<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <v-btn @click="connectDapper" color="primary">Connect Dapper Account</v-btn>
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
      console.log('connect dapper')
      fcl.authenticate()
        .then(async e => {
          console.log(e)
          this.dapperAddress = e.addr
          console.log(this.dapperAddress)
          console.log('get token')
          const url = 'https://us-central1-pvplegends.cloudfunctions.net/getJWTToken'
          console.log(url)
          const data = {
            ts: Date.now(),
            cid: e.cid,
            uid: e.addr,
          }
          console.log(data)
          await axios.post(url, data).then((response) => {
            console.log(response);
            firebase.auth().signInWithCustomToken(this.dapperAddress)
              .then((userCredential) => {
                var user = userCredential.user;
                console.log(user)
                this.dapperLogin = true
              })
              .catch((error) => {
                console.log(error)
              });
          })
            .catch(function (error) {
              console.log(error);
            });

          /*
          const fields = {
            dapperAddress: e.addr,
            dapperAddressCreated: firebase.firestore.FieldValue.serverTimestamp()
          }

                    db.collection('profiles')
                      .doc(useUserStore().user.uid)
                      .set(fields, {merge: true})

           */
        })
    },

  }
}
</script>
