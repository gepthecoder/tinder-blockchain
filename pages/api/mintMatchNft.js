import Moralis from 'moralis/node'
import { ethers } from 'ethers'
import { TINDER_ADDRESS, TINDER_ABI } from '../../lib/constants'

const mintMatchNft = async (req, res) => {
    /* Connect moralis server to the app */
    await Moralis.start({
        serverUrl: process.env.MORALIS_SERVER_URL,
        appId: process.env.MORALIS_APP_ID,
        masterKey: process.env.MORALIS_MASTER_KEY,
    })

    /* Includes all the data we want to include as a part of an nft  */
    const metadata = {
        name: `${req.body.names[0]} & ${req.body.names[1]}`,
        description: `${req.body.names[0].split(' ')[0]} & ${
          req.body.names[1].split(' ')[0]
        } just matched <3`,
        image: `ipfs://QmY4tKpDGzVHzaSkQc5gzVMCMNoznZqaX15DXkyL2bPp8Z`,
    }

    /* Abbreviation from binary to ASCI:
        -> takes meta data 
        -> to string 
        -> makes buffer for it 
        -> encode to base64 
    */
    const toBtoa = Buffer.from(JSON.stringify(metadata)).toString('base64')
    const metadataFile = new Moralis.File('file.json', { base64: toBtoa })

    await metadataFile.saveIPFS({ useMasterKey: true })

    const metadataURI = metadataFile.ipfs()

    const provider = ethers.getDefaultProvider(process.env.ALCHEMY_API_URL, {
        chainId: 4,
        name: 'rinkeby',
    })

    /*  GASLESS TRANSACTIONS:
        -> anytime the is gas fee its gonna be paid for by the owner of the smart contract address (private key)
    */
    const walletWithProvider = new ethers.Wallet(
        process.env.WALLET_PRIVATE_KEY,
        provider,
    )
    
    const contract = new ethers.Contract(
        TINDER_ADDRESS,
        TINDER_ABI,
        walletWithProvider,
    )

    /* Invoke tinder contract with mint nft function [TinderERC721] */
    const tx = await contract.mintNFT(
        req.body.walletAddresses[0],
        req.body.walletAddresses[1],
        metadataURI,
    )

    const txReceipt = await tx.wait()

    res.status(200).send({
        message: 'success',
        data: { tx: tx, txReceipt: txReceipt },
      })
}
  
export default mintMatchNft