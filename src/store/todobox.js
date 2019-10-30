
import { getItem } from '../utils/helpers'

export function state () {
  return {
    lists: [],
  }
}

const getters = {
  getList: state => listRef => {
    return getList(state.lists, listRef)
  },
  
  getItem: state => (itemRef, returnList) => {
    return getItem(state.lists, itemRef, returnList)
  },
}

export const actions = {
  setLists ({ state, commit }, lists) {
    lists.forEach((list, index) => {
      if (list.items) {
        list.items.forEach(item => {
          commit('addItem', Object.assign({ listId: index }, item))
        })
      }
    })
  }
}

export const mutations = {
  addItem (state, { listId, title, description, date }) {
    const list = getList(state.lists, listId)
    list.items.push(makeItem(title, description, date))
  },

  updateItem (state, { itemId, title, description, date }) {
    const item = getItem(state.lists, itemId)
    if (item) {
      Object.assign(item, makeItem(title, description, date, itemId))
    }
  },

  moveItem (state, { fromList, toList, fromIndex, toIndex }) {
    fromList = getList(state.lists, fromList)
    toList = getList(state.lists, toList)
    toList.items.splice(toIndex, 0, ...fromList.items.splice(fromIndex, 1))
  },

  removeItem (state, itemId) {
    const { list, item } = getItem(state.lists, itemId, true)
    if (list) {
      list.items.splice(list.items.indexOf(item), 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}