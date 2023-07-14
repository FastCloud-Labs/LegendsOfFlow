import NonFungibleToken from 0x1d7e57aa55817448
import AllDay from 0x1d7e57aa55817448

pub fun main(address: Address, id: UInt64): [AnyStruct] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(AllDay.CollectionPublicPath)
        .borrow<&{AllDay.MomentNFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let nft = collectionRef.borrowMomentNFT(id: id)
        ?? panic("Couldn't borrow momentNFT")

    return [nft.id, nft.editionID, nft.serialNumber, nft.mintingDate]
}