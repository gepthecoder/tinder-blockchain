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

    return (
        <TinderContext.Provider
            value={{}}
        >
        {children}
      </TinderContext.Provider>
    )
  }
