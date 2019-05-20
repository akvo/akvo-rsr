import Info from './info/comp/info'
import Contacts from './contacts/contacts'
import Partners from './partners/partners'
import Descriptions from './descriptions/descriptions'
import Finance from './finance/finance'
import Locations from './locations/locations'
import Focus from './focus/focus'
import LinksDocs from './links-n-docs/links-n-docs'
import CommentsKeywords from './comments-n-keywords/comments-n-keywords'
import Reporting from './reporting/comp/reporting'

export default [
  {key: 'info', validation: true, component: Info},
  {key: 'contacts', validation: true, component: Contacts},
  {key: 'partners', validation: true, component: Partners},
  {key: 'descriptions', component: Descriptions},
  {key: 'results-n-indicators' },
  {key: 'finance', component: Finance, validation: true},
  {key: 'locations', component: Locations, validation: true},
  {key: 'focus', component: Focus, validation: true},
  {key: 'links-n-docs', component: LinksDocs},
  {key: 'comments-n-keywords', component: CommentsKeywords},
  {key: 'reporting', component: Reporting}
]
