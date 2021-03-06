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

     /*constantly checking if the wallet is connected*/
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

    const handleRightSwipe = async (cardData, currentUserAddress) => {
        const likeData = {
          likedUser: cardData.walletAddress,
          currentUser: currentUserAddress,
        }
    
        try {
          await fetch('/api/saveLike', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(likeData),
          })
    
          const response = await fetch('/api/checkMatches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(likeData),
          })
    
          const responseData = await response.json()
    
          const matchStatus = responseData.data.isMatch
    
          if (matchStatus) {
            console.log('match')
    
            const mintData = {
              walletAddresses: [cardData.walletAddress, currentUserAddress],
              names: [cardData.name, currentUser.name],
            }
    
            await fetch('/api/mintMatchNft', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(mintData),
            })
          }
        } catch (error) {
          console.error(error)
        }
      }

    /* API Requests */

    const requestToCreateUserProfile = async (walletAddress, name) => {
        try {
          await fetch(`/api/createUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userWalletAddress: walletAddress,
              name: name,
            }),
          })
        } catch (error) {
          console.error(error)
        }
    }

    const requestCurrentUserData = async walletAddress => {
        try {
          const response = await fetch(
            `/api/fetchCurrentUserData?activeAccount=${walletAddress}`,
          )
          const data = await response.json()
    
          setCurrentUser(data.data)
        } catch (error) {
          console.error(error)
        }
    }
    
    const requestUsersData = async activeAccount => {
        try {
          const response = await fetch(
            `/api/fetchUsers?activeAccount=${activeAccount}`,
          )
          const data = await response.json()
    
          setCardsData(data.data)
        } catch (error) {
          console.error(error)
        }
    }


    /* Whatever we put in the value of provider we can use this function anywhere in our app */
    return (
        <TinderContext.Provider
            value={{
                connectWallet,
                disconnectWallet,
                currentAccount,
                currentUser,
                cardsData,
                handleRightSwipe,
            }}
        >
        {children}
      </TinderContext.Provider>
    )
  }
