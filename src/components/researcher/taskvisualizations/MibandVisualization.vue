<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
  </div>
  <div>
    <canvas id="mibandChart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import { date } from 'quasar'
/* eslint-disable */
export default {
  props: ['data', 'completed'],
  mounted () {
    this.initializeChart()
  },
  methods: {
    initializeChart () {
      const ctx = document.getElementById('mibandChart').getContext('2d')
      const config = {
        type: 'bar',
        data: {
          datasets: [{ 
            label: 'Steps', 
            data: this.getStepsActivity(), 
            type: 'bar', 
            borderColor:"blue",                     
            borderWidth:2                     
            }, { 
            label: 'Intensity', 
            data: this.getIntensityActivity(), 
            type: 'line',     
            borderColor:"green"                                         
            }],
            labels: this.getActivityDate()
        },
      }
      this.mibandChart = new Chart(ctx, config)
    },
    getStepsActivity () {
        const stepsArr = []
        for (let i = 0; i < this.data.miband3Data.length; i++) {
            stepsArr.push(this.data.miband3Data[i].steps);
        }
        return stepsArr
    },
    getIntensityActivity () {
        const intensityArr = []
        for (let i = 0; i < this.data.miband3Data.length; i++) {
            intensityArr.push(this.data.miband3Data[i].intensity)
        }
        return intensityArr
    },
    getActivityDate () {
        const dateArr = []
        for (let i = 0; i < this.data.miband3Data.length; i++) {
            dateArr.push(date.formatDate(this.data.miband3Data[i].date, 'YYYY-MM-DD HH:mm:ss'))
        }
        return dateArr
    }
  }
}
</script>

<style>

</style>
