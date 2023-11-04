<template>
  <div style="height: 75vh; width: 50vw;">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="centerCoordinates"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />

      <!-- Display a l-marker for the first position -->
      <l-marker
        :lat-lng="[taskDataContent.positions[0].coords.latitude, taskDataContent.positions[0].coords.longitude]"
      >
        <l-tooltip>
          {{ new Date(taskDataContent.positions[0].timestamp).toLocaleString() }}
        </l-tooltip>
      </l-marker>

      <!-- Display a l-marker for the last position -->
      <l-marker
        :lat-lng="[taskDataContent.positions[taskDataContent.positions.length - 1].coords.latitude, taskDataContent.positions[taskDataContent.positions.length - 1].coords.longitude]"
      >
        <l-tooltip>
          {{ new Date(taskDataContent.positions[taskDataContent.positions.length - 1].timestamp).toLocaleString() }}
        </l-tooltip>
      </l-marker>

      <l-polyline
        :lat-lngs="getMarkerCoordinates()"
        color="green"
      ></l-polyline>
    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPolyline
} from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'SMWTMap',
  props: {
    studyKey: String,
    userKey: String,
    taskDataContent: Object
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPolyline
  },
  data () {
    return {
      zoom: 15,
      iconWidth: 25,
      iconHeight: 40
    }
  },
  mounted () {
    console.log(this.taskDataContent)
  },
  computed: {
    centerCoordinates () {
      // Choose the marker you want to use for centering the map, e.g., the first marker.
      const chosenMarker = this.taskDataContent.positions[0] // Change the index as needed.

      if (chosenMarker) {
        return [chosenMarker.coords.latitude, chosenMarker.coords.longitude]
      } else {
        // Fallback coordinates in case the chosen marker doesn't exist or has invalid data.
        return [47.41322, -1.219482]
      }
    }
  },
  methods: {
    getMarkerCoordinates () {
      return this.taskDataContent.positions.map((position) => {
        return [position.coords.latitude, position.coords.longitude]
      })
    }
  }
}
</script>
