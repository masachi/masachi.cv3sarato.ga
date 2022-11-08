import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import EverydayListLayout from '@/layouts/EverydayListLayout'
import { PageSEO } from '@/components/SEO'
import { useEffect, useState } from 'react'
import { Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Link from '../components/Link'

export const EVERYDAYS_PER_PAGE = 5

export async function getStaticProps() {
  const everydays = await getAllFilesFrontMatter('everyday')
  const initialDisplayEverydays = everydays.slice(0, EVERYDAYS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(everydays.length / EVERYDAYS_PER_PAGE),
  }

  return { props: { initialDisplayEverydays, everydays, pagination } }
}

export default function Everyday({ everydays, initialDisplayEverydays, pagination }) {
  const [shouldDisplayPorn, setShouldDisplayPorn] = useState(undefined)

  const renderWarningContent = () => {
    return (
      <div className="porn-container">
        <div className="porn-warning-container">
          <p className="warning">FBI Warning</p>
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
      <PageSEO title={`每日一冲 - ${siteMetadata.author}`} description={siteMetadata.description} />
      {shouldDisplayPorn == undefined ? (
        <div className="loading-container">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : shouldDisplayPorn === true ? (
        <EverydayListLayout
          posts={everydays}
          initialDisplayPosts={initialDisplayEverydays}
          pagination={pagination}
          title="每日一冲"
        />
      ) : (
        renderWarningContent()
      )}
    </>
  )
}
