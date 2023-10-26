<template>
  <div>
    <canvas id="fingerTappingChart"></canvas>
  </div>
</template>

<script>
/* eslint-disable */
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
        type: 'scatter', 
        data: {
          datasets: [
            {
              label: 'Left finger',
              data: this.getLeft(),
              borderColor: 'red',
              backgroundColor: 'red',
              pointStyle: 'rectRot',
              radius: 5,
            },
            {
              label: 'Right finger',
              data: this.getRight(),
              borderColor: 'blue',
              backgroundColor: 'blue',
              pointStyle: 'rectRot',
              radius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              beginAtZero: true,
            },
            y: {
              type: 'linear',
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Finger Tapping Comparison',
            },
          },
        },
      };

      new Chart(ctx, config);
    },
  
    getLeft() {
      const leftTaps = this.data.filter(item => item.side === 'left');
      return leftTaps.map(item => ({
        x: item.msFromStart,
        y: 1, 
      }));
    },
    getRight() {
      const rightTaps = this.data.filter(item => item.side === 'right');
      return rightTaps.map(item => ({
        x: item.msFromStart,
        y: 2, 
      }));
    },
  },
};
</script>
