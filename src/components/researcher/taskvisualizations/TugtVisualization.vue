<template>
  <canvas id="tugtVectorChart"></canvas>
  <div class="resetChart">
      <q-btn @click="tugtVectorChart.resetZoom()">Reset Acceleration Gravity</q-btn>
    </div>
  <canvas id="tugtRotarChart"></canvas>
  <div class="resetChart">
      <q-btn @click="tugtRotarChart.resetZoom()">Reset Rotation</q-btn>
    </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

export default {
  props: ['data'],
  mounted () {
    this.initializeRotarChart()
    this.initializeVectorChart()
  },
  methods: {
    initializeRotarChart () {
      const ctx = document.getElementById('tugtRotarChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Rotation',
              data: this.getroter(),
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
              color: '#459399'
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
    initializeVectorChart () {
      const ctx = document.getElementById('tugtVectorChart').getContext('2d')
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
              color: '#459399'
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
      this.tugtVectorChart = new Chart(ctx, config)
    },
    getMotionObjects () {
      return JSON.parse(JSON.stringify(this.data.motion))
    },
    getOrientationObjects () {
      return JSON.parse(JSON.stringify(this.data.orientation))
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
    getroter () {
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

</style>
