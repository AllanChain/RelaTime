<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="pa-0">RelaTime</v-toolbar-title>

      <v-spacer></v-spacer>
      <ICALProcessor />
    </v-app-bar>

    <v-content>
      <Calendar />
    </v-content>
  </v-app>
</template>

<script>
import ICALProcessor from './components/ICALProcessor'
import Calendar from './components/Calendar'

export default {
  name: 'App',

  components: {
    ICALProcessor,
    Calendar
  },
  data() {
    return {
      drawer: false,
      bgImg: 'https://allanchain.github.io/webnav/back.jpg'
    }
  },
  methods: {}
}
</script>
