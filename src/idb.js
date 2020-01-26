import ICAL from 'ical.js'

const DB_NAME = 'veventdb'
const DB_VER = 1

export default {
  name: 'idb',
  db: null,
  async init() {
    if (!this.db) this.db = await this.getDB()
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
        objectStore.createIndex('course', 'course')
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
          let vevent = cursor.value
          vevent.event = new ICAL.Event(
            new ICAL.Component(JSON.parse(vevent.event)))
          vevents.push(vevent)
          cursor.continue()
        }
      }
      trans.oncomplete = e => resolve(vevents)
    })
  },
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
