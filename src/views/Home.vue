<template>
  <Landing />
</template>

<script>
import Landing from "@/components/Landing.vue";
import { useUserStore } from "@/store/app.js";
import { toRaw, watchEffect } from "vue";

export default {
  components: {
    Landing,
  },
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    watchEffect(async () => {
      const user = toRaw(useUserStore().user);
      if (user && user.uid) {
        this.user = user;
        this.$router.push("/dashboard");
      } else {
        this.user = user;
      }
    });
  },
};
</script>
