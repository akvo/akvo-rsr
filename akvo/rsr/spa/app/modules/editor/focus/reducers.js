import types from './action-types'
import vocab from './vocab.json'

const initialState = []

const newSector = {
  code: '',
  vocabulary: vocab[0].value,
}

export default (state = initialState, action) => {
  switch(action.type){
    case types.ADD:
      const additional = action.vocabulary ? { vocabulary: action.vocabulary } : {}
      return [...state, Object.assign({}, newSector, additional)]
    case types.REMOVE:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      const updated = Object.assign({}, state[action.index], field)
      return [...state.slice(0, action.index), updated, ...state.slice(action.index + 1)]
    default: return state
  }
}
