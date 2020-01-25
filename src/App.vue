<template>
  <div id="app">
    <icsProcessor />
    <div v-if="ready">
      <!-- <button @click="addVevent()" :disabled="addDisabled">Add</button> -->
      <ul>
        <li v-for="(display, index) in displayList" :key="index">
          {{display.vevent.course}}, {{display.vevent.event.location}} at
          {{display.day}}, {{display.time}}
          <!-- <button
            @click="deleteVevent(vevent.id)"
          >Delete</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import idb from './utils/idb.js'
import icsProcessor from './components/icsProcessor.vue'

export default {
  name: 'app',
  components: {
    icsProcessor
  },
  data() {
    return {
      ready: false,
      vevents: [],
      db: null,
      addDisabled: false,
      owlMode: 0,
      firstDayOfWeek: 1,
      displayList: []
    }
  },
  async created() {
    await idb.init()
    idb.getVevents().then(data => {
      this.vevents = data
      this.ready = true
      this.parseDisplay()
    })
  },
  methods: {
    parseDisplay() {
      let date = new Date(2019, 9, 30)
      let dayOfWeek = date.getDay()
      let startOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayOfWeek + this.firstDayOfWeek,
        0,
        0,
        this.owlMode
      )
      let endOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayOfWeek + this.firstDayOfWeek + 7,
        0,
        0,
        this.owlMode
      )
      const notSeen = arr => arr.every(x => x >= 0) || arr.every(x => x <= 0)
      this.displayList = []
      let result
      for (let vevent of this.vevents) {
        let event = vevent.event
        let duration = event.duration.toSeconds() * 1000
        let it = event.iterator()
        while ((result = it.next())) {
          let start = result.toJSDate()
          let end = new Date(start.getTime() + duration)
          if (
            !notSeen([
              start - startOfWeek,
              start - endOfWeek,
              end - startOfWeek,
              end - endOfWeek
            ])
          ) {
            let timeDelta = (start.getTime() - startOfWeek.getTime()) / 1000
            this.displayList.push({
              vevent: vevent,
              day: Math.floor(timeDelta / 86400),
              time: timeDelta % 86400
            })
          }
          if (start > endOfWeek) break
        }
      }
    }
  }
}
</script>

<style>
#app {
  text-align: center;
}
ul li {
  display: block;
}
</style>
