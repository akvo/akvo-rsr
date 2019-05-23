import Info from './section1/comp/info'
import Contacts from './section2/contacts'
import Partners from './section3/partners'
import Descriptions from './section4/descriptions'
import Finance from './section6/finance'
import Locations from './section7/locations'
import Focus from './section8/focus'
import LinksDocs from './section9/links-n-docs'
import CommentsKeywords from './section10/comments-n-keywords'
import Reporting from './section11/section11'

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

export const sectionLength = 11
