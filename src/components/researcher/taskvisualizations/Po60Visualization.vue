<template>
<div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
</div>
<p>{{ data }}</p>
</template>

<script>
/* eslint-disable*/
export default {
    props: ['data', 'completed'],
    mounted () {
        this.initializeChart()
    },
    methods: {
        initializeChart () {
        console.log('HoldPhone chart...')
        }
    }
  }
</script>

<style>

</style>
