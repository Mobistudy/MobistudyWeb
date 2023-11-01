<template>
  <canvas id="tugtChart"></canvas>
</template>

<script>
/* eslint-disable */
import { Chart } from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

export default {
  props: ['data'],
  mounted () {
    this.initializeChart()
  },
  methods: {
    initializeChart () {
      const ctx = document.getElementById('tugtChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              label: 'AccG',
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
                text: 'AccG',
                color: '#459399'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Inter Tapping Time',
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
      this.tugtChart = new Chart(ctx, config)
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
    }
  }
}
</script>

<style>

</style>
