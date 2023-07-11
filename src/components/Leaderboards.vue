<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="mb-4">Leaderboards</h2>
      <v-text-field
        class="leaderboard-search"
        v-if="filteredData.length > 0"
        placeholder="Search Players"
        v-model="searchQuery"
        variant="underlined"
      ></v-text-field>
      <v-table class="leaderboard-table" theme="dark">
        <thead>
        <tr>
          <th class="text-center leaderboard-header">#</th>
          <th class="text-center leaderboard-header">Name</th>
          <th class="text-center leaderboard-header">Points &#x1F3C6;</th>
          <th class="text-center leaderboard-header">Wins &#x1F947;</th>
          <th class="text-center leaderboard-header">Losses &#x1F625;</th>
          <th class="text-center leaderboard-header">Draws &#x1F914;</th>
          <th class="text-center leaderboard-header">Total Games Played</th>
          <th class="text-center leaderboard-header">Win Rate</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in filteredData" :key="item['player name']">
          <td class="leaderboard-cell">{{ index + 1 }}</td>
          <td>{{ item["player name"] }}</td>
          <td :style="{ color: '#fddca8' }">{{ item.points }}</td>
          <td :style="{ color: 'green' }">{{ item.win }}</td>
          <td :style="{ color: 'red' }">{{ item.loss }}</td>
          <td :style="{ color: 'blue' }">{{ item.draw }}</td>
          <td>{{ item.win + item.loss + item.draw }}</td>
          <td :style="{ color: getWinRateColor(item) }">
            {{ getWinRateEmoji(item) }}
            {{ getWinRate(item) }}
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-responsive>
  </v-container>
</template>

<style>
.leaderboard-table {
  margin-top: 0px;
  width: 90vw;
  max-width: 730px !important;
}

.leaderboard-header {
  background-color: #393939;
  color: #ffffff;
  font-weight: bold;
  padding: 16px;
  position: relative;
}

.leaderboard-cell {
  font-weight: bold;
  color: #ffffff;
  padding: 16px;
  position: relative;
}

.leaderboard-search {
  max-width: 100%;
}
</style>

<script setup>
import {ref, computed} from "vue";

const searchQuery = ref("");

const data = ref([
  {
    "player name": "James",
    points: 30,
    win: 7,
    loss: 1,
    draw: 1,
  },
  {
    "player name": "John",
    points: 25,
    win: 5,
    loss: 2,
    draw: 3,
  },
  {
    "player name": "Emily",
    points: 20,
    win: 4,
    loss: 1,
    draw: 2,
  },
  {
    "player name": "Michael",
    points: 18,
    win: 3,
    loss: 3,
    draw: 2,
  },
  {
    "player name": "Sarah",
    points: 15,
    win: 2,
    loss: 2,
    draw: 3,
  },
  {
    "player name": "David",
    points: 12,
    win: 1,
    loss: 3,
    draw: 3,
  },
]);

const sortedData = computed(() => {
  return data.value.slice().sort((a, b) => b.points - a.points);
});

const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (query === "") {
    return sortedData.value;
  } else {
    return sortedData.value.filter((item) =>
      item["player name"].toLowerCase().includes(query)
    );
  }
});

const getWinRate = (item) => {
  const totalGames = item.win + item.loss + item.draw;
  const winRate = (item.win / totalGames) * 100 || 0;
  return winRate.toFixed(0) + "%";
};

const getWinRateEmoji = (item) => {
  const winRate = (item.win / (item.win + item.loss + item.draw)) * 100 || 0;

  if (winRate >= 70) {
    return "🥇";
  } else if (winRate >= 40) {
    return "🥈";
  } else {
    return "🥉";
  }
};

const getWinRateColor = (item) => {
  const winRate = (item.win / (item.win + item.loss + item.draw)) * 100 || 0;
  if (winRate >= 70) {
    return "green";
  } else if (winRate >= 40) {
    return "orange";
  } else {
    return "red";
  }
};

</script>
