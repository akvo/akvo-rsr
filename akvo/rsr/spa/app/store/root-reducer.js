import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import contactsRdr from '../modules/editor/contacts/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'
import infoRdr from '../modules/editor/info/reducers'
import budgetItemsRdr from '../modules/editor/finance/reducers'
import locationsRdr from '../modules/editor/locations/reducers'
import focusRdr from '../modules/editor/focus/reducers'
import {linksRdr, docsRdr} from '../modules/editor/links/reducers'
import {commentsRdr, keywordsRdr} from '../modules/editor/comments-n-keywords/reducers'
import {reportingRdr, crsAddOtherFlagRdr, forecastsRdr, legaciesRdr} from '../modules/editor/reporting/reducers'

const rootReducer = combineReducers({
  partnersRdr,
  contactsRdr,
  descsRdr,
  infoRdr,
  budgetItemsRdr,
  locationsRdr,
  focusRdr,
  linksRdr,
  docsRdr,
  commentsRdr,
  keywordsRdr,
  reportingRdr,
  crsAddOtherFlagRdr,
  forecastsRdr,
  legaciesRdr
})

export default rootReducer
