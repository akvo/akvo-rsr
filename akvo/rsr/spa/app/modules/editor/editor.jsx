import React from 'react'
import { connect } from 'react-redux'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import { Icon, Button, Alert } from 'antd'

import Settings from './settings/settings'
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

import {touchSection} from './actions'
import './styles.scss'

export const sections = [
  {key: 'info', validation: true, component: Info},
  {key: 'contacts', validation: true, component: Contacts},
  {key: 'partners', validation: true, component: Partners},
  {key: 'descriptions', component: Descriptions},
  {key: 'results-n-indicators' },
  {key: 'finance', component: Finance, validation: true},
  {key: 'locations', component: Locations, validation: true},
  {key: 'focus', component: Focus, validation: true},
  {key: 'links-n-docs', component: LinksDocs, validation: true},
  {key: 'comments-n-keywords', component: CommentsKeywords},
  {key: 'reporting', component: Reporting}
]
const dict = {
  info: 'General Information',
  contacts: 'Contact Information',
  partners: 'Partners',
  descriptions: 'Descriptions',
  'results-n-indicators': 'Results & Indicators',
  finance: 'Finance',
  locations: 'Locations',
  focus: 'Focus',
  'links-n-docs': 'Links & Documents',
  'comments-n-keywords': 'Comments & Keywords',
  reporting: 'CRS++ & FSS reporting'
}

const Check = ({ checked }) => (
  <div className="check">
    <Icon type="check-circle" theme="filled" className={checked ? 'checked' : ''} />
  </div>
)

const MenuItem = (props) => {
  const { to, checked, hideCheck } = props
  return (
    <Route
      path={to}
      exact
      children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to}>
            <span>{props.children}</span>
            {!hideCheck &&
              <Check checked={checked} />
            }
          </Link>
        </li>
      )}
    />
  )
}

const filterSection11 = rdr => (item) => {
  if(rdr.showSection11 === false && item.key === 'reporting') return false
  return true
}

class _Section extends React.Component{
  componentWillMount(){
    console.log(this.props.sectionKey)
    this.props.touchSection(this.props.sectionKey)
  }
  render(){
    return this.props.children
  }
}
const Section = connect(null, {touchSection})(_Section)

const Editor = ({ rdr }) => (
  <Router basename="/my-rsr">
    <div className="editor">
      <div className="status-bar">
        <aside className="saving-status">
          <Icon type="check" />
          <span>Saved 3 minutes ago</span>
        </aside>
        <aside className="main-menu">
          <ul>
            <MenuItem hideCheck to="/">Settings</MenuItem>
            {sections.filter(filterSection11(rdr)).map((section, index) =>
            <MenuItem to={`/${section.key}`} checked={rdr.isCompleted[section.key]}>{index + 1}. {dict[section.key]}</MenuItem>
            )}
          </ul>
        </aside>
        <div className="content">
          <Button type="primary">Publish</Button>
          <i>The project is unpublished</i>
        </div>
      </div>
      <div className="main-content">
        <Route path="/" exact component={Settings} />
        {sections.map(section =>
          <Route
            path={`/${section.key}`}
            exact
            render={(props) => {
              const Comp = section.component
              return <Section {...props} sectionKey={section.key}><Comp /></Section>
            }}
          />)
        }
      </div>
      <div className="alerts" />
    </div>
  </Router>
)

export default connect(
  ({ editorRdr }) => ({ rdr: editorRdr })
)(Editor)
