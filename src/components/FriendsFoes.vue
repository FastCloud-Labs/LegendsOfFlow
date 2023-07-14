<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2 class="mb-4">Friends &amp; Foes</h2>
      <p class="mb-4">Invite your friends and challenge your foes!</p>
      <v-card>
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
          <v-tab value="1">Invite Friends</v-tab>
          <v-tab value="2">Freinds</v-tab>
          <v-tab value="3">Pending Invites</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="1">
            <v-container fluid>
              <InviteFriends />
            </v-container>
          </v-window-item>
          <v-window-item value="2">
            <v-container fluid>
              <Friends />
            </v-container>
          </v-window-item>
          <v-window-item value="3">
            <v-container fluid>
              <PendingInvites />
            </v-container>
          </v-window-item>
        </v-window>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import InviteFriends from "@/components/friends/InviteFriends.vue";
import PendingInvites from "@/components/friends/PendingInvites.vue";
import Friends from "@/components/friends/Friends.vue";

const tab = ref("1");
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}

.v-card {
  margin-top: 20px;
  width: 70vw;
}

.v-tabs {
  background-color: #f5f5f5;
}

.v-tab {
  color: #000;
  font-weight: bold;
}

.v-tab-item {
  padding: 20px;
}

.v-window-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-window-item .v-card {
  width: 100%;
  max-width: 400px;
  margin: 20px;
}
</style>
