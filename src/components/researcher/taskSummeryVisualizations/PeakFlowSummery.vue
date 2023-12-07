<template>
    <div>
      <canvas id="peakFlowChart"></canvas>
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
      peakFlowResults: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = this.taskData.filter(task => task.taskType === 'peakFlow')
        this.peakFlowResults = filteredTaskData
        this.initializePeakflowChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getPeakFlowSummery () {
      return this.peakFlowResults.map(result => (result.summary.pefMax))
    },
    getPeakFlowSummeryLabels () {
      return this.peakFlowResults.map(result => (result.summary.completedTS).slice(0, 10))
    },
    initializePeakflowChart () {
      const ctx = document.getElementById('peakFlowChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'PEF max',
              data: this.getPeakFlowSummery(),
              borderColor: '#459399',
              backgroundColor: '#459399'
            }
          ],
          labels: this.getPeakFlowSummeryLabels()
        },
        options: {
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
              title: {
                display: true,
                text: 'PEF Max',
                color: '#459399'
              }
            }
          }
        }
      }
      this.peakFlowSummary = new Chart(ctx, config)
    }
  }
}
</script>
