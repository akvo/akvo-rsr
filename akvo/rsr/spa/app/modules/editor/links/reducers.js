import types from './action-types'

const newLink = {
  url: '',
  caption: ''
}
const newDoc = {
  url: '',
  title: '',
  document: ''
}

const initialState = {
  links: [{...newLink}],
  docs: [{...newDoc}]
}

const reducer = (state, action, actionTypes, newItem) => {
  switch(action.type){
    case actionTypes.ADD:
      return [...state, {...newItem}]
    case actionTypes.REMOVE:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
    case actionTypes.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      const updated = Object.assign({}, state[action.index], field)
      return [...state.slice(0, action.index), updated, ...state.slice(action.index + 1)]
    default: return state
  }
}

export const linksRdr = (state = initialState.links, action) => reducer(state, action, types.LINKS, newLink)

export const docsRdr = (state = initialState.docs, action) => reducer(state, action, types.DOCS, newDoc)
