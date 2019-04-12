import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import contactsRdr from '../modules/editor/contacts/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'
import infoRdr from '../modules/editor/info/reducers'
import budgetItemsRdr from '../modules/editor/finance/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  contactsRdr,
  descsRdr,
  infoRdr,
  budgetItemsRdr
})

export default rootReducer
