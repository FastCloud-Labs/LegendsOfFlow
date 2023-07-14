<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <v-btn @click="connectDapper" color="primary" size="large">Login using Dapper</v-btn>
      <v-dialog v-model="dapperLogin">
      </v-dialog>
    </v-responsive>
  </v-container>
</template>


<script>
import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import * as fcl from '@onflow/fcl'
import {useUserStore} from '@/store/app.js'
import axios from "axios";
import db from "@/firebase/init";


export default {
  setup() {
    fcl.config({
      'discovery.wallet': 'https://accounts.meetdapper.com/fcl/authn-restricted',
      'discovery.wallet.method': 'POP/RPC',
      'accessNode.api': 'https://access-mainnet-beta.onflow.org',
      'app.detail.title': 'Legends of Flow',
      'app.detail.icon': 'https://legendsofflow.web.app/assets/logo.png',
    })
  },
  data() {
    return {
      dapperLogin: false,
      dapperAddress: '',

    }
  },
  mounted() {
    this.dapperAddress = useUserStore()?.profile?.dapperAddress
  },
  methods: {
    connectDapper() {
      fcl.authenticate()
        .then(async e => {
          this.dapperAddress = e.addr
          const url = 'https://us-central1-pvplegends.cloudfunctions.net/getJWTToken'
          const data = {
            ts: Date.now(),
            cid: e.cid,
            uid: e.addr,
          }
          await axios.post(url, data).then(async (response) => {
            await firebase.auth().signInWithCustomToken(response.data.token)
              .then(userCredential => {
                var user = userCredential.user;
                const fields = {
                  dapperAddress: this.dapperAddress,
                  dapperAddressCreated: firebase.firestore.FieldValue.serverTimestamp()
                }
                db.collection('profiles')
                  .doc(this.dapperAddress)
                  .set(fields, {merge: true})

                this.dapperLogin = true
              })
              .catch((error) => {
                console.log(error)
              });
          })
            .catch(function (error) {
              console.log(error);
            });
        })
    },

  }
}
</script>
