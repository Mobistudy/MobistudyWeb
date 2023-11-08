<template>
<div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
</div>
<p>{{ data }}</p>
</template>

<script>
export default {
    props: ['data', 'completed'],
    mounted () {
        this.initializeChart()
    },
    methods: {
        initializeChart () {
        console.log('Position chart...')
        }
    }
}
</script>

<style>

</style>
