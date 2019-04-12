import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import contactsRdr from '../modules/editor/contacts/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'
import infoRdr from '../modules/editor/info/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  contactsRdr,
  descsRdr,
  infoRdr
})

export default rootReducer
