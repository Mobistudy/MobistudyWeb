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
      console.log('Drawing chart...')
    }
  }
}
</script>

<style>

</style>
