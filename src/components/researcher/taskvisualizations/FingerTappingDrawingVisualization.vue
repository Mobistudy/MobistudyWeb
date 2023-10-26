<template>
  <div><canvas id="fingerTappingChart"></canvas></div>
</template>

<script>
/*eslint-disable*/
import { Chart } from 'chart.js/auto';

export default {
  props: ['data'],
  mounted() {
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctx = document.getElementById('fingerTappingChart').getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels: this.getLabels(),
          datasets: [
            {
              label: 'Left finger',
              data: this.getLeft(),
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            },
            {
              label: 'Right finger',
              data: this.getRight(),
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.5)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Comparison of Left Finger and Right Finger',
            },
          },
        },
      };

      new Chart(ctx, config);
    },
  
    getLeft() {
      const leftTaps = this.data.filter(item => item.side === 'left');
      return leftTaps.map(item => item.msFromStart);
    },
    getRight() {
      const rightTaps = this.data.filter(item => item.side === 'right');
      return rightTaps.map(item => item.msFromStart);
    },
    getLabels() {
      let seconds = 20;
      let secondsArray = [];

      for (let i = 0; i <= seconds; i++) { // Changed to <= to include 20
        secondsArray.push(i + 's');
      }
      return secondsArray;
    },
  }
}
</script>

<style>
/* Add your styles here if needed */
</style>
