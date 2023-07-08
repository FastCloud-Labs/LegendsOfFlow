<template>
  <v-container class="fill-height">
    <v-responsive class="align-top text-center fill-height">
      <h2>My Events</h2>
      <p>No upcoming events...</p>
      <br>
      <v-img class="mx-auto hidden-md-and-up" max-width="400" width="auto" src="@/assets/intro.jpg"/>
    </v-responsive>
  </v-container>
</template>

<script>
export default {

  data() {
    return {
      avatars: [],
    }
  },
}
</script>
