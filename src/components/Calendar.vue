<template>
  <div ref="container" class="cal-container">
    <div class="calendar" v-if="ready" :style="{
        height: zoom * 90 + 'vh'
      }">
      <div class="day" v-for="(days, i) in displayList" :key="i">
        <div class="date">{{i}}</div>
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
      addDisabled: false,
      vevents: [],
      owlMode: 0,
      zoom: 2,
      scroll: 0.2,
      firstDayOfWeek: 1,
      date: new Date(2019, 9, 3),
      alpha: 0.9
    }
  },
  async created() {
    await idb.init()
    idb.getVevents().then(data => {
      this.vevents = data
      this.ready = true
      Vue.nextTick(() => {
        const container = this.$refs.container
        container.scrollTo({
          top: container.scrollHeight * this.scroll
        })
      })
    })
  },
  computed: {
    startOfWeek() {
      return new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() - this.date.getDay() + this.firstDayOfWeek,
        0,
        0,
        this.owlMode
      )
    },
    endOfWeek() {
      return new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() - this.date.getDay() + this.firstDayOfWeek + 7,
        0,
        0,
        this.owlMode
      )
    },
    displayList() {
      let displayList = []
      for (let i = 0; i < 7; i++) displayList.push([])
      const notSeen = arr => arr.every(x => x >= 0) || arr.every(x => x <= 0)
      let result
      for (let vevent of this.vevents) {
        let event = vevent.event
        let duration = event.duration.toSeconds()
        let it = event.iterator()
        while ((result = it.next())) {
          let start = result.toJSDate()
          // console.log(start)
          if (start > this.endOfWeek) break
          let end = new Date(start.getTime() + duration * 1000)
          if (
            !notSeen([
              start - this.startOfWeek,
              start - this.endOfWeek,
              end - this.startOfWeek,
              end - this.endOfWeek
            ])
          ) {
            let exclude = false
            for (let exDate of it.exDates) {
              exDate = exDate.toJSDate()
              if (
                exDate.getFullYear() === start.getFullYear() &&
                exDate.getMonth() === start.getMonth() &&
                exDate.getDate() === start.getDate()
              ) {
                exclude = true
                break
              }
            }
            if (exclude) continue
            let timeDelta =
              (start.getTime() - this.startOfWeek.getTime()) / 1000
            let day = Math.floor(timeDelta / 86400)
            let c = vevent.color
            displayList[day].push({
              course: vevent.course,
              mod: vevent.mod,
              color: `hsla(${c.h}, ${c.s}%, ${c.l}%, ${this.alpha})`,
              location: vevent.event.location,
              description: vevent.event.description,
              top: (timeDelta % 86400) / 864 + '%',
              height: duration / 864 + '%'
            })
          }
        }
      }
      return displayList
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
