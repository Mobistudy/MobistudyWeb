<template>
  <div style="height: 75vh; width: 50vw;">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[47.41322, -1.219482]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />

      <l-marker
        v-for="(position, index) in taskDataContent.positions"
        :key="index"
        :lat-lng="[position.coords.latitude, position.coords.longitude]"
      >
        <l-tooltip>
          {{ new Date(position.timestamp).toLocaleString() }}
        </l-tooltip>
      </l-marker>

      <l-polyline
        :lat-lngs="[
          [47.334852, -1.509485],
          [47.342596, -1.328731],
          [47.241487, -1.190568],
          [47.234787, -1.358337],
        ]"
        color="green"
      ></l-polyline>
      <l-polygon
        :lat-lngs="[
          [46.334852, -1.509485],
          [46.342596, -1.328731],
          [46.241487, -1.190568],
          [46.234787, -1.358337],
        ]"
        color="#41b782"
        :fill="true"
        :fillOpacity="0.5"
        fillColor="#41b782"
      />
      <l-rectangle
        :lat-lngs="[
          [46.334852, -1.509485],
          [46.342596, -1.328731],
          [46.241487, -1.190568],
          [46.234787, -1.358337],
        ]"
        :fill="true"
        color="#35495d"
      />
      <l-rectangle
        :bounds="[
          [46.334852, -1.190568],
          [46.241487, -1.090357],
        ]"
      >
        <l-popup>
          lol
        </l-popup>
      </l-rectangle>
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
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle
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
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle
  },
  data () {
    return {
      zoom: 2,
      iconWidth: 25,
      iconHeight: 40
    }
  },
  mounted () {
    console.log(this.taskDataContent)
  },
  computed: {
    iconUrl () {
      return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`
    },
    iconSize () {
      return [this.iconWidth, this.iconHeight]
    }
  },
  methods: {
  }
}
</script>
