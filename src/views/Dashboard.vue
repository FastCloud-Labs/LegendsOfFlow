<template>
  <v-layout class="rounded rounded-md fill-height">
    <v-app-bar>
      <v-img @click="showMyEvents" max-width="200" class="ml-4 hidden-sm-and-down" src="@/assets/logo-horizontal.png"/>
      <v-img max-width="200" class="ml-4 hidden-md-and-up" src="@/assets/favicon.ico"
             @click="showMyEvents"/>
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
    <div class="deskop-menu hidden-sm-and-down fill-height" width="200" height="100%">
      <v-list>
        <v-list-item @click="showMyEvents">
          <v-icon icon="fas fa-calendar-check" class="mr-1 pa-2 ma-2" size="x-small"/>
          My Games
        </v-list-item>
        <v-list-item @click="showUpcomingEvents">
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
    </div>

    <v-navigation-drawer v-model="drawer" location="bottom" temporary class="mobile-menu hidden-md-and-up">
      <v-list>
        <v-list-item @click="showMyEvents">
          <v-icon icon="fas fa-calendar-check" class="mr-1 pa-2 ma-2" size="x-small"/>
          My Games
        </v-list-item>
        <v-list-item @click="showUpcomingEvents">
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

    <v-main class="d-flex justify-center" :width="width">
      <div v-if="showDapperConnect">
        <Dapper :user="user"/>
      </div>
      <div v-if="showMyEventComponent">
        <MyEvents :user="user" @showUpcomingGames="showUpcomingEvents" @showGameView="showGame"/>
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
    <div class="mobile-menu-btn hidden-md-and-up">
      <v-btn @click.stop="drawer = !drawer" block>
        <v-icon icon="fas fa-bars" class="mr-1 pa-2 ma-2" size="x-small"/>
        Menu
      </v-btn>
    </div>
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
      drawer: false,
      showMyEventComponent: true,
      showDapperConnect: false,
      showUpcomingEventComponent: false,
      showMomentsComponent: false,
      showLeaderboardComponent: false,
      showFriendsFoesComponent: false,
      showGameViewComponent: false,
      user: {},
      gameId: null,
      width: 600,
    }
  },
  mounted() {
    this.user = useUserStore()
    this.width = window.innerWidth
    if (this.width > 800) {
      this.width = 600
    }
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
      this.drawer = false
      this.showMyEventComponent = false
      this.showDapperConnect = false
      this.showMomentsComponent = false
      this.showUpcomingEventComponent = false
      this.showLeaderboardComponent = false
      this.showFriendsFoesComponent = false
      this.showGameViewComponent = false
    },
    showMyEvents() {
      this.closeAll()
      this.showMyEventComponent = true
    },
    showUpcomingEvents() {
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

<style>
.mobile-menu-btn {
  z-index: 99;
  position: fixed;
  bottom: 0;
  width: 100%;
  float: revert;
  border: 2px solid green;
  text-align: center;
  background: green;
}

.mobile-menu {
  position: fixed !important;
}

.deskop-menu {
  background: #212121;
  margin-top: 63px;
  width: 230px;
}
</style>
