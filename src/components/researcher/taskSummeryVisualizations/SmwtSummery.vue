<template>
  <div v-if="smwtResult">
      <div>
        <canvas id="smwtDistanceSummeryChart"></canvas>
      </div>
      <div>
        <canvas id="smwtStepsSummeryChart"></canvas>
      </div>
      <div>
        <canvas id="smwtBorgSummeryChart"></canvas>
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
      smwtResult: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = taskData.filter(task => task.taskType === 'smwt')
        this.smwtResult = filteredTaskData
        this.initializesmwtDistanceChart()
        this.initializesmwtStepsChart()
        this.initializesmwtBorgChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getSmwtSummery (smwt, data) {
      const arr = data.map(result => (Math.round(result.summary[smwt])))
      return arr
    },
    getSmwtSummeryLabels () {
      const labels = this.smwtResult.map(result => (result.summary.completedTS).slice(0, 10))
      return labels
    },
    initializesmwtDistanceChart () {
      const ctx = document.getElementById('smwtDistanceSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getSmwtSummery('distance', this.smwtResult),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'Distance'
            }],
          labels: this.getSmwtSummeryLabels()
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
                text: 'Distance',
                color: '#459399'
              }
            }
          }
        }
      }
      this.smwtDistanceSummery = new Chart(ctx, config)
    },
    initializesmwtStepsChart () {
      const ctx = document.getElementById('smwtStepsSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getSmwtSummery('steps', this.smwtResult),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'Steps'
            }],
          labels: this.getSmwtSummeryLabels()
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          responsive: true,
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
                text: 'Steps',
                color: '#459399'
              }
            }
          }
        }
      }
      this.smwtStepsSummery = new Chart(ctx, config)
    },
    initializesmwtBorgChart () {
      const ctx = document.getElementById('smwtBorgSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getSmwtSummery('borgScale', this.smwtResult),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'Borg Scale'
            }],
          labels: this.getSmwtSummeryLabels()
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
                text: 'Borg Scale',
                color: '#459399'
              },
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }
      this.smwtBorgSummery = new Chart(ctx, config)
    }
  }
}
</script>
