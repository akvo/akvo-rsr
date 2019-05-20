import types from './action-types'

const initialState = [
  { key: 'summary', required: true, value: '' },
  { key: 'goals', required: true, value: '' },
  { key: 'background', value: '' },
  { key: 'baseline', value: '' },
  { key: 'target-group', value: '' },
  { key: 'project-plan', value: '' },
  { key: 'sustainability', value: '' },
]

export default (state = initialState, action) => {
  switch(action.type){
    case types.EDIT_DESCRIPTION:
      const index = state.findIndex(it => it.key === action.key)
      const updated = Object.assign({}, state[index], { value: action.value})
      return [...state.slice(0, index), updated, ...state.slice(index + 1)]
    default: return state
  }
}
