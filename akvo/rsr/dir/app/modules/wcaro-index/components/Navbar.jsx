import React from 'react'
import { Row, Col, Menu, Dropdown, Button, Icon } from 'antd'
import { Link } from 'react-router-dom'
import SVGInline from 'react-svg-inline'

const MenuIcon = ({ icon, ...props }) => <Icon type={icon} theme="filled" className="menu-icon" style={{ fontSize: '24px', paddingLeft: '0.3em' }} {...props} />

export const Navbar = ({ logo, lang, setLang }) => {
  return (
    <Row className="wcaro-navbar">
      <Col span={4} style={{ paddingTop: '1em' }}>
        <SVGInline svg={logo} className="wcaro-logo" />
      </Col>
      <Col span={18}>
        <Menu mode="horizontal" defaultSelectedKeys={['home']} className="wcaro-menu">
          <Menu.Item key="home">
            <MenuIcon icon="home" />
          </Menu.Item>
          <Menu.Item key="info">
            <MenuIcon icon="info-circle" />
          </Menu.Item>
          <Menu.Item key="dashboard">
            <MenuIcon icon="dashboard" />
          </Menu.Item>
        </Menu>
      </Col>
      <Col span={1} style={{ textAlign: 'center' }}>
        <a href="/my-rsr/" target="_blank">
          <Icon type="user" style={{ color: '#FFFFFF', fontSize: '24px' }} />
        </a>
      </Col>
      <Col span={1} style={{ textAlign: 'right' }}>
        <Dropdown overlay={(
          <Menu onClick={({ key }) => setLang(key)}>
            <Menu.Item key="en">English</Menu.Item>
            <Menu.Item key="fr">France</Menu.Item>
            <Menu.Item key="es">Español</Menu.Item>
          </Menu>
        )} trigger={['click']}
        >
          <Button onClick={e => e.preventDefault()}>
            <strong style={{ textTransform: 'uppercase' }}>{lang}</strong>&nbsp;<Icon type="down" />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  )
}
