import { combineReducers } from 'redux'

import partnersRdr from '../modules/editor/partners/reducers'
import contactsRdr from '../modules/editor/contacts/reducers'
import descsRdr from '../modules/editor/descriptions/reducers'
import infoRdr from '../modules/editor/info/reducers'
import budgetItemsRdr from '../modules/editor/finance/budget-items/reducers'
import countryBudgetItemsRdr from '../modules/editor/finance/country-budget-items/reducers'
import transactionsRdr from '../modules/editor/finance/transactions/reducers'
import disbursementsRdr from '../modules/editor/finance/disbursements/reducers'
import financeRdr from '../modules/editor/finance/reducers'
import locationsRdr from '../modules/editor/locations/reducers'
import locationItemsRdr from '../modules/editor/locations/location-items/reducers'
import recipientCountriesRdr from '../modules/editor/locations/recipient-countries/reducers'
import recipientRegionsRdr from '../modules/editor/locations/recipient-regions/reducers'
import focusRdr from '../modules/editor/focus/reducers'
import sectorsRdr from '../modules/editor/focus/sectors/reducers'
import policyMarkersRdr from '../modules/editor/focus/policy-markers/reducers'
import humanitarianScopesRdr from '../modules/editor/focus/humanitarian-scopes/reducers'
// import linksRdr from '../modules/editor/links-n-docs/links/reducers'
// import docsRdr from '../modules/editor/links-n-docs/docs/reducers'
import {commentsRdr, keywordsRdr} from '../modules/editor/comments-n-keywords/reducers'
import {reportingRdr, crsAddOtherFlagRdr, forecastsRdr, legaciesRdr} from '../modules/editor/reporting/reducers'
import editorRdr from '../modules/editor/reducer'
// import editorRdrNew from '../modules/editor/reducer'

const rootReducer = combineReducers({
  partnersRdr,
  contactsRdr,
  descsRdr,
  infoRdr,
  budgetItemsRdr,
  countryBudgetItemsRdr,
  transactionsRdr,
  disbursementsRdr,
  locationsRdr,
  locationItemsRdr,
  recipientCountriesRdr,
  recipientRegionsRdr,
  focusRdr,
  sectorsRdr,
  policyMarkersRdr,
  humanitarianScopesRdr,
  // linksRdr,
  // docsRdr,
  commentsRdr,
  keywordsRdr,
  reportingRdr,
  crsAddOtherFlagRdr,
  forecastsRdr,
  legaciesRdr,
  financeRdr,
  editorRdr,
})

export default rootReducer
