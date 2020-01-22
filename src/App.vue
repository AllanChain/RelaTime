<template>
  <div id="app">
    <div v-if="ready">
      <button @click="addCat()" :disabled="addDisabled">Add</button>
      <ul>
        <li v-for="(cat, index) in cats" :key="index">
          {{cat.name}} is {{cat.age}} years old.
          <button @click="killCat(cat.id)">Kill</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const DB_NAME = 'catdb'
const DB_VER = 1

export default {
  name: 'app',
  data () {
    return {
      ready: false,
      cats: [],
      db: null,
      addDisabled: false
    }
  },
  async created () {
    console.log('lsls')
    this.db = await this.getDB()
    this.cats = await this.getCats()
    this.ready = true
  },
  methods: {
    async getDB () {
      return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(DB_NAME, DB_VER)
        // When creating the db, `onupgradeneeded` is called
        // Then `onsuccess`
        request.onupgradeneeded = e => {
          console.log('onupgrade')
          let db = e.target.result
          let objectStore = db.createObjectStore('cats', {
            autoIncrement: true,
            keyPath: 'id'
          })
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
    async getCats () {
      return new Promise((resolve, reject) => {
        let trans = this.db.transaction(['cats'], 'readonly')
        let store = trans.objectStore('cats')
        let cats = []
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result
          if (cursor) {
            cats.push(cursor.value)
            cursor.continue()
          }
        }
        trans.oncomplete = e => resolve(cats)
      })
    },
    async addCat () {
      this.addDisabled = true
      const cat = {
        name: 'Cat' + Math.floor(Math.random() * 100),
        age: Math.floor(Math.random() * 10) + 1
      }
      console.log('adding' + JSON.stringify(cat))
      await this.addCatToDB(cat)
      this.cats = await this.getCats()
      this.addDisabled = false
    },
    async addCatToDB (cat) {
      return new Promise((resolve, reject) => {
        let trans = this.db.transaction(['cats'], 'readwrite')
        trans.oncomplete = e => resolve()
        trans.objectStore('cats').add(cat)
      })
    },
    async killCat (id) {
      await this.deleteCatFromDB(id)
      this.cats = await this.getCats()
    },
    async deleteCatFromDB (id) {
      return new Promise((resolve, reject) => {
        let trans = this.db.transaction(['cats'], 'readwrite')
        trans.oncomplete = e => resolve()
        trans.objectStore('cats').delete(id)
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
ul li{
  display: block;
}
</style>
