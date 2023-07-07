<template>
  <router-view/>
</template>

<script setup>
import {onMounted} from "vue";
import {useUserStore} from "@/store/app";
const userStore = useUserStore()

onMounted(() => {
  console.log('mounting..')
  userStore.setUser()
})
</script>
