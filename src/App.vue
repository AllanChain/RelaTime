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
      <v-btn @click.stop="dialog = true" icon text small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-dialog v-model="dialog" max-width="290">
        <!-- <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">-->
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Modify Event</v-toolbar-title>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon large target="_blank" v-on="on">
                  <v-icon>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  large
                  href="https://codepen.io/johnjleider/pen/pMvGQO"
                  target="_blank"
                  v-on="on"
                >
                  <v-icon>mdi-codepen</v-icon>
                </v-btn>
              </template>
              <span>Codepen</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field label="Login" name="login" prepend-icon="place" type="text" />

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="lock"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
        <!-- </v-col>
        </v-row>-->
      </v-dialog>
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
      dialog: false,
      bgImg: 'https://allanchain.github.io/webnav/back.jpg'
    }
  },
  methods: {}
}
</script>
