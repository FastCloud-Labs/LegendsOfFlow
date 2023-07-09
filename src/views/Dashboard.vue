<template>
  <v-layout class="rounded rounded-md fill-height">
    <v-app-bar>
      <v-img max-width="200" class="ml-4 hidden-sm-and-down" src="@/assets/logo-horizontal.png"
             @click.stop="drawer = !drawer"/>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer/>
      <v-chip color="success" class="mr-1">
        <v-icon icon="fas fa-shield-halved" class="mr-1"/>
        XP Points: {{ user.profile?.xpPoints || 0 }}
      </v-chip>
      <v-chip color="warning" class="mr-1">
        <v-icon icon="fas fa-coins" class="mr-1"/>
        LF Tokens: {{ user.profile?.tokens || 0 }}
      </v-chip>
      <v-menu>
        <template v-slot:activator=" { props }
      ">
          <v-btn
            v-bind="props"
          >
            <v-icon icon="fas fa-cog"/>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="!user.profile?.dapperAddress">
            <v-list-item-title @click="showDapper()">Connect Dapper Wallet</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.profile?.dapperAddress" @click="showMoments()">
            <v-list-item-title>Dapper Account: <br>{{ user.profile?.dapperAddress }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.profile?.dapperAddress" @click="showMoments()">
            <v-list-item-title>View My Moments</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item @click="myEvents">
          <v-icon icon="fas fa-calendar-check" class="mr-1 pa-2 ma-2" size="x-small"/>
          My Events
        </v-list-item>
        <v-list-item @click="upcomingEvents">
          <v-icon icon="fas fa-calendar-days" class="mr-1 pa-2 ma-2" size="x-small"/>
          Upcoming Events
        </v-list-item>
        <v-list-item @click="showMoments">
          <v-icon icon="fas fa-address-card" class="mr-1 pa-2 ma-2" size="x-small"/>
          Moments
        </v-list-item>
        <v-list-item @click="showLeaderboard">
          <v-icon icon="fas fa-list-ul" class="mr-1 pa-2 ma-2" size="x-small"/>
          Leaderboards
        </v-list-item>
        <v-list-item @click="showFriendsFoes">
          <v-icon icon="fas fa-users" class="mr-1 pa-2 ma-2" size="x-small"/>
          Friends & Foes
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex justify-center">
      <div v-if="showDapperConnect">
        <Dapper :user="user"/>
      </div>
      <div v-if="showMyEventComponent">
        <MyEvents :user="user"/>
      </div>
      <div v-if="showUpcomingEventComponent">
        <UpcomingEvents :user="user" @showGameView="showGame"/>
      </div>
      <div v-if="showMomentsComponent">
        <Moments :user="user"/>
      </div>
      <div v-if="showLeaderboardComponent">
        <Leaderboards :user="user"/>
      </div>
      <div v-if="showFriendsFoesComponent">
        <FriendsFoes :user="user"/>
      </div>

      <div v-if="showGameViewComponent">
        <GameDetailView :user="user" :gameId="gameId"/>
      </div>

      <br>
    </v-main>
  </v-layout>
</template>


<script>
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import MyEvents from '@/components/MyEvents.vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import Moments from '@/components/Moments.vue'
import Leaderboards from "@/components/Leaderboards.vue"
import FriendsFoes from "@/components/FriendsFoes.vue"

import Dapper from '@/components/ConnectDapper.vue'
import {useUserStore} from '@/store/app.js'
import GameDetailView from "@/components/GameDetailView.vue";

export default {
  setup() {
    const auth = firebase.auth()
  },
  components: {
    GameDetailView,
    MyEvents,
    UpcomingEvents,
    Moments,
    Leaderboards,
    FriendsFoes,
    Dapper,
  },
  data() {
    return {
      drawer: true,
      showMyEventComponent: true,
      showDapperConnect: false,
      showUpcomingEventComponent: false,
      showMomentsComponent: false,
      showLeaderboardComponent: false,
      showFriendsFoesComponent: false,
      showGameViewComponent: false,
      user: {},
      gameId: null,
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

    closeAll() {
      this.showMyEventComponent = false
      this.showDapperConnect = false
      this.showMomentsComponent = false
      this.showUpcomingEventComponent = false
      this.showLeaderboardComponent = false
      this.showFriendsFoesComponent = false
      this.showGameViewComponent = false
    },
    myEvents() {
      this.closeAll()
      this.showMyEventComponent = true
    },
    upcomingEvents() {
      this.closeAll()
      this.showUpcomingEventComponent = true
    },
    showMoments() {
      this.closeAll()
      this.showMomentsComponent = true
    },
    showLeaderboard() {
      this.closeAll()
      this.showLeaderboardComponent = true
    },
    showFriendsFoes() {
      this.closeAll()
      this.showFriendsFoesComponent = true
    },
    showDapper() {
      this.closeAll()
      this.showDapperConnect = true
    },
    showGame(gameId) {
      console.log('show game', gameId)
      this.gameId = gameId
      this.closeAll()
      this.showGameViewComponent = true
    }

  }
}
</script>
