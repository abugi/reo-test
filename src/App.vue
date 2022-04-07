<template>
  <div></div>
</template>

<script>
export default {
  name: 'App',
  async mounted() {
    this.google = window.google
    this.map = window.createMap

    if (this.google) {
      this.addMarker()
    }
  },
  data() {
    return {
      google: null,
      map: null,
    }
  },
  methods: {
    async addMarker() {
      await new this.google.maps.Marker({
        position: { lat: 9.0787, lng: 7.4702 },
        map: this.map(),
      })

      // const infoWindow = await new this.google.maps.InfoWindow({
      //   content: '<h1>Wuse 2, Abuja</h1>',
      // })

      // marker.addListener('click', function () {
      //   infoWindow.open(this.map, marker)
      // })
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
  height: 600px;
}
</style>
