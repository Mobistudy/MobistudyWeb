<template>
  <div v-if="drawingResult">
      <div>
        <canvas id="drawingSummeryChart"></canvas>
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
      drawingResult: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = taskData.filter(task => task.taskType === 'drawing')
        this.drawingResult = filteredTaskData
        this.initializedrawingChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getDrawingSummery (drawing, data) {
      const arr = data.map(result => (Math.round(result.summary[drawing])))
      return arr
    },
    getDrawingSummeryLabels () {
      const labels = this.drawingResult.map(result => (result.summary.completedTS).slice(0, 10))
      return labels
    },
    initializedrawingChart () {
      const ctx = document.getElementById('drawingSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getDrawingSummery('totalVariabilitySquare', this.drawingResult),
              borderColor: 'blue',
              backgroundColor: 'blue',
              label: 'Square'
            },
            {
              data: this.getDrawingSummery('totalVariabilitySpiral', this.drawingResult),
              borderColor: 'red',
              backgroundColor: 'red',
              label: 'Spiral'
            }
          ],
          labels: this.getDrawingSummeryLabels()
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
                text: 'Total Variability',
                color: '#459399'
              }
            }
          }
        }
      }
      this.drawingSummery = new Chart(ctx, config)
    }
  }
}
</script>
<style>
  canvas {
    margin: 50px 0;
  }
</style>
