<template>
  <div>
    <div class="cal-all">
      <div class="cal-head">
        <div class="date" v-for="fdate of formatDates" :key="fdate">{{fdate}}</div>
      </div>
      <div ref="container" class="cal-container" @touchstart="touchStart" @touchend="touchEnd">
        <div class="calendar" v-if="ready" :style="{
        height: zoom * 90 + 'vh'
      }">
          <div class="time-lines">
            <div :style="{height: timeHintPadding}"></div>
            <div class="line" v-for="i in 24" :key="i"></div>
          </div>
          <div class="time-hint">
            <div :style="{height: `calc(${timeHintPadding} - 9px)`}"></div>
            <p class="time" v-for="hint in timeHints" :key="hint">{{hint}}</p>
          </div>
          <div
            class="day"
            :class="{active: i === dayOfWeek && deltaDay === 0 }"
            v-for="(days, i) in displayList"
            :key="i"
          >
            <div
              class="event"
              v-for="(display, j) in days"
              @click="editingID = { id: display.id, start: display.start }"
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
    <EventDialog :id="editingID" @finish="dialogFinish" />
  </div>
</template>

<script>
import Vue from 'vue'
import Hammer from 'hammerjs'
import idb from '../idb.js'
import utils from '../utils'
import EventDialog from './EventDialog'

let originZoom, hammer

export default {
  name: 'Calendar',
  components: {
    EventDialog
  },
  data() {
    return {
      ready: false,
      addDisabled: false,
      events: [],
      owlMode: 26600, // a.k.a. startOfDay
      zoom: 2,
      scroll: 0.2,
      firstDayOfWeek: 1,
      deltaDay: 0, // change when swipe
      date: new Date(2019, 10, 3),
      alpha: 0.7,
      editingID: null,
      touchThreshold: 40
    }
  },
  async created() {
    await idb.init()
    idb.getEvents().then(data => {
      this.events = data
      this.ready = true
      Vue.nextTick(() => {
        const container = this.$refs.container
        container.scrollTo({
          top: container.scrollHeight * this.scroll
        })
      })
    })
  },
  mounted() {
    hammer = new Hammer.Manager(this.$refs.container)
    hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }))
    hammer.add(new Hammer.Pinch({ enable: false }))
    hammer.on('pinchstart', this.pinchStart)
    hammer.on('pinchmove', this.pinchMove)
    hammer.on('swipeleft', () => {
      this.deltaDay += 7
    })
    hammer.on('swiperight', () => {
      this.deltaDay -= 7
    })
  },
  methods: {
    async update() {
      this.events = await idb.getEvents()
    },
    dialogFinish(update) {
      this.editingID = null
      if (update) this.update()
    },
    pinchStart(e) {
      originZoom = this.zoom
    },
    pinchMove(e) {
      this.zoom = originZoom * e.scale
    },
    touchStart(e) {
      if (e.touches.length > 1)
        hammer.get('pinch').set({ enable: true })
    },
    touchEnd(e) {
      hammer.get('pinch').set({ enable: false })
    }
  },
  computed: {
    formatDates() {
      let fdates = []
      for (let i = 0; i < 7; i++) {
        let fdate = new Date(this.startOfWeek.getTime() + i * 86400000)
        fdates.push(`${fdate.getMonth() + 1}-${fdate.getDate()}`)
      }
      return fdates
    },
    timeHints() {
      /* Math.floor + 1 != Math.ceil in case of 0 */
      let nearest = Math.floor(this.owlMode / 3600) + 1
      let hints = [nearest]
      for (let i = nearest + 1; i < 24; i++) hints.push(i)
      for (let i = 0; i < nearest; i++) hints.push(i)
      return hints
    },
    timeHintPadding() {
      let h = this.owlMode / 3600
      return ((Math.floor(h) + 1 - h) / 24) * 100 + '%'
    },
    dayOfWeek() {
      return (this.date.getDay() - this.firstDayOfWeek + 7) % 7
    },
    startOfWeek() {
      return new Date(
        this.date.getTime() +
          (this.deltaDay - this.dayOfWeek) * 86400000 +
          this.owlMode * 1000
      )
    },
    endOfWeek() {
      return new Date(this.startOfWeek.getTime() + 7 * 86400000)
    },
    displayList() {
      let displayList = []
      for (let i = 0; i < 7; i++) displayList.push([])
      const notSeen = arr => arr.every(x => x >= 0) || arr.every(x => x <= 0)
      for (let event of this.events) {
        for (let start of utils.getIterator(event)) {
          if (start > this.endOfWeek) break
          let end = new Date(start.getTime() + event.duration * 1000)
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
            for (let exDate of event.exdate) {
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
            let c = event.description.color
            displayList[day].push({
              course: event.description.course,
              mod: event.description.mod,
              color: `hsla(${c.h}, ${c.s * 100}%, ${c.l * 100}%, ${this.alpha})`,
              location: event.location,
              top: (timeDelta % 86400) / 864 + '%',
              height: event.duration / 864 + '%',
              id: event.id,
              start: start
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
  padding-left: 18px;
  border-bottom: 1px solid gray;
}
.cal-container {
  overflow-y: scroll;
  width: 100%;
  height: calc(100vh - 67px);
  /* Hide scrollbar for IE and Edge */
  -ms-overflow-style: none;
}
/* Hide scrollbar for Chrome, Safari and Opera */
.cal-container::-webkit-scrollbar {
  display: none;
}
.calendar {
  position: relative;
  padding-left: 18px;
  /* Time lable will overflow */
  overflow: hidden;
}
.time-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.time-lines .line {
  /* seems vuetify introduces border-box; */
  height: 4.166666666666667%;
  margin-left: 18px;
  border-top: 1px dashed gray;
}
.date {
  position: relative;
  display: inline-block;
  width: 14.285714285714286%;
  height: 100%;
}
.day {
  position: relative;
  display: inline-block;
  width: 14.285714285714286%;
  height: 100%;
}
.day.active {
  background-color: #ffa07a55;
}
.time-hint {
  width: 18px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}
.time-hint .time {
  margin: 0;
  vertical-align: bottom;
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
