import React from 'react'
import Masonry from 'react-masonry-css'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import Image from 'next/image'

const root = process.cwd()
const galleryPath = 'assets/gallery'

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
    <Masonry
      breakpointCols={6}
      className="gallery-masonry-grid"
      columnClassName="gallery-masonry-grid_column"
    >
      {images.map((item, index) => {
        return (
          <div key={uuidv4()}>
            <Image src={`/${galleryPath}/${item.fileName}`} layout="fill" />
          </div>
        )
      })}
    </Masonry>
  )
}
