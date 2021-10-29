/* global window */
import React from 'react'
import {
  Row,
  Col,
  Avatar,
  Typography,
  Menu,
  Icon,
  Button,
  Dropdown
} from 'antd'
import SVGInline from 'react-svg-inline'
import { useHistory } from 'react-router-dom'
import logo from '../../../images/unicef-logo.svg'

const { Text } = Typography
const { SubMenu } = Menu

const UserMenu = ({ firstName, lastName }) => (
  <Menu theme="dark" mode="horizontal">
    <SubMenu
      disabled={!firstName}
      title={
        <span className="submenu-title-wrapper">
          <Avatar
            style={{
              backgroundColor: '#92d7f1',
              width: 40,
              height: 40,
              marginRight: 10
            }}
            icon={(!firstName) ? 'loading' : 'user'}
          />
          {firstName ? `${firstName} ${lastName}` : 'Loading...'}
        </span>
      }
    >
      <Menu.Item key="my-projects">
        <a target="_blank" rel="noopener noreferrer" href="/my-rsr">My Projects</a>
      </Menu.Item>
      <Menu.Item key="sign-out">
        <a href="/en/sign_out">Sign out</a>
      </Menu.Item>
    </SubMenu>
  </Menu>
)

export const Navbar = ({
  lang,
  user,
  setLang,
  menuKey,
  setMenuKey
}) => {
  const history = useHistory()
  const handleOnSwitchPage = (key) => {
    switch (key) {
      case 'dashboard':
        history.push('/dir/framework')
        break
      case 'global':
        history.push('/dir/map')
        break
      default:
        history.push('/')
        break
    }
  }

  return (
    <Row className="wcaro-top-navbar">
      <Col lg={4} xs={6}>
        <SVGInline svg={logo} className="wcaro-logo" />
      </Col>
      <Col lg={12} xs={8}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[menuKey]}
          onClick={({ key }) => setMenuKey(key)}
        >
          <Menu.Item key="info" onClick={({ key }) => handleOnSwitchPage(key)}>
            <Icon type="info-circle" className="menu-icon" style={{ fontSize: 24 }} theme="filled" />
          </Menu.Item>
          <Menu.Item key="dashboard" onClick={({ key }) => handleOnSwitchPage(key)}>
            <Icon type="dashboard" className="menu-icon" style={{ fontSize: 24 }} theme="filled" />
          </Menu.Item>
          <Menu.Item key="global" onClick={({ key }) => handleOnSwitchPage(key)}>
            <Icon type="global" className="menu-icon" style={{ fontSize: 24 }} theme="outlined" />
          </Menu.Item>
        </Menu>
      </Col>
      <Col lg={6} xs={6} className="text-right">
        {user.status === 'fail' ?
          (
            <Button type="link" href={`/en/sign_in/?next=${window.location.href}`}>
              <Text strong>SIGN IN</Text>&nbsp;
              <Icon type="arrow-right" />
            </Button>
          )
          : <UserMenu {...{ ...user.data }} />}
      </Col>
      <Col lg={2} xs={4} className="text-right">
        <Dropdown overlay={(
          <Menu onClick={({ key }) => setLang(key)}>
            <Menu.Item key="en">English</Menu.Item>
            <Menu.Item key="fr">France</Menu.Item>
            <Menu.Item key="es">Español</Menu.Item>
          </Menu>
        )} trigger={['click']}
        >
          <Button type="default" onClick={e => e.preventDefault()}>
            <strong style={{ textTransform: 'uppercase' }}>{lang}</strong>&nbsp;<Icon type="down" />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  )
}
