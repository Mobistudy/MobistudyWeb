<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
    <div>
      <p v-for="(test, index) in formattedData" :key="index">{{ test }}</p>
    </div>
    <p>Highest Value: {{ highestValueWithUnits }}</p>
  </div>
</template>

<script>
export default {
  props: ['data', 'completed'],
  computed: {
    formattedData () {
      if (this.data && this.data.PEFs) {
        return this.data.PEFs.map((value, index) => `Test ${index + 1}: ${value} liters/minute`)
      }
      return []
    },
    highestValue () {
      if (this.data && this.data.PEFs) {
        return Math.max(...this.data.PEFs)
      }
      return null
    },
    highestValueWithUnits () {
      if (this.highestValue !== null) {
        return `${this.highestValue} liters/minute`
      }
      return null
    }
  },
  mounted () {
    this.initializeChart()
  },
  methods: {
    initializeChart () {
      console.log('Peak Flow visualization...')
    }
  }
}
</script>

<style>
.q-card {
  min-width: 500px !important;
  min-height: 500px !important;
}
</style>
