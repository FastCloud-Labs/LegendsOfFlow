<template>
  <v-sheet
    class="mx-auto ma-4"
    :width="width"
    rounded
  >
    <v-slide-group
      show-arrows
    >
      <v-slide-group-item
      >
        <v-btn
          v-if="blocked"
          class="ma-2"
          rounded
          color="red"
          variant="outlined"
          @click="showLocked"
        >
          Staked
        </v-btn>
      </v-slide-group-item>
      <v-slide-group-item
      >
        <v-btn
          class="ma-2"
          rounded
          variant="outlined"
          @click="showLaLiga"
        >
          La Liga
        </v-btn>
      </v-slide-group-item>
      <v-slide-group-item
      >
        <v-btn
          class="ma-2"
          rounded
          variant="outlined"
          @click="showTopShot"
        >
          NBA Top Shot
        </v-btn>
      </v-slide-group-item>
      <v-slide-group-item
      >
        <v-btn
          class="ma-2"
          rounded
          variant="outlined"
          @click="showAllDay"
        >
          NFL All Day
        </v-btn>
      </v-slide-group-item>
      <v-slide-group-item
      >
        <v-btn
          class="ma-2"
          rounded
          variant="outlined"
          @click="showUfcStrike"
        >
          UFC Strike
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
export default {
  name: 'SelectionSlider',
  props: {
    blocked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: 735
    }
  },
  mounted() {
    this.width = window.innerWidth
    if (this.width > 735) {
      this.width = 735
    }
  },
  methods: {
    showLocked() {
      this.$emit('showLocked')
    },
    showLaLiga() {
      this.$emit('showSport', 'LaLiga')
    },
    showTopShot() {
      this.$emit('showSport', 'NBA')
    },
    showAllDay() {
      this.$emit('showSport', 'NFL')
    },
    showUfcStrike() {
      this.$emit('showSport', 'UFC')
    }
  }
}
</script>
