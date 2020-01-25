<template>
  <!-- v-model does not work for files -->
  <input type="file" @change="handleICS" />
</template>

<script>
import ICAL from 'ical.js'
import idb from '../utils/idb.js'

export default {
  name: 'icsProcessor',
  methods: {
    async handleICS(event) {
      const file = event.target.files[0]
      console.log(file)
      const reader = new FileReader()
      reader.onload = async event => {
        let icalData = event.target.result
        let parsed = ICAL.parse(icalData)
        let icalObj = new ICAL.Component(parsed)
        let events = icalObj.getAllSubcomponents('vevent')
        for (let vevent of events) {
          let event = new ICAL.Event(vevent)
          /* 课程及模块 */
          let course = event.summary
          let mod = ''
          let courseMatch = course.match(
            /^(.*?)(习题|上机)课*?$/
          )
          if (courseMatch) {
            course = courseMatch[1]
            mod = courseMatch[2]
          }

          await idb.addVeventToDB({
            /* Stringifying event will cause error */
            event: JSON.stringify(vevent),
            course: course,
            mod: mod
          })
        }
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style>

</style>
