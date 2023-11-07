<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
  </div>
  <div>
    <q-toggle @click="handleFTToggleChange()" v-model="isACCombined">{{ isACCombined ? 'Module' : 'XYZ' }}</q-toggle>
    <canvas id="tugtChart"></canvas>
  </div>
    <div class="resetChart">
      <q-btn @click="tugtChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
    </div>
  <div>
    <q-toggle @click="handleRoterToggleChange()" v-model="isRCombined">{{ isRCombined ? 'Module' : 'XYZ' }}</q-toggle>
    <canvas id="tugtRotarChart"></canvas>
  </div>
    <div class="resetChart">
      <q-btn @click="tugtRotarChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
    </div>
</template>

<script>
import { ref } from 'vue'
import { Chart } from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

export default {
  props: ['data', 'completed'],
  mounted () {
    this.initializeRotarCombinedChart()
    this.initializeVectorChart()
  },
  data () {
    return {
      isACCombined: ref(true),
      isRCombined: ref(true)
    }
  },
  methods: {
    handleFTToggleChange () {
      if (this.isACCombined) {
        this.tugtChart.destroy()
        this.initializeVectorChart()
      } else {
        this.tugtChart.destroy()
        this.initializeXYZChart()
      }
    },
    handleRoterToggleChange () {
      if (this.isRCombined) {
        this.tugtRotarChart.destroy()
        this.initializeRotarCombinedChart()
      } else {
        this.tugtRotarChart.destroy()
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
    getOrientationObjects () {
      return JSON.parse(JSON.stringify(this.data.orientation))
    },
    getAccG (axis) {
      const accGArr = []
      const accGObjArr = this.getMotionObjects().map(obj => obj.accG)
      for (let i = 0; i < accGObjArr.length; i++) {
        accGArr.push({
          x: i,
          y: Math.sqrt((accGObjArr[i][axis] * accGObjArr[i][axis]))
        })
      }
      return accGArr
    },
    getXYZ () {
      const vectors = []
      const accGArr = JSON.parse(JSON.stringify(this.data.motion.map(obj => obj.accG)))
      for (let i = 0; i < accGArr.length; i++) {
        vectors.push({
          x: i,
          y: Math.sqrt((accGArr[i].x * accGArr[i].x), (accGArr[i].y * accGArr[i].y), (accGArr[i].z * accGArr[i].z))
        })
      }
      return vectors
    },
    getAlphaBetaGamma (roter) {
      const alphaBetaGamma = []
      const roterArr = JSON.parse(JSON.stringify(this.data.motion.map(obj => obj.rotRate)))
      for (let i = 0; i < roterArr.length; i++) {
        alphaBetaGamma.push({
          x: i,
          y: Math.sqrt((roterArr[i][roter] * roterArr[i][roter]))
        })
      }
      return alphaBetaGamma
    },
    getRoter () {
      const vectors = []
      const roter = JSON.parse(JSON.stringify(this.data.motion.map(obj => obj.rotRate)))
      for (let i = 0; i < roter.length; i++) {
        vectors.push({
          x: i,
          y: Math.sqrt((roter[i].alpha * roter[i].alpha), (roter[i].beta * roter[i].beta), (roter[i].gamma * roter[i].gamma))
        })
      }
      return vectors
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
</style>
