import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import SVGInline from 'react-svg-inline'
import { Icon, Button, Menu, Dropdown } from 'antd'

import 'reset-css'
import 'antd/dist/antd.css'

import rsrSvg from './images/akvorsr.svg'
import Editor from './modules/editor/editor'
import Projects from './modules/projects/projects'


const menu = () => (
  <Menu>
    <Menu.Item key="0">
      <a href="/en/myrsr/details/">My details</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="/en/sign_out">Sign out</a>
    </Menu.Item>
  </Menu>
)

const basePath = process.env.DETACHED_FE ? '/' : '/my-rsr'

const Root = () => (
  <Router basename={basePath}>
  <div id="root">
    <div className="top-bar">
      <div className="ui container">
        <SVGInline svg={rsrSvg} />
        <div className="right-side">
          <Dropdown overlay={menu} trigger={['click']}>
            <span className="user ant-dropdown-link">
              Anthony Gonzalez <Icon type="caret-down" />
            </span>
          </Dropdown>
          <Link to="/projects"><Button type="primary" ghost>My Projects</Button></Link>
        </div>
      </div>
    </div>
    <div className="ui container">
        <Route path="/projects" exact component={Projects} />
        <Route path="/projects/:id" component={Editor} />
    </div>
  </div>
  </Router>
)

export default Root
