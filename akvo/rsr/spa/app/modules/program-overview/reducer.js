import actionTypes from './action-types'

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.APPEND_RESULTS:
      return action.payload
    case actionTypes.SET_CONTRIBUTORS:
      const { periodID, data } = action.payload
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i.periods.map((p) => {
            if (p.id === periodID) {
              return {
                ...p,
                contributors: data,
                fetched: true
              }
            }
            return p
          })
        }))
      }))
    default:
      return state
  }
}
