<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
  </div>
  <div class="row">
    <div>
      <div>
        <q-toggle @click=" this.data && handleKineticLeftToggleChange()" v-model="isKeneticLeftCombined">{{ isKeneticLeftCombined ? 'Module' : 'XYZ' }}</q-toggle>
        <canvas id="kineticLeftChart"></canvas>
      </div>
      <div class="resetChart">
        <q-btn @click="kineticLeftChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
    </div>
    <div>
      <div>
        <q-toggle @click=" this.data && handleKineticRightToggleChange()" v-model="isKeneticRightCombined">{{ isKeneticRightCombined ? 'Module' : 'XYZ' }}</q-toggle>
        <canvas id="kineticRightChart"></canvas>
      </div>
      <div class="resetChart">
        <q-btn @click="kineticRightChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
    </div>
  </div>
  <div class="row">
    <div>
      <div>
        <q-toggle @click="this.data && handlePosturalLeftToggleChange()" v-model="isPosturalLeftCombined">{{ isPosturalLeftCombined ? 'Module' : 'XYZ' }}</q-toggle>
        <canvas id="posturalLeftChart"></canvas>
      </div>
      <div class="resetChart">
        <q-btn @click="posturalLeftChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
    </div>
    <div>
      <div>
        <q-toggle @click="this.data && handleoPosturalRightToggleChange()" v-model="isPosturalRightCombined">{{ isPosturalRightCombined ? 'Module' : 'XYZ' }}</q-toggle>
        <canvas id="posturalRightChart"></canvas>
      </div>
      <div class="resetChart">
        <q-btn @click="posturalRightChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
    </div>
  </div>
  <div class="row">
    <div>
      <div>
        <q-toggle @click="this.data && handleRestingLeftToggleChange()" v-model="isRestingLeftCombined">{{ isRestingLeftCombined ? 'Module' : 'XYZ' }}</q-toggle>
        <canvas id="restingLeftChart"></canvas>
      </div>
      <div class="resetChart">
        <q-btn @click="restingLeftChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
    </div>
    <div>
      <div>
        <q-toggle @click="this.data && handleRestingRightToggleChange()" v-model="isRestingRightCombined">{{ isRestingRightCombined ? 'Module' : 'XYZ' }}</q-toggle>
        <canvas id="restingRightChart"></canvas>
      </div>
      <div class="resetChart">
        <q-btn @click="restingRightChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
      </div>
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
      isKeneticRightCombined: ref(true),
      isKeneticLeftCombined: ref(true),
      isPosturalRightCombined: ref(true),
      isPosturalLeftCombined: ref(true),
      isRestingRightCombined: ref(true),
      isRestingLeftCombined: ref(true),
      isRestingCombined: ref(true)
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.data = this.taskData
        this.initializeKineticRightVectorChart()
        this.initializeKineticLeftVectorChart()
        this.initializePosturalRightVectorChart()
        this.initializePosturalLeftVectorChart()
        this.initializeRestingRightVectorChart()
        this.initializeRestingLeftVectorChart()
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
    handleKineticRightToggleChange () {
      this.kineticRightChart.destroy()
      if (this.isKeneticRightCombined) {
        this.initializeKineticRightVectorChart()
      } else {
        this.initializeKineticRightXYZChart()
      }
    },
    handleKineticLeftToggleChange () {
      this.kineticLeftChart.destroy()
      if (this.isKeneticLeftCombined) {
        this.initializeKineticLeftVectorChart()
      } else {
        this.initializeKineticLeftXYZChart()
      }
    },
    handleoPosturalRightToggleChange () {
      this.posturalRightChart.destroy()
      if (this.isPosturalRightCombined) {
        this.initializePosturalRightVectorChart()
      } else {
        this.initializePosturalRightXYZChart()
      }
    },
    handlePosturalLeftToggleChange () {
      this.posturalLeftChart.destroy()
      if (this.isPosturalLeftCombined) {
        this.initializePosturalLeftVectorChart()
      } else {
        this.initializePosturalLeftXYZChart()
      }
    },
    handleRestingRightToggleChange () {
      this.restingRightChart.destroy()
      if (this.isRestingRightCombined) {
        this.initializeRestingRightVectorChart()
      } else {
        this.initializeRestingRightXYZChart()
      }
    },
    handleRestingLeftToggleChange () {
      this.restingLeftChart.destroy()
      if (this.isRestingLeftCombined) {
        this.initializeRestingLeftVectorChart()
      } else {
        this.initializeRestingLeftXYZChart()
      }
    },
    initializeKineticRightVectorChart () {
      const ctx = document.getElementById('kineticRightChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(this.data.kinetic.right),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Vector Right'
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
              text: 'Kinetic Right',
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
      this.kineticRightChart = new Chart(ctx, config)
    },
    initializeKineticRightXYZChart () {
      const ctx = document.getElementById('kineticRightChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x', this.data.kinetic.right),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG X'
            },
            {
              type: 'line',
              data: this.getAccG('y', this.data.kinetic.right),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Y'
            },
            {
              type: 'line',
              data: this.getAccG('z', this.data.kinetic.right),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Z'
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
              text: 'Kinetic Right',
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
      this.kineticRightChart = new Chart(ctx, config)
    },
    initializeKineticLeftVectorChart () {
      const ctx = document.getElementById('kineticLeftChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(this.data.kinetic.left),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Vector Left'
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
              text: 'Kinetic Left',
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
      this.kineticLeftChart = new Chart(ctx, config)
    },
    initializeKineticLeftXYZChart () {
      const ctx = document.getElementById('kineticLeftChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x', this.data.kinetic.left),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG X'
            },
            {
              type: 'line',
              data: this.getAccG('y', this.data.kinetic.left),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Y'
            },
            {
              type: 'line',
              data: this.getAccG('z', this.data.kinetic.left),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Z'
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
              text: 'Kinetic Left',
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
      this.kineticLeftChart = new Chart(ctx, config)
    },
    initializePosturalRightVectorChart () {
      const ctx = document.getElementById('posturalRightChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(this.data.postural.right),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Vector Right'
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
              text: 'Postural Right',
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
      this.posturalRightChart = new Chart(ctx, config)
    },
    initializePosturalRightXYZChart () {
      const ctx = document.getElementById('posturalRightChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x', this.data.postural.right),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG X'
            },
            {
              type: 'line',
              data: this.getAccG('y', this.data.postural.right),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Y'
            },
            {
              type: 'line',
              data: this.getAccG('z', this.data.postural.right),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Z'
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
              text: 'Postural Right',
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
      this.posturalRightChart = new Chart(ctx, config)
    },
    initializePosturalLeftVectorChart () {
      const ctx = document.getElementById('posturalLeftChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(this.data.postural.left),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Vector Left'
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
              text: 'Postural Left',
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
      this.posturalLeftChart = new Chart(ctx, config)
    },
    initializePosturalLeftXYZChart () {
      const ctx = document.getElementById('posturalLeftChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x', this.data.postural.left),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG X'
            },
            {
              type: 'line',
              data: this.getAccG('y', this.data.postural.left),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Y'
            },
            {
              type: 'line',
              data: this.getAccG('z', this.data.postural.left),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Z'
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
              text: 'Postural Left',
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
      this.posturalLeftChart = new Chart(ctx, config)
    },
    initializeRestingRightVectorChart () {
      const ctx = document.getElementById('restingRightChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(this.data.resting.right),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Vector Right'
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
              text: 'Resting Right',
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
      this.restingRightChart = new Chart(ctx, config)
    },
    initializeRestingRightXYZChart () {
      const ctx = document.getElementById('restingRightChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x', this.data.resting.right),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG X'
            },
            {
              type: 'line',
              data: this.getAccG('y', this.data.resting.right),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Y'
            },
            {
              type: 'line',
              data: this.getAccG('z', this.data.resting.right),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Z'
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
              text: 'Resting Right',
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
      this.restingRightChart = new Chart(ctx, config)
    },
    initializeRestingLeftVectorChart () {
      const ctx = document.getElementById('restingLeftChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getXYZ(this.data.resting.left),
              borderColor: '#459399',
              backgroundColor: '#459399',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Vector Left'
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
              text: 'Resting Left',
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
      this.restingLeftChart = new Chart(ctx, config)
    },
    initializeRestingLeftXYZChart () {
      const ctx = document.getElementById('restingLeftChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getAccG('x', this.data.resting.left),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG X'
            },
            {
              type: 'line',
              data: this.getAccG('y', this.data.resting.left),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Y'
            },
            {
              type: 'line',
              data: this.getAccG('z', this.data.resting.left),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'AccG Z'
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
              text: 'Resting Left',
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
      this.restingLeftChart = new Chart(ctx, config)
    },
    getMotionObjects (data) {
      return JSON.parse(JSON.stringify(data.motion))
    },
    calcMS (obj) {
      console.log(obj)
      if (this.lastMS !== null) {
        const diffMS = obj.startedTS - this.lastMS
        this.lastMS = obj.startedTS
        this.MS = this.MS + diffMS
        return this.MS
      } else {
        this.lastMS = obj.startedTS
        this.MS = 0
        return this.MS
      }
    },
    getAccG (axis, data) {
      const motionObj = this.getMotionObjects(data)
      const accGArr = motionObj.map(obj => {
        const accGObj = {
          x: obj.msFromStart,
          y: Math.sqrt((obj.accG[axis] * obj.accG[axis]))
        }
        return accGObj
      })
      return accGArr
    },
    getXYZ (data) {
      const motionObj = this.getMotionObjects(data)
      const accGArr = motionObj.map(obj => {
        const accGObj = {
          x: obj.msFromStart,
          y: Math.sqrt((obj.accG.x * obj.accG.x), (obj.accG.y * obj.accG.y), (obj.accG.z * obj.accG.z))
        }
        return accGObj
      })
      return accGArr
    }
  }
}
</script>
<style>
  .row {
    display:flex;
  }
  .taskVisualizationHeader {
    text-align: center;
    font-weight: bold;
    color: #459399;
  }
  .reset_btn {
    font-size: 12px; padding: 4px 8px
  }
  .row div {
    box-sizing: border-box;
  }
  .row > div {
    width: 50%;
  }
</style>
