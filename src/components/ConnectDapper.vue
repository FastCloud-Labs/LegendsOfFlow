<template>
  <div class="mx-auto text-center">
    {{ user }}
    <h4 class="ma-2">Dapper Account</h4>
    <div v-if="dapperAddress">
      {{ dapperAddress }}
    </div>
    <div v-else>
      <v-btn @click="connectDapper" color="primary">Connect Dapper Account</v-btn>
    </div>
  </div>
</template>


<script>
import firebase from 'firebase/app'
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
  methods: {
    connectDapper() {
      console.log('connect dapper')
      console.log(useUserStore().user.uid)
      fcl.authenticate()
        .then(e => {
          this.dapperAddress = e.addr
          console.log(this.dapperAddress)
          const fields = {dapperAddress: e.addr}
          fields.dapperAddressCreated = firebase.firestore.FieldValue.serverTimestamp()
          db.collection('profiles')
            .doc(useUserStore().user.uid)
            .set(fields, {merge: true})
        })
    }
  }
}
</script>
