import { useState, createContext, useEffect } from 'react'
import { faker } from '@faker-js/faker'

export const TinderContext = createContext()

export const TinderProvider = ({children}) => {
   
    [/* each user that we are able to swipe through labeled as a card  */]
    const [cardsData, setCardsData] = useState([])
    const [currentAccount, setCurrentAccount] = useState()
    const [currentUser, setCurrentUser] = useState()


    return (
        <TinderContext.Provider
            value={{}}
        >
        {children}
      </TinderContext.Provider>
    )
  }
