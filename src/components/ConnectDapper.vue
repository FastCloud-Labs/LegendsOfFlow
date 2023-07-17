<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <v-card>
        <v-card-text class="mx-auto text-center">
          <h2>Account:</h2>
          <v-avatar class="border ma-2" size="60">
            <img :src="profile?.avatar"/>
          </v-avatar>
          <br>
          <v-chip @click="showDapper()" class="text-truncate" size="small" color="success" variant="outlined">{{
              user.profile?.username
            }}
          </v-chip>
          <br>
          <v-chip v-if="user.profile?.dapperAddress" @click="showDapper()" class="text-truncate mt-2" size="small"
                  color="primary"
                  variant="outlined">
            {{ user.profile?.dapperAddress }}
          </v-chip>
          <br>
          <br>
          <v-btn @click="changeUsername" variant="outlined">Change Username</v-btn>
          <br>
          <v-btn @click="upcoming" color="success" class="ma-4">Start a Game</v-btn>
          <v-btn v-if="dapperAddress" @click="moments" color="success" class="ma-4">View Moments</v-btn>
          <br>
          <v-btn v-if="dapperAddress" @click="logoutDapper" color="primary" class="ma-1">Dis-connect Dapper Account
          </v-btn>
          <div v-if="!dapperAddress">
            <v-btn @click="connectDapper" color="primary" variant="outlined">Connect Dapper Account</v-btn>
          </div>
        </v-card-text>
      </v-card>

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
      'app.detail.title': 'Legends of Flow',
      'app.detail.icon': 'https://legendsofflow.web.app/assets/logo.png',
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
      profile: {}
    }
  },
  mounted() {
    this.dapperAddress = useUserStore()?.profile?.dapperAddress
    this.profile = useUserStore()?.profile
    if (!this.profile?.avatar) {
      let fields = {
        avatar: `https://source.boringavatars.com/pixel/60/${this.profile?.dapperAddress | this.profile?.username}.png`
      }
      db.collection('profiles')
        .doc(useUserStore().user.uid)
        .set(fields, {merge: true}).then(() => {
        this.profile.avatar = `https://source.boringavatars.com/pixel/60/${this.profile?.dapperAddress | this.profile?.username}.png`
      })
    }

  },
  methods: {
    connectDapper() {
      console.log('connectDapper')
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
