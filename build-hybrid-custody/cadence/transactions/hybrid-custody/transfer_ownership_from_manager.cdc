#allowAccountLinking

import "HybridCustody"

transaction(ownedAddress: Address, owner: Address) {
    prepare(acct: AuthAccount) {
        let manager = acct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("manager not found")
        manager.giveOwnership(addr: ownedAddress, to: owner)
    }
}