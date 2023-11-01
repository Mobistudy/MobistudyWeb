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
      console.log(this.getMotionObjects())
      console.log(this.getOrientationObjects())
    },
    getMotionObjects () {
      return JSON.parse(JSON.stringify(this.data.motion))
    },
    getOrientationObjects () {
      return JSON.parse(JSON.stringify(this.data.orientation))
    }
  }
}
</script>

<style>

</style>
