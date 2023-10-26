<template>
  <div>
    <canvas id="fingerTappingChart"></canvas>
    <p>Average time left: {{ getAverageLeft() }}ms </p>
    <p>Average time right: {{ getAverageRight() }}ms</p>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  props: ['data'],
  mounted () {
    this.initializeChart()
  },
  methods: {
    initializeChart () {
      const ctx = document.getElementById('fingerTappingChart').getContext('2d')
      const config = {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Left',
              data: this.getLeft(),
              borderColor: 'red',
              backgroundColor: 'red',
              pointStyle: 'rectRot',
              radius: 4
            },
            {
              label: 'Right',
              data: this.getRight(),
              borderColor: 'blue',
              backgroundColor: 'blue',
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
                text: 'Time (seconds)'
              },
              ticks: {
                stepSize: 1000,
                callback: function (value) {
                  return (value / 1000) + 's'
                }
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
              text: 'Finger Tapping Comparison'
            }
          }
        }
      }

      this.chart = new Chart(ctx, config)
    },

    getLeft () {
      const leftTaps = this.data.filter(item => item.side === 'left')
      return leftTaps.map(item => ({
        x: item.msFromStart,
        y: 1
      }))
    },
    getRight () {
      const rightTaps = this.data.filter(item => item.side === 'right')
      return rightTaps.map(item => ({
        x: item.msFromStart,
        y: 2
      }))
    },
    getAverageLeft () {
      const leftTaps = this.getLeft()
      const timeDifferences = []
      for (let i = 1; i < leftTaps.length; i++) {
        const timeDifference = leftTaps[i].x - leftTaps[i - 1].x
        timeDifferences.push(timeDifference)
      }
      if (timeDifferences.length > 0) {
        const sum = timeDifferences.reduce((acc, timeDiff) => acc + timeDiff, 0)
        const averageTime = Math.round(sum / timeDifferences.length)
        return averageTime
      }
    },
    getAverageRight () {
      const leftTaps = this.getRight()
      const timeDifferences = []
      for (let i = 1; i < leftTaps.length; i++) {
        const timeDifference = leftTaps[i].x - leftTaps[i - 1].x
        timeDifferences.push(timeDifference)
      }
      if (timeDifferences.length > 0) {
        const sum = timeDifferences.reduce((acc, timeDiff) => acc + timeDiff, 0)
        const averageTime = Math.round(sum / timeDifferences.length)
        return averageTime
      }
    }
  }
}
</script>

<style>
canvas {width: 500px; height:500px;}
p {text-align: center;}
</style>
