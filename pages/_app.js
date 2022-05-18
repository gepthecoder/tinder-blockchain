import '../styles/globals.css'
import { TinderProvider } from '../context/TinderContext'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider>
       <TinderProvider>
          <Component {...pageProps} />
      </TinderProvider>
    </MoralisProvider>
  )
}

export default MyApp
