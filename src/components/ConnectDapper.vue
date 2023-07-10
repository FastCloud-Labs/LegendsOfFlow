<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="ma-4">Account</h2>
      <div v-if="dapperAddress" class="ma-4">
        <v-chip color="primary" variant="outlined">Dapper Address: {{ dapperAddress }}</v-chip>
        <br>
      </div>
      <div class="ma-4">
        <v-chip color="success" variant="outlined">Username: {{ user.profile.username }}</v-chip>
        <br>
      </div>
      <v-btn @click="changeUsername" variant="outlined">Change Username</v-btn>
      <br>
      <v-btn @click="upcoming" color="success" class="ma-4">Start a Game</v-btn>
      <v-btn v-if="dapperAddress" @click="moments" color="success" class="ma-4">View Moments</v-btn>
      <br>
      <v-btn v-if="dapperAddress" @click="logoutDapper" color="primary" class="ma-1">Dis-connect Dapper Account</v-btn>
      <div v-if="!dapperAddress">
        <v-btn @click="connectDapper" color="primary" variant="outlined">Connect Dapper Account</v-btn>
      </div>
    </v-responsive>
  </v-container>
</template>


<script>
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import * as fcl from '@onflow/fcl'
import {useUserStore} from '@/store/app.js'
import db from '@/firebase/init.js'

export default {
  setup() {
    fcl.config({
      'discovery.wallet': 'https://accounts.meetdapper.com/fcl/authn-restricted',
      'discovery.wallet.method': 'POP/RPC',
      'accessNode.api': 'https://access-mainnet-beta.onflow.org',
      'app.detail.title': '{{PVP Legends}}',
      'app.detail.icon': 'https://pvplegends.web.app/assets/logo.png',
    })
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogLogin: false,
      dapperAddress: '',
    }
  },
  mounted() {
    this.dapperAddress = useUserStore()?.profile?.dapperAddress
  },
  methods: {
    connectDapper() {
      console.log('connect dapper')
      fcl.authenticate()
        .then(e => {
          this.dapperAddress = e.addr
          const fields = {
            dapperAddress: e.addr,
            dapperAddressCreated: firebase.firestore.FieldValue.serverTimestamp()
          }

          db.collection('profiles')
            .doc(useUserStore().user.uid)
            .set(fields, {merge: true})
        })
    },
    logoutDapper() {
      console.log('logout dapper')
      fcl.unauthenticate()

      this.dapperAddress = ''
      const fields = {
        dapperAddress: this.dapperAddress,
      }

      db.collection('profiles')
        .doc(useUserStore().user.uid)
        .set(fields, {merge: true})
    },
    upcoming() {
      this.$emit('showUpcomingGames')
    },
    moments() {
      this.$emit('showMoments')
    },
    changeUsername() {
      this.$emit('changeUsername')
    }
  }
}
</script>
