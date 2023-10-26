<template>
  <div>
    <canvas id="fingerTappingChart"></canvas>
    <p>Average time left: {{ getAverageLeft() }}ms </p>
    <p>Average time right: {{ getAverageRight() }}ms</p>
  </div>
  <div>
    <canvas id="fingerTappingDelayChart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  props: ['data'],
  mounted () {
    this.initializeFingerTappingChart()
    this.initializeFingerTappingDelayChart()
  },
  methods: {
    initializeFingerTappingChart () {
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
              text: 'Finger Tapping'
            }
          }
        }
      }
      this.chart = new Chart(ctx, config)
    },

    initializeFingerTappingDelayChart () {
      const ctx = document.getElementById('fingerTappingDelayChart').getContext('2d')
      const config = {
        type: 'scatter',
        data: {
          datasets: [
            {
              type: 'line',
              label: 'Time Delay',
              data: this.getTimeDelays(),
              borderColor: 'gray',
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
                text: 'Milliseconds'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time Delay'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Finger Tapping'
            }
          }
        }
      }
      this.chart = new Chart(ctx, config)
    },
    getTimeDelays () {
      /* eslint-disable-next-line */
      const sortedData = this.data.sort((a, b) => a.msFromStart - b.msFromStart)
      const timeDelays = []

      for (let i = 1; i < sortedData.length; i++) {
        const delay = sortedData[i].msFromStart - sortedData[i - 1].msFromStart
        timeDelays.push({ x: sortedData[i].msFromStart, y: delay })
      }
      return timeDelays
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
