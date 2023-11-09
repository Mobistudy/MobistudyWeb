<template>
  <q-page id="main">
    <div v-show="!isDownloading">
      <p class="q-pa-md mobitxt1">{{ $t('miband3.chartsIntro') }}</p>
      <div class="text-center text-h6">
        {{ $t('miband3.lineChart') }}
      </div>
      <div class="q-pa-md">
        <canvas
          style="margin: 0 auto; padding-right: 2rem; display: inline;"
          height="320"
          ref="lineChart"
        />
        <div class="row justify-around">
          <q-btn
            :label="'-12 ' + $t('miband3.hours')"
            color="secondary"
            :disable="disableMinus"
            @click="lineChartAdd((-12))"
          />
          <q-btn
            :label="'+12 ' + $t('miband3.hours')"
            color="secondary"
            :disable="disablePlus"
            @click="lineChartAdd((12))"
          />
        </div>
      </div>
    </div>

    <q-inner-loading :showing="isDownloading">
      <div class="mobitxt2">{{ $t('miband3.dataDownload') }}</div>
      <q-spinner-dots
        size="50px"
        color="primary"
      />
    </q-inner-loading>
  </q-page>
</template>

<script>
/* eslint-disable no-new */
import { date } from 'quasar'
import Chart from 'chart.js/auto'
import { ScatterController, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
Chart.register(ScatterController, LineElement, PointElement, CategoryScale, LinearScale)

// a bunch of colors that nicely fit together on a multi-line or bar chart
// if there are more than 10 colors, we are in trouble
// const chartColors = [
//   '#800000',
//   '#778000',
//   '#118000',
//   '#008080',
//   '#003780',
//   '#080080',
//   '#440080',
//   '#790080',
//   '#800046',
//   '#800046'
// ]

// holder of all the stored data, this is kept outside of Vue for efficiency
let storedData = []
const minimumDataRequired = 30 // 30 minutes of data is required at a minimum to upload the data

// holder of the line chart data
const lineChart = {
  hrs: [],
  steps: [],
  intensities: [],
  labels: [],
  reset () {
    this.hrs = []
    this.steps = []
    this.intensities = []
    this.labels = []
  }
}

export default {
  name: 'SMWTChart',
  props: {
    studyKey: String,
    userKey: String,
    taskDataContent: Object
  },
  data () {
    return {
      startDate: new Date(),
      isDownloading: false,
      lineChart: undefined,
      currentStartHour: 0,
      currentEndHour: 12,
      disableMinus: true,
      disablePlus: false,
      sending: false,
      report: {}
    }
  },
  async mounted () {
    await this.downloadData()
  },
  methods: {
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    async downloadData () {
      this.isDownloading = true

      this.report = {
        userKey: this.userKey,
        studyKey: this.studyKey,
        taskId: Number(this.taskId),
        createdTS: new Date(),
        taskType: 'smwt',
        summary: {
          startedTS: new Date(),
          completedTS: new Date()
        }
      }

      // reset the charts stuff in case it has been partially filled
      storedData = []
      lineChart.reset()

      try {
        storedData = this.taskDataContent.inertial.motion
        console.log(storedData)
        if (storedData.length < minimumDataRequired) { // If less than 30 minutes of data exists, show page which describes to little data is found, wait and come back next time.
          await this.storeDownloadDate(this.startDate) // by storing this, we make sure to retrieve the data from the time the data was not enough instead of from today - period (which depends on when the user performs the task)
          // TODO: should we also store that the task is completed?
          this.$router.push({ name: 'notEnoughDataPage' })
          return
        }

        this.renderLineChart(this.currentStartHour, this.currentEndHour)

        this.report.summary.length = storedData.length
        this.report.summary.completedTS = new Date()
        this.report.summary.firstTS = storedData[0].msFromStart
        this.report.summary.lastTS = storedData[storedData.length - 1].msFromStart
        this.report.data = {
          activity: storedData
        }

        this.isDownloading = false
      } catch (err) {
        console.error('cannot download data', err)
        this.showErrorDialog() // TODO: Retry if the device is disconnected? The retry won't accomplish anything in this case and is confusing from a user perspective. ?? Retry moves to Connect page, make sure i am disconnected.
      }
    },
    renderLineChart (startTime, endTime) {
      lineChart.reset()
      const startIndexInMinutes = startTime * 60
      let endIndexInMinutes = endTime * 60 - 1
      if (endIndexInMinutes >= storedData.length) {
        endIndexInMinutes = storedData.length - 1
      }
      for (let i = startIndexInMinutes; i <= endIndexInMinutes; i++) {
        const data = storedData[i]
        this.addToLineChart(data.hr, data.intensity, data.steps, data.date)
      }
      this.createActivityLineChart()
      this.updateLineChartReferences()
      this.updatePlusMinusButtons() // Could be placed somewhere else but is needed at start in case data size < 12 hours worth
    },

    showErrorDialog () {
      this.$q.dialog({
        title: this.$t('errors.error'),
        message: this.$t('miband3.dataDownloadError'),
        cancel: this.$t('common.cancel'),
        ok: this.$t('common.retry'),
        persistent: true
      }).onOk(() => {
        // retry
        this.downloadData()
      }).onCancel(() => {
        // cancel and go home
        this.cancelTask()
      })
    },
    dataCallback (data) {
      // collects data from the miband and prepares the charts
      storedData.push(data)
    },

    addToLineChart (hr, intensity, steps, date) {
      if (hr > 30 && hr < 210) {
        // filter out unreasonable HR
        lineChart.hrs.push({ x: date, y: hr })
      }
      lineChart.intensities.push({ x: date, y: intensity })
      lineChart.steps.push({ x: date, y: steps })
      lineChart.labels.push(this.niceTimestamp(date))
    },

    updateLineChartReferences () {
      this.lineChart.data.datasets[0].data = lineChart.hrs
      this.lineChart.data.datasets[1].data = lineChart.intensities
      this.lineChart.data.datasets[2].data = lineChart.steps
      this.lineChart.data.labels = lineChart.labels
    },

    createActivityLineChart () {
      if (this.lineChart) {
        this.lineChart.destroy()
      }
      const lineCtx = this.$refs.lineChart
      this.lineChart = new Chart(lineCtx, {
        type: 'scatter',
        data: {
          labels: lineChart.labels,
          datasets: [
            {
              label: this.$t('miband3.hrs'),
              data: lineChart.hrs,
              backgroundColor: '#C74038',
              borderColor: '#C74038',
              borderWidth: 0,
              pointRadius: 1,
              pointHoverRadius: 3,
              fill: false,
              lineTension: 0
            },
            {
              label: this.$t('miband3.intensities'),
              data: lineChart.intensities,
              backgroundColor: '#4038C7',
              borderColor: '#4038C7',
              borderWidth: 0,
              pointRadius: 1,
              pointHoverRadius: 3,
              fill: false,
              lineTension: 0
            },
            {
              label: this.$t('miband3.steps'),
              data: lineChart.steps,
              backgroundColor: '#38C740',
              borderColor: '#38C740',
              borderWidth: 0,
              pointRadius: 1,
              pointHoverRadius: 3,
              fill: false,
              lineTension: 0
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              mode: 'nearest',
              intersect: false,
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y
                  }
                  return label
                }
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: {
                  quarter: 'HH:MM:SS'
                }
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'value'
              }
            }
          }
        }
      })
    },
    lineChartAdd (amount) {
      this.currentStartHour += amount
      this.currentEndHour += amount
      this.renderLineChart(this.currentStartHour, this.currentEndHour)
      this.updatePlusMinusButtons()
    },
    updatePlusMinusButtons () {
      if (this.currentStartHour === 0) {
        this.disableMinus = true
      } else {
        this.disableMinus = false
      }
      if (this.currentEndHour >= (storedData.length / 60)) {
        this.disablePlus = true
      } else {
        this.disablePlus = false
      }
    }
  }
}
</script>
