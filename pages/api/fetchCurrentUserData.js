import { client } from '../../lib/sanity'

/* Grab from sanity the current active account */
const getUserInfo = async (req, res) => {
  try {
    const query = `
      *[_type == "users" && _id == "${req.query.activeAccount}"]{
          name,
          walletAddress,
          "imageUrl": profileImage.asset->url
        }
    `
    /* Store query result */
    const sanityResponse = await client.fetch(query)

    res.status(200).send({ message: 'success', data: sanityResponse[0] })
  } catch (error) {
    res.status(500).send({ message: 'error', data: error.message })
  }
}

export default getUserInfo