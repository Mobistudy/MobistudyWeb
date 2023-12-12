<template>
  <div v-if="positionResult">
      <div>
        <canvas id="positionSummeryChart"></canvas>
      </div>
      <div>
        <canvas id="positionAQISummeryChart"></canvas>
      </div>
  </div>
  </template>

<script>
import API from 'src/shared/API'
import { Chart } from 'chart.js/auto'

export default {
  props: ['studyKey', 'userKey'],
  mounted () {
    this.fetchTaskData()
  },
  data () {
    return {
      positionResult: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = taskData.filter(task => task.taskType === 'position')
        this.positionResult = filteredTaskData
        this.initializePositionChart()
        this.initializePositionAQIChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getpositionSummery (position, data) {
      const arr = data.map(result => (Math.round(result.summary[position])))
      return arr
    },
    getpositionSummeryLabels () {
      const labels = this.positionResult.map(result => {
        const arr = [(result.summary.completedTS).slice(0, 10), ` ${result.summary.location}`, ` ${(result.summary.weather).charAt(0).toUpperCase() + (result.summary.weather).slice(1)}`]
        return arr
      })
      return labels
    },
    getAQILabels () {
      const labels = this.positionResult.map(result => (result.summary.completedTS).slice(0, 10))
      return labels
    },
    getTitle () {
      const title = this.positionResult.map(result => result.summary.weather)
      return title
    },
    initializePositionChart () {
      const ctx = document.getElementById('positionSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getpositionSummery('temperature', this.positionResult),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'Temperature'
            }],
          labels: this.getpositionSummeryLabels()
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              position: 'bottom',
              title: {
                display: true,
                text: 'Date, Location and Weather',
                color: '#459399'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Temperature',
                color: '#459399'
              }
            }
          }
        }
      }
      this.positionDistanceSummery = new Chart(ctx, config)
    },
    initializePositionAQIChart () {
      const ctx = document.getElementById('positionAQISummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getpositionSummery('aqi', this.positionResult),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'AQI'
            }],
          labels: this.getAQILabels()
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              position: 'bottom',
              title: {
                display: true,
                text: 'Date',
                color: '#459399'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'AQI',
                color: '#459399'
              },
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }
      this.positionAQISummery = new Chart(ctx, config)
    }
  }
}
</script>
