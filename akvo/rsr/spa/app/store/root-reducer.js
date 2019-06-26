import { combineReducers } from 'redux'

import editorRdr from '../modules/editor/reducer'
import userRdr from './user-reducer'

const rootReducer = combineReducers({
  editorRdr,
  userRdr
})

export default rootReducer
