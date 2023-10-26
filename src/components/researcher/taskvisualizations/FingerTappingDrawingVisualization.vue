<template>
  <p>{{ data }}</p>
</template>

<script>
export default {
  props: ['data'],
  mounted () {
    this.initializeChart()
  },
  methods: {
    initializeChart () {
      console.log(this.getRight())
    },
    getLeft () {
      const leftTaps = this.data.filter(item => item.side === 'left')
      return leftTaps.map(item => item.msFromStart)
    },
    getRight () {
      const leftTaps = this.data.filter(item => item.side === 'right')
      return leftTaps.map(item => item.msFromStart)
    }
  }
}
</script>

<style>

</style>
