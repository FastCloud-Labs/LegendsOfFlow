<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-item">
              <div class="stat-label">Points</div>
              <div class="stat-value">{{ stats?.points }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-item">
              <div class="stat-label">Win</div>
              <div class="stat-value">{{ stats?.win }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-item">
              <div class="stat-label">Loss</div>
              <div class="stat-value">{{ stats?.loss }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-item">
              <div class="stat-label">Draw</div>
              <div class="stat-value">{{ stats?.draw }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-item">
              <div class="stat-label">Total Played</div>
              <div class="stat-value">
                {{ stats?.win + stats?.loss + stats?.draw }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-item">
              <div class="stat-label">Win Rate</div>
              <div class="stat-value">
                {{
                  (
                    (stats?.win || 0) /
                    (stats?.win || 0 + stats?.loss || 0 + stats?.draw || 0)
                  ).toFixed(2) *
                    100 +
                  "%"
                }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.stat-item {
  display: flex;
  justify-content: space-between;
}

.stat-label {
  margin-right: auto;
}
</style>

<script setup>
import { ref, watchEffect } from "vue";
import { getStatsByUid } from "@/firebase/functions";

const stats = ref({});
const props = defineProps({
  uid: {
    type: String,
  },
});

watchEffect(async () => {
  try {
    console.log(props.uid);
    const res = await getStatsByUid(props.uid);
    stats.value = res;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
});
</script>
