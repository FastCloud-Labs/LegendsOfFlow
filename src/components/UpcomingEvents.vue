<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <div v-if="showDetailView">
        <GameDetailView :event="selectedEvent" :eventId="selectedEventId"
                        @close="showDetailView = false"></GameDetailView>
      </div>
      <div v-else>
        <h2>Upcoming Events</h2>
        <SelectionSlider :blocked="false" @showSport="whichSport"></SelectionSlider>
        <v-progress-circular v-if="loading" indeterminate
                             color="success" class="ma-1 mb-4"></v-progress-circular>
        <h4 v-if="!sport ">Choose a sport</h4>

        <v-text-field v-if="sport && !loading" placeholder="Search Teams" width="auto" v-model="search"></v-text-field>
        <v-card v-for="match in filteredFixtures" class="mb-4 border mx-auto" width="100%"
                :class="{playing:match.playing}">
          <div v-if="match.playing" class="playing-status">
            Playing
          </div>
          <v-card-text>
            <v-chip class="ma-2">{{ moment(match.fixture.date).format("ddd MMM DD, YYYY [at] HH:mm a") }}</v-chip>
            <v-row class="ma-2">
              <v-col cols="5" class="mx-auto text-center">
                <h3>{{ match.teams.home.name }}</h3>
                <v-img :src="match.teams.home.logo" width="50" height="50" class="mx-auto ma-2"/>
              </v-col>
              <v-col cols="2">
                <div v-if="!loading">
                  <v-chip size="small" class="mb-1 mt-0">{{ match.fixture.status.short }}</v-chip>
                  <p class="fill-height align-center text-center mx-auto">VS</p>
                  <br>
                  <div v-if="match.playing">
                    <v-btn color="success" @click="viewEvent(match.eventId)" class="mx-auto mt-2">View</v-btn>
                  </div>
                  <div v-else>
                    <v-btn color="success" @click="addEvent(match)" class="mx-auto mt-2">Play</v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="5" class="mx-auto text-center">
                <h3>{{ match.teams.away.name }}</h3>
                <v-img :src="match.teams.away.logo" width="50" height="50" class="mx-auto ma-2"/>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-responsive>
  </v-container>
</template>

<script>
import axios from 'axios'
import {useUserStore} from "@/store/app";
import moment from "moment";
import SelectionSlider from "@/components/SelectionSlider";
import GameDetailView from "@/components/GameDetailView.vue";
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import db from '@/firebase/init.js'

export default {
  components: {
    SelectionSlider,
    GameDetailView,
  },
  computed: {
    moment() {
      return moment
    },
    filteredFixtures() {
      return this.laLigaFixtures.filter((match) => {
        return match.teams.home.name.toLowerCase().includes(this.search.toLowerCase()) ||
          match.teams.away.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },

  data() {
    return {
      user: {},
      sport: '',
      laLigaFixtures: [],
      loading: false,
      search: '',
      showDetailView: false,
      selectedEvent: '',
      selectedEventId: '',
    }
  },

  mounted() {
    this.user = useUserStore().user
    if (useUserStore().profile?.lastSport) {
      this.whichSport(useUserStore().profile.lastSport)
    }
  },

  methods: {
    whichSport(sport) {
      this.sport = sport
      if (sport === 'LaLiga') {
        this.getLaLigaFixtures()
      } else if (sport === 'UFC') {
        this.getUFCFixtures()
      } else if (sport === 'NBA') {
        this.getNBAFixtures()
      } else if (sport === 'NFL') {
        this.getNFLFixtures()
      }
    },
    async getLaLigaFixtures() {
      this.loading = true
      db.collection('fixtures')
        .doc('LaLiga')
        .get()
        .then(fixtures => {
          this.laLigaFixtures = fixtures.data().response
          db.collection('events')
            .where('owner', '==', useUserStore().user.uid)
            .get()
            .then(querySnapshot => {
              if (querySnapshot.size) {
                querySnapshot.forEach(doc => {
                  console.log(doc.data().fixtureId)
                  this.laLigaFixtures.forEach(match => {
                    if (match.fixture.id === doc.data().fixtureId) {
                      match.playing = true
                      match.eventId = doc.id
                    }
                  })
                })
              }
              this.loading = false
            }).catch(error => {
            console.log('Error getting fame: ', error)
          })
        })
    },
    getUFCFixtures() {
      //todo
    },
    getNBAFixtures() {
      //todo
    },
    getNFLFixtures() {
      //todo
    },
    async addEvent(match) {
      let fixtureId = match.fixture.id
      let profileFields = {
        lastSport: this.sport,
        lastGameStarted: firebase.firestore.FieldValue.serverTimestamp()
      }
      db.collection('profiles')
        .doc(useUserStore().user.uid)
        .set(profileFields, {merge: true})

      const eventFields = {
        fixtureId: fixtureId,
        sport: this.sport,
        owner: useUserStore().user.uid,
        opponent: '',
        gameType: '',
        winner: 'TBD',
        ownerSelectedTeam: '',
        opponentSelectedTeam: '',
        eventDetails: match,
      }

      await db.collection('events')
        .where('fixtureId', '==', fixtureId)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.size) {
            querySnapshot.forEach(doc => {
              if (doc.data().owner == useUserStore().user.uid || doc.data().opponent == useUserStore().user.uid) {
                console.log('Event already exists update: ', doc.id)
                db.collection('events')
                  .doc(doc.id)
                  .set(eventFields, {merge: true})
                this.selectedEvent = doc.data()
                this.detailView(doc.id)

              } else {
                this.createEvent(eventFields)
              }
            })
          } else {
            this.createEvent(eventFields)
          }
        }).catch(error => {
          console.log('Error getting events: ', error)
        })
    },
    async createEvent(eventFields) {
      console.log('Create Doc', eventFields)
      await db.collection('events')
        .add(eventFields)
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id)
          this.selectedEvent = eventFields
          this.detailView(docRef.id)
        })
    },
    detailView(docId) {
      this.selectedEventId = docId
      this.$emit('showGameView', docId)
    },
    viewEvent(docId) {
      this.selectedEventId = docId
      this.$emit('showGameView', docId)
    }
  }
};
</script>

<style scoped>
.playing {
  background-color: rgba(187, 243, 187, 0.2);
  border: 1px solid green !important;
}


element.style {
}

.playing-status {
  font-size: 12px;
  background: green;
  width: 51px;
  height: 21px;
  border-radius: 0 0 6px;
}
</style>
