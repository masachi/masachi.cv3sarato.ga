import React, { useRef, useState } from 'react'
import { PageSEO } from '@/components/SEO'
import { PhotoSlider } from 'react-photo-view'
import { Timeline } from 'antd'
import PhotoAlbum from 'react-photo-album'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'

const GIST_TOKEN = process.env.GIST_TOKEN

const octokit = new Octokit({
  auth: GIST_TOKEN,
})

export async function getStaticProps() {
  const gistContent = await getContentByGistId(process.env.GIST_ID, process.env.FILE_NAME)
  const album = []
  const images = []
  Object.keys(gistContent)
    .sort((dateA, dateB) => dayjs(dateB).unix() - dayjs(dateA).unix())
    .forEach((date) => {
      album.push({
        date: date,
        thumbnails: gistContent[date]
          .filter((items) => items.length > 0)
          .map((items) => {
            let item = items[items.length >= 2 ? items.length - 2 : items[0]]
            return {
              ...item,
              url: `${process.env.IMG_DOMAIN}${item.path}`,
              src: `${process.env.IMG_DOMAIN}${item.path}`,
            }
          }),
      })

      images.push(
        gistContent[date]
          .filter((items) => items.length > 0)
          .map((items) => {
            let item = items[items.length - 1]
            return {
              src: `${process.env.IMG_DOMAIN}${item.path}`,
              id: item.id,
            }
          })
      )
    })

  return {
    props: {
      albums: album,
      images: images,
    },
  }
}

const getContentByGistId = async (gist_id, fileName) => {
  const gistGetResponse = await octokit.request(`GET /gists/${gist_id}`)
  if (gistGetResponse.status === 200) {
    return JSON.parse(gistGetResponse.data.files[fileName].content)
  }

  return {}
}

export default function Gallery({ albums, images }) {
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

  const handlePreview = (file) => {
    let previewIndex = images.findIndex((item) => file.id === item.id)
    if (previewIndex > -1) {
      setPreviewModalOpen(true)
      setPreviewIndex(previewIndex)
    }
  }

  return (
    <>
      <PageSEO title={`个人收藏沙雕图`} description={`个人收藏沙雕图`} />

      <div className={'gallery-container'}>
        <Timeline mode={'left'}>
          {albums.map((dateImages) => {
            return (
              <Timeline.Item key={dateImages.date} label={dateImages.date}>
                <PhotoAlbum
                  layout="rows"
                  photos={dateImages.thumbnails}
                  onClick={(event, photo, index) => {
                    handlePreview(photo)
                  }}
                />
              </Timeline.Item>
            )
          })}
        </Timeline>
      </div>

      <PhotoSlider
        images={images.map((item) => ({ src: item.url, key: item.id }))}
        visible={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        index={previewIndex}
        onIndexChange={(index) => setPreviewIndex(index)}
        toolbarRender={({ onScale, scale }) => {
          return (
            <>
              <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 1)} />
              <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 1)} />
            </>
          )
        }}
      />
    </>
  )
}
