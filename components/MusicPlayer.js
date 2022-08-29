import React from 'react'
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import Locale from 'react-jinke-music-player/lib/config/locale'

const musicData = require('./data/music-data.json')

const params = {
  // audio lists model
  audioLists: musicData,
  defaultPlayIndex: 0,
  theme: 'auto',
  bounds: 'body',
  quietUpdate: true,
  clearPriorAudioLists: false,
  autoPlayInitLoadPlayList: true,
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
