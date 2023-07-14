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
