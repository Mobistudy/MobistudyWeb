<template>
  <div id="container">
    <div>
      <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
    </div>
    <div>
      <p id="tugtTotalTime">Total time: {{ this.data && getTotalTime() }}</p>
    </div>
    <div>
      <q-toggle @click=" this.data && handleFTToggleChange()" v-model="isACCombined">{{ isACCombined ? 'Module' : 'XYZ' }}</q-toggle>
      <canvas id="tugtChart"></canvas>
    </div>
      <div class="resetChart">
        <q-btn @click="tugtChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
    <div>
      <q-toggle @click="this.data && handleRoterToggleChange()" v-model="isRCombined">{{ isRCombined ? 'Module' : 'XYZ' }}</q-toggle>
      <canvas id="tugtRotarChart"></canvas>
    </div>
      <div class="resetChart">
        <q-btn @click="tugtRotarChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
  </div>
</template>

<script>
import API from 'src/shared/API'
import { date } from 'quasar'
import { ref } from 'vue'
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
      data: null,
      lastMS: null,
      MS: null,
      isACCombined: ref(true),
      isRCombined: ref(true)
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.data = this.taskData
        this.initializeRotarCombinedChart()
        this.initializeVectorChart()
        this.getTotalTime()
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
    handleFTToggleChange () {
      this.tugtChart.destroy()
      if (this.isACCombined) {
        this.initializeVectorChart()
      } else {
        this.initializeXYZChart()
      }
    },
    handleRoterToggleChange () {
      this.tugtRotarChart.destroy()
      if (this.isRCombined) {
        this.initializeRotarCombinedChart()
      } else {
        this.initializeRotarSeparate()
      }
    },
    initializeVectorChart () {
      const ctx = document.getElementById('tugtChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(),
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
              ticks: {
                stepSize: 0.2
              },
              suggestedMin: 0.1,
              suggestedMax: 1,
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Acceleration Gravity',
                color: '#459399'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Acceleration Gravity',
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
                mode: 'x'
              }
            }
          }
        }
      }
      this.tugtChart = new Chart(ctx, config)
    },
    initializeXYZChart () {
      const ctx = document.getElementById('tugtChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x'),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Acc X'
            },
            {
              type: 'line',
              data: this.getAccG('y'),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Acc Y'
            },
            {
              type: 'line',
              data: this.getAccG('z'),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Acc Z'
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
              ticks: {
                stepSize: 0.2
              },
              suggestedMin: 0.1,
              suggestedMax: 1,
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Acceleration Gravity',
                color: '#459399'
              }
            }
          },
          plugins: {
            legend: {
            },
            title: {
              display: true,
              text: 'Acceleration Gravity',
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
                mode: 'x'
              }
            }
          }
        }
      }
      this.tugtChart = new Chart(ctx, config)
    },
    initializeRotarCombinedChart () {
      const ctx = document.getElementById('tugtRotarChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Rotation',
              data: this.getRoter(),
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
              ticks: {
                stepSize: 0.2
              },
              suggestedMin: 0.1,
              suggestedMax: 1,
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Rotation',
                color: '#459399'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Rotation',
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
                mode: 'x'
              }
            }
          }
        }
      }
      this.tugtRotarChart = new Chart(ctx, config)
    },
    initializeRotarSeparate () {
      const ctx = document.getElementById('tugtRotarChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getAlphaBetaGamma('alpha'),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Alpha'
            },
            {
              data: this.getAlphaBetaGamma('beta'),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Beta'
            },
            {
              data: this.getAlphaBetaGamma('gamma'),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Gamma'
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
              ticks: {
                stepSize: 0.2
              },
              suggestedMin: 0.1,
              suggestedMax: 1,
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Rotation',
                color: '#459399'
              }
            }
          },
          plugins: {
            legend: {
            },
            title: {
              display: true,
              text: 'Rotation',
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
                mode: 'x'
              }
            }
          }
        }
      }
      this.tugtRotarChart = new Chart(ctx, config)
    },
    getMotionObjects () {
      return JSON.parse(JSON.stringify(this.data.motion))
    },
    calcMS (obj) {
      if (this.lastMS !== null) {
        const diffMS = obj.msFromStart - this.lastMS
        this.lastMS = obj.msFromStart
        this.MS = this.MS + diffMS
        return this.MS
      } else {
        this.lastMS = obj.msFromStart
        this.MS = 0
        return this.MS
      }
    },
    getAccG (axis) {
      const motionObj = this.getMotionObjects()
      const accGArr = motionObj.map(obj => {
        const accGObj = {
          x: this.calcMS(obj),
          y: Math.sqrt((obj.accG[axis] * obj.accG[axis]))
        }
        return accGObj
      })
      return accGArr
    },
    getXYZ () {
      const motionObj = this.getMotionObjects()
      const accGArr = motionObj.map(obj => {
        const accGObj = {
          x: this.calcMS(obj),
          y: Math.sqrt((obj.accG.x * obj.accG.x), (obj.accG.y * obj.accG.y), (obj.accG.z * obj.accG.z))
        }
        return accGObj
      })
      return accGArr
    },
    getAlphaBetaGamma (aBG) {
      const motionObj = this.getMotionObjects()
      const accGArr = motionObj.map(obj => {
        const accGObj = {
          x: this.calcMS(obj),
          y: Math.sqrt((obj.rotRate[aBG] * obj.rotRate[aBG]))
        }
        return accGObj
      })
      return accGArr
    },
    getRoter () {
      const motionObj = this.getMotionObjects()
      const accGArr = motionObj.map(obj => {
        const accGObj = {
          x: this.calcMS(obj),
          y: Math.sqrt((obj.rotRate.alpha * obj.rotRate.alpha), (obj.rotRate.beta * obj.rotRate.beta), (obj.rotRate.gamma * obj.rotRate.gamma))
        }
        return accGObj
      })
      return accGArr
    },
    getTotalTime () {
      const totalTime = this.getMotionObjects().reverse()[0].msFromStart / 1000
      const roundTotalTime = (Math.round(totalTime * 100) / 100).toFixed(2)
      return roundTotalTime
    }
  }
}
</script>

<style>
.taskVisualizationHeader {
  text-align: center;
  font-weight: bold;
  color: #459399;
}
.reset_btn {
  font-size: 12px; padding: 4px 8px
}
#tugtTotalTime {
  text-align: center;
}
#container {
  padding-left: 70px;
  padding-right: 70px;
}
</style>
