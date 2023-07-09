<template>
  <div>
    <v-card class="lineup mx-auto mt-0 pt-0">
      <div class="lineup-rows">
        <v-row clas="mt-0">
          <v-col cols="3">
          </v-col>
          <v-col cols="3">
            <v-avatar class=" border font-weight-bold" @click="openMomentPicker">LF</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class=" border font-weight-bold">RF</v-avatar>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">LM</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">CM</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">CM</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">RM</v-avatar>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">LB</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">CB</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">CB</v-avatar>
          </v-col>
          <v-col cols="3">
            <v-avatar class="border font-weight-bold">RB</v-avatar>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
          </v-col>
          <v-col cols="4">
            <v-avatar class="border font-weight-bold">GK</v-avatar>
          </v-col>
          <v-col cols="4">
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-dialog v-model="momentPickerLineup" width="auto">
      <v-card>
        <Moments :user="user"/>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Moments from "@/components/Moments.vue";
import {useUserStore} from "@/store/app";

export default {
  components: {
    Moments
  },
  data() {
    return {
      user: {},
      loaded: false,
      hotspotConfig: {},
      momentPickerLineup: false,

    };
  },
  mounted() {
    this.user = useUserStore()
  },
  methods: {
    openMomentPicker() {
      this.momentPickerLineup = true
    },
    saveData(data) {
      console.log(data)
    },
    afterDelete(data) {
      console.log(data)
    }
  }
}
</script>
<style>
.lineup {
  background: url(src/assets/soccer-field-1.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 345px;
  height: 300px;


}

.lineup-rows {
  width: 220px;
  margin: auto;
  margin-top: 38px;
  margin-left: 61px;
}

.lineup-rows .v-avatar.border {
  border: 1px solid #fff !important;
  color: #fff;
  background: rgba(255, 255, 255, 0.37);
  text-shadow: 1px 1px 2px #000;
  box-shadow: 2px 2px 4px #000;
}

.lineup-rows .v-avatar {
  color: #222;
}

.lineup-rows .v-col {
  padding: 10px;
}
</style>
