import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  descsRdr
})

export default rootReducer
