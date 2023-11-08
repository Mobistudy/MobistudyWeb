<template>
<div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
</div>
<p>{{ data }}</p>
    <div id="map" style="width: 530px; height: 400px;"></div>
</template>

<script>
/* eslint-disable */
export default {
    props: ['data', 'completed'],
    mounted () {
        this.initializeMap()
    },
    methods: {
        initializeMap () {
            const latitude = this.data.position.coords.latitude;
            const longitude = this.data.position.coords.longitude;

            const map = L.map('map').setView([latitude, longitude], 13)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
                attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
            }).addTo(map)
            const marker = L.marker([latitude, longitude]).addTo(map)
            marker.bindPopup('Participant position').openPopup()
        }
    }
}
</script>

<style>

</style>
