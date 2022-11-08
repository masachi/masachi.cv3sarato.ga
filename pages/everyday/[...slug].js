import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'

const DEFAULT_LAYOUT = 'EverydayPostLayout'

export async function getStaticPaths() {
  const everydays = getFiles('everyday')
  return {
    paths: everydays.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allEverydays = await getAllFilesFrontMatter('everyday')
  const everydayIndex = allEverydays.findIndex(
    (everyday) => formatSlug(everyday.slug) === params.slug.join('/')
  )
  const prev = allEverydays[everydayIndex + 1] || null
  const next = allEverydays[everydayIndex - 1] || null
  const everyday = await getFileBySlug('everyday', params.slug.join('/'))
  const authorList = everyday.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // rss
  // if (allPosts.length > 0) {
  //   const rss = generateRss(allPosts)
  //   fs.writeFileSync('./public/feed.xml', rss)
  // }

  return { props: { everyday, authorDetails, prev, next } }
}

export default function Blog({ everyday, authorDetails, prev, next }) {
  const { mdxSource, toc, frontMatter } = everyday

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            施工中{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
