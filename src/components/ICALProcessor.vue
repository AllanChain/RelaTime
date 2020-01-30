<template>
  <div>
    <v-btn @click.stop="doUpload" icon text small>
      <v-icon>mdi-upload</v-icon>
    </v-btn>
    <v-btn @click.stop="exportICS" icon text small>
      <v-icon>file_download</v-icon>
    </v-btn>
    <!-- v-model does not work for files -->
    <input type="file" accept=".ics" ref="file" @change="handleICS" hidden />
    <!-- <a class="d-none" :download="" :href=></a> -->
  </div>
</template>

<script>
import ICAL from 'ical.js'
import idb from '../idb.js'
import utils from '../utils.js'

export default {
  name: 'ICALProcessor',
  methods: {
    doUpload() {
      this.$refs.file.click()
    },
    async exportICS() {
      let events = await idb.getEvents()
      let ical = new ICAL.Component(['vcalendar', [], []])
      ical.updatePropertyWithValue('prodid', '-//RelaTime Export')
      for (let event of events) {
        let clone = JSON.parse(JSON.stringify(event.rrule))
        for (let rrule of clone) {
          event.rrule = [rrule]
          ical.addSubcomponent(utils.eventToComp(event))
        }
      }
      let hiddenElement = document.createElement('a')
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(ical.toString())
      hiddenElement.target = '_blank'
      hiddenElement.download = `export-${new Date().getTime()}.ics`
      hiddenElement.click()
    },
    async handleICS(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = async event => {
        let icalData = event.target.result
        let parsed = ICAL.parse(icalData)
        let icalObj = new ICAL.Component(parsed)
        let events = icalObj.getAllSubcomponents('vevent')
        let colorMap = {}
        let eventMap = {}
        for (let vevent of events) {
          let event = utils.compToEvent(vevent)
          let hash = utils.eventHash(event)
          if (hash in eventMap) {
            let targetEvent = eventMap[hash]
            for (let targetRrule of targetEvent.rrule) {
              for (let rrule of event.rrule) {
                if (JSON.stringify(rrule) !== JSON.stringify(targetRrule))
                  targetEvent.rrule.push(rrule)
              }
            }
          } else eventMap[hash] = event
          if (!(event.description.course in colorMap))
            colorMap[event.description.course] = utils.randColor()

          event.description.color = colorMap[event.description.course]
        }
        let promises = []
        for (let hash in eventMap)
          promises.push(idb.addEventToDB(eventMap[hash]))
        Promise.all(promises)
        this.$emit('update')
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style>
</style>
