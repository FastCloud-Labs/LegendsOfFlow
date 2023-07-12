<template>
  <div>
    <v-chip size="small">{{ lineupCount }}/11</v-chip>
    <div class="lineup mx-auto mt-0 pt-0">
      <div class="lineup-rows">
        <v-row clas="mt-0">
          <v-col cols="3">
          </v-col>
          <v-col cols="3">
            <v-btn @click="openMomentPicker('Forward', 'LF')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold mb-0 pb-0">
                <v-img
                  v-if="momentsInPlay['LF']"
                  class="moment-stretch mb-0 pb-0"
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=80,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['LF']?.detail?.PlayDataID}/play_${momentsInPlay['LF']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>LF</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['LF']" @click="openMomentPicker('Forward', 'LF')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['LF']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3">
            <v-btn @click="openMomentPicker('Forward', 'RF')" variant="plain" icon="LF" class="mb-0 pb-0">

              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['RF']"
                  class="moment-stretch mb-0 pb-0"
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['RF']?.detail?.PlayDataID}/play_${momentsInPlay['RF']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>RF</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['RF']" @click="openMomentPicker('Forward', 'RF')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['RF']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Midfielder', 'LM')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['LM']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['LM']?.detail?.PlayDataID}/play_${momentsInPlay['LM']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>LM</span>
              </v-avatar>
            </v-btn>
            <v-chip v-if="momentsInPlay['LM']" @click="openMomentPicker('Midfielder', 'LM')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['LM']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Midfielder', 'LCM')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['LCM']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['LCM']?.detail?.PlayDataID}/play_${momentsInPlay['LCM']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>LCM</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['LCM']" @click="openMomentPicker('Midfielder', 'LCM')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['LCM']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Midfielder', 'RCM')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['RCM']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['RCM']?.detail?.PlayDataID}/play_${momentsInPlay['RCM']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>RCM</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['RCM']" @click="openMomentPicker('Midfielder', 'RCM')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['RCM']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Midfielder', 'RM')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['RM']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['RM']?.detail?.PlayDataID}/play_${momentsInPlay['RM']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>RM</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['RM']" @click="openMomentPicker('Midfielder', 'RM')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['RM']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Defender', 'LB')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['LB']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['LB']?.detail?.PlayDataID}/play_${momentsInPlay['LB']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>LB</span>
              </v-avatar>
            </v-btn>
            <v-chip v-if="momentsInPlay['LB']" @click="openMomentPicker('Defender', 'LB')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['LB']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Defender', 'LCB')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['LCB']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['LCB']?.detail?.PlayDataID}/play_${momentsInPlay['LCB']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>LCB</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['LCB']" @click="openMomentPicker('Defender', 'LCB')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['LCB']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Defender', 'RCB')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['RCB']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['RCB']?.detail?.PlayDataID}/play_${momentsInPlay['RCB']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>RCB</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['RCB']" @click="openMomentPicker('Defender', 'RCB')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['RCB']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="">
            <v-btn @click="openMomentPicker('Defender', 'RB')" variant="plain" icon="LF" class="mb-0 pb-0">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['RB']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['RB']?.detail?.PlayDataID}/play_${momentsInPlay['RB']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>RB</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['RB']" @click="openMomentPicker('Defender', 'RB')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['RB']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
          </v-col>
          <v-col cols="4" class="">
            <v-btn @click="openMomentPicker('Goalkeeper', 'GK')" variant="plain" icon="GK" class="">
              <v-avatar class="border font-weight-bold ">
                <v-img
                  v-if="momentsInPlay['GK']"
                  class="moment-stretch "
                  v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=60,height=60,quality=100/https://assets.laligagolazos.com/editions/${momentsInPlay['GK']?.detail?.PlayDataID}/play_${momentsInPlay['GK']?.detail?.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                <span v-else>GK</span>
              </v-avatar>
            </v-btn>
            <br>
            <v-chip v-if="momentsInPlay['GK']" @click="openMomentPicker('GoalKeeper', 'GK')" size="x-small"
                    variant="outlined"
                    class="jersyname text-truncate  px-1">{{
                momentsInPlay['GK']?.detail?.PlayerJerseyName
              }}
            </v-chip>
          </v-col>
          <v-col cols="4">
          </v-col>
        </v-row>
      </div>
    </div>
    <v-dialog v-model="momentPickerLineup" width="auto">
      <v-card>
        <Moments :user="user" :force-sport="sport" :position="position" :subPosition="subPosition" :game="game"
                 @closeMoment="closeMoment" v-click-outside="clickOff" @showDapperView="showDapper"/>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Moments from "@/components/Moments.vue";
import {useUserStore} from "@/store/app";
import db from "@/firebase/init";

export default {
  components: {
    Moments
  },
  props: {
    game: {
      type: Object,
      default: () => {
      }
    },
    gameId: {
      type: String,
      default: () => {
      }
    },
  },
  data() {
    return {
      user: {},
      loaded: false,
      hotspotConfig: {},
      momentPickerLineup: false,
      position: '',
      subPosition: '',
      sport: '',
      momentsInPlay: {},
      lineupCount: 0,
      owner: false
    };
  },
  mounted() {
    this.user = useUserStore()
    if (this.game.owner == this.user.uid) {
      this.owner = true
    }
    this.sport = this.game.sport
    this.updateLineUp()
  },
  methods: {
    openMomentPicker(position, subPosition) {
      this.position = position
      this.subPosition = subPosition
      this.momentPickerLineup = true
    },
    closeMoment() {
      this.momentPickerLineup = false
      this.updateLineUp()
    },
    clickOff() {
      this.updateLineUp()
    },
    updateLineupCount(lineupCount) {
      this.lineupCount = lineupCount

      let fields = {opponentLineupCount: this.lineupCount}

      if (this.owner) {
        fields = {ownerLineupCount: this.lineupCount}
      }

      db.collection('events')
        .doc(this.gameId)
        .set(fields, {merge: true})

    },
    async updateLineUp() {
      this.momentsInPlay = {}
      await db.collection('momentsInPlayLaLiga')
        .where('owner', '==', useUserStore().user.uid)
        .where('inPlay', '==', true)
        .where('lastFixture', '==', this.game.fixtureId)
        .onSnapshot((querySnapshot) => {
          let momentsInPlay = []
          querySnapshot.forEach((doc) => {
            momentsInPlay.push(doc.data())
          })
          momentsInPlay.forEach(e => {
            this.momentsInPlay[e['subPosition']] = e
          })
          this.updateLineupCount(querySnapshot.size)
        })

    },
    showDapper() {
      this.$emit('showDapper')
    },
  }
}
</script>
<style>
.lineup {
  background: url('@/assets/soccer-field-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 330px;
  height: 380px;
  margin-bottom: 20px;
}

.lineup-rows {
  width: 250px;
  margin: auto;
  padding-top: 60px;
  margin-left: 40px;
}

@media only screen and (min-width: 600px) {
  .lineup {
    background: url('@/assets/soccer-field-1.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 450px;
    height: 480px;
  }

  .lineup-rows {
    width: 350px;
    margin: auto;
    padding-top: 110px;
    margin-left: 50px;
  }
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

.lineup-rows .v-btn--icon.v-btn--density-default {
  opacity: 1;
}

.lineup-rows .v-chip {
  background: rgb(51, 51, 51);
}

span.v-chip.jersyname {
  margin-top: -13px !important;
}
</style>
