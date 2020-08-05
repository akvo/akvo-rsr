/* global localStorage */
const langPref = localStorage.getItem('rsr-lang-pref')
const initialState = {
  lang: langPref ? langPref : 'en',
  programs: []
}

export default (state = initialState, action) => {
  switch(action.type){
    case 'SET_USER':
      return { ...state, ...action.user}
    case 'SET_LANG':
      localStorage.setItem('rsr-lang-pref', action.lang)
      return { ...state, lang: action.lang }
    case 'ADD_PROGRAM':
      return {...state, programs: [...state.programs, action.program]}
    case 'EDIT_PROGRAM_NAME':
      const programs = [...state.programs]
      const index = programs.findIndex(it => it.id === Number(action.projectId))
      if(index !== -1){
        programs[index].name = action.projectName
      }
      return {...state, programs}
    case 'SEEN_ANNOUNCEMENT':
      return {...state, seenAnnouncements: [...state.seenAnnouncements, action.date]}
    default: return state
  }
}
