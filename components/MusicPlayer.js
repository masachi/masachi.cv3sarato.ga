import React from 'react'
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import Locale from 'react-jinke-music-player/lib/config/locale'

const params = {
  // audio lists model
  audioLists: [
    {
      name: '歌に形はないけれど',
      singer: 'doriko',
      cover: 'https://p2.music.126.net/dWt2GQ9DtguAKu46D6zDmw==/925788790612409.jpg',
      musicSrc: 'https://music.163.com/song/media/outer/url?id=22635188.mp3',
    },
  ],
  defaultPlayIndex: 0,
  theme: 'auto',
  bounds: 'body',
  quietUpdate: true,
  clearPriorAudioLists: false,
  autoPlayInitLoadPlayList: false,
  preload: false,
  glassBg: false,
  remember: true,
  remove: false,
  defaultPosition: {
    left: 0,
    bottom: 0,
  },
  defaultPlayMode: 'order',
  mode: 'full',
  once: false,
  autoPlay: true,
  toggleMode: false,
  showMiniModeCover: true,
  showMiniProcessBar: false,
  drag: false,
  seeked: true,
  showMediaSession: true,
  showProgressLoadBar: true,
  showPlay: true,
  showReload: true,
  showDownload: false,
  showPlayMode: true,
  showThemeSwitch: false,
  showLyric: true,
  showDestroy: false,
  extendsContent: null,
  defaultVolume: 1,
  playModeShowTime: 600,
  loadAudioErrorPlayNext: true,
  autoHiddenCover: false,
  spaceBar: true,
  locale: Locale.zh_CN,
  responsive: false,
  mobileMediaQuery: '(max-width: 600px)',
  volumeFade: {
    fadeIn: 1000,
    fadeOut: 1000,
  },
  restartCurrentOnPrev: false,
  sortableOptions: {},
}

const MusicPlayer = () => {
  return <ReactJkMusicPlayer {...params} />
}

export default MusicPlayer
