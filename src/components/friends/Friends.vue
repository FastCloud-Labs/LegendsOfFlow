<template>
  <div class="friends">
    <h2>Friends</h2>
    <v-card class="friends-card">
      <v-card-title class="d-flex align-center">
        <v-avatar>
          <img
            src="https://res.cloudinary.com/dmovdfcta/image/upload/v1689055906/avatar-default_c8rpgq.png"
            alt="Avatar"
          />
        </v-avatar>
        <span class="username">John Doe</span>
        <v-spacer></v-spacer>
        <div class="button-container">
          <v-btn class="ma-2 decline-button" color="red">Remove</v-btn>
        </div>
      </v-card-title>
    </v-card>
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

.username {
  margin-left: 10px;
}
</style>

<script setup>
import { ref } from "vue";
</script>
