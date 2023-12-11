<template>
  <div v-if="PO60Result">
      <div>
        <canvas id="PO60HRSummeryChart"></canvas>
      </div>
      <div>
        <canvas id="PO60SPO2SummeryChart"></canvas>
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
      PO60Result: []
    }
  },
  methods: {
    async fetchTaskData () {
      try {
        const taskData = await API.getTasksResults(this.studyKey, this.userKey)
        const filteredTaskData = taskData.filter(task => task.taskType === 'po60')
        this.PO60Result = filteredTaskData
        this.initializePO60HRChart()
        this.initializePO60SPO2Chart()
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      }
    },
    getPO60Summery (PO60, data) {
      const arr = data.map(result => (Math.round(result.summary[PO60])))
      return arr
    },
    getPO60SummeryLabels () {
      const labels = this.PO60Result.map(result => (result.summary.completedTS).slice(0, 10))
      return labels
    },
    initializePO60HRChart () {
      const ctx = document.getElementById('PO60HRSummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getPO60Summery('hr', this.PO60Result),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'Hart Rate'
            }],
          labels: this.getPO60SummeryLabels()
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
                text: 'HR',
                color: '#459399'
              }
            }
          }
        }
      }
      this.PO60HRSummery = new Chart(ctx, config)
    },
    initializePO60SPO2Chart () {
      const ctx = document.getElementById('PO60SPO2SummeryChart').getContext('2d')
      const config = {
        type: 'line',
        data: {
          datasets: [
            {
              data: this.getPO60Summery('SPO2', this.PO60Result),
              borderColor: '#459399',
              backgroundColor: '#459399',
              label: 'SPO2'
            }],
          labels: this.getPO60SummeryLabels()
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
                text: 'SPO2',
                color: '#459399'
              }
            }
          }
        }
      }
      this.PO60SPO2Summery = new Chart(ctx, config)
    }
  }
}
</script>
