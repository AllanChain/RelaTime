<template>
  <v-dialog v-if="events != null" :value="events != null" @input="finish">
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on" @click="done">
              <v-icon color="green lighten-2">check</v-icon>
            </v-btn>
          </template>
          <span>Done</span>
        </v-tooltip>
        <v-toolbar-title>{{singleEvent.description.course}}</v-toolbar-title>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on" @click="deleteThis">
              <v-icon color="red lighten-2">delete</v-icon>
            </v-btn>
          </template>
          <span>Delete This</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on" @click="finish({ update: false })">
              <v-icon color="yellow lighten-2">cancel</v-icon>
            </v-btn>
          </template>
          <span>Cancel</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="pa-1">
        <v-tabs v-model="tab">
          <v-tabs-slider />
          <v-tab v-for="($, mod) in events" :key="'-'+mod" :href="'#' + mod">{{mod}}</v-tab>
          <v-tab-item v-for="(event, mod) in events" :key="mod" :value="mod">
            <!-- <v-tab v-model="tab" v-for="i in 2" :key="i" :href="'#tab-'+i">{{i}}</v-tab>
            <v-tab-item v-for="i in 2" :key="i" :value="'tab-' + i">-->
            <v-container>
              <v-row dense>
                <v-col cols="6" sm="4" dense>
                  <v-text-field
                    outlined
                    dense
                    label="Course"
                    prepend-inner-icon="school"
                    type="text"
                    v-model="event.description.course"
                  />
                </v-col>
                <v-col cols="6" sm="4" dense>
                  <v-text-field
                    outlined
                    dense
                    label="Module"
                    prepend-inner-icon="extension"
                    type="text"
                    v-model="event.description.mod"
                  />
                </v-col>
                <v-col cols="6" sm="4" dense>
                  <v-text-field
                    outlined
                    dense
                    label="class"
                    prepend-inner-icon="description"
                    type="text"
                    v-model="event.description.class"
                  />
                </v-col>
                <v-col cols="6" sm="4" dense>
                  <v-text-field
                    outlined
                    dense
                    label="Location"
                    prepend-inner-icon="place"
                    type="text"
                    v-model="event.location"
                  />
                </v-col>
              </v-row>
              <v-row v-for="(time, i) of event.timeData" :key="i" dense>
                <v-col cols="4" dense>
                  <!-- <v-menu v-model="time.days.editing" :close-on-content-click="false">
                    <template v-slot:activator="{ on }">
                      <v-btn text small dense v-on="on">{{time.days.days}}</v-btn>
                  </template>-->
                  <v-select
                    v-model="time.days.days[0]"
                    :items="['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']"
                    label="Day"
                    outlined
                    dense
                  ></v-select>
                  <!-- </v-menu> -->
                </v-col>
                <v-col v-for="(atime, j) of time.time" :key="j" cols="4" dense>
                  <v-menu
                    v-model="atime.editing"
                    :close-on-content-click="false"
                    width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn text small dense v-on="on">
                        <v-icon class="mr-1">access_time</v-icon>
                        {{atime.time}}
                      </v-btn>
                    </template>
                    <v-time-picker
                      v-if="atime.editing"
                      v-model="atime.time"
                      full-width
                      format="24hr"
                      @click:minute="atime.editing = false"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import idb from '../idb'
import ICAL from 'ical.js'

const formatTime = time => {
  let h = time.getHours()
  if (h < 10) h = '0' + h
  let m = time.getMinutes()
  if (m < 10) m = '0' + m
  return h + ':' + m
}

export default {
  name: 'EventDialog',
  props: ['id'],
  data() {
    return {
      singleEvent: null,
      events: null,
      mode: 'all',
      tab: 1
    }
  },
  watch: {
    async id(id) {
      if (id) {
        let thisEvents = {}
        let thisEvent = await idb.getEventByID(id.id)
        this.singleEvent = thisEvent
        this.tab = thisEvent.description.mod || thisEvent.description.course
        let events = await idb.getCourseByName(thisEvent.description.course)
        for (let event of events) {
          let timeData = {
            time: [
              {
                time: formatTime(event.dtstart),
                editing: false
              },
              {
                time: formatTime(event.dtend),
                editing: false
              }
            ],
            days: {
              days: event.rrule.BYDAY,
              editing: false
            }
          }
          let mod = event.description.mod || event.description.course
          if (thisEvents[mod]) {
            thisEvents[mod].timeData.push(timeData)
          } else {
            event.timeData = [timeData]
            thisEvents[mod] = event
          }
        }
        /* Modify data at once so vue will know */
        this.events = thisEvents
      } else {
        this.events = null
      }
    }
  },
  // computed: {
  //   times() {
  //     if (this.mode == 'single')
  //   }
  // },
  methods: {
    deleteThis() {
      let property = this.singleEvent.event.component.getFirstProperty('exdate')
      let exDates = property.getValues()
      exDates.push(ICAL.Time.fromJSDate(this.id.start))
      property.setValues(exDates)
      idb.updateEvent(this.singleEvent)
      this.finish({ update: true })
    },
    finish(e) {
      this.events = null
      this.$emit('finish', !!e.update)
    },
    done() {}
  }
}
</script>

<style>
</style>
