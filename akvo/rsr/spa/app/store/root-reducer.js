import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import contactsRdr from '../modules/editor/contacts/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  contactsRdr,
  descsRdr
})

export default rootReducer
