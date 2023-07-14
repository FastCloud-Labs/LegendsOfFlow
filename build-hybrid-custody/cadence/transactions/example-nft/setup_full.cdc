import "NonFungibleToken"
import "MetadataViews"

import ExampleNFT from "ExampleNFT"

transaction {
    prepare(acct: AuthAccount) {
        let d = ExampleNFT.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData

        if acct.borrow<&ExampleNFT.Collection>(from: d.storagePath) == nil {
            acct.save(<- ExampleNFT.createEmptyCollection(), to: ExampleNFT.CollectionStoragePath)
        }

        acct.unlink(d.publicPath)
        acct.link<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic, NonFungibleToken.CollectionPublic}>(d.publicPath, target: d.storagePath)

        acct.unlink(d.providerPath)
        acct.link<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Provider}>(d.providerPath, target: d.storagePath)
    }
}
