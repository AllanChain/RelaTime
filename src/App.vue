<template>
  <div id="app">
    <!-- v-model does not work for files -->
    <input type="file" @change="handleICS" />
    <div v-if="ready">
      <!-- <button @click="addVevent()" :disabled="addDisabled">Add</button> -->
      <ul>
        <li v-for="(vevent, index) in vevents" :key="index">
          <!-- {{vevent.name}} is {{vevent.age}} years old. -->
          <button @click="deleteVevent(vevent.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const DB_NAME = 'veventdb'
const DB_VER = 1

export default {
  name: 'app',
  data() {
    return {
      ready: false,
      vevents: [],
      db: null,
      addDisabled: false
    }
  },
  async created() {
    console.log('lsls')
    this.db = await this.getDB()
    this.vevents = await this.getVevents()
    this.ready = true
  },
  methods: {
    async handleICS(event) {
      const file = event.target.files[0]
      console.log(file)
      const reader = new FileReader()
      reader.onload = event => {
        let icalData = event.target.result
        let icalObj = new ICAL.Component(ICAL.parse(icalData))
        let events = icalObj.getAllSubcomponents('vevent')
        for (let vevent of events) {
          let event = new ICAL.Event(vevent)
          let duration = event.duration.toSeconds() * 1000
          let it = event.iterator()
          let result = it.next()
          while (result) {
            let start = result.toJSDate()
            let end = new Date(start.getTime() + duration)
            console.log(start.getHours(), start.getMinutes())
            console.log(end.getHours(), end.getMinutes())
            result = it.next()
          }
        }
      }
      reader.readAsText(file)
    },
    async getDB() {
      return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(DB_NAME, DB_VER)
        // When creating the db, `onupgradeneeded` is called
        // Then `onsuccess`
        request.onupgradeneeded = e => {
          console.log('onupgrade')
          let db = e.target.result
          let objectStore = db.createObjectStore('vevents', {
            autoIncrement: true,
            keyPath: 'id'
          })
          objectStore.createIndex('start', 'start')
          objectStore.createIndex('end', 'end')
          console.log(db, objectStore)
        }
        request.onerror = e => {
          console.log('Reject!!')
          reject(new Error('Reject!!'))
        }
        request.onsuccess = e => {
          resolve(e.target.result)
          console.log('success!')
        }
      })
    },
    async getVevents() {
      return new Promise((resolve, reject) => {
        let trans = this.db.transaction(['vevents'], 'readonly')
        let store = trans.objectStore('vevents')
        let vevents = []
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result
          if (cursor) {
            vevents.push(cursor.value)
            cursor.continue()
          }
        }
        trans.oncomplete = e => resolve(vevents)
      })
    },
    // async addVevent () {
    //   this.addDisabled = true
    //   const vevent = {
    //     name: 'Vevent' + Math.floor(Math.random() * 100),
    //     age: Math.floor(Math.random() * 10) + 1
    //   }
    //   console.log('adding' + JSON.stringify(vevent))
    //   await this.addVeventToDB(vevent)
    //   this.vevents = await this.getVevents()
    //   this.addDisabled = false
    // },
    async addVeventToDB(vevent) {
      return new Promise((resolve, reject) => {
        let trans = this.db.transaction(['vevents'], 'readwrite')
        trans.oncomplete = e => resolve()
        trans.objectStore('vevents').add(vevent)
      })
    },
    async deleteVevent(id) {
      await this.deleteVeventFromDB(id)
      this.vevents = await this.getVevents()
    },
    async deleteVeventFromDB(id) {
      return new Promise((resolve, reject) => {
        let trans = this.db.transaction(['vevents'], 'readwrite')
        trans.oncomplete = e => resolve()
        trans.objectStore('vevents').delete(id)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul li {
  display: block;
}
</style>
