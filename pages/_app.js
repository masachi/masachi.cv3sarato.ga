import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/gallery.css'
import 'katex/dist/katex.css'
import 'react-photo-view/dist/react-photo-view.css'

import '@fontsource/inter/variable-full.css'
import 'antd/lib/timeline/style/index.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { useCallback } from 'react'
import Particles from 'react-particles'
import { loadLinksPreset } from 'tsparticles-preset-links'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

export default function App({ Component, pageProps }) {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine)
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadLinksPreset(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container)
  }, [])

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

      <Particles
        id="tsparticles"
        options={{
          preset: 'links',
          background: {
            color: 'transparent',
          },
          particles: {
            // color: {
            //   value: "#ffffff",
            // },
            links: {
              color: '#000000',
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            collisions: {
              enable: true,
            },
          },
        }}
        init={particlesInit}
      />
    </ThemeProvider>
  )
}
