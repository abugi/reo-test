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
      markers: [],
      placedPoints: [],
      farthestPoint: 6384415.98,
      distanceBetweenTwoPoints: [],
      groups: [],
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
        console.log('group points')
      }
    },
    markers() {
      const markers = this.markers
      const length = this.markers.length

      if (length > 1) {
        this.computeDistanceBetweenTwoPoints(
          markers[length - 1],
          markers[length - 2]
        )

        const prop = 'level'
        const value = 'lower'

        this.placedPoints[0][prop] = value
        console.log(this.placedPoints[0])
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

        // add marker to place point
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
    computeDistanceBetweenTwoPoints(markerA, markerB) {
      const distanceInMeters =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          markerA.getPosition(),
          markerB.getPosition()
        )

      this.distanceBetweenTwoPoints.push(distanceInMeters)
      console.log(distanceInMeters)
    },
    // compareDistances() {
    //   const arr = this.distanceBetweenTwoPoints

    //   for (let i = 1; i < arr.length; i++) {
    //     // arr[i] - arr[i - 1] < this.standardDistance ? this.groups.push({})
    //     console.log(arr[i] - arr[i - 1])
    //   }

    //   console.log('standard distance', this.standardDistance)
    // },
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
