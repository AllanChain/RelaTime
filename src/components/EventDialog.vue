<template>
  <v-dialog v-if="event != null" :value="event != null" @input="finish" max-width="350px">
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
        <v-toolbar-title>{{event.description.course}}</v-toolbar-title>
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
        <v-container class="overflow-y-auto" style="max-height: 400px">
          <v-row class="pb-1" dense>
            <v-col cols="8" dense>
              <v-text-field
                outlined
                dense
                hide-details
                label="Course"
                prepend-inner-icon="school"
                type="text"
                v-model="event.description.course"
              />
            </v-col>
            <v-col cols="4" dense>
              <v-text-field
                outlined
                dense
                hide-details
                label="Credit"
                prepend-inner-icon="credit_card"
                type="number"
                v-model="event.description.credit"
              />
            </v-col>
            <v-col cols="6" dense>
              <v-text-field
                outlined
                dense
                hide-details
                label="Module"
                prepend-inner-icon="extension"
                type="text"
                v-model="event.description.mod"
              />
            </v-col>
            <v-col cols="6" dense>
              <v-text-field
                outlined
                dense
                hide-details
                label="Class"
                prepend-inner-icon="class"
                type="number"
                v-model="event.description.class"
              />
            </v-col>
            <v-col cols="6" dense>
              <v-text-field
                outlined
                dense
                hide-details
                label="Location"
                prepend-inner-icon="place"
                type="text"
                v-model="event.location"
              />
            </v-col>
            <v-col cols="6" dense>
              <v-text-field
                outlined
                dense
                hide-details
                label="Duration"
                prepend-inner-icon="timelapse"
                type="number"
                v-model="event.duration"
              />
            </v-col>
          </v-row>
          <v-row v-for="(rrule, i) of rrules()" :key="i" align="start" justify="center" dense>
            <v-col cols="6" dense>
              <v-select
                v-model="rrule.days"
                :items="allDays"
                label="Days"
                append-icon
                prepend-inner-icon="calendar_today"
                outlined
                multiple
                dense
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4" dense>
              <v-menu :close-on-content-click="false" width="290px" min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-btn text dense v-on="on">
                    <v-icon class="mr-1" small>access_time</v-icon>
                    {{rrule.startTime}}
                  </v-btn>
                </template>
                <v-time-picker v-model="rrule.startTime" full-width format="24hr"></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="pt-1" dense>
            <v-col cols="12" dense>
              <v-color-picker
                v-model="event.description.color"
                class="ma-0"
                canvas-height="100px"
                hide-inputs
              ></v-color-picker>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import idb from '../idb'

export default {
  name: 'EventDialog',
  props: ['id'],
  data() {
    return {
      event: null,
      allDays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
    }
  },
  watch: {
    async id(id) {
      if (id) this.event = await idb.getEventByID(id.id)
      else this.event = null
    }
  },
  methods: {
    deleteThis() {
      this.event.exdate.push(this.id.start)
      idb.updateEvent(this.event)
      this.finish({ update: true })
    },
    finish(e) {
      this.events = null
      this.$emit('finish', !!e.update)
    },
    done() {
      idb.updateEvent(this.event)
      this.finish({ update: true })
    },
    addTime() {},
    back1Day(rrule) {
      rrule.BYDAY = rrule.BYDAY.map(day => {
        let index = this.allDays.indexOf(day) || this.allDays.length
        return this.allDays[index - 1]
      })
    },
    *rrules() {
      for (let rrule of this.event.rrule) {
        yield {
          get days() {
            return rrule.BYDAY
          },
          set days(days) {
            rrule.BYDAY = days
          },
          get startTime() {
            let h = rrule.BYHOUR[0]
            h = (h + 8) % 24
            if (h < 10) h = '0' + h
            let m = rrule.BYMINUTE[0]
            if (m < 10) m = '0' + m
            return h + ':' + m
          },
          set startTime(time) {
            let hm = time.split(':')
            let h = parseInt(hm[0]) - 8
            if (h < 0) {
              h += 24
              if (rrule.BYHOUR[0] < 16) this.back1Day(rrule)
            }
            rrule.BYHOUR[0] = h
            rrule.BYMINUTE[0] = parseInt(hm[1])
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
