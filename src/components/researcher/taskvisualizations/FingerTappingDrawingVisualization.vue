<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ this.data && this.niceTimestamp(completed) }}</p>
  </div>
    <div>
      <canvas id="fingerTappingChart"></canvas>
    </div>
      <div class="resetChart">
        <q-btn @click="fingerTapping.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
      <div id="fingerTappingResult">
        <p>Total Taps: {{ this.data && this.data.length }}</p>
        <p>Average Tap Time Difference: {{ this.data && this.getAverageTapTime() }}ms</p>
      </div>
    <div>
      <canvas id="fingerTappingDelayChart"></canvas>
    </div>
      <div class="resetChart">
        <q-btn @click="interTapping.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
</template>

<script>
import API from 'src/shared/API'
import { date } from 'quasar'
import { Chart } from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

export default {
  props: ['taskProps'],
  mounted () {
    this.fetchTaskData()
  },
  data () {
    return {
      completed: null,
      data: null
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.completed = this.taskData.createdTS
        this.data = this.taskData
        this.initializeFingerTappingChart()
        this.initializeFingerTappingDelayChart()
        this.getAverageTapTime()
        this.getTapTimeDifference()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    initializeFingerTappingChart () {
      const ctx = document.getElementById('fingerTappingChart').getContext('2d')
      const config = {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Left',
              data: this.getLeftTaps(),
              borderColor: '#459399',
              backgroundColor: '#459399',
              pointStyle: 'rectRot',
              radius: 4
            },
            {
              label: 'Right',
              data: this.getRightTaps(),
              borderColor: '#71bbcd',
              backgroundColor: '#71bbcd',
              pointStyle: 'rectRot',
              radius: 4
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Milliseconds',
                color: '#459399'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              ticks: {
                display: false
              }
            }
          },
          layout: {
            padding: {
              top: 10
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Finger Tapping',
              color: '#459399',
              font: {
                size: 16
              }
            },
            zoom: {
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'x',
                onZoom () {
                  console.log('FT')
                }
              }
            }
          }
        }
      }
      this.fingerTapping = new Chart(ctx, config)
    },

    initializeFingerTappingDelayChart () {
      const ctx = document.getElementById('fingerTappingDelayChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              label: 'Time Difference',
              data: this.getTapTimeDifference(),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Milliseconds',
                color: '#459399'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time Difference',
                color: '#459399'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Inter Tapping Time',
              color: '#459399',
              font: {
                size: 16
              }
            },
            zoom: {
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'x',
                onZoom () {
                  console.log('ITT')
                }
              }
            }
          }
        }
      }
      this.interTapping = new Chart(ctx, config)
    },
    getLeftTaps () {
      const leftTaps = this.data.filter(tap => tap.side === 'left')
      return leftTaps.map(tap => ({
        x: tap.msFromStart,
        y: 1
      }))
    },
    getRightTaps () {
      const rightTaps = this.data.filter(tap => tap.side === 'right')
      return rightTaps.map(tap => ({
        x: tap.msFromStart,
        y: 2
      }))
    },
    getAverageTapTime () {
      const taps = this.data.map(tap => ({
        x: tap.msFromStart
      }))
      const timeDifferences = []

      for (let i = 1; i < taps.length; i++) {
        timeDifferences.push(taps[i].x - taps[i - 1].x)
      }
      if (timeDifferences.length > 0) {
        const sum = timeDifferences.reduce((acc, timeDiff) => acc + timeDiff, 0)
        const averageTime = Math.round(sum / timeDifferences.length)
        return averageTime
      }
    },
    getTapTimeDifference () {
      const data = this.data
      const sortedTaps = data.sort((firstTap, secondTap) => firstTap.msFromStart - secondTap.msFromStart)
      const tapTimeDifference = []

      for (let i = 1; i < sortedTaps.length; i++) {
        const difference = sortedTaps[i].msFromStart - sortedTaps[i - 1].msFromStart
        tapTimeDifference.push({ x: sortedTaps[i].msFromStart, y: difference })
      }
      return tapTimeDifference
    }
  }
}
</script>

<style>
canvas {width: 500px; height:500px;}
p {
  margin: 1%;
}
#fingerTappingResult {
  text-align: center;
  margin: 2% 0 6% 0;
}
button {
  margin: 10px 0;
}
#fingerTappingResult {
  text-align: center;
  margin: auto;
}
.resetChart {
  align-items: center;
  display: flex;
  justify-content: center;
}
.resetChart * {
  color: white;
  background-color: #71bbcd;
}
.reset_btn {
  font-size: 12px; padding: 4px 8px
}
</style>
