<template>
  <div class="cal-all">
    <div class="cal-head">
      <div class="date day" v-for="fdate of formatDates" :key="fdate">{{fdate}}</div>
    </div>
    <div ref="container" class="cal-container">
      <div class="calendar" v-if="ready" :style="{
        height: zoom * 90 + 'vh'
      }">
        <div class="time-lines">
          <div class="line" v-for="i in 24" :key="i"></div>
        </div>
        <div class="time-hint day">
          <div class="time" v-for="i in 24" :key="i">{{i}}</div>
        </div>
        <div
          class="day"
          :class="{active: i === dayOfWeek}"
          v-for="(days, i) in displayList"
          :key="i"
        >
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
      date: new Date(2019, 10, 3),
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
    formatDates() {
      let fdates = []
      for (let i = 0; i < 7; i++) {
        let fdate = new Date(this.startOfWeek.getTime() + i * 86400000)
        console.log(fdate)
        fdates.push(`${fdate.getMonth() + 1}-${fdate.getDate()}`)
      }
      return fdates
    },
    dayOfWeek() {
      return (this.date.getDay() - this.firstDayOfWeek + 7) % 7
    },
    startOfWeek() {
      return new Date(
        this.date.getTime() - this.dayOfWeek * 86400000 + this.owlMode * 1000
      )
    },
    endOfWeek() {
      return new Date(this.startOfWeek.getTime() + 7 * 86400000)
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
          if (start > this.endOfWeek) break
          let end = new Date(start.getTime() + duration * 1000)
          /* In this week */
          if (
            !notSeen([
              start - this.startOfWeek,
              start - this.endOfWeek,
              end - this.startOfWeek,
              end - this.endOfWeek
            ])
          ) {
            /* Whether to be excluded */
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
.cal-all {
  margin: auto;
  overflow-x: hidden;
  font-size: 12px;
  text-align: center;
}
.cal-head {
  margin-left: 5.5%;
  border-bottom: 1px solid gray;
}
.cal-container {
  overflow-y: scroll;
  width: 100%;
  height: 90vh;
}
.calendar {
  position: relative;
  width: 100%;
}
.time-lines {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 5.5%;
}
.time-lines .line {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  height: 4.166666666666667%;
  border-bottom: 1px dashed gray;
}
.day {
  position: relative;
  display: inline-block;
  width: 13.5%;
  height: 100%;
}
.day.active {
  background-color: #ffa07a55;
}
.day.time-hint {
  width: 5.5%;
}
.time-hint .time {
  height: 4.166666666666667%;
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
.course {
  font-size: 14px;
}
</style>
