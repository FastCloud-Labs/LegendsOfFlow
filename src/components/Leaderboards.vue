<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="mb-4">Leaderboards</h2>
      <v-text-field
        class="leaderboard-search"
        placeholder="Search Username"
        v-model="searchQuery"
        variant="underlined"
      ></v-text-field>
      <v-table class="leaderboard-table" theme="dark">
        <thead>
          <tr>
            <th class="text-center leaderboard-header">Rank</th>
            <th class="text-center leaderboard-header">Username</th>
            <th class="text-center leaderboard-header">Points</th>
            <th class="text-center leaderboard-header">Wins</th>
            <th class="text-center leaderboard-header">Losses</th>
            <th class="text-center leaderboard-header">Draws</th>
            <th class="text-center leaderboard-header">Total Games Played</th>
            <th class="text-center leaderboard-header">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="item.username">
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'inherit',
                color: '#e2ff6f',
              }"
            >
              {{ item.rank }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }"
              @click="openUser(item.username)"
              title="View Profile"
            >
              {{ item.username }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.points }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.win }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.loss }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.draw }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.win + item.loss + item.draw }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
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
import { ref, computed } from "vue";

const searchQuery = ref("");

const data = ref([
  {
    username: "James",
    points: 30,
    win: 7,
    loss: 1,
    draw: 1,
  },
  {
    username: "John",
    points: 25,
    win: 5,
    loss: 2,
    draw: 3,
  },
  {
    username: "Emily",
    points: 20,
    win: 4,
    loss: 1,
    draw: 2,
  },
  {
    username: "Michael",
    points: 18,
    win: 3,
    loss: 3,
    draw: 2,
  },
  {
    username: "Sarah",
    points: 15,
    win: 2,
    loss: 2,
    draw: 3,
  },
  {
    username: "David",
    points: 12,
    win: 1,
    loss: 3,
    draw: 3,
  },
]);

const sortedData = computed(() => {
  const sortedArray = data.value.slice().sort((a, b) => b.points - a.points);
  sortedArray.forEach((item, index) => {
    item.rank = (index + 1).toString().padStart(2, "0");
  });
  return sortedArray;
});

const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (query === "") {
    return sortedData.value;
  } else {
    return sortedData.value.filter((item) =>
      item.username.toLowerCase().includes(query)
    );
  }
});

const getWinRate = (item) => {
  const totalGames = item.win + item.loss + item.draw;
  const winRate = (item.win / totalGames) * 100 || 0;
  return winRate.toFixed(0) + "%";
};

const openUser = (username) => {
  const url = "/user?username=" + username;
  window.open(url, "_blank");
};
</script>
