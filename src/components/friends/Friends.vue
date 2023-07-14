<template>
  <div class="friends">
    <h2>Friends</h2>
    <div v-for="friend in friends" :key="friend.uid">
      <v-card class="friends-card">
        <v-card-title class="d-flex align-center">
          <v-avatar size="50">
            <img :src="friend.avatar || defaultAvatarUrl" alt="Avatar" />
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
            <v-btn class="ma-2 decline-button" color="red">Remove</v-btn>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.friends {
  text-align: center;
  margin-bottom: 20px;
}

.friends-card {
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
</style>

<script setup>
import { onMounted, ref, watch } from "vue";
import { getFriendsList } from "@/firebase/functions";
import { useUserStore } from "@/store/app";

const friends = ref([]);
const user = ref({});
const defaultAvatarUrl =
  "https://res.cloudinary.com/dmovdfcta/image/upload/v1689055906/avatar-default_c8rpgq.png";

onMounted(async () => {
  const userStore = useUserStore();
  user.value = userStore.user;
  friends.value = await getFriendsList(user.value.uid);
});
</script>
