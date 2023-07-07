// Utilities
import {defineStore} from 'pinia'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import db from '@/firebase/init.js'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {},
      loading: false,
      profile: {},
      listenerUnsubscribe: null
    }
  },
  actions: {
    setUser() {
      this.loading = true
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          console.log('onAuthState Observer: user signed in...')
          const {displayName, email, photoURL, emailVerified, uid} = user // get what you need from the user object
          this.user = {displayName, email, photoURL, emailVerified, uid}
          db.collection('profiles')
            .doc(user.uid)
            .get()
            .then(doc => {
              this.profile = doc.data()
            })
            .catch(error => {
              console.log('Error getting documents: ', error)
            })
          this.loading = false
        } else {
          console.log('onAuthState Observer: user not logged in or created yet')
          this.loading = false
        }
      })
    },
    persist: true //persists user state to local storage!
  },
})
