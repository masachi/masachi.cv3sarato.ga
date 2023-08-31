import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PageSEO } from '@/components/SEO'
import { PhotoSlider } from 'react-photo-view'
import { Timeline } from 'antd'
import PhotoAlbum from 'react-photo-album'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'

const NextJsImage = ({ photo, imageProps, wrapperProps }) => {
  const { width, height } = photo
  const { src, alt, title, style, sizes, className, onClick } = imageProps
  const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {}

  return (
    <div
      style={{
        width: style.width,
        padding: style.padding,
        marginBottom: style.marginBottom,
        ...wrapperStyle,
      }}
      {...restWrapperProps}
    >
      <Image
        src={src}
        alt={alt}
        title={title}
        sizes={sizes}
        width={width}
        height={height}
        className={className}
        onClick={onClick}
      />
    </div>
  )
}

const GIST_TOKEN = process.env.NEXT_PUBLIC_GIST_TOKEN

const octokit = new Octokit({
  auth: GIST_TOKEN,
})

const getContentByGistId = async (gist_id, fileName) => {
  const gistGetResponse = await octokit.request(`GET /gists/${gist_id}`)
  if (gistGetResponse.status === 200) {
    if (gistGetResponse.data.files[fileName].raw_url) {
      let rawJsonResponse = await fetch(gistGetResponse.data.files[fileName].raw_url)
      let rawJson = await rawJsonResponse.json()
      return JSON.parse(rawJson)
    }
  }

  return {}
}

export default function Gallery() {
  const [images, setImages] = useState([])
  const [albums, setAlbums] = useState([])

  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

  const handlePreview = (file) => {
    let previewIndex = images.findIndex((item) => file.id === item.id)
    if (previewIndex > -1) {
      setPreviewModalOpen(true)
      setPreviewIndex(previewIndex)
    }
  }

  const dataProcess = async () => {
    const gistContent = await getContentByGistId(
      process.env.NEXT_PUBLIC_GIST_ID,
      process.env.NEXT_PUBLIC_FILE_NAME
    )
    let album = []
    let images = []
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
                url: `${process.env.NEXT_PUBLIC_IMG_DOMAIN}${item.path}`,
                src: `${process.env.NEXT_PUBLIC_IMG_DOMAIN}${item.path}`,
              }
            }),
        })

        images.push(
          ...gistContent[date]
            .filter((items) => items.length > 0)
            .map((items) => {
              let item = items[items.length - 1]
              return {
                src: `${process.env.NEXT_PUBLIC_IMG_DOMAIN}${item.path}`,
                id: item.id,
              }
            })
        )
      })

    setImages(images)
    setAlbums(album)
  }

  useEffect(() => {
    dataProcess()
  }, [])

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
                  renderPhoto={NextJsImage}
                />
              </Timeline.Item>
            )
          })}
        </Timeline>
      </div>

      <PhotoSlider
        images={images}
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
