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
