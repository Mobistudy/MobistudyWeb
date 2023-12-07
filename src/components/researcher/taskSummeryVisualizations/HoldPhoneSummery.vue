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
      const arr = data.map(result => ({
        x: new Date(result.summary.completedTS),
        y: Math.round((result.summary[axis].left.accelerationVariance + result.summary[axis].right.accelerationVariance) / 2)
      }))
      return arr
    },
    getHTPSummeryLabels () {
      return this.holdThePhoneResult.map(result => result.summary.completedTS)
    },
    initializeHTPChart () {
      const ctx = document.getElementById('HTPSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              type: 'line',
              data: this.getHTPSummery('kinetic', this.holdThePhoneResult),
              borderColor: 'blue',
              backgroundColor: 'blue',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Kinetic Acceleration Variance'
            },
            {
              type: 'line',
              data: this.getHTPSummery('postural', this.holdThePhoneResult),
              borderColor: 'red',
              backgroundColor: 'red',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Postural Acceleration Variance'
            },
            {
              type: 'line',
              data: this.getHTPSummery('resting', this.holdThePhoneResult),
              borderColor: 'green',
              backgroundColor: 'green',
              fill: false,
              borderWidth: 1,
              pointRadius: 0,
              label: 'Resting Acceleration Variance'
            }
          ],
          labels: this.getHTPSummeryLabels()
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Acceleration Variance'
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
