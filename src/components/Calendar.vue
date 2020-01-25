<template>
  <div ref="container" class="cal-container">
    <div class="calendar" v-if="ready" :style="{
        height: zoom * 90 + 'vh'
      }">
      <div class="day" v-for="(days, i) in displayList" :key="i">
        <div
          class="event"
          v-for="(display, j) in days"
          :key="j"
          :style="{
            height: display.height,
            top: display.top,
            'background-color': display.color
            }"
        >
          <span class="course">{{display.course}}</span>
          <span v-if="display.mod" class="mod">{{display.mod}}</span>
          <span class="location">{{display.location}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import idb from '../idb.js'

export default {
  name: 'Calendar',
  data() {
    return {
      ready: false,
      db: null,
      addDisabled: false,
      owlMode: 0,
      zoom: 2,
      scroll: 0.2,
      firstDayOfWeek: 1,
      alpha: 0.9,
      displayList: []
    }
  },
  async created() {
    await idb.init()
    idb.getVevents().then(data => {
      this.vevents = data
      this.ready = true
      this.parseDisplay(data)
      console.log(this.displayList)
      Vue.nextTick(() => {
        const container = this.$refs.container
        container.scrollTo({
          top: container.scrollHeight * this.scroll
        })
      })
    })
  },
  methods: {
    parseDisplay(vevents) {
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
      for (let i = 0; i < 7; i++) this.displayList.push([])
      let result
      for (let vevent of vevents) {
        let event = vevent.event
        let duration = event.duration.toSeconds()
        let it = event.iterator()
        while ((result = it.next())) {
          let start = result.toJSDate()
          let end = new Date(start.getTime() + duration * 1000)
          if (
            !notSeen([
              start - startOfWeek,
              start - endOfWeek,
              end - startOfWeek,
              end - endOfWeek
            ])
          ) {
            let timeDelta = (start.getTime() - startOfWeek.getTime()) / 1000
            let day = Math.floor(timeDelta / 86400)
            let c = vevent.color
            this.displayList[day].push({
              course: vevent.course,
              mod: vevent.mod,
              color: `hsla(${c.h}, ${c.s}%, ${c.l}%, ${this.alpha})`,
              location: vevent.event.location,
              description: vevent.event.description,
              top: (timeDelta % 86400) / 864 + '%',
              height: duration / 864 + '%'
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
.cal-container {
  overflow-x: scroll;
  height: 90vh;
  width: 95vw;
  margin: auto;
  font-size: 14px;
}
.calendar {
  position: relative;
  width: 100%;
}
.day {
  position: relative;
  display: inline-block;
  width: 14.28%;
  height: 100%;
}
.event {
  position: absolute;
  overflow: hidden;
  width: 100%;
  border-radius: 5px;
}
.event span {
  display: block;
}
.location {
  font-size: 12px;
}
</style>
