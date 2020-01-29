<template>
  <div>
    <v-btn @click.stop="doUpload" icon text small>
      <v-icon>mdi-upload</v-icon>
    </v-btn>
    <!-- v-model does not work for files -->
    <input type="file" accept=".ics" ref="file" @change="handleICS" hidden />
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
    async handleICS(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = async event => {
        let icalData = event.target.result
        let parsed = ICAL.parse(icalData)
        let icalObj = new ICAL.Component(parsed)
        let events = icalObj.getAllSubcomponents('vevent')
        let colorMap = {}
        let promises = []
        for (let vevent of events) {
          let event = utils.compToEvent(vevent)
          if (!(event.description.course in colorMap)) {
            colorMap[event.description.course] = utils.randColor()
          }
          event.description.color = colorMap[event.description.course]
          promises.push(idb.addEventToDB(event))
        }
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
