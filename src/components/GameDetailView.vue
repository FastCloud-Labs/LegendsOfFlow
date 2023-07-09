<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="mb-2">Selected Game</h2>
      <v-progress-circular v-if="loading" indeterminate color="success"></v-progress-circular>
      <v-card max-width="100%" width="800">
        <v-card-text v-if="match?.fixture" width="800">
          <v-chip class="ma-2">{{ moment(match.fixture.date).format("ddd MMM DD, YYYY [at] HH:mm a") }}</v-chip>
          <v-row class="ma-2">
            <v-col cols="5" class="mx-auto text-center border"
                   :class="{selectedBoarder: match.teams.home.name == teamPicked}"
                   @click="pickTeam(match.teams.home.name)">
              <h3>{{ match.teams.home.name }}</h3>
              <v-img :src="match.teams.home.logo" width="50" height="50" class="mx-auto ma-2"/>
            </v-col>
            <v-col cols="2">
              <v-chip size="small" class="mb-1 mt-0">{{ match.fixture.status.short }}</v-chip>
              <p class="fill-height align-center text-center mx-auto">VS
              </p>
            </v-col>
            <v-col cols="5" class="mx-auto text-center border"
                   :class="{selectedBoarder: match.teams.away.name == teamPicked}"
                   @click="pickTeam(match.teams.away.name)">
              <h3>{{ match.teams.away.name }}</h3>
              <v-img :src="match.teams.away.logo" width="50" height="50" class="mx-auto ma-2"/>
            </v-col>
          </v-row>
          <p v-if="!teamPicked" class="text-green">Select team</p>
          <div v-else class="ma-4">
            <div v-if=event.gameType>
              <v-chip color="info"> Game Type: {{ event.gameType }}</v-chip>
              <div v-if="event.gameType == 'Win Loss'">
                <p class="ma-1">You've chosen {{ teamPicked }} to win.</p>
              </div>
              <div v-if="event.gameType == 'Team Points'">
                <p class="ma-1">You've chosen {{ teamPicked }}.</p>
                Your opponent can choose the same team, winner picks the highest scoring lineup.
                <v-divider class="ma-3"></v-divider>
                <h4>Choose LineUp</h4>
              </div>
              <v-btn v-if="!momentLocked" color="success" @click="chooseMoment" class="ma-4">Choose Moment</v-btn>
            </div>
            <div v-else>
              Choose Game Type:
              <ul>
                <li>Team points: (Both players can choose the same team)</li>
                <li>Simple Win Loss</li>
                <li>More game types coming soon</li>
              </ul>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script>
import moment from "moment";
import db from "@/firebase/init";
import {useUserStore} from '@/store/app.js'

export default {
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
      teamPicked: '',
      isOwner: false,
      momentLocked: false
    }
  },
  computed: {
    moment() {
      return moment
    }
  },
  mounted() {
    this.getGame()
  },
  methods: {
    getGame() {
      db.collection('events')
        .doc(this.gameId)
        .get().then((doc) => {
        this.event = doc.data()
        this.match = this.event.eventDetails
        this.loading = false
        if (this.event.owner == useUserStore().user.uid) {
          this.isOwner = true
        }
        if (this.isOwner) {
          this.teamPicked = this.event.ownerSelectedTeam
        } else {
          this.teamPicked = this.event.opponentSelectedTeam
        }
      })
    },
    pickTeam(team) {
      this.teamPicked = team
      let eventFields = {}
      if (this.isOwner) {
        eventFields = {
          ownerSelectedTeam: team
        }
      } else {
        eventFields = {
          opponentSelectedTeam: team
        }
      }
      db.collection('events')
        .doc(this.gameId)
        .set(eventFields, {merge: true})
    }
  }
}
</script>
<style>
.selectedBoarder {
  border: 2px solid green !important;
  border-radius: 5px;
}
</style>
