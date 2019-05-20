import types from './action-types'

export const editComments = comments => ({ type: types.EDIT_COMMENTS, comments })

export const addKeyword = () => ({ type: types.ADD_KEYWORD })
export const removeKeyword = index => ({ type: types.REMOVE_KEYWORD, index })
export const editKeyword = (index, keyword) => ({ type: types.EDIT_KEYWORD, index, keyword })
