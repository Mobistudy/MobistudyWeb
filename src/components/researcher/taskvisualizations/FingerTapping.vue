<template>
  <p>{{data}}</p>
</template>

<script>
export default {
  props: ['data'],
  mounted () {
    this.initializeChart()
  },
  methods: {
    initializeChart () {
      console.log('hello')
    }
  }
}

</script>

<style>

</style>
