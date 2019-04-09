import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/modules/partners/reducers'
import descsRdr from '../modules/editor/modules/descriptions/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  descsRdr
})

export default rootReducer
