import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'
import { useEffect, useState } from 'react'
import { Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Link from '../../components/Link'
import siteMetadata from '@/data/siteMetadata'

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

  const [shouldDisplayPorn, setShouldDisplayPorn] = useState(undefined)

  const renderWarningContent = () => {
    return (
      <div className="porn-container">
        <div className="porn-warning-container">
          <p className="warning">请注意</p>
          <p>以下内容可能涉及成人内容</p>
          <p>请不要在工作时间或者是公共场合观看以下内容</p>
          <p>未满18岁的未成年人请在成人的陪同下观看</p>

          <div className="btn-container">
            <span
              className="porn-confirm-btn"
              onClick={() => {
                localStorage.setItem('porn-display', new Date().getTime())
                setShouldDisplayPorn(true)
              }}
            >
              继续
            </span>
            <Link href="/" aria-label={siteMetadata.headerTitle} className="porn-confirm-btn">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    let timestamp = localStorage.getItem('porn-display') || 0
    if (new Date().getTime() - parseInt(timestamp) <= 7 * 24 * 60 * 60 * 1000) {
      setShouldDisplayPorn(true)
    } else {
      localStorage.removeItem('porn-display')
      setShouldDisplayPorn(false)
    }
  }, [])

  return (
    <>
      {frontMatter.draft !== true ? (
        shouldDisplayPorn === true ? (
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
          renderWarningContent()
        )
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
