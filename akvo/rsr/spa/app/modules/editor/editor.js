import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import { Icon, Alert, Button } from 'antd'
import { StickyContainer, Sticky } from 'react-sticky'

import Settings from './settings/settings'
import Info from './info/info'
import Contacts from './contacts/contacts'
import Partners from './partners/partners'
import Descriptions from './descriptions/descriptions'
import Finance from './finance/finance'

import './styles.scss'

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

const Editor = () => (
  <Router>
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
        <div className="flex-container">
          <Sticky>
          {({ style, isSticky }) => (
            <aside style={{...style, paddingTop: isSticky ? 50 : 0 }}>
              <ul>
                <MenuItem hideCheck to="/settings">Settings</MenuItem>
                <MenuItem to="/info" checked>General Information</MenuItem>
                <MenuItem to="/contacts">Contact Information</MenuItem>
                <MenuItem to="/partners">Partners</MenuItem>
                <MenuItem to="/descriptions">Descriptions</MenuItem>
                <MenuItem to="/results-indicators">Results and indicators</MenuItem>
                <MenuItem to="/finance">Finance</MenuItem>
                <MenuItem to="/locations">Locations</MenuItem>
                <MenuItem to="/focus">Focus</MenuItem>
                <MenuItem to="/links">Link and documents</MenuItem>
                <MenuItem to="/comments-keyowrds">Comments and keywords</MenuItem>
              </ul>
            </aside>
          )}
          </Sticky>
          <div className="content">
            <Route path="/settings" exact component={Settings} />
            <Route path="/info" exact component={Info} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/partners" component={Partners} />
            <Route path="/descriptions" component={Descriptions} />
            <Route path="/finance" component={Finance} />
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
      </div>
    </StickyContainer>
  </Router>
)

export default Editor
