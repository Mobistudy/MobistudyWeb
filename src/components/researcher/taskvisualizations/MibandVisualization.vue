<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
  </div>
  <div>
    <canvas id="mibandChart"></canvas>
  </div>
  <div class="resetChart">
        <q-btn @click="mibandChart.resetZoom()" class="reset_btn">Reset Zoom</q-btn>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import { date } from 'quasar'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)
export default {
  props: ['data', 'completed'],
  mounted () {
    this.initializeChart()
    console.log(this.getStepsActivity())
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
            borderColor: '#459399',
            backgroundColor: 'rgba(69, 147, 153, 0.5)',
            borderWidth: 2,
            radius: 4,
            fill: false,
            order: 2
          },
          {
            label: 'Intensity',
            data: this.getIntensityActivity(),
            type: 'line',
            borderColor: 'green',
            backgroundColor: 'green',
            order: 0
          },
          {
            label: 'Heartrate',
            data: this.getHeartrateActivity(),
            type: 'line',
            borderColor: 'red',
            backgroundColor: 'red',
            order: 1
          }],
          labels: this.getActivityDate()
        },
        options: {
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy',
                minZoom: 0.5,
                maxZoom: 2.0,
                sensitivity: 0.5
              }
            }
          }
        }
      }
      this.mibandChart = new Chart(ctx, config)
    },
    getStepsActivity () {
      const stepsArr = []
      for (let i = 0; i < this.data.miband3Data.length; i++) {
        stepsArr.push(this.data.miband3Data[i].steps)
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
    getHeartrateActivity () {
      const heartrate = []
      for (let i = 0; i < this.data.miband3Data.length; i++) {
        heartrate.push(this.data.miband3Data[i].hr)
      }
      return heartrate
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
