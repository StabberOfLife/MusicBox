import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import { shuffle } from '../common/js/util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCELIST_STATE, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST_STATE, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST_STATE, list)
  }
  commit(types.SET_CURRENTINDEX_STATE, index)
  commit(types.SET_FULLSCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_MODE_STATE, playMode.random)
  commit(types.SET_SEQUENCELIST_STATE, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST_STATE, randomList)
  commit(types.SET_CURRENTINDEX_STATE, 0)
  commit(types.SET_FULLSCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录下当前歌曲 (currentIndex) => 歌单中的index指针
  let currentSong = playlist[currentIndex]
  // 因为两个页面（歌手详情页本身就对歌单进行加载了，之后搜索页面页要进行加载）加载入歌曲，所以，
  // 需要先判断currentIndex里面是不是与我当前准备插入的歌曲重复，如果是，就需要对当前dom进行操作，
  // 在现有的基础上使用剪切函数对指引的歌曲删除再插入
  // 1、判断
  let findPlayListIndex = findIndex(playlist, song)
  // 如果没有，那么，currentIndex指针在链中增加一个位置
  currentIndex++
  // 2、执行插入操作
  playlist.splice(currentIndex, 0, song)
  // 如果，我们是已经存在了这首歌了，我们需要把他删除了，然后，重新插入进去
  // 首先，看到findIndex返回来的数据
  if (findPlayListIndex > -1) {
    // 那么，在队列中插入数据时，有两种情况的，
    // 第一种就是如果在歌单列表后尾添加时，存在该歌单就把findIndx检索到的这个数据删除了
    // 然后，在currentIndex减少一位
    if (currentIndex > findPlayListIndex) {
      playlist.splice(findPlayListIndex, 1)
      currentIndex--
    } else {
      // 第二种其实就是超前插入的问题，在歌单后尾已经存在该歌单，但是想要在此之前插入，
      // 那么，在不打算破坏原本后尾的原有的歌曲的时候，我们需要对其增加就好了
      playlist.splice(findPlayListIndex + 1, 1)
    }
  }
  // 找到需要查入的位置
  let currentSongIndex = findIndex(sequenceList, currentSong) + 1
  // 找到列表中的歌曲插入
  let findSongIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSongIndex, 0, song)
  if (findSongIndex > -1) {
    if (currentSongIndex > findSongIndex) {
      sequenceList.splice(findSongIndex, 1)
    } else {
      sequenceList.splice(findSongIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST_STATE, playlist)
  commit(types.SET_SEQUENCELIST_STATE, sequenceList)
  commit(types.SET_CURRENTINDEX_STATE, currentIndex)
  commit(types.SET_FULLSCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST_STATE, playlist)
  commit(types.SET_SEQUENCELIST_STATE, sequenceList)
  commit(types.SET_CURRENTINDEX_STATE, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST_STATE, [])
  commit(types.SET_SEQUENCELIST_STATE, [])
  commit(types.SET_CURRENTINDEX_STATE, -1)
  commit(types.SET_PLAYING_STATE, false)
}
