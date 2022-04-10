<template>
  <section class="container">
    <ListView
      v-if="placedPoints.length"
      :placedPoints="placedPoints"
      :groups="groups"
    />
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
      markers: [],
      placedPoints: [],
      farthestPoint: 6384415.98,
      distanceBetweenTwoPoints: [],
      groups: {},
    }
  },
  mounted() {
    setTimeout(() => {
      this.addMap()
      // this.addMarker(this.center)
      this.placePoint()
    }, 150)
  },
  watch: {
    placedPoints() {
      if (this.placedPoints.length >= 9) {
        this.groups = this.groupBy(this.placedPoints, 'level')
      }
    },
    markers() {
      const markers = this.markers
      const length = this.markers.length
      let distanceInMeters

      if (length % 2 === 0) {
        distanceInMeters = this.computeDistanceBetweenTwoPoints(
          markers[length - 1],
          markers[length - 2]
        )

        if (distanceInMeters < this.standardDistance) {
          this.placedPoints[this.placedPoints.length - 2]['level'] = 'lower'
          this.placedPoints[this.placedPoints.length - 1]['level'] = 'lower'
        } else {
          this.placedPoints[this.placedPoints.length - 2]['level'] = 'higher'
          this.placedPoints[this.placedPoints.length - 1]['level'] = 'higher'
        }
      }
    },
  },
  computed: {
    standardDistance() {
      return (25 / 100) * this.farthestPoint
    },
  },
  methods: {
    addMap() {
      this.map = new window.google.maps.Map(this.$refs['map'], {
        center: this.center,
        zoom: 8,
      })
    },
    addMarker(coords) {
      const marker = new window.google.maps.Marker({
        position: coords,
        map: this.map,
      })

      // update markers array
      this.markers.push(marker)
    },
    placePoint() {
      let lat
      let lng

      window.google.maps.event.addListener(this.map, 'click', async (event) => {
        lat = event.latLng.lat()
        lng = event.latLng.lng()

        this.placedPoints.push({
          name: await this.getGeoLocation(lat, lng),
          lat: lat,
          lng: lat,
        })

        // add marker to place point
        this.addMarker({ lat: lat, lng: lng })
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
    computeDistanceBetweenTwoPoints(markerA, markerB) {
      const distanceInMeters =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          markerA.getPosition(),
          markerB.getPosition()
        )

      return distanceInMeters
    },
    groupBy(array, key) {
      // Return the end result
      return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        ;(result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        )
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result
      }, {}) // empty object is the initial value for result object
    },
  },
}
</script>

<style>
#app {
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
