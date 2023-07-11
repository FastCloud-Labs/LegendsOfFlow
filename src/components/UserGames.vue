<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="ma-4" v-if="props.isUpcoming === 'true'">Upcoming Games</h2>
      <h2 class="ma-4" v-else-if="props.isUpcoming === 'false'">Past Games</h2>
      <br />
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="success"
        class="ma-1 mb-4"
      ></v-progress-circular>
      <div class="upcoming-games" v-else-if="upcomingGames?.length">
        <!-- todo: search bar -->
        <!-- <v-text-field
          v-if="!loading"
          placeholder="Search Games"
          width="auto"
          v-model="search"
          variant="underlined"
          class="mt-4"
        ></v-text-field> -->
        <v-card
          v-for="match in upcomingGames"
          class="mb-4 border mx-auto playing"
        >
          <div class="gametype ma-0 pa-0" :class="match.gameType || 'Win/Loss'">
            Type: {{ match.gameType || "Win/Loss" }}
          </div>
          <div
            class="playing-status ma-0 pa-0"
            :class="match.status || 'Pending'"
          >
            {{ match.status || "Pending" }}
          </div>

          <v-card-text class="mt-md-0 pt-md-0 mt-sm-2">
            <v-chip class="mb-4 mt-md-0 mt-lg-0 mt-sm-2"
              >{{
                moment(match.eventDetails.fixture.date).format(
                  "ddd MMM DD, YYYY"
                )
              }}
            </v-chip>

            <v-row>
              <v-col cols="5" class="mx-auto text-center">
                <div class="mine fill-height pa-1 pt-3">
                  <h3>{{ match.ownerSelectedTeam }}</h3>
                  <v-img
                    :src="match.ownerSelectedTeamLogo"
                    width="50"
                    height="50"
                    class="mx-auto ma-2"
                  />
                </div>
              </v-col>
              <v-col cols="2" class="ma-0 pa-0 mt-7">
                <div v-if="!loading">
                  <v-chip size="small" class="mb-1 mt-0">{{
                    match.eventDetails.fixture.status.short
                  }}</v-chip>
                  <p class="fill-height align-center text-center mx-auto">VS</p>
                  <!-- <div>
                    <v-btn
                      color="success"
                      @click="viewEvent(match.gameId)"
                      class="mx-auto mt-2"
                      size="small"
                      >View
                    </v-btn>
                  </div> -->
                </div>
              </v-col>
              <v-col
                cols="5"
                class="mx-auto text-center"
                v-if="match.opponentSelectedTeam"
              >
                <div class="opponent fill-height pa-3">
                  <h3>{{ match.opponentSelectedTeam }}</h3>
                  <v-img
                    :src="match.opponentSelectedTeamLogo"
                    width="50"
                    height="50"
                    class="mx-auto ma-2"
                  />
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
        <v-btn class="ma-2 mt-4" color="green" @click="upcoming"
          >Choose a match to play</v-btn
        >
        <br />
        <v-img
          class="mx-auto"
          max-width="400"
          width="auto"
          src="@/assets/intro.jpg"
        />
      </div>
    </v-responsive>
  </v-container>
</template>

<style scoped>
.upcoming-games {
  margin-left: 75px;
  margin-right: 75px;
}
.upcoming-wrapper {
  margin: auto;
  width: 92%;
}

.playing {
  background-color: rgba(187, 243, 187, 0.05);
  border: 1px solid #4caf50 !important;
}

.playing-status-upcoming {
  font-size: 12px;
  background: #4caf50;
  width: 51px;
  height: 21px;
  border-radius: 0 0 6px;
  margin-bottom: -20px !important;
}
</style>
<script setup>
import { onMounted } from "vue";
import { defineProps, ref } from "vue";
import { getUpcomingGames, getPastGames } from "@/firebase/functions";
import moment from "moment";

const props = defineProps({
  uid: {
    type: String,
  },
  isUpcoming: {
    type: String,
  },
});

const upcomingGames = ref([]);
let loading = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    let games = [];
    if (props.isUpcoming === "true") {
      games = await getUpcomingGames(props.uid);
    } else {
      games = await getPastGames(props.uid);
    }
    upcomingGames.value = games;
    loading.value = false;
  } catch (error) {
    console.error(
      "Error fetching " + isUpcoming === "true"
        ? "upcoming "
        : "past " + "games:",
      error
    );
  }
});
</script>
