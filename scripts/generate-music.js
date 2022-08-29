const fs = require('fs')
const musicsFromListen1Export = require('./data/listen1_backup.json')

function parseMusicTrackToComponentData() {
  let musicData = []
  Object.keys(musicsFromListen1Export).forEach((key) => {
    if (/myplaylist_(.+)/g.test(key)) {
      musicsFromListen1Export[key]['tracks'].forEach((trackItem) => {
        musicData.push({
          name: trackItem.title,
          singer: trackItem.artist,
          cover: trackItem.img_url,
          musicSrc: trackItem.source_url
            .replace('https://music.163.com/#/song', 'https://music.163.com/song/media/outer/url')
            .concat('.mp3'),
        })
      })
    }
  })

  fs.writeFile(
    `${__dirname}/../components/data/music-data.json`,
    JSON.stringify(musicData),
    { flag: 'w+' },
    function (err) {
      if (err) throw err
      console.log("It's saved!")
    }
  )
}

parseMusicTrackToComponentData()
