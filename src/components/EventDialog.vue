<template>
  <v-dialog v-if="vevent != null" :value="vevent != null" @input="finish" max-width="290">
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Modify Event</v-toolbar-title>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on">
              <v-icon>cancel</v-icon>
            </v-btn>
          </template>
          <span>Cancel</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="pa-1">
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Course"
                prepend-inner-icon="school"
                type="text"
                v-model="vevent.course"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Module"
                prepend-inner-icon="extension"
                type="text"
                v-model="vevent.mod"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Location"
                prepend-inner-icon="place"
                type="text"
                v-model="vevent.event.location"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Description"
                prepend-inner-icon="description"
                type="text"
                v-model="vevent.event.description"
              />
            </v-col>
          </v-row>
          <v-row v-for="(time, i) of times" :key="i">
            <v-col cols="12">
              <v-icon>access_time</v-icon>
              <v-menu
                v-for="(atime, j) of time"
                :key="j"
                v-model="atime.editing"
                :close-on-content-click="false"
                width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-btn text small v-on="on">{{atime.time}}</v-btn>
                </template>
                <v-time-picker v-if="atime.editing" v-model="atime.time" full-width format="24hr"></v-time-picker>
                <!-- @click:minute="null" -->
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import idb from '../idb'
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
      vevent: null,
      times: []
    }
  },
  watch: {
    async id(id) {
      if (id) {
        this.times = []
        this.vevent = await idb.getVeventByID(id)
        this.times.push([
          {
            time: formatTime(this.vevent.event.startDate.toJSDate()),
            editing: false
          },
          {
            time: formatTime(this.vevent.event.endDate.toJSDate()),
            editing: false
          }
        ])
      } else this.vevent = null
    }
  },
  methods: {
    finish(e) {
      this.$emit('finish', {})
    }
  }
}
</script>

<style>
</style>
