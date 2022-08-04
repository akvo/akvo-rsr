import actionTypes from './action-types'

const initialState = [
  {
    id: null,
    indicators: [
      {
        id: null,
        periods: [
          {
            id: null,
            updates: []
          }
        ]
      }
    ]
  },
]

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_RESULTS:
      return action.payload
    case actionTypes.UPDATE_RESULT:
      return state.map((s) => {
        if (s.id === action?.payload?.id) {
          return action.payload
        }
        return s
      })
    case actionTypes.UPDATE_INDICATOR:
      return state.map((s) => ({
        ...s,
        indicators: s?.indicators?.map((i) => {
          if (i.id === action?.payload?.id) {
            return action.payload
          }
          return i
        })
      }))
    case actionTypes.UPDATE_PERIOD:
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => {
            if (p.id === action?.payload?.id) {
              return action.payload
            }
            return p
          })
        }))
      }))
    case actionTypes.UPDATE_ITEM:
      return state.map((s) => ({
        ...s,
        indicators: s.indicators.map((i) => ({
          ...i,
          periods: i.periods.map((p) => ({
            ...p,
            updates: p?.updates?.map((u) => {
              if (u.id === action?.payload?.id) {
                return action.payload
              }
              return u
            })
          }))
        }))
      }))
    default:
      return state
  }
}
