import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import EverydayListLayout from '@/layouts/EverydayListLayout'
import { EVERYDAYS_PER_PAGE } from '../../everyday'

export async function getStaticPaths() {
  const totalEverydays = await getAllFilesFrontMatter('everyday')
  const totalPages = Math.ceil(totalEverydays.length / EVERYDAYS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const {
    params: { page },
  } = context
  const everydays = await getAllFilesFrontMatter('everyday')
  const pageNumber = parseInt(page)
  const initialDisplayEverydays = everydays.slice(
    EVERYDAYS_PER_PAGE * (pageNumber - 1),
    EVERYDAYS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(everydays.length / EVERYDAYS_PER_PAGE),
  }

  return {
    props: {
      everydays,
      initialDisplayEverydays,
      pagination,
    },
  }
}

export default function EverydayPage({ everydays, initialDisplayEverydays, pagination }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <EverydayListLayout
        posts={everydays}
        initialDisplayPosts={initialDisplayEverydays}
        pagination={pagination}
        title="每日一冲"
      />
    </>
  )
}
