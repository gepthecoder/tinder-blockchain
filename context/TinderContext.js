import { useState, createContext, useEffect } from 'react'
import { faker } from '@faker-js/faker'
import { useMoralis } from 'react-moralis'

export const TinderContext = createContext()

export const TinderProvider = ({children}) => {
   
    /* each user that we are able to swipe through labeled as a card  */
    const [cardsData, setCardsData] = useState([])
    const [currentAccount, setCurrentAccount] = useState()
    const [currentUser, setCurrentUser] = useState()

    const { authenticate, isAuthenticated, user, Moralis } = useMoralis()

    useEffect((
    ) => {
        checkWalletConnection()
        if (isAuthenticated) {
            /* Grab all the users we can swipe left/right except us */
            requestUsersData(user.get('ethAddress'))
            /* Grab me and nobody else -> for separation */
            requestCurrentUserData(user.get('ethAddress'))
          }
    }, [isAuthenticated])

    /* Moralis knows in the background if we are connected or not .. :o */
    const checkWalletConnection = async () => {
        if (isAuthenticated) {
          const address = user.get('ethAddress')
          setCurrentAccount(address)
          requestToCreateUserProfile(address, faker.name.findName())
        } else {
        /* There shouldn't be an account if the user is not created */
          setCurrentAccount('')
        }
    }

    const connectWallet = async () => {
        if (!isAuthenticated) {
          try {
            await authenticate({
              signingMessage: 'Log in using Moralis',
            })
          } catch (error) {
            console.error(error)
          }
        }
    }

    const disconnectWallet = async () => {
        await Moralis.User.logOut()
        setCurrentAccount('')
    }

    /* Whatever we put in the value of provider we can use this function anywhere in our app */
    return (
        <TinderContext.Provider
            value={{
                connectWallet,
                disconnectWallet,
                currentAccount,
                currentUser,
            }}
        >
        {children}
      </TinderContext.Provider>
    )
  }
