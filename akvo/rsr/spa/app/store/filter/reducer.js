import actionTypes from './action-types'

const initialState = {
  data: [],
  countries: {
    items: [],
    apply: false
  },
  contributors: {
    items: [],
    apply: false
  },
  periods: {
    items: [],
    apply: false
  },
  partners: {
    items: [],
    apply: false
  }
}

export default (state = initialState, action) => {
  const { fieldName, data, id } = action.payload || {}
  switch (action.type) {
  case actionTypes.SET_FILTER_ITEMS:
    return {
      ...state,
      [fieldName]: {
        ...state[fieldName],
        key: fieldName,
        items: data
      }
    }
  case actionTypes.REMOVE_FILTER_ITEM:
    const items = state[fieldName]?.items?.filter((d) => d.id !== id)
    return {
      ...state,
      [fieldName]: {
        ...state[fieldName],
        apply: (items.length),
        items
      }
    }
  case actionTypes.APPLY_FILTER:
    return {
      ...state,
      [fieldName]: {
        ...state[fieldName],
        apply: true
      }
    }
  case actionTypes.SET_DATA_FILTER:
    return {
      ...state,
      data: action.payload
    }
  case actionTypes.CLEAR_FILTER:
    return initialState
  default:
    return state
  }
}
