<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="ma-4">Dapper Account</h2>
      <div v-if="dapperAddress">
        <v-chip>{{ dapperAddress }}</v-chip>
        <br>
        <v-btn @click="moments" color="success" size="small" class="ma-4">View Moments</v-btn>
        <v-btn @click="upcoming" color="success" size="small" class="ma-4">Start a Game</v-btn>

        <v-btn @click="logoutDapper" color="primary" size="small" class="ma-4">Dis-connect Dapper Account</v-btn>
      </div>
      <div v-else>
        <v-btn @click="connectDapper" color="primary">Connect Dapper Account</v-btn>
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
import {useRoute} from "vue-router";

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
      console.log(useUserStore().user.uid)
      fcl.authenticate()
        .then(e => {
          this.dapperAddress = e.addr
          console.log(this.dapperAddress)
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
      console.log('connect dapper')
      console.log(useUserStore().user.uid)
      fcl.unauthenticate()

      this.dapperAddress = ''
      console.log(this.dapperAddress)
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

  }
}
</script>
