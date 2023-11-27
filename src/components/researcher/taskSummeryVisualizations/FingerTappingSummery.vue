<template>
<div v-if="fingerTappingResults">
    <div>
      <canvas id="fingerTappingSummeryChart"></canvas>
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
      taskData: null,
      fingerTappingResults: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = this.taskData.filter(task => task.taskId === 9)
        this.fingerTappingResults = filteredTaskData
        this.initializeFingerTappingChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getFingerTappingSummery () {
      return this.fingerTappingResults.map(result => ({
        x: new Date(result.summary.completedTS),
        y: result.summary.tappingCount
      }))
    },
    getFingerTappingSummeryLabels () {
      return this.fingerTappingResults.map(result => result.summary.completedTS)
    },
    initializeFingerTappingChart () {
      const ctx = document.getElementById('fingerTappingSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Finger Tapping',
              data: this.getFingerTappingSummery(),
              borderColor: '#459399',
              backgroundColor: '#459399'
            }
          ],
          labels: this.getFingerTappingSummeryLabels()
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
                text: 'Tapping Count'
              }
            }
          }
        }
      }
      this.fingerTappingSummery = new Chart(ctx, config)
    }
  }
}
</script>

<style>

</style>
