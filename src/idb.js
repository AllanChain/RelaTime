// import ICAL from 'ical.js'

const DB_NAME = 'eventdb'
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
        let db = e.target.result
        let objectStore = db.createObjectStore('events', {
          autoIncrement: true,
          keyPath: 'id'
        })
        objectStore.createIndex('course', 'description.course')
      }
      request.onerror = e => reject(new Error('Reject!!'))
      request.onsuccess = e => resolve(e.target.result)
    })
  },
  async getEvents() {
    return new Promise((resolve, reject) => {
      let trans = this.db.transaction(['events'], 'readonly')
      let request = trans.objectStore('events').getAll()
      request.onsuccess = () => resolve(request.result)
    })
  },
  async getEventByID(id) {
    return new Promise(resolve => {
      let trans = this.db.transaction(['events'], 'readonly')
      let request = trans.objectStore('events').get(id)
      request.onsuccess = () => resolve(request.result)
    })
  },
  async getCourseByName(name) {
    return new Promise(resolve => {
      let trans = this.db.transaction(['events'], 'readonly')
      let request = trans
        .objectStore('events')
        .index('course')
        .getAll(IDBKeyRange.only(name))
      request.onsuccess = () => resolve(request.result)
    })
  },
  async updateEvent(event) {
    return new Promise(resolve => {
      let trans = this.db.transaction(['events'], 'readwrite')
      trans.oncomplete = resolve
      trans.objectStore('events').put(event)
    })
  },
  async addEventToDB(event) {
    return new Promise(resolve => {
      let trans = this.db.transaction(['events'], 'readwrite')
      trans.oncomplete = resolve
      trans.objectStore('events').add(event)
    })
  },
  async deleteEvent(id) {
    await this.deleteEventFromDB(id)
    this.events = await this.getEvents()
  },
  async deleteEventFromDB(id) {
    return new Promise((resolve, reject) => {
      let trans = this.db.transaction(['events'], 'readwrite')
      trans.oncomplete = e => resolve()
      trans.objectStore('events').delete(id)
    })
  }
}
