<template>
  <v-container class="fill-height moments">
    <v-responsive class="align-top text-center fill-height" :width="width">
      <h2><span v-if="filterPosition" class="mb-2 mt-0 pt-0">{{ filterPosition }}</span> Moments</h2>
      <SelectionSlider v-if="!forceSport" :blocked="true" @showSport="whichSport"
                       @showLocked="showLocked"></SelectionSlider>
      <v-progress-circular v-if="loading && user.profile.dapperAddress" indeterminate
                           color="success" class="mt-2"></v-progress-circular>
      <div v-if="!user.profile.dapperAddress" class="mt-2">
        <p class="ma-2">Connect Wallet to Access Moments</p>
        <v-btn color="success" @click="dapperAccount">Connect Wallet</v-btn>
      </div>
      <h4 v-else-if="!sport" class="text-green">Choose a sport
        <v-icon icon="fas fa-arrow-up"></v-icon>
      </h4>
      <div v-else>
        <div class="moment-wrapper">
          <v-row class="my-0 py-0">
            <v-col cols="8" class="ma-0 pa-0">
              <v-text-field v-if="sport && !loading" placeholder="Search Moments" width="auto" variant="underlined"
                            class="my-0 py-0"
                            v-model="search"></v-text-field>
            </v-col>
            <v-col cols="4" class="my-0 py-0">
              <v-btn-group class="float-right mt-1">
                <v-btn @click="changeView('list')" size="small" :disabled="view.list">
                  <v-icon icon="fas fa-list-ul"></v-icon>
                </v-btn>
                <v-btn @click="changeView('grid')" size="small" :disabled="view.grid">
                  <v-icon icon="fas fa-grip"></v-icon>
                </v-btn>
              </v-btn-group>
            </v-col>
          </v-row>
          <div v-if="view.grid">
            <v-row class="mb-6 mt-0 pt-0">
              <v-col cols="6" class="v-col-lg-4 v-col-md-4 v-col-sm-6 v-col-xs-12 " v-for="moment in paginatedMoments"
                     :key="moment.id">
                <v-card
                  class="mx-auto fill-height"
                  variant="outlined"
                >
                  <v-card-item>
                    <div>
                      <div class="font-weight-bold mb-0 text-truncate">
                        {{ moment.PlayerFirstName }} {{ moment.PlayerLastName }}
                      </div>
                      <p class="text-truncate text-sm-caption">{{ moment.MatchHighlightedTeam }}</p>
                      <v-avatar size="80" class="aborder ma-1">
                        <v-img
                          class="moment-stretch"
                          v-bind:src="`https://laligagolazos.com/cdn-cgi/image/width=110,height=110,quality=100/https://assets.laligagolazos.com/editions/${moment.PlayDataID}/play_${moment.PlayDataID}__capture_Hero_Black_2880_2880_default.png`"></v-img>
                      </v-avatar>
                      <div class="text-caption">{{ moment.description }}</div>
                      <div class="text-overline mb-0">
                        <v-chip size="x-small" class="laligachip mr-1" :class="moment.PlayType">{{
                            moment.PlayType
                          }}
                        </v-chip>
                        <v-chip size="x-small" class="laligachip ml-1" :class="moment.editionTier">{{
                            moment.editionTier
                          }}
                        </v-chip>
                        <div v-if="filterPosition || stake" class="text-center mx-auto">
                          <div
                            v-if="momentsInPlay.includes(moment.PlayDataID+'-'+moment.serialNumber) || momentsStaked.includes(moment.PlayDataID+'-'+moment.serialNumber)"
                            class="text-center">
                            <v-btn color="red" variant="outlined" @click="removePlayer(moment)" size="small">
                              <span v-if="stake">Un-stake</span><span v-else>Remove</span>
                            </v-btn>
                          </div>
                          <div v-else>
                            <v-btn color="green" variant="outlined" @click="selectPlayer(moment)" size="small">
                              <span v-if="stake">Remove</span><span v-else>Select</span>
                            </v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
            <v-pagination
              class="mb-12"
              v-model="page"
              :length="Math.ceil(pages.length/perPage)"
            ></v-pagination>
          </div>
          <VDataTable v-if="view.list"
                      :headers="headers"
                      :items="filteredMoments"
                      item-value="name"
                      class="elevation-1 ma-0 pa-0 mb-4 pb-4"
                      hide-default-footer
                      density="compact"
                      :loading="tabelLoading"
          >
            <template v-slot:item.PlayerFirstName="{ item }">
              <div v-if="filterPosition || stake">
                <p class="text-left mt-1 text-truncate">
                  {{ item.selectable.PlayerFirstName }} {{ item.selectable.PlayerLastName }}
                </p>
                <div v-if="momentsInPlay.includes(item.selectable.PlayDataID+'-'+item.selectable.serialNumber) ||
                momentsStaked.includes(item.selectable.PlayDataID+'-'+item.selectable.serialNumber)"
                     class="text-left mb-2 mt-1">
                  <v-btn size="x-small" color="red" variant="outlined" @click="removePlayer(item.selectable)">
                    <span v-if="stake">Un-stake</span><span v-else>Remove</span>
                  </v-btn>
                </div>
                <div v-else class="text-left mb-2 mt-1">
                  <v-btn size="x-small" color="green" variant="outlined" @click="selectPlayer(item.selectable)">
                    <span v-if="stake">Stake</span><span v-else>Select</span>
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <h3 class="text-left mt-2 text-truncate text-lg-body-2">
                  {{ item.selectable.PlayerFirstName }} {{ item.selectable.PlayerLastName }}
                </h3>
              </div>

            </template>
            <template v-slot:item.MatchHighlightedTeam="{ item }">
              <p class="text-left mt-0 pt-0 text-truncate">
                {{ item.selectable.MatchHighlightedTeam }}
              </p>
              <v-chip size="x-small" class="laligachip text-left float-left mt-1" :class="item.selectable.editionTier">
                {{ item.selectable.editionTier }}
              </v-chip>
            </template>
            <template v-slot:item.PlayerPosition="{ item }">
              <p class="text-left">
                {{ item.selectable.PlayerPosition }}
              </p>
              <v-chip size="x-small" class="laligachip text-left float-left mt-1" :class="item.selectable.PlayType">
                {{ item.selectable.PlayType }}
              </v-chip>
            </template>
          </VDataTable>
        </div>
      </div>
    </v-responsive>
  </v-container>
</template>

<script>
import * as fcl from '@onflow/fcl'
import {t} from '@onflow/fcl'
import SelectionSlider from "@/components/SelectionSlider.vue";
import {useUserStore} from "@/store/app";
import {VDataTable} from 'vuetify/labs/VDataTable'
import db from "@/firebase/init";
import firebase from 'firebase/app';
import 'firebase/firestore';
import LaLigaMoments from '@/cadence/LaLigaMoments.cdc?raw'
import LaLigaMetaView from '@/cadence/LaLigaMetaView.cdc?raw'
import UfcStrikeMoments from '@/cadence/UfcStrikeMoments.cdc?raw'

fcl.config({
  'discovery.wallet': 'https://accounts.meetdapper.com/fcl/authn-restricted',
  'discovery.wallet.method': 'POP/RPC',
  'accessNode.api': 'https://access-mainnet-beta.onflow.org',
})
export default {
  components: {SelectionSlider, VDataTable},
  props: {
    user: Object,
    forceSport: String,
    position: String,
    subPosition: String,
    game: Object,
    stake: Boolean,
  },
  data() {
    return {
      page: 1,
      perPage: 12,
      momentsLaLiga: [],
      momentsLaLigaRaw: [],
      momentsStrike: [],
      loading: false,
      sport: '',
      search: '',
      width: 800,
      itemsPerPage: 5,
      headers: [
        {
          title: 'Name',
          align: 'start',
          key: 'PlayerFirstName',
        },
        {title: 'Team', align: 'start', key: 'MatchHighlightedTeam'},
        {title: 'Position', align: 'start', key: 'PlayerPosition'},

      ],
      view: {
        list: false,
        grid: true
      },
      forcePositionFilter: false,
      filterPosition: '',
      selectedPlayer: {},
      momentsInPlay: [],
      momentsStaked: [],
      tabelLoading: true,
      stakedView: false,
      stakedMomentsPicked: [],
    }
  },
  mounted() {
    this.width = window.innerWidth
    if (this.width > 800) {
      this.width = 800
    }
    if (this.forceSport) {
      this.whichSport(this.forceSport)
    } else if (useUserStore().profile?.lastSport) {
      this.whichSport(useUserStore().profile.lastSport)
    }

    if (this.stake) {
      this.view.list = true
      this.view.grid = false
      this.forcePositionFilter = false
      this.getMomentsStaked()
    }
    if (this.position) {
      this.view.list = true
      this.view.grid = false
      this.filterPosition = this.position
      this.forcePositionFilter = true
      this.getMomentsInPlay()
    }

  },
  computed: {
    paginatedMoments() {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    },
    pages() {
      return this.filteredMoments
    },
    filteredMoments() {
      if (this.stakedView) {
        return this.stakedMomentsPicked
      } else if (this.momentsLaLiga) {
        return this.momentsLaLiga.filter((moment) => {
          moment['momentId'] = moment.PlayDataID + '-' + moment.serialNumber
          return moment.PlayerFirstName.toLowerCase().includes(this.search.toLowerCase()) ||
            moment.PlayerLastName.toLowerCase().includes(this.search.toLowerCase()) ||
            moment.MatchHighlightedTeam.toLowerCase().includes(this.search.toLowerCase()) ||
            moment.PlayType.toLowerCase().includes(this.search.toLowerCase()) ||
            moment.editionTier.toLowerCase().includes(this.search.toLowerCase()) ||
            moment.PlayerPosition.toLowerCase().includes(this.search.toLowerCase())
        }).filter((moment) => {
          if (this.forcePositionFilter) {
            return moment.PlayerPosition === this.filterPosition
          } else {
            return true
          }
        })
      } else {
        return this.momentsLaLigaRaw
      }
    }
  },
  methods: {
    whichSport(sport) {
      this.momentsLaLigaRaw = []
      this.momentsLaLiga = []
      this.stakedView = false
      this.sport = sport
      if (this.user.profile.dapperAddress) {
        if (sport === 'LaLiga') {
          this.getOwnedMoments()
        } else if (sport === 'UFC') {
          this.queryMomentsUFC()
        } else if (sport === 'NBA') {
          this.queryMomentsNBA()
        } else if (sport === 'NFL') {
          this.queryMomentsNBA()
        }
      }
    },
    async showLocked() {
      this.momentsLaLigaRaw = []
      this.momentsLaLiga = []
      this.stakedMomentsPicked = []
      this.stakedView = true
      console.log('show staked moments', this.stakedView)
      await db.collection('momentsInPlayLaLiga')
        .where('owner', '==', useUserStore().user.uid)
        .where('staked', '==', true)
        .get()
        .then(async (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let moment = doc.data()
            moment.id = doc.id
            this.stakedMomentsPicked.push(moment.detail)
          })
        })
    },
    async queryMomentsUFC() {
      this.loading = true
      // get owned NFT metadata
      const idsResponse = await fcl.send([
        fcl.script`${UfcStrikeMoments}`,
        fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address)]),
      ])
      this.momentsStrike = await fcl.decode(idsResponse)
      this.loading = false


    },
    getOwnedMoments() {
      this.tabelLoading = true
      this.loading = true
      db.collection('momentsLaLiga')
        .doc(useUserStore().user.uid)
        .get()
        .then(doc => {
          this.momentsLaLiga = doc.data()?.moments
          this.tabelLoading = false
          this.loading = false
          this.queryMomentsLaLiga()
        })
    },
    async queryMomentsLaLiga() {
      // get owned NFT metadata
      const idsResponse = await fcl.send([
        fcl.script`${LaLigaMoments}`,
        fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address)]),
      ])
      let moments = await fcl.decode(idsResponse)
      for (const moment of moments) {
        const metaViewResponse = await fcl.send([
          fcl.script`${LaLigaMetaView}`,
          fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address), fcl.arg(moment, t.UInt64)]),
        ])
        let metaView = await fcl.decode(metaViewResponse)
        let momentObj = []
        let traitList = {}
        metaView.traits.forEach((elem, i) => {
          metaView.traits[`key${i}`] = elem
          traitList[metaView.traits[`key${i}`].name] = metaView.traits[`key${i}`].value
        })
        momentObj.push(traitList)
        this.momentsLaLigaRaw.push(traitList)
      }

      await db.collection('momentsLaLiga')
        .doc(useUserStore().user.uid)
        .set({
          moments: this.momentsLaLigaRaw,
          lastModified: firebase.firestore.FieldValue.serverTimestamp(),
        }, {merge: true})
    },
    changeView(view) {
      if (view == 'list') {
        this.view.grid = false
        this.view.list = true
      } else {
        this.view.grid = true
        this.view.list = false
      }
    },
    async selectPlayer(item) {
      if (!this.stake) {
        this.$emit('closeMoment')
      }
      this.selectedPlayer = item
      await this.removePreviousMomentInPlay(this.stake).then(() => {
        this.saveMomentInPlay(item, true, this.stake)
      })
    },
    async removePlayer(item) {
      this.selectedPlayer = item
      await this.saveMomentInPlay(item, false, this.stake).then(() => {
        this.getMomentsInPlay()
      })
    },
    getMomentsInPlay() {
      db.collection('momentsInPlayLaLiga')
        .where('owner', '==', useUserStore().user.uid)
        .where('inPlay', '==', true)
        .where('lastFixture', '==', this.game.fixtureId)
        .onSnapshot((querySnapshot) => {
          let momentsInPlay = []
          querySnapshot.forEach((doc) => {
            momentsInPlay.push(doc.id)
          })
          this.momentsInPlay = momentsInPlay
        })
    },
    getMomentsStaked() {
      db.collection('momentsInPlayLaLiga')
        .where('owner', '==', useUserStore().user.uid)
        .where('staked', '==', true)
        .where('lastFixture', '==', this.game.fixtureId)
        .onSnapshot((querySnapshot) => {
          let momentsStaked = []
          querySnapshot.forEach((doc) => {
            momentsStaked.push(doc.id)
          })
          this.momentsStaked = momentsStaked
        })
    },
    async removePreviousMomentInPlay(staked) {
      if (useUserStore().user.uid) {
        let fields = {}
        if (staked) {
          fields = {
            staked: false,
            inPlayLastModified: firebase.firestore.FieldValue.serverTimestamp(),
            lastFixture: this.game.fixtureId,
          }
          await db.collection('momentsInPlayLaLiga')
            .where('owner', '==', useUserStore().user.uid)
            .where('staked', '==', true)
            .where('lastFixture', '==', this.game.fixtureId)
            .get()
            .then(querySnapshot => {
              if (querySnapshot.size) {
                querySnapshot.forEach(async doc => {
                  await db.collection('momentsInPlayLaLiga')
                    .doc(doc.id)
                    .set(fields, {merge: true})
                })
              }
            })
        } else {
          fields = {
            inPlay: false,
            inPlayLastModified: firebase.firestore.FieldValue.serverTimestamp(),
            lastFixture: this.game.fixtureId,
            subPosition: this.subPosition,
          }
          await db.collection('momentsInPlayLaLiga')
            .where('owner', '==', useUserStore().user.uid)
            .where('inPlay', '==', true)
            .where('lastFixture', '==', this.game.fixtureId)
            .where('subPosition', '==', this.subPosition)
            .get()
            .then(querySnapshot => {
              if (querySnapshot.size) {
                querySnapshot.forEach(async doc => {
                  await db.collection('momentsInPlayLaLiga')
                    .doc(doc.id)
                    .set(fields, {merge: true})
                })
              }
            })
        }

      }
    },
    async saveMomentInPlay(item, inPlay, stakeMoment) {
      if (useUserStore().user.uid) {
        let fields = {
          inPlay: inPlay,
          staked: stakeMoment,
          inPlayLastModified: firebase.firestore.FieldValue.serverTimestamp(),
          lastFixture: this.game.fixtureId,
          subPosition: this.subPosition || '',
          id: item.PlayDataID,
          serial: item.serialNumber,
          detail: item,
          owner: useUserStore().user.uid
        }
        let momentId = item.PlayDataID + '-' + item.serialNumber
        await db.collection('momentsInPlayLaLiga')
          .doc(momentId)
          .set(fields, {merge: true}).then(() => {
            if (this.stake) {
              this.$emit('closeMoment')
            }
          })
      }
    },
    dapperAccount() {
      this.$emit('showDapperView')
    },
  },
}
</script>

<style>

.moment-wrapper {
  margin: auto;
  width: 92%;
}

.moment-stretch img {
  object-fit: none !important;
}

.aborder {
  border: 2px solid #d1d1d1ab;
  border-radius: 66px;
}

.laligachip.LEGENDARY {
  background: linear-gradient(95.26deg, rgb(255, 231, 209) 0%, rgb(0, 255, 255) 45.83%, rgb(90, 127, 255) 100%);
  color: #000;
}

.laligachip.FANDOM {
  background: linear-gradient(95.26deg, rgb(173, 248, 90) 0%, rgb(253, 237, 69) 100%);
  color: #000;
}

.laligachip.UNCOMMON {
  background: linear-gradient(94.05deg, rgb(235, 242, 252) 1.53%, rgb(169, 185, 203) 100%);
  color: #000;
}

.laligachip.RARE {
  background: linear-gradient(84.74deg, rgb(255, 234, 181) 0%, rgb(223, 168, 33) 100%);
  color: #000;
}

.laligachip.SAVE {
  border: 1px solid red;
}

.laligachip.ASSIST {
  border: 1px solid #0da3da;
}

.laligachip.GOAL {
  border: 1px solid #1e8c41;
}

.laligachip.HATTRICK {
  border: 1px solid #0dda4e;
}

.laligachip.SKILL {
  border: 1px solid #7842b9;
}

.laligachip.DEFENSIVE {
  border: 1px solid #ff9900;
}

.laligachip.HIGHLIGHT {
  border: 1px solid #b700ff;
}

.laligachip.POKER {
  border: 1px solid #ffd47b;
}

.moments .v-data-table {
  width: 100%;
  font-size: 12px;
  margin: -13px !important;
}

.moments .v-data-table .v-field__input {
  font-size: 12px;
}

.moments .v-data-table-footer__items-per-page {
  display: none;
}

.moments td.v-data-table__td.v-data-table-column--align-start {
  max-width: 120px;
  margin: 0 !important;
  padding: 0 6px !important;
}

@media only screen and (min-width: 600px) {
  .moments td.v-data-table__td.v-data-table-column--align-start {
    max-width: 120px;
    margin: 10 !important;
    padding: 10px 20px !important;
  }
}
</style>

