import ICAL from 'ical.js'

const DB_NAME = 'veventdb'
const DB_VER = 1

export default {
  name: 'idb',
  db: null,
  async init() {
    if (!this.db) this.db = await this.getDB()
  },
  translateEvent(vevent) {
    vevent.event = new ICAL.Event(
      new ICAL.Component(JSON.parse(vevent.event))
    )
    return vevent
  },
  async getDB() {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(DB_NAME, DB_VER)
      // When creating the db, `onupgradeneeded` is called
      // Then `onsuccess`
      request.onupgradeneeded = e => {
        let db = e.target.result
        let objectStore = db.createObjectStore('vevents', {
          autoIncrement: true,
          keyPath: 'id'
        })
        objectStore.createIndex('course', 'course')
      }
      request.onerror = e => reject(new Error('Reject!!'))
      request.onsuccess = e => resolve(e.target.result)
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
          let vevent = this.translateEvent(cursor.value)
          vevents.push(vevent)
          cursor.continue()
        }
      }
      trans.oncomplete = e => resolve(vevents)
    })
  },
  async getVeventByID(id) {
    return new Promise(resolve => {
      let trans = this.db.transaction(['vevents'], 'readonly')
      let request = trans.objectStore('vevents').get(id)
      request.onsuccess = () => resolve(this.translateEvent(request.result))
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
