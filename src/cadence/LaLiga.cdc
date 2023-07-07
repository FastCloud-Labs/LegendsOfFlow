import NonFungibleToken from 0xNONFUNGIBLETOKENADDRESS
import Golazos from 0xGOLAZOSADDRESS

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Golazos.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs()
}