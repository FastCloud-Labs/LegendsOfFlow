<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height" :width="width">
      <h2 class="mb-2">Selected Game</h2>
      <v-progress-circular v-if="loading" indeterminate color="success"></v-progress-circular>
      <div class="game-wrapper">
        <v-card>
          <v-card-text v-if="match?.fixture">
            <v-chip class="ma-2">{{ moment(match.fixture.date).format("ddd MMM DD, YYYY [at] HH:mm a") }}</v-chip>
            <v-row class="ma-2">
              <v-col cols="5" class="mx-auto text-center border"
                     :class="{selectedBoarder: match.teams.home.name == teamPicked}"
                     @click="pickTeam(match.teams.home.name,match.teams.home.logo)">
                <h3>{{ match.teams.home.name }}</h3>
                <v-img :src="match.teams.home.logo" width="50" height="50" class="mx-auto ma-2"/>
              </v-col>
              <v-col cols="2">
                <p class="fill-height align-center text-center mx-auto mt-8">VS
                </p>
              </v-col>
              <v-col cols="5" class="mx-auto text-center border"
                     :class="{selectedBoarder: match.teams.away.name == teamPicked}"
                     @click="pickTeam(match.teams.away.name, match.teams.away.logo)">
                <h3>{{ match.teams.away.name }}</h3>
                <v-img :src="match.teams.away.logo" width="50" height="50" class="mx-auto ma-2"/>
              </v-col>
            </v-row>
            <p v-if="!teamPicked" class="text-green">Select team</p>
            <div v-else class="ma-4">
              <v-divider class="ma-4 mt-6"></v-divider>
              <h3 class="text-left mb-0 pb-0" @click="changeGameType">Game Type</h3>
              <v-progress-circular v-if="loadingInner" indeterminate color="success" size="small"></v-progress-circular>
              <div v-if="!game.gameType">

                <div
                  class="mx-auto mt-0 pa-2"
                  max-width="300"
                >
                  <p>Choose Game Type:</p>
                  <div
                    v-for="(item, i) in gameType"
                    :key="i"
                    color="primary"
                    rounded="xl"
                    class="mt-1"
                  >
                    <v-btn variant="outlined" elevation="2" sixe="small" class="ma-1 pa-2"
                           @click="setGameType(item.text )">{{ item.text }}
                    </v-btn>
                  </div>
                </div>
              </div>
              <div v-if="game.gameType" clas="mt-0 pt-0">
                <v-chip color="info" @click="changeGameType" class="mb-3 mt-0 pt-0">{{ game.gameType }}</v-chip>
                <div v-if="game.gameType == 'Win/Loss'">
                  <p class="ma-1">You've chosen {{ teamPicked }} to win.</p>
                </div>
                <div v-if="game.gameType == 'Team Points'">
                  <p class="ma-1">You've chosen {{ teamPicked }}.</p>
                  Your opponent can choose the same team, highest scoring lineup wins.
                  <v-divider class="ma-3"></v-divider>
                  <h4>Choose LineUp</h4>
                  <LineUpView/>
                </div>
              </div>
              <v-divider class="ma-3 mt-4"></v-divider>
              <h3 class="text-left">Stake</h3>
              <v-btn v-if="!momentLocked" color="success" @click="chooseMoment" class="ma-4">Choose Moment</v-btn>
            </div>
          </v-card-text>
        </v-card>
        <v-dialog v-model="momentPicker" width="auto">
          <v-card>
            <Moments :user="user"/>
          </v-card>
        </v-dialog>
      </div>
    </v-responsive>
  </v-container>
</template>

<script>
import moment from "moment";
import db from "@/firebase/init";
import {useUserStore} from '@/store/app.js'
import LineUpView from "@/components/LineUpView.vue";
import Moments from "@/components/Moments.vue";


export default {
  components: {
    Moments,
    LineUpView
  },
  props: {
    gameId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      match: {},
      loading: true,
      loadingInner: false,
      teamPicked: '',
      isOwner: false,
      momentLocked: false,
      gameType: [{text: 'Win/Loss'}, {text: 'Team Points'}],
      game: {},
      width: 700,
      momentPicker: false,
      user: {},
    }
  },
  computed: {
    moment() {
      return moment
    }
  },
  mounted() {
    this.width = window.innerWidth
    if (this.width > 700) {
      this.width = 700
    }
    this.getGame()
    this.user = useUserStore()
  },
  methods: {
    getGame() {
      db.collection('events')
        .doc(this.gameId)
        .get().then((doc) => {
        this.game = doc.data()
        this.match = this.game.eventDetails
        this.loading = false
        if (this.game.owner == useUserStore().user.uid) {
          this.isOwner = true
        }
        if (this.isOwner) {
          this.teamPicked = this.game.ownerSelectedTeam
        } else {
          this.teamPicked = this.game.opponentSelectedTeam
        }
      })
    },
    pickTeam(team, logo) {
      this.teamPicked = team
      let eventFields = {}
      if (this.isOwner) {
        eventFields = {
          ownerSelectedTeam: team,
          ownerSelectedTeamLogo: logo
        }
      } else {
        eventFields = {
          opponentSelectedTeam: team,
          ownerSelectedTeamLogo: logo
        }
      }
      db.collection('events')
        .doc(this.gameId)
        .set(eventFields, {merge: true})
    },
    async setGameType(gameType) {
      this.loadingInner = true
      await db.collection('events')
        .doc(this.gameId)
        .set({gameType: gameType}, {merge: true}).then(() => {
          this.game.gameType = gameType
        })
      this.loadingInner = false
    },
    changeGameType() {
      console.log("reset")
      this.game.gameType = ''
    },
    chooseMoment() {
      console.log('choose moment')
      this.momentPicker = true
    }
  }
}
</script>
<style>
.selectedBoarder {
  border: 2px solid #4caf50 !important;
  border-radius: 5px;
}

.game-wrapper {
  margin: auto;
  width: 92%;
}
</style>
