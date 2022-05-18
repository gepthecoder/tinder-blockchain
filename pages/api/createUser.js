import { client } from '../../lib/sanity'

const createUserOnSanity = async (req, res) => {
  try {
    const userDoc = {
      _type: 'users',
      _id: req.body.userWalletAddress,
      name: req.body.name,
      walletAddress: req.body.userWalletAddress,
    }

    /* Create a sanity user, if the user not exists create a new one */
    await client.createIfNotExists(userDoc)

    res.status(200).send({ message: 'success' })
  } catch (error) {
    res.status(500).send({ message: 'error', data: error.message })
  }
}

export default createUserOnSanity