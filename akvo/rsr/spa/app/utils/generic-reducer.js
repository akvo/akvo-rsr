export default (initialState, model, actionTypes) => (state = initialState, action) => {
  switch(action.type){
    case actionTypes.ADD:
      return [...state, Object.assign({}, model)]
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
