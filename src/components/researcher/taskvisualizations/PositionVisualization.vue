<template>
  <div id="container">
    <div v-if="loading">
      <q-spinner-gears size="80px" color="primary" />
    </div>
    <div v-else-if="data">
      <div>
        <p class="taskVisualizationHeader">Completed: {{ this.niceTimestamp(this.taskProps.row.summary.completedTS) }}</p>
      </div>
        <div v-if="data" id="map"></div>
        <q-list id="position_accordion" bordered class="rounded-borders" v-for="(content, key) in this.data.environment" :key="key">
          <q-expansion-item expand-separator :label="key.toUpperCase()">
            <q-card>
              <q-card-section>
                <table id="position_table">
                    <tbody>
                        <tr>
                            <td v-if="key === 'weather'">
                              <q-table :rows="getWeatherRows(content)" :columns="getWeatherColumns()" row-key="field" :dense="true" class="q-mt-md" :rows-per-page-options="[0]" :hide-pagination="true" />
                            </td>
                            <td v-if="key === 'pollution'">
                              <q-table :rows="getPollutionRows(content)" :columns="getPollutionColumns()" row-key="field" :dense="true" class="q-mt-md" :rows-per-page-options="[0]" :hide-pagination="true" />
                            </td>
                            <td v-if="key === 'postcode'">
                              <q-table :rows="getPostcodeRows(content)" :columns="getPostcodeColumns()" row-key="field" :dense="true" class="q-mt-md" :rows-per-page-options="[0]" :hide-pagination="true" />
                            </td>
                            <td v-if="key === 'allergens'">
                              <q-table :rows="getAllergensRows(content)" :columns="getAllergensColumns()" row-key="field" :dense="true" class="q-mt-md" :rows-per-page-options="[0]" :hide-pagination="true" />
                            </td>
                        </tr>
                    </tbody>
                </table>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
    </div>
    <div v-else>
        <q-alert color="negative" icon="report_problem">
          Cannot retrieve the task content
        </q-alert>
    </div>
  </div>

</template>

<script>
import API from 'src/shared/API'
import { date } from 'quasar'

export default {
  props: ['taskProps'],
  data () {
    return {
      loading: true,
      data: null
    }
  },
  mounted () {
    this.fetchTaskData()
  },
  methods: {
    async fetchTaskData () {
      try {
        this.taskData = await API.getTaskAttachment(this.taskProps.row.studyKey, this.taskProps.row.userKey, this.taskProps.row.taskId, this.taskProps.row.attachments[0])
        this.data = this.taskData
      } catch (err) {
        this.$q.notify({
          color: 'negative',
          message: 'Cannot retrieve the task content',
          icon: 'report_problem'
        })
      } finally {
        this.loading = false
        this.$nextTick(() => {
          this.initializeMap()
        })
      }
    },
    niceTimestamp (timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    initializeMap () {
      if (this.data) {
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
    },
    getWeatherColumns () {
      return [
        { name: 'title', align: 'left', label: 'Title', field: 'title' },
        { name: 'data', align: 'left', label: 'Data', field: 'data' }
      ]
    },
    getWeatherRows (content) {
      return [
        { title: 'Location', data: content.location },
        { title: 'Weather', data: '...' },
        { title: 'Temperature', data: this.getRounded(content.temperature) },
        { title: 'Lowest temperature', data: this.getRounded(content.temperatureMin) },
        { title: 'Highest temperature', data: this.getRounded(content.temperatureMax) },
        { title: 'Pressure', data: content.pressure },
        { title: 'Sunrise', data: this.getNicerTimeStamp(content.sunrise) },
        { title: 'Sunset', data: this.getNicerTimeStamp(content.sunset) },
        { title: 'Clouds', data: content.clouds },
        { title: 'Wind Speed', data: content.wind.speed }
      ]
    },
    getPollutionColumns () {
      return [
        { name: 'title', align: 'left', label: 'Title', field: 'title' },
        { name: 'data', align: 'left', label: 'Data', field: 'data' }
      ]
    },
    getPollutionRows (content) {
      return [
        { title: 'Air Quality Index (AQI)', data: content.aqi },
        { title: 'Co', data: content.components.co },
        { title: 'No', data: content.components.no },
        { title: 'No2', data: content.components.no2 },
        { title: 'O3', data: content.components.o3 },
        { title: 'So2', data: content.components.so2 },
        { title: 'PM2_5', data: content.components.pm2_5 },
        { title: 'PM10', data: content.components.pm10 },
        { title: 'Nh3', data: content.components.nh3 }
      ]
    },
    getPostcodeColumns () {
      return [
        { name: 'title', align: 'left', label: 'Title', field: 'title' },
        { name: 'data', align: 'left', label: 'Data', field: 'data' }
      ]
    },
    getPostcodeRows (content) {
      return [
        { title: 'Postcode', data: content.postcode },
        { title: 'County', data: content.county }
      ]
    },
    getAllergensColumns () {
      return [
        { name: 'title', align: 'left', label: 'Title', field: 'title' },
        { name: 'data', align: 'left', label: 'Data', field: 'data' }
      ]
    },
    getAllergensRows (content) {
      return [
        { title: 'Grass Pollen Amount', data: content.pollen.Count.grass_pollen },
        { title: 'Tree Pollen Amount', data: content.pollen.Count.tree_pollen },
        { title: 'Weed Pollen Amount', data: content.pollen.Count.weed_pollen },
        { title: 'Risk Grass Pollen', data: content.pollen.Risk.grass_pollen },
        { title: 'Risk Tree Pollen', data: content.pollen.Risk.tree_pollen },
        { title: 'Risk Weed Pollen', data: content.pollen.Risk.weed_pollen },
        { title: 'Species Grass', data: content.pollen.Species.Grass['Grass / Poaceae'] },
        { title: 'Species Others', data: content.pollen.Species.Others },
        { title: 'Species Tree Alder', data: content.pollen.Species.Tree.Alder },
        { title: 'Species Tree Birch', data: content.pollen.Species.Tree.Birch },
        { title: 'Species Tree Cypress', data: content.pollen.Species.Tree.Cypress },
        { title: 'Species Tree Elm', data: content.pollen.Species.Tree.Elm },
        { title: 'Species Tree Hazel', data: content.pollen.Species.Tree.Hazel },
        { title: 'Species Tree Oak', data: content.pollen.Species.Tree.Oak },
        { title: 'Species Tree Pine', data: content.pollen.Species.Tree.Pine },
        { title: 'Species Tree Plane', data: content.pollen.Species.Tree.Plane },
        { title: 'Species Tree Poplar/Cottonwood', data: content.pollen.Species.Tree['Poplar / Cottonwood'] }
      ]
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
#map {
  width: 530px;
  height: 400px;
  margin-bottom: 10px;
}
#position_table {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
#position_accordion {
  display: flex;
  flex-direction: column;
  margin: auto;

  max-width: 350px;
}
#container {
  padding-left: 40px;
  padding-right: 40px;
}
</style>
