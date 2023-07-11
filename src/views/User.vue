<template>
  <v-container>
    <v-responsive>
      <v-card class="profile-card">
        <div class="profile-avatar">
          <v-avatar size="80">
            <img
              src="https://res.cloudinary.com/dmovdfcta/image/upload/v1689055906/avatar-default_c8rpgq.png"
              alt="Avatar"
            />
          </v-avatar>
          <v-list-item class="text-white">
            <template #default>
              <v-list-item-title>@{{ username }}</v-list-item-title>
            </template>
          </v-list-item>
        </div>
        <v-card-title>
          <v-tabs v-model="activeTab" align-tabs="center">
            <v-tab v-for="item in data.items" :key="item" :value="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-card-title>
      </v-card>
      <v-window v-model="activeTab">
        <v-window-item v-for="item in data.items" :key="item" :value="item">
          <v-card flat>
            <v-card-text v-if="item === 'Upcoming games'">
              <UserGames :uid="uid" isUpcoming = "true" />
            </v-card-text>
            <v-card-text v-else-if="item === 'Past games'">
              <UserGames :uid="uid" isUpcoming = "false" />
            </v-card-text>
            <v-card-text v-else>{{ data.text }}</v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-responsive>
  </v-container>
</template>

<style>
.profile-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  flex-direction: column;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
}

.section-title {
  margin-top: 30px;
}

.game-card {
  margin-bottom: 10px;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-item {
  font-weight: bold;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserGames from "@/components/UserGames.vue";
import { getUidByUsername } from "@/firebase/functions";

const router = useRouter();

const username = ref("");
const uid = ref("");

const data = {
  items: ["Overview", "Upcoming games", "Past games", "Moments", "Friends"],
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};
const activeTab = ref(data.items[0]);
onMounted(async () => {
  const routeParams = router?.currentRoute?.value?.query;
  username.value = routeParams?.username;
  uid.value = await getUidByUsername(username.value);
  console.log(uid.value);
});
</script>
