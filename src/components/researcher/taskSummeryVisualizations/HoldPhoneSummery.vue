<template>
  <div v-if="holdThePhoneResult">
      <div>
        <canvas id="HTPSummeryChart"></canvas>
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
      holdThePhoneResult: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = taskData.filter(task => task.taskType === 'holdPhone')
        this.holdThePhoneResult = filteredTaskData
        this.initializeHTPChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getHTPSummery (axis, data) {
      const arr = data.map(result => (Math.round((result.summary[axis].left.accelerationVariance + result.summary[axis].right.accelerationVariance) / 2)))
      return arr
    },
    getHTPSummeryLabels () {
      const labels = this.holdThePhoneResult.map(result => (result.summary.completedTS).slice(0, 10))
      return labels
    },
    initializeHTPChart () {
      const ctx = document.getElementById('HTPSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getHTPSummery('kinetic', this.holdThePhoneResult),
              borderColor: 'blue',
              backgroundColor: 'blue',
              label: 'Kinetic'
            },
            {
              data: this.getHTPSummery('postural', this.holdThePhoneResult),
              borderColor: 'red',
              backgroundColor: 'red',
              label: 'Postural'
            },
            {
              data: this.getHTPSummery('resting', this.holdThePhoneResult),
              borderColor: 'green',
              backgroundColor: 'green',
              label: 'Resting'
            }
          ],
          labels: this.getHTPSummeryLabels()
        },
        options: {
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
                text: 'Acceleration Variance',
                color: '#459399'
              }
            }
          }
        }
      }
      this.HTPSummery = new Chart(ctx, config)
    }
  }
}
</script>
<style>
  canvas {
    margin: 50px 0;
  }
</style>
