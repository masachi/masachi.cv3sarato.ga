import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getFileBySlug } from '@/lib/mdx'

const DEFAULT_LAYOUT = 'PostSimple'

export async function getStaticProps() {
  const NingenShikkaku = await getFileBySlug('NingenShikkaku', ['default'])
  return { props: { NingenShikkaku } }
}

export default function NingenShikkaku({ NingenShikkaku }) {
  const { mdxSource, frontMatter } = NingenShikkaku

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
