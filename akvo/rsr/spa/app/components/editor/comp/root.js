import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import { Icon, Alert } from 'antd'

import Settings from './settings'
import Info from './info'
import Partners from './partners'

import '../styles.scss'

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
  <div className="editor">
    <aside>
      <ul>
        <MenuItem hideCheck to="/settings">Settings</MenuItem>
        <MenuItem to="/info">General Information</MenuItem>
        <MenuItem to="/partners">Partners</MenuItem>
      </ul>
    </aside>
    <div className="content">
      <Route path="/settings" exact component={Settings} />
      <Route path="/info" exact component={Info} />
      <Route path="/partners" component={Partners} />
    </div>
    <div className="alerts">
      <Alert
        description="This is a warning notice about copywriting."
        type="warning"
        showIcon
      />
    </div>
  </div>
  </Router>
)

export default Editor
