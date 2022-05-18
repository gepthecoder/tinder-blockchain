import '../styles/globals.css'
import { TinderProvider } from '../context/TinderContext'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl='https://6sutfewfo80o.usemoralis.com:2053/server'
      appId='aJumtntxtUb2XoPtK8OG3uMjS3QbGZhZ1xxgnI08'
    >
       <TinderProvider>
          <Component {...pageProps} />
      </TinderProvider>
    </MoralisProvider>
  )
}

export default MyApp
