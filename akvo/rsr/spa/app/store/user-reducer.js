/* global localStorage */
const langPref = localStorage.getItem('rsr-lang-pref')
const initialState = {
  lang: langPref ? langPref : 'en'
}

export default (state = initialState, action) => {
  switch(action.type){
    case 'SET_USER':
      return { ...state, ...action.user}
      case 'SET_LANG':
      localStorage.setItem('rsr-lang-pref', action.lang)
      return { ...state, lang: action.lang }
    default: return state
  }
}
