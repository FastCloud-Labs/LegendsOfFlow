<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 clas="ma-4">My Games</h2>
      <div v-if="loading">
        <v-progress-circular indeterminate color="success" class="ma-4 mb-4"></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="myEvents.length">
          <v-text-field v-if="!loading" placeholder="Search Teams" width="auto" v-model="search"
                        class="mt-4"></v-text-field>
          <v-card v-for="match in filteredFixtures" class="mb-4 border mx-auto playing">
            <div class="gametype ma-0 pa-0" :class="match.gameType||'Win/Loss'">
              Type: {{ match.gameType || 'Win/Loss' }}
            </div>
            <div class="playing-status ma-0 pa-0" :class="match.status||'Pending'">
              {{ match.status || 'Pending' }}
            </div>

            <v-card-text class="ma-0">
              <v-chip class="mb-5">{{
                  moment(match.eventDetails.fixture.date).format("ddd MMM DD, YYYY")
                }}
              </v-chip>

              <v-row>
                <v-col cols="5" class="mx-auto text-center">
                  <div class="mine fill-height pa-1 pt-3">
                    <h3>{{ match.ownerSelectedTeam }}</h3>
                    <v-img :src="match.ownerSelectedTeamLogo" width="50" height="50" class="mx-auto ma-2"/>
                  </div>
                </v-col>
                <v-col cols="2">
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
                  </div>
                </v-col>
                <v-col cols="5" class="mx-auto text-center" v-else>
                  <div class="border fill-height pa-3">
                    <p class="ma-2">Waiting for opponent to confirm team.</p>
                  </div>
                </v-col>
              </v-row>

            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          <p>No upcoming games...</p>
          <v-btn class="ma-2" color="green" @click="upcoming">Choose a match to play</v-btn>
          <br>
          <v-img class="mx-auto" max-width="400" width="auto" src="@/assets/intro.jpg"/>
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
    this.user = useUserStore().user
    this.getMyEvents()
  },
  methods: {
    async getMyEvents() {
      console.log('get my events', this.user.uid)
      if (!this.user.uid) {
        this.user = firebase.auth().currentUser
        console.log('get user from fb', this.user)
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
        db.collection('events')
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
        this.loading = false
      } else {
        console.log('no user')
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
</style>
