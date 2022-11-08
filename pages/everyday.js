import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import EverydayListLayout from '@/layouts/EverydayListLayout'
import { PageSEO } from '@/components/SEO'

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
  return (
    <>
      <PageSEO title={`Everyday - ${siteMetadata.author}`} description={siteMetadata.description} />
      <EverydayListLayout
        posts={everydays}
        initialDisplayPosts={initialDisplayEverydays}
        pagination={pagination}
        title="每日一冲"
      />
    </>
  )
}
