<template>
  <div class="pending-invites">
    <h2>Pending Invites</h2>
    <v-card class="pending-invites-card">
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
          <v-btn class="ma-2 accept-button" color="primary">
            Accept&nbsp;
            <v-icon icon="mdi:mdi-check-circle" right />
          </v-btn>
          <v-btn class="ma-2 decline-button" color="red">
            Decline&nbsp;
            <v-icon icon="mdi:mdi-cancel" right />
          </v-btn>
        </div>
      </v-card-title>
    </v-card>
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
