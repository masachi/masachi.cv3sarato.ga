import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/masonry.css'
import 'katex/dist/katex.css'
import 'react-photo-view/dist/react-photo-view.css'

import '@fontsource/inter/variable-full.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'

import dynamic from 'next/dynamic'
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), {
  ssr: false,
})

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
      <MusicPlayer />
    </ThemeProvider>
  )
}
