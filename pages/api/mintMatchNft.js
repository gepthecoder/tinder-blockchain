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
}
  
export default mintMatchNft