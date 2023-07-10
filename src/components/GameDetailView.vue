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
            <p v-if="!teamPicked" class="text-green">Select a team</p>
            <div v-else class="ma-4">
              <v-expansion-panels :disabled="!teamPicked" v-model="pickedPanel" :multiple="true">
                <v-expansion-panel>
                  <v-expansion-panel-title><h3>Game Type</h3></v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-progress-circular v-if="loadingInner" indeterminate color="success"
                                         size="small"></v-progress-circular>

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
                        Opponents can choose the same team, highest scoring lineup wins.
                        <v-divider class="ma-3"></v-divider>
                        <h4>Choose LineUp</h4>
                        <LineUpView/>
                      </div>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title><h3>Game Mode</h3></v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <p class="mt-2">Choose PvP mode, Community or both.</p>
                    <v-row class="mode-check-box">
                      <v-col cols="6">
                        <v-checkbox label="PvP" v-model="pvpMode" class="mx-auto" color="success"
                                    size="large" @click="setGameMode('pvpMode')"></v-checkbox>
                        <p class="text-sm-caption ma-0 pa-0">Compete a against a friend or foe.</p>
                      </v-col>
                      <v-col cols="6">
                        <v-checkbox label="Community" v-model="communityMode" color="success" size="large"
                                    @click="setGameMode('communityMode')"></v-checkbox>
                        <p class="text-sm-caption ma-0 pa-0">Compete against all players in the community.</p>
                      </v-col>
                    </v-row>
                    <div v-if="pvpMode">
                      <h3 class="ma-2">Choose Opponent:</h3>
                      <v-autocomplete
                        label="Opponent"
                        :items="opponentList"
                        item-title="username"
                        item-value="uid"
                      >
                        <template v-slot:chip="{ props, item }">
                          <v-chip
                            v-bind="props"
                            :prepend-avatar="item.dapperAddress"
                            :text="item.raw.name"
                          ></v-chip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title><h3>Stake</h3></v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div v-if="pvpMode || communityMode">
                      <v-row>
                        <v-col v-if="pvpMode">
                          <h4>PVP Stake</h4>
                          <v-btn v-if="!momentLocked" variant="outlined" elevation="2" sixe="small"
                                 @click="chooseMoment('pvpStake')" class="ma-4">Choose
                            Moment
                          </v-btn>
                        </v-col>
                        <v-col v-if="communityMode">
                          <h4>Community Stake</h4>
                          <v-btn v-if="!momentLocked" variant="outlined" elevation="2" sixe="small"
                                 @click="chooseMoment('pvpCommunity')" class="ma-4">Choose
                            Moment
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
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
      pvpMode: false,
      communityMode: false,
      pickedPanel: null,
      opponentList: []
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
        if (this.game.modeCommunity) {
          this.communityMode = true
        }
        if (this.game.modePvp) {
          this.pvpMode = true
          this.getOpponentList()
        }
        this.checkPanels()
      })
    },
    checkPanels() {
      if (this.teamPicked) {
        this.pickedPanel = [0]
      }
      if (this.game?.gameType) {
        this.pickedPanel = [0, 1]
      }
      if (this.pvpMode || this.communityMode) {
        this.pickedPanel = [0, 1, 2]
      }

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
      this.checkPanels()
    },
    async setGameType(gameType) {
      this.loadingInner = true
      await db.collection('events')
        .doc(this.gameId)
        .set({gameType: gameType}, {merge: true}).then(() => {
          this.game.gameType = gameType
        })
      this.loadingInner = false
      this.checkPanels()
    },
    async setGameMode(gameMode) {
      this.loadingInner = true
      if (gameMode == 'communityMode') {
        await db.collection('events')
          .doc(this.gameId)
          .set({modeCommunity: !this.communityMode}, {merge: true}).then(() => {
          })
      }
      if (gameMode == 'pvpMode') {

        await db.collection('events')
          .doc(this.gameId)
          .set({modePvp: !this.pvpMode}, {merge: true}).then(() => {
          })
        this.getOpponentList()
      }
      this.loadingInner = false
      this.checkPanels()
    },
    async getOpponentList() {
      const profiles = await db.collection('profiles').get()
      profiles.docs.forEach((doc) => {
        let opponent = doc.data()
        opponent.uid = doc.id
        if (opponent.dapperAddress) {
          opponent.username = `${opponent.username} - ${opponent.dapperAddress}`
        }
        if (opponent.username && opponent.uid != this.user.user.uid) {
          this.opponentList.push(opponent)
        }
      })
    },
    changeGameType() {
      console.log("reset")
      this.game.gameType = ''
      this.checkPanels()
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

.mode-check-box .v-input__control {
  margin: auto !important;
  text-align: center !important;
}


.mode-check-box .v-input {
  margin-bottom: -30px !important;
}
</style>
