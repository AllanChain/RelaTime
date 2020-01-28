<template>
  <v-app>
    <Drawer v-model="drawer" />
    <v-app-bar app color="primary" dark dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="pa-0">RelaTime</v-toolbar-title>
      <v-spacer></v-spacer>
      <ICALProcessor @update="updateCal" />
      <v-btn @click.stop="dialog = true" icon text small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <Calendar ref="calendar"/>
    </v-content>
  </v-app>
</template>

<script>
import ICALProcessor from './components/ICALProcessor'
import Calendar from './components/Calendar'
import Drawer from './components/Drawer'

export default {
  name: 'App',

  components: {
    ICALProcessor,
    Calendar,
    Drawer
  },
  data() {
    return {
      drawer: false,
      dialog: false,
      bgImg: 'https://allanchain.github.io/webnav/back.jpg'
    }
  },
  methods: {
    updateCal() {
      this.$refs.calendar.update()
    }
  }
}
</script>
