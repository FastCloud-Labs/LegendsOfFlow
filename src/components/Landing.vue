<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img max-width="400" class="mx-auto" src="@/assets/intro.jpg"/>
      <div class="mt-6">
        <v-btn class="mt-2 mr-2" color="success" size="x-large" elevation="4" @click="dialogSignUp=true">SignUp</v-btn>
        <v-btn class="mt-2 ml-2" color="info" size="x-large" elevation="4" @click="dialogLogin=true">Login</v-btn>
      </div>

      <div class="py-14"/>

      <v-dialog
        v-model="dialogLogin"
        width="33%"
        min-width="300"
      >
        <v-card class="ma-2">
          <v-card-text class="ma-1">
            <h3 class="ma-2 mb-2">Login</h3>
            <v-text-field
              v-model="email"
              label="Email"
              type="email"></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"></v-text-field>
            <v-spacer/>
            <v-btn color="success" block @click="login" elevation="4" class="mb-2">Login</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogSignUp"
        width="33%"
        min-width="300"
      >
        <v-card>
          <v-card-text class="ma-2">
            <h4 class="ma-2 mb-4">SignUp</h4>
            <v-text-field
              v-model="email"
              label="Email"
              type="email"></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"></v-text-field>
            <v-btn color="success" block @click="signup" elevation="4" class="mb-2">SignUp</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogError"
        width="auto"
        min-width="300"
      >
        <v-card>
          <v-card-text class="ma-1">
            <p class="text-red">{{ errorText }}</p>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-responsive>
  </v-container>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import db from '@/firebase/init.js'

export default {
  setup() {
    const auth = firebase.auth()
  },
  data() {
    return {
      dialogLogin: false,
      dialogSignUp: false,
      dialogError: false,
      errorText: '',
      user: {},
      email: '',
      password: ''
    }
  },
  methods: {
    signup() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user;
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          console.log(error)
          this.dialogError = true
          this.errorText = error.message
        });
    },
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user;
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          console.log(error)
          this.dialogError = true
          this.errorText = error.message

        });
    }
  }
}
</script>
