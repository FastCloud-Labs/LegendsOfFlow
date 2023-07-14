import TopShot from 0x0b2a3299cc857e29
pub fun main(account: Address, id: UInt64): {String: String} {

    // get the public capability for the owner's moment collection and borrow a reference to it
    let collectionRef = getAccount(account).getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Could not get public moment collection reference")

    // Borrow a reference to the specified moment
    let token = collectionRef.borrowMoment(id: id)
        ?? panic("Could not borrow a reference to the specified moment")

    // Get the moment's metadata to access its play and Set IDs
    let data = token.data

    // Use the moment's play ID to get all the metadata associated with that play
    let metadata = TopShot.getPlayMetaData(playID: data.playID) ?? panic("Play doesn't exist")

    return metadata
}