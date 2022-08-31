import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import Image from 'next/image'

const root = process.cwd()
const galleryPath = 'public/static/assets/gallery'

export async function getStaticProps() {
  const images = fs.readdirSync(path.join(root, galleryPath))
  return {
    props: {
      images: images.map((item) => {
        return {
          fileName: item,
        }
      }),
    },
  }
}

export default function Gallery({ images }) {
  return (
    <MasonryInfiniteGrid className="container" gap={5} align={'justify'}>
      {images.map((item) => {
        return (
          <div className="item" key={uuidv4()}>
            <div className="thumbnail">
              <img
                data-grid-lazy="true"
                src={`/${galleryPath.replace('public/', '')}/${item.fileName}`}
              />
            </div>
          </div>
        )
      })}
    </MasonryInfiniteGrid>
  )
}
