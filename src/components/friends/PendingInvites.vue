<template>
  <div class="pending-invites">
    <v-text-field
      placeholder="Search Username"
      v-model="searchQuery"
      variant="underlined"
    ></v-text-field>

    <div v-if="loading">
      <v-progress-circular
        indeterminate
        color="success"
        class="ma-4 mb-4"
      ></v-progress-circular>
    </div>

    <div v-if="!loading && filteredData.length === 0">
      <p>No pending invites found!</p>
    </div>

    <div v-if="!loading" v-for="friend in filteredData" :key="friend.uid">
      <v-card class="pending-invites-card">
        <v-card-title class="d-flex align-center">
          <v-avatar size="50">
            <img :src="friend?.avatar || defaultAvatarUrl" alt="Avatar" />
          </v-avatar>
          <div class="user-details">
            <div>
              <span
                class="username"
                :style="{
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
            <v-btn
              class="ma-2 accept-button"
              color="primary"
              @click="handleAcceptFriend(friend)"
            >
              Accept&nbsp;
              <v-icon icon="mdi:mdi-check-circle" right />
            </v-btn>
            <v-btn
              class="ma-2 decline-button"
              color="red"
              @click="handleRejectFriend(friend)"
            >
              Decline&nbsp;
              <v-icon icon="mdi:mdi-cancel" right />
            </v-btn>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.pending-invites {
  text-align: center;
  margin-bottom: 20px;
}

.pending-invites-card {
  padding: 20px;
  border: none;
  box-shadow: none;
}

.username {
  margin-left: 10px;
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
import { computed, onMounted, ref } from "vue";
import {
  getPendingFriendsList,
  acceptFriend,
  rejectFriend,
} from "@/firebase/functions";
import { useUserStore } from "@/store/app";

const searchQuery = ref("");
const friends = ref([]);
const user = ref({});
const loading = ref(false);
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

const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (query === "") {
    return friends.value;
  } else {
    return friends.value.filter((item) =>
      item.username.toLowerCase().includes(query)
    );
  }
});

const handleAcceptFriend = async (friend) => {
  loading.value = true;
  await acceptFriend(user.value.uid, friend.uid);
  friends.value = friends.value.filter((item) => item.uid !== friend.uid);
  loading.value = false;
};

const handleRejectFriend = async (friend) => {
  loading.value = true;
  await rejectFriend(user.value.uid, friend.uid);
  friends.value = friends.value.filter((item) => item.uid !== friend.uid);
  loading.value = false;
};

onMounted(async () => {
  loading.value = true;
  const userStore = useUserStore();
  user.value = userStore.user;
  friends.value = await getPendingFriendsList(user.value.uid);
  loading.value = false;
});
</script>
