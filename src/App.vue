<template>
  <section class="container">
    <ListView
      id="list-wrapper"
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
      farthestPoint: 6384415.98, // Chimborazo's summit (farthest point on earth's surface)
      distanceBetweenTwoPoints: [],
      groups: {},
    }
  },
  mounted() {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAP_JAVASCRIPT_API}&libraries=geometry`

    document.body.appendChild(script)

    setTimeout(() => {
      this.addMap()
      // this.addMarker(this.center)
      this.placePoint()
    }, 500)
  },
  watch: {
    placedPoints() {
      // Group locations when upto 9  points are placed
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

        this.assignGroupFlag(distanceInMeters)
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
    assignGroupFlag(distance) {
      const points = this.placedPoints
      const prop = 'level' // the level key is useful for grouping placed points

      if (distance < this.standardDistance) {
        points[points.length - 2][prop] = 'lower'
        points[points.length - 1][prop] = 'lower'
      } else {
        points[points.length - 2][prop] = 'higher'
        points[points.length - 1][prop] = 'higher'
      }
    },
    groupBy(array, key) {
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
  order: 2;
}

#list-wrapper {
  order: 1;
}

.container {
  display: flex;
  flex-direction: row;
}

@media only screen and (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  #map {
    order: 1;
    height: 50vh;
  }

  #list-wrapper {
    order: 2;
    height: 50vh;
    width: 100%;
  }
}
</style>
