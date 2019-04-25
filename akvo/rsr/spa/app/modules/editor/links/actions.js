import types from './action-types'

export const addLink = () => ({ type: types.LINKS.ADD })
export const removeLink = index => ({ type: types.LINKS.REMOVE, index })
export const editLinkField = (index, key, value) => ({ type: types.LINKS.EDIT_FIELD, index, key, value })

export const addDoc = () => ({ type: types.DOCS.ADD })
export const removeDoc = index => ({ type: types.DOCS.REMOVE, index })
export const editDocField = (index, key, value) => ({ type: types.DOCS.EDIT_FIELD, index, key, value })
