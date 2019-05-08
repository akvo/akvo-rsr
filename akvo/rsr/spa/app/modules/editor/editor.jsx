import React from 'react'
import { connect } from 'react-redux'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import { Icon, Button, Alert } from 'antd'
import { StickyContainer, Sticky } from 'react-sticky'

import Settings from './settings/settings'
import Info from './info/comp/info'
import Contacts from './contacts/contacts'
import Partners from './partners/partners'
import Descriptions from './descriptions/descriptions'
import Finance from './finance/finance'
import Locations from './locations/comp/locations'
import Focus from './focus/focus'
import Links from './links/links'
import CommentsKeywords from './comments-n-keywords/comments-n-keywords'
import Reporting from './reporting/comp/reporting'

import './styles.scss'

export const sections = ['info', 'contacts', 'partners']

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

const Editor = ({ rdr }) => (
  <Router basename="/my-rsr">
    <StickyContainer>
      <div className="editor">
        <div className="status-bar">
          <aside>
            <Icon type="check" />
            <span>Saved 3 minutes ago</span>
          </aside>
          <div className="content">
            <Button type="primary">Publish</Button>
            <i>The project is unpublished</i>
          </div>
        </div>
        <Sticky>
        {({ style, isSticky }) => (
          <aside style={{...style, paddingTop: isSticky ? 50 : 0 }}>
            <ul>
              <MenuItem hideCheck to="/">Settings</MenuItem>
              <MenuItem to="/info" checked={rdr.isCompleted.info}>General Information</MenuItem>
              <MenuItem to="/contacts" checked={rdr.isCompleted.contacts}>Contact Information</MenuItem>
              <MenuItem to="/partners" checked={rdr.isCompleted.partners}>Partners</MenuItem>
              <MenuItem to="/descriptions" checked={rdr.isCompleted.descriptions}>Descriptions</MenuItem>
              <MenuItem to="/results-indicators">Results and indicators</MenuItem>
              <MenuItem to="/finance" checked={rdr.isCompleted.finance}>Finance</MenuItem>
              <MenuItem to="/locations">Locations</MenuItem>
              <MenuItem to="/focus">Focus</MenuItem>
              <MenuItem to="/links">Links and documents</MenuItem>
              <MenuItem to="/comments-n-keywords">Comments and keywords</MenuItem>
              {rdr.showSection11 &&
              <MenuItem to="/reporting">CRS++ and FSS reporting</MenuItem>
              }
            </ul>
          </aside>
        )}
        </Sticky>
        <div className="main-content">
          <Route path="/" exact component={Settings} />
          <Route path="/info" exact component={Info} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/partners" component={Partners} />
          <Route path="/descriptions" component={Descriptions} />
          <Route path="/finance" component={Finance} />
          <Route path="/locations" component={Locations} />
          <Route path="/focus" component={Focus} />
          <Route path="/links" component={Links} />
          <Route path="/comments-n-keywords" component={CommentsKeywords} />
          <Route path="/reporting" component={Reporting} />
        </div>
        <div className="alerts">
        {/* <Sticky>
          {({style, isSticky}) => (
            <div style={{...style, paddingTop: isSticky ? 70 : 0 }}>
              <Alert
                description="This is a warning notice about copywriting."
                type="warning"
                showIcon
              />
            </div>
          )}
        </Sticky> */}
        </div>
      </div>
    </StickyContainer>
  </Router>
)

export default connect(
  ({ editorRdr }) => ({ rdr: editorRdr })
)(Editor)
