<template>
  <div id="app" :style="{ backgroundImage: `url(${bgImg})` }">
    <ICALProcessor />
    <Calendar />
  </div>
</template>

<script>
// import idb from './utils/idb.js'
import ICALProcessor from './components/ICALProcessor'
import Calendar from './components/Calendar'

export default {
  name: 'app',
  components: {
    ICALProcessor,
    Calendar
  },
  data() {
    return {
      bgImg: 'https://allanchain.github.io/webnav/back.jpg'
    }
  },
  methods: {
  }
}
</script>

<style>
#app {
  text-align: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
}
ul li {
  display: block;
}
</style>
