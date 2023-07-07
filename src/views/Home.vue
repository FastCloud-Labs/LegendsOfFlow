<template>
  <Landing/>
</template>

<script>
import Landing from '@/components/Landing.vue'
import {useUserStore} from '@/store/app.js'

export default {
  components: {
    Landing
  },
  data() {
    return {
      user: {},
    }
  },
  mounted() {
    this.user = useUserStore().user
    if (this.user.uid) {
      this.$router.push('/dashboard')
    }
  },
}
</script>
