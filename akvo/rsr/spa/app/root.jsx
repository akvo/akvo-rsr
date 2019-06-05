import React from 'react'
import { connect } from 'react-redux'
import SVGInline from 'react-svg-inline'
import { Icon, Button, Menu, Dropdown, Tabs } from 'antd'

import 'reset-css'
import 'antd/dist/antd.css'

import rsrSvg from './images/akvorsr.svg'
import Editor from './modules/editor/editor'

const { TabPane } = Tabs

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

const _Header = ({title}) => (
  <header className="main-header">
    <Icon type="left" />
    <h1>{title ? title : 'Untitled project'}</h1>
    <Tabs size="large">
      <TabPane tab="Results" key="1" />
      <TabPane tab="Updates" key="2" />
      <TabPane tab="Reports" key="3" />
      <TabPane tab="Editor" key="4" />
    </Tabs>
  </header>
)
const Header = connect(({ editorRdr: { section1: { fields: { title } }} }) => ({ title }))(_Header)

const Root = () => (
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
          <Button type="primary" ghost>My Projects</Button>
        </div>
      </div>
    </div>
    <div className="ui container">
      <Header />
      <Editor />
    </div>
  </div>
)

export default Root
