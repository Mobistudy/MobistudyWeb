<template>
<div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
</div>
    <div id="map" style="width: 530px; height: 400px;"></div>
        <ul v-for="(content, key) in this.data.environment" :key="key">
            <table>
                <thead>
                    <tr>
                        <th @click="this.toggleContent(content)">{{ key }}</th>
                    </tr>
                </thead>
                <tbody v-if="content.showContent">
                    <tr>
                        <td v-if="key === 'weather'">
                        <p>{{ content.location }}</p>
                        <img :src="content.icon" alt="{{ content.description }}">
                        <p>{{ content.temperature }}</p>
                        <p>{{ content.temperatureMin }}</p>
                        <p>{{ content.temperatureMax }}</p>
                        <p>{{ content.pressure }}</p>
                        <p>{{ content.sunrise }}</p>
                        <p>{{ content.sunset }}</p>
                        <p>{{ content.clouds }}</p>
                        <p>Wind speed: {{ content.wind.speed }}</p>
                        </td>
                        <td v-if="key === 'pollution'">
                            <p>Air Quality Index (AQI) {{ content.aqi }}</p>
                            <p>{{ content.components.co }}</p>
                            <p>{{ content.components.no }}</p>
                            <p>{{ content.components.no2 }}</p>
                            <p>{{ content.components.o3 }}</p>
                            <p>{{ content.components.so2 }}</p>
                            <p>{{ content.components.pm2_5 }}</p>
                            <p>{{ content.components.pm10 }}</p>
                            <p>{{ content.components.nh3 }}</p>
                        </td>
                        <td v-if="key === 'postcode'">
                            <p>{{ content.postcode }}</p>
                            <p>{{ content.county }}</p>
                        </td>
                        <td v-if="key === 'allergens'">
                            <p>{{ content.pollen.Count.grass_pollen }}</p>
                            <p>{{ content.pollen.Count.tree_pollen }}</p>
                            <p>{{ content.pollen.Count.weed_pollen }}</p>
                            <p>{{ content.pollen.Risk.grass_pollen }}</p>
                            <p>{{ content.pollen.Risk.tree_pollen }}</p>
                            <p>{{ content.pollen.Risk.weed_pollen }}</p>
                            <p>{{ content.pollen.Species.Grass }}</p>
                            <p>{{ content.pollen.Species.Others }}</p>
                            <p>{{ content.pollen.Species.Tree.Alder }}</p>
                            <p>{{ content.pollen.Species.Tree.Birch }}</p>
                            <p>{{ content.pollen.Species.Tree.Cypress }}</p>
                            <p>{{ content.pollen.Species.Tree.Elm }}</p>
                            <p>{{ content.pollen.Species.Tree.Hazel }}</p>
                            <p>{{ content.pollen.Species.Tree.Oak }}</p>
                            <p>{{ content.pollen.Species.Tree.Pine }}</p>
                            <p>{{ content.pollen.Species.Tree.Plane }}</p>
                            <p>{{ content.pollen.Species.Tree['Poplar / Cottonwood'] }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </ul>
</template>

<script>
export default {
  props: ['data', 'completed'],
  mounted () {
    this.initializeMap()
  },
  methods: {
    toggleContent (data) {
      data.showContent = !data.showContent
    },
    initializeMap () {
      const latitude = this.data.position.coords.latitude
      const longitude = this.data.position.coords.longitude
      /* eslint-disable-next-line */
      const map = L.map('map').setView([latitude, longitude], 13)
      /* eslint-disable-next-line */
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
      }).addTo(map)
      /* eslint-disable-next-line */
      const marker = L.marker([latitude, longitude]).addTo(map)
      marker.bindPopup('Participant position').openPopup()
    }
  }
}
</script>

<style>

</style>
