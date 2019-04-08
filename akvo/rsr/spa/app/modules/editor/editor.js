import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import { Icon, Alert, Button } from 'antd'
import { StickyContainer, Sticky } from 'react-sticky'

import Settings from './modules/settings/settings'
import Info from './modules/info/info'
import Partners from './modules/partners/partners'

import './styles.scss'

const Check = () => (
  <div className="check">
    <Icon type="check-circle" theme="filled" style={{ fontSize: 20, color: '#ccc' }} />
  </div>
)

const MenuItem = (props) => {
  const { to, checked, hideCheck } = props
  return (
    <Route
      path={to}
      children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to}>{props.children}</Link>
          {!hideCheck &&
          <Check checked={checked} />
          }
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
                <MenuItem to="/info">General Information</MenuItem>
                <MenuItem to="/partners">Partners</MenuItem>
              </ul>
            </aside>
          )}
          </Sticky>
          <div className="content">
            <Route path="/settings" exact component={Settings} />
            <Route path="/info" exact component={Info} />
            <Route path="/partners" component={Partners} />
          </div>
          <div className="alerts">
          <Sticky>
            {({style, isSticky}) => (
              <div style={{...style, paddingTop: isSticky ? 70 : 0 }}>
                <Alert
                  description="This is a warning notice about copywriting."
                  type="warning"
                  showIcon
                />
              </div>
            )}
          </Sticky>
          </div>
        </div>
      </div>
    </StickyContainer>
  </Router>
)

export default Editor
