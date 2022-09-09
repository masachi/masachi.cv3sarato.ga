import React, { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import { PageSEO } from '@/components/SEO'
import { PhotoSlider } from 'react-photo-view'
import { Timeline } from 'antd'
import PhotoAlbum from 'react-photo-album'

const root = process.cwd()
const galleryPath = 'public/static/assets/gallery'

export async function getStaticProps() {
  const images = fs.readdirSync(path.join(root, galleryPath))
  return {
    props: {
      images: images.map((item) => {
        return {
          fileName: item,
          id: uuidv4(),
          height: 200,
          width: 200,
          url: `/${galleryPath.replace('public/', '')}/${item}`,
          src: `/${galleryPath.replace('public/', '')}/${item}`,
        }
      }),
    },
  }
}

export default function Gallery({ images }) {
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
      {/*<MasonryInfiniteGrid className="container" gap={5} align={'justify'}>*/}
      {/*  {images.map((item) => {*/}
      {/*    return (*/}
      {/*      <div className="item" key={item.id}>*/}
      {/*        <div className="thumbnail">*/}
      {/*          <img*/}
      {/*            onClick={() => {*/}
      {/*              handlePreview(item)*/}
      {/*            }}*/}
      {/*            data-grid-lazy="true"*/}
      {/*            src={`${item.url}`}*/}
      {/*            alt={''}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    )*/}
      {/*  })}*/}
      {/*</MasonryInfiniteGrid>*/}

      <div className={'gallery-container'}>
        <Timeline mode={'left'}>
          <Timeline.Item label="2015-09-01">
            <PhotoAlbum layout="rows" photos={images.slice(0, 10)} />
          </Timeline.Item>
          <Timeline.Item label="2015-09-01">
            <PhotoAlbum layout="rows" photos={images.slice(10, 20)} />
          </Timeline.Item>
          <Timeline.Item label="2015-09-01">
            <PhotoAlbum layout="rows" photos={images.slice(20, 30)} />
          </Timeline.Item>
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
