const initialState = {
  lang: 'en'
}

export default (state = initialState, action) => {
  switch(action.type){
    case 'SET_USER':
      return { ...state, ...action.user}
    case 'SET_LANG':
      return { ...state, lang: action.lang }
    default: return state
  }
}
