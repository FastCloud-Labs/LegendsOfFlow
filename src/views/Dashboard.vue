<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <v-img max-width="200" class="ml-4" src="@/assets/logo-horizontal.png"/>
      <v-spacer/>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
          >
            <v-icon icon="fas fa-cog"/>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="!user.profile?.dapperAddress">
            <v-list-item-title @click="showDapperConnect=true">Connect Dapper Wallet</v-list-item-title>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-title>Dapper Account: <br>{{ user.profile?.dapperAddress }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <div v-if="showDapperConnect">
        <Dapper :user="user"/>
      </div>
      <div v-else>
        Main Content
      </div>
      <br>
    </v-main>
  </v-layout>
</template>


<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import Dapper from '@/components/ConnectDapper.vue'
import {useUserStore} from '@/store/app.js'

export default {
  setup() {
    const auth = firebase.auth()
  },
  components: {
    Dapper
  },
  data() {
    return {
      dialogLogin: false,
      showDapperConnect: false,
      user: {},
      email: '',
      password: ''
    }
  },
  mounted() {
    this.user = useUserStore()
  },
  methods: {
    logout() {
      firebase.auth().signOut()
        .then(() => {
          this.user = ''
          console.log('logged out')
          useUserStore().$reset()
          this.$router.push('/')
        })
        .catch((error) => {
          console.log(error)
        });
    },

    connectDapper() {
      console.log('connect dapper')
    }
  }
}
</script>
