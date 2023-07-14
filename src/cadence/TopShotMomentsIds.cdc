import TopShot from 0x0b2a3299cc857e29
pub fun main(account: Address): [UInt64] {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/MomentCollection)
                            .borrow<&{TopShot.MomentCollectionPublic}>()!

    return collectionRef.getIDs()
}