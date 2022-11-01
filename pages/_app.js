import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/gallery.css'
import 'katex/dist/katex.css'
import 'react-photo-view/dist/react-photo-view.css'

import '@fontsource/inter/variable-full.css'
import 'antd/lib/timeline/style/index.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'

import ReactCanvasNest from '@/lib/reactCanvasNest'

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
      <ReactCanvasNest
        className="canvasNest"
        config={{
          pointColor: ' 255, 255, 255 ',
          count: 100 * 3,
          pointOpacity: 0.2,
        }}
        style={{ zIndex: -1, opacity: 0.2 }}
      />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}
