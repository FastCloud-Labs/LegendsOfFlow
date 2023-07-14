<template>
  <div class="invite-friends">
    <h2>Invite Friends</h2>
    <div v-for="friend in friends" :key="friend.uid">
      <v-card class="invite-card">
        <v-card-title class="d-flex align-center">
          <v-avatar>
            <img :src="friend.avatar || defaultAvatarUrl" alt="Avatar" />
          </v-avatar>
          <div class="user-details">
            <div>
              <span
                class="username"
                :style="{
                  'background-color':
                    index % 2 === 0 ? 'rgb(56, 60, 45)' : 'none',
                  cursor: 'pointer',
                }"
                title="View Profile"
                @click="openUser(friend?.username)"
                >{{ friend?.username }}</span
              >
            </div>
            <div>
              <span
                class="subtitle"
                :style="{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }"
                title="View Wallet on FlowScan"
                @click="openProfileInNewTab(friend?.dapperAddress)"
                >{{ friend?.dapperAddress }}</span
              >
            </div>
          </div>
          <v-spacer></v-spacer>
          <div class="button-container">
            <v-btn class="ma-2 accept-button" color="primary">Add Friend</v-btn>
            <v-btn class="ma-2 decline-button" color="success"
              >Invite to game</v-btn
            >
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.invite-friends {
  text-align: center;
  margin-bottom: 20px;
}

.invite-card {
  padding: 20px;
  border: none;
  box-shadow: none;
}

.user-details {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  margin-bottom: 5px;
}

.subtitle {
  color: #999;
  font-size: 12px;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.accept-button {
  margin: 5px;
}

.decline-button {
  margin: 5px;
}
</style>

<script setup>
import { onMounted, ref, watch } from "vue";
import { getInviteFriendsList } from "@/firebase/functions";
import { useUserStore } from "@/store/app";

const friends = ref([]);
const user = ref({});
const defaultAvatarUrl =
  "https://res.cloudinary.com/dmovdfcta/image/upload/v1689055906/avatar-default_c8rpgq.png";

const openUser = (username) => {
  const url = "/user?username=" + username;
  window.open(url, "_blank");
};

const openProfileInNewTab = (dapperAddress) => {
  const url = `https://flowscan.org/account/${dapperAddress}`;
  window.open(url, "_blank");
};

onMounted(async () => {
  const userStore = useUserStore();
  user.value = userStore.user;
  friends.value = await getInviteFriendsList(user.value.uid);
});
</script>
