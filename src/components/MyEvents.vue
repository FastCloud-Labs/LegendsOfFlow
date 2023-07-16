<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height" :width="width">
      <h2 clas="ma-4">My Games</h2>
      <div class="home-wrapper">
        <div v-if="loading">
          <v-progress-circular indeterminate color="success" class="ma-4 mb-4"></v-progress-circular>
        </div>

        <div v-else>
          <div v-if="myEvents.length">
            <v-text-field v-if="!loading" placeholder="Search Games" width="auto" v-model="search" variant="underlined"
                          class="mt-4"></v-text-field>
            <v-card v-for="match in filteredFixtures" class="mb-4 border mx-auto playing">

              <div class="gametype ma-0 pa-0" :class="match.gameType||'Win/Loss'">
                Type: {{ match.gameType || 'Win/Loss' }}
              </div>
              <div class="playing-status ma-0 pa-0" :class="match.status||'Pending'">
                {{ match.status || 'Pending' }}
              </div>

              <v-card-text class="mt-md-0 pt-md-0 mt-sm-2">
                <v-chip class="mb-4 mt-md-0 mt-lg-0 mt-sm-2">{{
                    moment(match.eventDetails.fixture.date).format("ddd MMM DD, YYYY")
                  }}
                </v-chip>
                <div v-if="match.owner == user.uid">
                  <v-row>
                    <v-col cols="5" class="mx-auto text-center">
                      <div class="mine fill-height pa-1 pt-3">
                        <h3>{{ match.ownerSelectedTeam }}</h3>
                        <v-img :src="match.ownerSelectedTeamLogo" width="50" height="50" class="mx-auto ma-2"/>
                        <div class="stakeinfo">
                          <v-chip size="small" class="ma-1">{{ match.ownerStake || '2 XP points' }}</v-chip>
                          <v-chip size="small" class="ma-1"> {{ match.gameType }}</v-chip>
                        </div>
                        <div v-if="match.gameType == 'Team Points'">
                          <v-chip color="error" class="ma-2" size="small">{{ match.ownerlineupCount || 0 }}/11
                            Players
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="2" class="ma-0 pa-0 mt-7">
                      <div v-if="!loading">
                        <v-chip size="small" class="mb-1 mt-0">{{ match.eventDetails.fixture.status.short }}</v-chip>
                        <p class="fill-height align-center text-center mx-auto">VS</p>
                        <div>
                          <v-btn color="success" @click="viewEvent(match.gameId)" class="mx-auto mt-2" size="small">View
                          </v-btn>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="5" class="mx-auto text-center" v-if="match.opponentSelectedTeam">
                      <div class="opponent fill-height pa-3">
                        <h3>{{ match.opponentSelectedTeam }}</h3>
                        <v-img :src="match.opponentSelectedTeamLogo" width="50" height="50" class="mx-auto ma-2"/>
                        <div class="mx-auto text-center mt-0 pt-0">
                          <div class="stakeinfo">
                            <v-chip size="small" class="ma-1">{{ match.opponentStake || '2 XP points' }}</v-chip>
                            <v-chip size="small" class="ma-1"> {{ match.gameType }}</v-chip>
                          </div>
                          <h4>Opponent:</h4>
                          <v-chip class="text-truncate mt-2 pl-0 ml-0" size="small" color="warning"
                                  variant="outlined">
                            <v-avatar size="20" class="ml-0 pl-0 mr-1">
                              <img
                                :src="`https://source.boringavatars.com/pixel/20/${match.opponentDetails?.dapperAddress | match.opponentDetails?.username}.png`"/>
                            </v-avatar>
                            {{
                              match.opponentDetails?.username
                            }}
                          </v-chip>
                        </div>
                        <div v-if="match.gameType == 'Team Points'">
                          <v-chip color="error" class="ma-2" size="small">{{ match.opponentLineupCount || 0 }}/11
                            Players
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="5" class="mx-auto text-center" v-else>
                      <div class="border fill-height pa-3">
                        <div v-if="match?.opponentDetails?.username">

                          <div class="mx-auto text-center mt-0 pt-0">
                            <h4>Opponent:</h4>
                            <v-chip class="text-truncate mt-2 pl-0 ml-0" size="small" color="warning"
                                    variant="outlined">
                              <v-avatar size="20" class="ml-0 pl-0 mr-1">
                                <img
                                  :src="`https://source.boringavatars.com/pixel/20/${match.opponentDetails?.dapperAddress | match.opponentDetails?.username}.png`"/>
                              </v-avatar>
                              {{
                                match.opponentDetails?.username
                              }}
                            </v-chip>
                          </div>
                          <p class="ma-b mt-2 stakeinfo">Waiting for opponent to confirm team.</p>
                        </div>
                        <div v-else-if="!match?.opponentDetails" class="mt-6">
                          <v-btn @click="viewEvent(match.gameId)" size="small" variant="outlined">Invite Opponent
                          </v-btn>
                        </div>


                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="match.opponent == user.uid">
                  <v-row>
                    <v-col cols="5" class="mx-auto text-center" v-if="match.opponentSelectedTeam">
                      <div class="mine fill-height pa-3">
                        <h3>{{ match.opponentSelectedTeam }}</h3>
                        <v-img :src="match.opponentSelectedTeamLogo" width="50" height="50" class="mx-auto ma-2"/>
                        <div class="stakeinfo">
                          <v-chip size="small" class="ma-1">{{ match.opponentStake || '2 XP points' }}</v-chip>
                          <v-chip size="small" class="ma-1"> {{ match.gameType }}</v-chip>
                        </div>
                        <div v-if="match.gameType == 'Team Points'">
                          <v-chip color="error" class="ma-2" size="small">{{ match.opponentLineupCount || 0 }}/11
                            Players
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="5" class="mx-auto text-center" v-else>
                      <div class="border fill-height pa-3">
                        <div v-if="match?.opponentDetails?.username">
                          <v-card-text class="mx-auto text-center mt-0 pt-0">
                          </v-card-text>
                          <p class="ma-b">
                            <v-btn variant="outlined" @click="viewEvent(match.gameId)" class="mx-auto"
                                   size="small">
                              Choose Team
                            </v-btn>
                          </p>
                        </div>
                        <div v-else-if="!match?.opponentDetails" class="mt-6">
                          <v-btn @click="viewEvent(match.gameId)" size="small" variant="outlined">Invite Opponent
                          </v-btn>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="2" class="ma-0 pa-0 mt-7">
                      <div v-if="!loading">
                        <v-chip size="small" class="mb-1 mt-0">{{ match.eventDetails.fixture.status.short }}</v-chip>
                        <p class="fill-height align-center text-center mx-auto">VS</p>
                        <div>
                          <v-btn color="success" @click="viewEvent(match.gameId)" class="mx-auto mt-2" size="small">View
                          </v-btn>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="5" class="mx-auto text-center">

                      <div class="opponent fill-height pa-1 pt-3 mb-3">
                        <h3>{{ match.ownerSelectedTeam }}</h3>
                        <v-img :src="match.ownerSelectedTeamLogo" width="50" height="50" class="mx-auto ma-2"/>
                        <div class="stakeinfo">
                          <v-chip size="small" class="ma-1">{{ match.ownerStake || '2 XP points' }}</v-chip>
                          <v-chip size="small" class="ma-1"> {{ match.gameType }}</v-chip>
                        </div>
                        <div v-if="match.gameType == 'Team Points'">
                          <v-chip color="error" class="ma-2" size="small">{{ match.ownerLineupCount || 0 }}/11
                            Players
                          </v-chip>
                        </div>
                        <div class="mx-auto text-center mt-0 pt-0">
                          <h4>Opponent:</h4>
                          <v-chip class="text-truncate mt-2 pl-0 ml-0" size="small" color="warning"
                                  variant="outlined">
                            <v-avatar size="20" class="ml-0 pl-0 mr-1">
                              <img
                                :src="`https://source.boringavatars.com/pixel/20/${match.ownerDetails?.dapperAddress | match.ownerDetails?.username}.png`"/>
                            </v-avatar>
                            {{
                              match.ownerDetails?.username
                            }}
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

              </v-card-text>
            </v-card>
          </div>
          <div v-else>
            <p>No upcoming games...</p>
            <v-btn class="ma-2 mt-4" color="green" @click="upcoming">Choose a match to play</v-btn>
            <br>
            <v-img class="mx-auto" max-width="400" width="auto" src="@/assets/intro.jpg"/>
          </div>
        </div>
      </div>
    </v-responsive>
  </v-container>
</template>

<script>
import db from "@/firebase/init";
import {useUserStore} from "@/store/app";
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import moment from "moment/moment";

export default {
  data() {
    return {
      myEvents: [],
      user: {},
      search: '',
      loading: true,
      width: 800,
      username: '',
      email: '',
      newEmail: '',
    }
  },
  computed: {
    moment() {
      return moment
    },
    filteredFixtures() {
      return this.myEvents.filter(event => {
        return event.eventDetails.teams.home.name.toLowerCase().includes(this.search.toLowerCase()) ||
          event.eventDetails.teams.away.name.toLowerCase().includes(this.search.toLowerCase()) ||
          event.status.includes(this.search.toLowerCase()) ||
          event.gameType.includes(this.search.toLowerCase())
      })
    }
  },
  mounted() {
    this.width = window.innerWidth
    if (this.width > 800) {
      this.width = 800
    }
    this.getMyEvents()
    this.user = useUserStore().user
  },
  methods: {
    async getMyEvents() {
      if (!this.user.uid) {
        this.user = firebase.auth().currentUser
      }
      if (this.user?.uid) {
        await db.collection('events')
          .where('owner', '==', this.user.uid)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size) {
              querySnapshot.forEach(doc => {
                let gameData = doc.data()
                gameData.gameId = doc.id
                this.myEvents.push(gameData)
              })
            }
            this.loading = false
          }).catch(error => {
            console.log('Error getting fame: ', error)
          })
        await db.collection('events')
          .where('opponent', '==', this.user.uid)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size) {
              querySnapshot.forEach(doc => {
                let gameData = doc.data()
                gameData.gameId = doc.id
                this.myEvents.push(gameData)
              })
            }
            this.loading = false
          }).catch(error => {
            console.log('Error getting fame: ', error)
          })
        this.myEvents.forEach((game, index) => {
          if (game.opponent) {
            db.collection('profiles')
              .doc(game.opponent)
              .get().then(doc => {
              let opponent = doc.data()
              this.myEvents[index].opponentDetails = opponent
            })
          }
          db.collection('profiles')
            .doc(game.owner)
            .get().then(doc => {
            let owner = doc.data()
            this.myEvents[index].ownerDetails = owner
          })

        })
        this.loading = false

      } else {
        this.$router.push('/')
      }
    },
    viewEvent(docId) {
      this.$emit('showGameView', docId)
    },
    upcoming() {
      this.$emit('showUpcomingGames')
    }
  }
}
</script>

<style scoped>
.home-wrapper {
  margin: auto;
  width: 92%;
}

.playing {
  background-color: rgba(187, 243, 187, 0.05);
  border: 1px solid #4caf50 !important;
}

.playing-status {
  font-size: 12px;
  background: #4caf50;
  width: 130px;
  height: 21px;
  border-radius: 0 0 6px;
}

.playing-status.Pending {
  background: rgba(114, 118, 118, 0.31);
}

.mine {
  border: 2px solid #4caf50;
  border-radius: 5px;
}

.opponent {
  border: 2px solid rgba(255, 165, 0, 0.63);
  border-radius: 5px;
}


.gametype {
  font-size: 12px;
  background: #4caf50;
  width: 130px;
  height: 21px;
  border-radius: 0 0 0 6px;
  float: right;
}

.stakeinfo {
  font-size: 12px;
  color: #ddd;
  padding: 3px;
}
</style>
