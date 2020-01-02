import * as types from './mutation-types'

const mutations = {
  [types.SET_MUSICSINGER] (state, musicSinger) {
    state.musicSinger = musicSinger
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN_STATE] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST_STATE] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST_STATE] (state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE_STATE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX_STATE] (state, index) {
    state.currentIndex = index
  }
}
export default mutations