import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import contactsRdr from '../modules/editor/contacts/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'
import infoRdr from '../modules/editor/info/reducers'
import budgetItemsRdr from '../modules/editor/finance/reducers'
import locationsRdr from '../modules/editor/locations/reducers'
import focusRdr from '../modules/editor/focus/reducers'
import {linksRdr, docsRdr} from '../modules/editor/links/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  contactsRdr,
  descsRdr,
  infoRdr,
  budgetItemsRdr,
  locationsRdr,
  focusRdr,
  linksRdr,
  docsRdr
})

export default rootReducer
