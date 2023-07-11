<template>
  <v-container class="fill-height moments">
    <v-responsive class="align-top text-center fill-height" :width="width">
      <h2><span v-if="filterPosition" class="mb-2 mt-0 pt-0">{{ filterPosition }}</span> Moments</h2>
      <SelectionSlider v-if="!forceSport" :blocked="true" @showSport="whichSport"></SelectionSlider>
      <v-progress-circular v-if="loading" indeterminate
                           color="success"></v-progress-circular>
      <h4 v-if="!sport" class="text-green">Choose a sport
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
              <v-btn-group class="float-right mt-3">
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
                      :items="paginatedMoments"
                      item-value="name"
                      class="elevation-1 ma-0 pa-0 mb-4 pb-4"
                      hide-default-footer
          >
            <template v-slot:item.PlayerFirstName="{ item }">
              <p class="text-left mt-2 text-truncate">
                {{ item.selectable.PlayerJerseyName }}
              </p>
              <div v-if="momentsInPlay.includes(item.selectable.PlayDataID+'-'+item.selectable.serialNumber)"
                   class="text-left mb-2 mt-1">
                <v-btn size="x-small" color="red" variant="outlined" @click="removePlayer(item)">Remove</v-btn>
              </div>
              <div v-else class="text-left mb-2 mt-1">
                <v-btn size="x-small" color="green" variant="outlined" @click="selectPlayer(item)">Select</v-btn>
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
    game: Object
  },
  data() {
    return {
      page: 1,
      perPage: 12,
      momentsLaLiga: [],
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
    if (this.position) {
      this.view.list = true
      this.view.grid = false
      this.filterPosition = this.position
      this.forcePositionFilter = true
    }
    this.getMomentsInPlay()

  },
  computed: {
    paginatedMoments() {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    },
    pages() {
      return this.filteredMoments
    },
    filteredMoments() {
      return this.momentsLaLiga.filter((moment) => {
        return moment.PlayerFirstName.toLowerCase().includes(this.search.toLowerCase()) ||
          moment.PlayerLastName.toLowerCase().includes(this.search.toLowerCase()) ||
          moment.MatchHighlightedTeam.toLowerCase().includes(this.search.toLowerCase()) ||
          moment.PlayType.toLowerCase().includes(this.search.toLowerCase()) ||
          moment.editionTier.toLowerCase().includes(this.search.toLowerCase()) ||
          moment.PlayerPosition.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
  ,
  methods: {
    whichSport(sport) {
      this.sport = sport
      if (sport === 'LaLiga') {
        this.queryMomentsLaLiga()
      } else if (sport === 'UFC') {
        this.queryMomentsUFC()
      } else if (sport === 'NBA') {
        this.queryMomentsNBA()
      } else if (sport === 'NFL') {
        this.queryMomentsNBA()
      }
    },
    async queryMomentsUFC() {
      this.loading = true
      // get owned NFT metadata
      const idsResponse = await fcl.send([
        fcl.script`
          import UFC_NFT from 0x329feb3ab062d289
          pub struct MetadataCollections {

            pub let items: {String : MetadataCollectionItem}
            pub let collections: {String : [String]}

            init(items: {String : MetadataCollectionItem}, collections: {String : [String]}) {
              self.items=items
              self.collections=collections
              }
          }

          pub struct MetadataCollection{
            pub let type: String
            pub let items: [MetadataCollectionItem]

            init(type:String, items: [MetadataCollectionItem]) {
                self.type=type
                self.items=items
                }
          }

          pub struct MetadataCollectionItem {
            pub let id:UInt64
            pub let name: String
            pub let image: String
            pub let url: String
            pub let listPrice: UFix64?
            pub let listToken: String?
            pub let mintQty: UInt32
            pub let setId: UInt32
            pub let seriesId: UInt32
            pub let metadata: {String: String}


            init(id:UInt64, name:String, image:String, url:String, listPrice: UFix64?, listToken:String?,  mintQty: UInt32, setId: UInt32, seriesId: UInt32, metadata: {String: String}) {
              self.id=id
              self.name=name
              self.url=url
              self.image=image
              self.listToken=listToken
              self.listPrice=listPrice
              self.mintQty=mintQty
              self.setId=setId
              self.seriesId=seriesId
              self.metadata=metadata
              }
            }

          pub fun main(account: Address): MetadataCollections? {
            let resultMap : {String : MetadataCollectionItem} = {}
            let results : {String :  [String]}={}
            let acct = getAccount(account)
            let collectionRef = acct.getCapability<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic}>(UFC_NFT.CollectionPublicPath)
            let collection = collectionRef.borrow()!
            let items: [String] = []
            for id in collection.getIDs() {
                  let nft = collection.borrowUFC_NFT(id: id)!
                  let metadata = UFC_NFT.getSetMetadata(setId: nft.setId)!
                  let seriesId = UFC_NFT.getSetSeriesId(setId: nft.setId)!
                  let image = metadata["image"]!
                  let data = UFC_NFT.getSetMaxEditions(setId: nft.setId)!
                  let contentType="video"
                  let item = MetadataCollectionItem(
                      id: id,
                      name: metadata["name"]!,
                      image: image,
                      url: "https://www.ufcstrike.com",
                      listPrice: nil,
                      listToken: nil,
                      mintQty: UFC_NFT.getSetMaxEditions(setId: nft.setId)!,
                      setId: nft.setId,
                      seriesId: seriesId,
                      metadata: metadata
                      )

                  let itemId="UFC".concat(id.toString())
                  items.append(itemId)
                  resultMap[itemId] = item
            }

            if items.length != 0 {
              results["UFC"] = items
            }
            return MetadataCollections(items: resultMap, collections:results)
          }
        `,
        fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address)]),
      ])
      this.momentsStrike = await fcl.decode(idsResponse)
      this.loading = false


    },
    async queryMomentsLaLiga() {
      this.loading = true
      // get owned NFT metadata
      const idsResponse = await fcl.send([
        fcl.script`
            import NonFungibleToken from 0x1d7e57aa55817448
            import Golazos from 0x87ca73a41bb50ad5

            pub fun main(address: Address): [UInt64] {
                let account = getAccount(address)

                let collectionRef = account.getCapability(Golazos.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
                    ?? panic("Could not borrow capability from public collection")

                return collectionRef.getIDs()
            }
        `,
        fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address)]),
      ])
      let moments = await fcl.decode(idsResponse)
      for (const moment of moments) {
        const metaViewResponse = await fcl.send([
          fcl.script`
          import Golazos from 0x87ca73a41bb50ad5
          import MetadataViews from 0x1d7e57aa55817448

            pub fun main(address: Address, id: UInt64):  MetadataViews.Traits {
            let account = getAccount(address)

            let collectionRef = account.getCapability(Golazos.CollectionPublicPath)
              .borrow<&{Golazos.MomentNFTCollectionPublic}>()
              ?? panic("Could not borrow capability from public collection")

            let nft = collectionRef.borrowMomentNFT(id: id)
              ?? panic("Couldn't borrow momentNFT")

            return nft.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits
          }
        `,
          fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address), fcl.arg(moment, t.UInt64)]),
        ])
        let metaView = await fcl.decode(metaViewResponse)
        let momentObj = []
        let traitList = {}
        metaView.traits.forEach((elem, i) => {
          metaView.traits[`key${i}`] = elem
          traitList[metaView.traits[`key${i}`].name] = metaView.traits[`key${i}`].value
        })
        if (this.forcePositionFilter) {
          if (traitList['PlayerPosition'] === this.filterPosition) {
            traitList['momentId'] = traitList.PlayDataID + '-' + traitList.serialNumber
            momentObj.push(traitList)
            this.momentsLaLiga.push(traitList)
          }
        } else {
          momentObj.push(traitList)
          this.momentsLaLiga.push(traitList)
        }
        this.loading = false
      }
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
    selectPlayer(item) {
      this.selectedPlayer = item
      this.saveMomentInPlay(item, true)
    },
    removePlayer(item) {
      this.selectedPlayer = item
      this.saveMomentInPlay(item, false)
    },
    getMomentsInPlay() {
      db.collection('momentsInPlayLaLiga')
        .where('owner', '==', useUserStore().user.uid)
        .where('inPlay', '==', true)
        .onSnapshot((querySnapshot) => {
          let momentsInPlay = []
          querySnapshot.forEach((doc) => {
            momentsInPlay.push(doc.id)
          })
          this.momentsInPlay = momentsInPlay
        })
    },
    async saveMomentInPlay(item, inPlay) {
      console.log('momentsInPlayLaLiga', item)
      console.log('game', this.game.fixtureId)
      console.log('subPosition', this.subPosition)
      if (useUserStore().user.uid) {
        console.log(useUserStore().user.uid)
        let fields = {
          inPlay: inPlay,
          inPlayLastModified: firebase.firestore.FieldValue.serverTimestamp(),
          lastFixture: this.game.fixtureId,
          subPosition: this.subPosition,
          id: item.selectable.PlayDataID,
          serial: item.selectable.serialNumber,
          detail: item.selectable,
          owner: useUserStore().user.uid
        }
        let momentId = item.selectable.PlayDataID + '-' + item.selectable.serialNumber
        await db.collection('momentsInPlayLaLiga')
          .doc(momentId)
          .set(fields, {merge: true}).then(() => {
            console.log('Document successfully written!')
            this.$emit('closeMoment')
          })
      }
    }
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

