<template>
  <section class="container">
    <ListView v-if="placedPoints.length" :placedPoints="placedPoints" />
    <div id="map" ref="map"></div>
  </section>
</template>

<script>
import ListView from '@/components/List view.vue'
import axios from 'axios'
export default {
  name: 'App',
  components: { ListView },
  data() {
    return {
      map: null,
      center: { lat: 9.0747, lng: 7.476 },
      placedPoints: [],
    }
  },
  mounted() {
    this.addMap()
    this.addMarker(this.center)
    this.addMarker({ lat: 9.5836, lng: 6.5463 })

    this.placePoint()
  },
  methods: {
    addMap() {
      this.map = new window.google.maps.Map(this.$refs['map'], {
        center: this.center,
        zoom: 8,
      })
    },
    addMarker(coords) {
      new window.google.maps.Marker({
        position: coords,
        map: this.map,
      })
    },
    placePoint() {
      let lat
      let lng

      window.google.maps.event.addListener(this.map, 'click', async (event) => {
        lat = event.latLng.lat()
        lng = event.latLng.lng()

        this.addMarker({ lat: lat, lng: lng })
        this.placedPoints.push({
          name: await this.getGeoLocation(lat, lng),
          lat: lat,
          lng: lat,
        })
      })
    },
    async getGeoLocation(lat, lng) {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.VUE_APP_GOOGLE_GEOLOCATION_API}`
      )

      if (!data.results.length) {
        return
      }

      return data.results[data.results.length - 2].formatted_address
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#map {
  width: 100%;
  height: 100vh;
  background: #eee;
}

.container {
  display: flex;
  flex-direction: row;
}
</style>
