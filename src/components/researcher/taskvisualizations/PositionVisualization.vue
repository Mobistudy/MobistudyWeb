<template>
<div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
    <p class="taskVisualizationHeader">Map</p>
</div>
    <div id="map" style="width: 530px; height: 400px;"></div>
    <div class="q-pa-md" style="max-width: 350px" id="position_accordion">
    <q-list bordered class="rounded-borders" v-for="(content, key) in this.data.environment" :key="key">
      <q-expansion-item
        expand-separator
        :label="key.toUpperCase()"
      >
        <q-card>
          <q-card-section>
            <table id="position_table">
                <tbody>
                    <tr>
                        <td v-if="key === 'weather'">
                          <table>
                            <tr>
                              <td>Location</td>
                              <td>{{ content.location }}</td>
                            </tr>
                            <tr>
                              <td>Temperature</td>
                              <td> {{ getRounded(content.temperature) }} C°</td>
                            </tr>
                            <tr>
                              <td>Weather</td>
                              <td> <img :src="content.icon" alt=""></td>
                            </tr>
                            <tr>
                              <td>Lowest temperature</td>
                              <td>{{ getRounded(content.temperatureMin) }} C°</td>
                            </tr>
                            <tr>
                              <td>Highest temperature</td>
                              <td>{{ getRounded(content.temperatureMax) }} C°</td>
                            </tr>
                            <tr>
                              <td>Pressure</td>
                              <td>{{ content.pressure }} mbar</td>
                            </tr>
                            <tr>
                              <td>Sunrise</td>
                              <td>{{ getNicerTimeStamp(content.sunrise) }}</td>
                            </tr>
                            <tr>
                              <td>Sunset</td>
                              <td>{{ getNicerTimeStamp(content.sunset) }}</td>
                            </tr>
                            <tr>
                              <td>Clouds</td>
                              <td>{{ content.clouds }}</td>
                            </tr>
                            <tr>
                              <td>Wind Speed</td>
                              <td>{{ content.wind.speed }} m/s</td>
                            </tr>
                          </table>
                        </td>
                        <td v-if="key === 'pollution'">
                          <table>
                            <tr>
                              <td>Air Quality Index (AQI)</td>
                              <td>{{  content.aqi }}</td>
                            </tr>
                            <tr>
                              <td>Co amount</td>
                              <td>{{  content.components.co }}</td>
                            </tr>
                            <tr>
                              <td>No amount</td>
                              <td>{{  content.components.no }}</td>
                            </tr>
                            <tr>
                              <td>No2 Amount</td>
                              <td>{{  content.components.no2 }}</td>
                            </tr>
                            <tr>
                              <td>O3 Amount</td>
                              <td>{{  content.components.o3 }}</td>
                            </tr>
                            <tr>
                              <td>So2 Amount</td>
                              <td>{{  content.components.so2 }}</td>
                            </tr>
                            <tr>
                              <td>PM2_5 Amount</td>
                              <td>{{  content.components.pm2_5 }}</td>
                            </tr>
                            <tr>
                              <td>PM 10</td>
                              <td>{{  content.components.pm10 }}</td>
                            </tr>
                            <tr>
                              <td>Nh3 Amount</td>
                              <td>{{  content.components.nh3 }}</td>
                            </tr>
                          </table>
                        </td>
                        <td v-if="key === 'postcode'">
                          <table>
                            <tr>
                              <td>Postcode</td>
                              <td>{{ content.postcode }}</td>
                            </tr>
                            <tr>
                              <td>County</td>
                              <td>{{ content.county }}</td>
                            </tr>
                          </table>
                        </td>
                        <td v-if="key === 'allergens'">
                          <table>
                            <tr>
                              <td>Grass pollen amount</td>
                              <td>{{ content.pollen.Count.grass_pollen }}</td>
                            </tr>
                            <tr>
                              <td>Tree pollen amount</td>
                              <td>{{ content.pollen.Count.tree_pollen }}</td>
                            </tr>
                            <tr>
                              <td>Weed pollen amount</td>
                              <td>{{ content.pollen.Count.weed_pollen }}</td>
                            </tr>
                            <tr>
                              <td>Risk grass pollen</td>
                              <td>{{ content.pollen.Risk.grass_pollen }}</td>
                            </tr>
                            <tr>
                              <td>Risk tree pollen</td>
                              <td>{{ content.pollen.Risk.tree_pollen }}</td>
                            </tr>
                            <tr>
                              <td>Risk weed pollen</td>
                              <td>{{ content.pollen.Risk.weed_pollen }}</td>
                            </tr>
                            <tr>
                              <td>Species grass</td>
                              <td>{{ content.pollen.Species.Grass }}</td>
                            </tr>
                            <tr>
                              <td>Species others</td>
                              <td>{{ content.pollen.Species.Others }}</td>
                            </tr>
                            <tr>
                              <td>Species tree alder</td>
                              <td>{{ content.pollen.Species.Tree.Alder }}</td>
                            </tr>
                            <tr>
                              <td>Species tree birch</td>
                              <td>{{ content.pollen.Species.Tree.Birch }}</td>
                            </tr>
                            <tr>
                              <td>Species tree cypress</td>
                              <td>{{ content.pollen.Species.Tree.Cypress }}</td>
                            </tr>
                            <tr>
                              <td>Species tree elm</td>
                              <td>{{ content.pollen.Species.Tree.Elm }}</td>
                            </tr>
                            <tr>
                              <td>Species tree hazel</td>
                              <td>{{ content.pollen.Species.Tree.Hazel }}</td>
                            </tr>
                            <tr>
                              <td>Species tree oak</td>
                              <td>{{ content.pollen.Species.Tree.Oak }}</td>
                            </tr>
                            <tr>
                              <td>Species tree pine</td>
                              <td>{{ content.pollen.Species.Tree.Pine }}</td>
                            </tr>
                            <tr>
                              <td>Species tree plane</td>
                              <td>{{ content.pollen.Species.Tree.Plane }}</td>
                            </tr>
                            <tr>
                              <td>Species tree Poplar/cottonwood</td>
                              <td>{{ content.pollen.Species.Tree['Poplar / Cottonwood'] }}</td>
                            </tr>
                          </table>
                        </td>
                    </tr>
                </tbody>
            </table>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { date } from 'quasar'
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
    },
    getRounded (value) {
      return (Math.round(value * 100) / 100).toFixed(2)
    },
    getNicerTimeStamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style>
.th_position, .th_position:hover {
  color: #459399;
}
.th_position:hover {
  text-decoration:underline;
  cursor: pointer;
}
#position_table {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
#position_table td {
  border: 1px solid black;
  padding: 5px;
}
#position_accordion {
  display: flex;
  flex-direction: column;
  margin: auto;
}
</style>
