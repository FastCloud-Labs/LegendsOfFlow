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
              @click="
                openUser(
                  item?.username ? 'username' : 'dapperAddress',
                  item?.username || item?.dapperAddress
                )
              "
              title="View Profile"
            >
              {{ item?.username || item?.dapperAddress }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.stats.points }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.stats.win }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.stats.loss }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.stats.draw }}
            </td>
            <td
              :style="{
                'background-color':
                  index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
              }"
            >
              {{ item.stats.win + item.stats.loss + item.stats.draw }}
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

<style scoped>
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
import { ref, computed, onMounted } from "vue";
import { getAllProfiles } from "@/firebase/functions";

const searchQuery = ref("");
const data = ref([]);

const sortedData = computed(() => {
  const sortedArray = data.value
    .slice()
    .sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0));
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
  const totalGames =
    (item.stats?.win || 0) + (item.stats?.loss || 0) + (item.stats?.draw || 0);
  const winRate = (item.stats?.win / totalGames) * 100 || 0;
  return winRate.toFixed(0) + "%";
};

const openUser = (type, value) => {
  const url = `/user?${type}=` + value;
  window.location.href = url;
};

onMounted(async () => {
  try {
    const res = await getAllProfiles();
    data.value = res.map((item) => ({
      ...item,
      stats: {
        points: item.stats?.points || 0,
        win: item.stats?.win || 0,
        loss: item.stats?.loss || 0,
        draw: item.stats?.draw || 0,
      },
    }));
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
});
</script>
