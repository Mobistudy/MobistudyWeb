<template>
<div v-if="tugtResults">
    <div>
      <canvas id="tugtSummeryChart"></canvas>
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
      tugtResults: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = this.taskData.filter(task => task.taskType === 'tugt')
        this.tugtResults = filteredTaskData
        this.initializeTugtChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getTugtSummery () {
      return this.tugtResults.map(result => ((result.summary.durationMs / 1000)))
    },
    getTugtSummeryLabels () {
      return this.tugtResults.map(result => (result.summary.completedTS).slice(0, 10))
    },
    initializeTugtChart () {
      const ctx = document.getElementById('tugtSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Tugt',
              data: this.getTugtSummery(),
              borderColor: '#459399',
              backgroundColor: '#459399'
            }
          ],
          labels: this.getTugtSummeryLabels()
        },
        options: {
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
              title: {
                display: true,
                text: 'Duration (seconds)',
                color: '#459399'
              }
            }
          }
        }
      }
      this.tugtSummery = new Chart(ctx, config)
    }
  }
}
</script>
<style>
  canvas {
    margin: 50px 0;
  }
</style>
