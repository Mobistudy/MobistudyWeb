<template>
  <div v-if="vocalizationResult">
      <div>
        <canvas id="vocalizationSummeryChart"></canvas>
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
      vocalizationResult: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = taskData.filter(task => task.taskType === 'vocalization')
        this.vocalizationResult = filteredTaskData
        this.initializeVocalizationChart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    calcDifferenceInTime (index, result) {
      let start = (result.summary.phases[index].startedTS).slice(11, 23)
      let stop = (result.summary.phases[index].completedTS).slice(11, 23)
      start = start.replaceAll(':', '')
      start = start.replaceAll('.', '')
      stop = stop.replaceAll(':', '')
      stop = stop.replaceAll('.', '')
      const time = Math.round((stop - start) / 1000)
      return time
    },
    getVocalizationSummery (index, data) {
      const arr = data.map(result => (this.calcDifferenceInTime(index, result)))
      return arr
    },
    getVocalizationSummeryLabels () {
      return this.vocalizationResult.map(result => (result.summary.completedTS).slice(0, 10))
    },
    initializeVocalizationChart () {
      const ctx = document.getElementById('vocalizationSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getVocalizationSummery(0, this.vocalizationResult),
              borderColor: 'blue',
              backgroundColor: 'blue',
              label: 'Vowel a'
            },
            {
              data: this.getVocalizationSummery(1, this.vocalizationResult),
              borderColor: 'red',
              backgroundColor: 'red',
              label: 'Vowel i'
            },
            {
              data: this.getVocalizationSummery(2, this.vocalizationResult),
              borderColor: 'green',
              backgroundColor: 'green',
              label: 'Vowel u'
            }
          ],
          labels: this.getVocalizationSummeryLabels()
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
                text: 'Seconds',
                color: '#459399'
              }
            }
          }
        }
      }
      this.vocalizationSummery = new Chart(ctx, config)
    }
  }
}
</script>
<style>
  canvas {
    margin: 50px 0;
  }
</style>
