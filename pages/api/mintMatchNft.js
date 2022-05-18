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
}
  
export default mintMatchNft