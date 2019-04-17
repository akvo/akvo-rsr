import types from './action-types'

const initialState = {
  comments: '',
  keywords: []
}

export const keywordsRdr = (state = initialState.keywords, action) => {
  switch(action.type){
    case types.ADD_KEYWORD:
      return [...state, null]
    case types.EDIT_KEYWORD:
      return [...state.slice(0, action.index), action.keyword, ...state.slice(action.index + 1)]
    case types.REMOVE_KEYWORD:
      return state.filter((it, index) => index !== action.index)
    default: return state
  }
}

export const commentsRdr = (state = initialState.comments, action) => {
  switch(action.type){
    case types.EDIT_COMMENTS:
      return action.comments
    default: return state
  }
}
