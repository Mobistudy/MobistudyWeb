<template>
  <q-page id="main">
    <div v-show="!isDownloading">
      <p class="q-pa-md mobitxt1">{{ $t('miband3.chartsIntro') }}</p>
      <div class="text-center text-h6">
        {{ $t('miband3.lineChart') }}
      </div>
      <div class="q-pa-md">
        <canvas
          style="margin: 0 auto; padding-right: 2rem;"
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
      <q-separator></q-separator>
      <div class="text-center text-h6">
        {{ $t('miband3.pieChart') }}
      </div>
      <div class="q-pa-md">
        <canvas
          ref="pieChart"
          height="270"
        ></canvas>
      </div>
      <q-separator></q-separator>
      <div class="row justify-around q-my-lg">
        <q-btn
          class="mobibtn"
          color="negative"
          :loading="sending"
          :label="$t('common.discard')"
          @click="discard()"
        />
        <q-btn
          class="mobibtn"
          color="primary"
          :loading="sending"
          :label="$t('common.send')"
          @click="send()"
        />
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
import Chart from 'chart.js/auto'
import { ScatterController, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
Chart.register(ScatterController, LineElement, PointElement, CategoryScale, LinearScale)

// a bunch of colors that nicely fit together on a multi-line or bar chart
// if there are more than 10 colors, we are in trouble
const chartColors = [
  '#800000',
  '#778000',
  '#118000',
  '#008080',
  '#003780',
  '#080080',
  '#440080',
  '#790080',
  '#800046',
  '#800046'
]

// holder of all the stored data, this is kept outside of Vue for efficiency
let storedData = []
const minimumDataRequired = 30 // 30 minutes of data is required at a minimum to upload the data

// pie chart configuration
const pieChartConfig = {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  },
  options: {
    animation: {
      animateScale: true
    }
  },
  // additional properties used internally
  indexes: [],
  maxIndex: -1,
  reset () {
    this.data.datasets.data = []
    this.data.datasets.backgroundColor = []
    this.data.labels = []
    this.indexes = []
    this.maxIndex = -1
  }
}

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
  name: 'MiBand3Charts',
  props: {
    studyKey: String,
    userKey: String,
    taskDataContent: Object
  },
  data () {
    return {
      startDate: new Date(),
      deviceInfo: {},
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
    console.log('Received studyKey:', this.studyKey)
    console.log('Received userKey:', this.userKey)
    console.log('Received taskDataContent:', this.taskDataContent)
    this.createActivityLineChart()
    await this.downloadData()
  },
  methods: {
    async downloadData () {
      this.isDownloading = true

      this.report = {
        userKey: this.userKey,
        // participantKey: userinfo.user.participantKey,
        studyKey: this.studyKey,
        taskId: Number(this.taskId),
        createdTS: new Date(),
        taskType: 'miband3',
        // phone: phone.device,
        summary: {
          startedTS: new Date(),
          completedTS: new Date()
        }
      }

      // reset the charts stuff in case it has been partially filled
      storedData = []
      pieChartConfig.reset()
      lineChart.reset()

      // this.startDate = await this.getDateToUseForDownload()
      try {
        this.deviceInfo = this.taskDataContent.device
        storedData = this.taskDataContent.activity
        console.log(storedData)
        console.log(storedData.length)

        if (storedData.length < minimumDataRequired) { // If less than 30 minutes of data exists, show page which describes to little data is found, wait and come back next time.
          await this.storeDownloadDate(this.startDate) // by storing this, we make sure to retrieve the data from the time the data was not enough instead of from today - period (which depends on when the user performs the task)
          // TODO: should we also store that the task is completed?
          this.$router.push({ name: 'notEnoughDataPage' })
          return
        }

        this.createPieChart()
        this.renderLineChart(this.currentStartHour, this.currentEndHour)

        this.report.summary.length = storedData.length
        this.report.summary.completedTS = new Date()
        this.report.summary.firstTS = storedData[0].date
        this.report.summary.lastTS = storedData[storedData.length - 1].date
        this.report.data = {
          device: this.deviceInfo,
          activity: storedData
        }
        console.log(this.report)

        this.isDownloading = false
      } catch (err) {
        console.error('cannot download data', err)
        this.showErrorDialog() // TODO: Retry if the device is disconnected? The retry won't accomplish anything in this case and is confusing from a user perspective. ?? Retry moves to Connect page, make sure i am disconnected.
      }
    },
    /**
     * Retreives the latest date the data was downloaded
     * or if it's the first time it uses the scheduling information
     */

    // async getDateToUseForDownload () {
    //   let startDate
    //   const consentedTask = await db.getStudyParticipationTaskItemConsent(this.studyKey, this.taskId)
    //   const latestSampleTS = consentedTask.lastMiband3SampleTS
    //   if (latestSampleTS) {
    //     startDate = new Date(latestSampleTS)
    //   } else {
    //     const taskDescription = await db.getTaskDescription(this.studyKey, this.taskId)
    //     const lastExecuted = taskDescription.lastExecuted
    //     if (lastExecuted) {
    //       startDate = new Date(lastExecuted)
    //     } else {
    //       // use the scheduling information
    //       startDate = moment()
    //       const intervalType = taskDescription.scheduling.intervalType
    //       const interval = taskDescription.scheduling.interval
    //       if (intervalType === 'd') {
    //         startDate.subtract(interval, 'days')
    //       } else if (intervalType === 'w') {
    //         startDate.subtract(interval, 'weeks')
    //       } else if (intervalType === 'm') {
    //         startDate.subtract(interval, 'months')
    //       } else if (intervalType === 'y') {
    //         startDate.subtract(interval, 'years')
    //       }
    //       startDate = startDate.toDate()
    //     }
    //   }
    //   return startDate
    // },
    /**
    * Renders the line chart data between the two specific parameters, end and start in hours.
    * The parameters are converted to minutes. And because there is a stored sample
    * minute by minute in the storedData, the start and end time are re-calculated in minutes
    * and this will be the indexes of the corresponding samples.
    */
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
      this.updateLineChartReferences()
      this.updatePlusMinusButtons() // Could be placed somewhere else but is needed at start in case data size < 12 hours worth
    },

    showErrorDialog () {
      this.$q.dialog({
        title: this.$t('errors.error'),
        message: this.$t('studies.tasks.miband3.dataDownloadError'),
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
      lineChart.labels.push(date)
    },

    createPieChart () {
      // create the configuration object
      for (const datapoint of storedData) {
        const activityType = datapoint.activityType
        const name = this.getStringIdentifier(activityType)
        if (pieChartConfig.indexes[name] === undefined) {
          pieChartConfig.maxIndex++
          const index = pieChartConfig.maxIndex
          pieChartConfig.indexes[name] = index
          pieChartConfig.data.datasets[0].data[index] = 1
          pieChartConfig.data.datasets[0].backgroundColor[index] = chartColors[index]
          pieChartConfig.data.labels.push(this.$t('miband3.activityTypes.' + name))
        } else {
          const index = pieChartConfig.indexes[name]
          pieChartConfig.data.datasets[0].data[index]++
        }
      }
      // create the chart
      const pieCtx = this.$refs.pieChart
      new Chart(pieCtx, pieChartConfig)
    },

    updateLineChartReferences () {
      this.lineChart.data.datasets[0].data = lineChart.hrs
      this.lineChart.data.datasets[1].data = lineChart.intensities
      this.lineChart.data.datasets[2].data = lineChart.steps
      this.lineChart.data.labels = lineChart.labels
      console.log('DEBUGGEADOR')
      // this.lineChart.update()
    },

    createActivityLineChart () {
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
              display: false
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
      console.log(this.lineChart)
      // this.lineChart.update()
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
    },
    getStringIdentifier (index) {
      switch (index) {
        case 1:
        case 16:
          return 'walk'
        case 3:
          return 'not_worn'
        case 6:
          return 'charging'
        case 80:
        case 90:
        case 89:
        case 91:
        case 92:
        case 96:
          return 'sedentary'
        case 98:
        case 82:
          return 'running'
        case 17:
          return 'activity_high'
        case 106:
        case 112:
        case 121:
        case 122:
        case 123:
          return 'sleep'
        default:
          return 'unknown'
      }
    }
  }
}
</script>
