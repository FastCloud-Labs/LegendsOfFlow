import NonFungibleToken from 0x1d7e57aa55817448
import Golazos from 0x87ca73a41bb50ad5

pub fun main(address: Address): [UInt64] {
        let account = getAccount(address)

        let collectionRef = account.getCapability(Golazos.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow capability from public collection")

        return collectionRef.getIDs()
    }