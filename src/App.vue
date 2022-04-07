<template>
  <div id="map" ref="map">reo test</div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      map: null,
      center: { lat: 9.0747, lng: 7.476 },
    }
  },
  mounted() {
    this.addMap()
    this.addMarker(this.center)
    this.addMarker({ lat: 9.5836, lng: 6.5463 })

    this.placePoint()
  },
  methods: {
    getMap(callback) {
      let vm = this
      function checkForMap() {
        if (vm.map) {
          callback(vm.map)
        } else {
          setTimeout(checkForMap, 200)
        }
      }

      checkForMap()
    },
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
      window.google.maps.event.addListener(this.map, 'click', (event) => {
        this.addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
      })
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
  height: 450px;
  background: #eee;
}
</style>
