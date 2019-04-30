import types from './action-types'

const newLocation = { address: '', coordinates: {}}
const newCountry = { name: '', code: '' }

const initialState = {
  locations: [{...newLocation}],
  countries: ['']
}

export default (state = initialState, action) => {
  switch(action.type){
    case types.ADD_LOCATION:
      return {...state, locations: [...state.locations, {...newLocation}]}
    case types.REMOVE_LOCATION:
    return {...state, locations: [...state.locations.slice(0, action.index), ...state.locations.slice(action.index + 1)]}
    case types.EDIT_LOCATION:
      return {...state, locations: [...state.locations.slice(0, action.index), action.location, ...state.locations.slice(action.index + 1)]}
    case types.ADD_COUNTRY:
      return {...state, countries: [...state.countries, '']}
    case types.REMOVE_COUNTRY:
    return {...state, countries: [...state.countries.slice(0, action.index), ...state.countries.slice(action.index + 1)]}
    case types.EDIT_COUNTRY:
      return {...state, countries: [...state.countries.slice(0, action.index), action.country, ...state.countries.slice(action.index + 1)]}
    default: return state
  }
}
