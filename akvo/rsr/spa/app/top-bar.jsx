import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import SVGInline from 'react-svg-inline'
import { Icon, Button, Dropdown, Menu } from 'antd'

import rsrSvg from './images/akvorsr.svg'
import { useFetch } from './utils/hooks'

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

const TopBar = connect()(({ dispatch }) => {
  const [data, loading] = useFetch('/me')
  if(!loading && data){
    dispatch({ type: 'SET_USER', user: data })
  }
  return (
    <div className="top-bar">
      <div className="ui container">
        <SVGInline svg={rsrSvg} />
        <div className="right-side">
          {!loading &&
          <Dropdown overlay={menu} trigger={['click']}>
            <span className="user ant-dropdown-link">
              {data.firstName} {data.lastName} <Icon type="caret-down" />
            </span>
          </Dropdown>
          }
          <Link to="/projects"><Button type="primary" ghost>My Projects</Button></Link>
        </div>
      </div>
    </div>
  )
})

export default TopBar
