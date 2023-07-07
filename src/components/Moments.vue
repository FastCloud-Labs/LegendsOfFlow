<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      Moments
      {{ user.profile.dapperAddress }}
    </v-responsive>
  </v-container>
</template>

<script>
import * as fcl from '@onflow/fcl'
import {t} from "@onflow/fcl";

fcl.config({
  'discovery.wallet': 'https://accounts.meetdapper.com/fcl/authn-restricted',
  'discovery.wallet.method': 'POP/RPC',
  'accessNode.api': 'https://access-mainnet-beta.onflow.org',
})
export default {
  props: {
    user: Object
  },
  data() {
    return {
      momentsLaLiga: []
    }
  },
  mounted() {
    this.queryMomentsUFC()
    this.queryMomentsLaLiga()
  },
  methods: {
    async queryMomentsUFC() {

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
      let moments = await fcl.decode(idsResponse)
      console.log(moments)
    },
    async queryMomentsLaLiga() {
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
        console.log(moment)
        const metaViewResponse = await fcl.send([
          fcl.script`
          import Golazos from 0x87ca73a41bb50ad5
import MetadataViews from 0x1d7e57aa55817448

pub fun main(address: Address, id: UInt64):  MetadataViews.Display {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Golazos.CollectionPublicPath)
            .borrow<&{Golazos.MomentNFTCollectionPublic}>()
            ?? panic("Could not borrow capability from public collection")

    let nft = collectionRef.borrowMomentNFT(id: id)
            ?? panic("Couldn't borrow momentNFT")

    return nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
}
        `,
          fcl.args([fcl.arg(this.user.profile.dapperAddress, t.Address), fcl.arg(moment, t.UInt64)]),
        ])
        let metaView = await fcl.decode(metaViewResponse)
        console.log(metaView)
      }
    }
  }
}
</script>
