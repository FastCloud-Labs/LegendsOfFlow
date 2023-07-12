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
              <v-list-item-subtitle
                class="profile-dapper-address"
                @click="openProfileInNewTab"
              >
                {{ profile?.dapperAddress }}
              </v-list-item-subtitle>
            </template>
          </v-list-item>
        </div>
        <div class="button-container">
          <v-btn class="mr-2" text small color="primary" @click="addFriend">
            Add Friend
          </v-btn>
          <v-btn text small color="success"> Invite to Game </v-btn>
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
          <component
            :is="getComponent(item)"
            :uid="uid"
            :isUpcoming="
              isUpcoming(item) &&
              (item === 'Upcoming games' || item === 'Past games')
            "
          />
        </v-window-item>
      </v-window>
    </v-responsive>
  </v-container>
</template>

<style scoped>
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
.profile-dapper-address {
  cursor: pointer;
  text-decoration: underline;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProfile, getUidByUsername } from "@/firebase/functions";
import Overview from "@/components/profile/Overview.vue";
import UserGames from "@/components/profile/UserGames.vue";
import Moments from "@/components/profile/Moments.vue";
import Friends from "@/components/profile/Friends.vue";

const router = useRouter();

const username = ref("");
const uid = ref("");
const profile = ref({});
const activeTab = ref("Overview");

const data = {
  items: ["Overview", "Upcoming games", "Past games", "Moments", "Friends"],
};

const getComponent = (item) => {
  switch (item) {
    case "Overview":
      return Overview;
    case "Moments":
      return Moments;
    case "Friends":
      return Friends;
    case "Upcoming games":
    case "Past games":
      return UserGames;
    default:
      return null;
  }
};

const isUpcoming = (item) => {
  return item === "Upcoming games";
};

const addFriend = () => {
  // todo: add friend
  console.log("add friend");
};

const openProfileInNewTab = () => {
  if (profile.value && profile.value.dapperAddress) {
    const url = `https://flowscan.org/account/${profile.value.dapperAddress}`;
    window.open(url, "_blank");
  }
};

onMounted(async () => {
  const routeParams = router?.currentRoute?.value?.query;
  username.value = routeParams?.username;
  uid.value = await getUidByUsername(username.value);
  profile.value = await getProfile(uid.value);
  console.log(profile.value);
});
</script>
