/* global window */
import React from 'react'
import { Row, Col, Menu, Dropdown, Button, Icon } from 'antd'
import SVGInline from 'react-svg-inline'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const MenuIcon = ({ icon, ...props }) => <Icon type={icon} theme="filled" className="menu-icon" style={{ fontSize: '24px', paddingLeft: '0.3em' }} {...props} />

export const Navbar = ({
  logo,
  lang,
  user,
  setLang,
  menuKey,
  setMenuKey
}) => {
  const history = useHistory()
  const { t } = useTranslation()
  return (
    <Row className="wcaro-navbar">
      <Col span={4} style={{ paddingTop: '10px', height: '64px' }}>
        <SVGInline svg={logo} className="wcaro-logo" />
      </Col>
      <Col span={18}>
        <Menu mode="horizontal" selectedKeys={[menuKey]} className="wcaro-menu" onClick={({ key }) => setMenuKey(key)}>
          <Menu.Item key="info" onClick={() => history.push('/')}>
            <MenuIcon icon="info-circle" />
          </Menu.Item>
          {user && (
            <Menu.Item key="dashboard" onClick={() => history.push('/dir/framework')}>
              <MenuIcon icon="dashboard" />
            </Menu.Item>
          )}
        </Menu>
      </Col>
      <Col span={1} style={{ textAlign: 'center' }}>
        {user
          ? (
            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu>
                  <Menu.Item key="my-projects">
                    <a target="_blank" rel="noopener noreferrer" href="/my-rsr">{t('My Projects')}</a>
                  </Menu.Item>
                  <Menu.Item key="my-details">
                    <a target="_blank" rel="noopener noreferrer" href="/my-rsr/my-details/">{t('My details')}</a>
                  </Menu.Item>
                  <Menu.Item key="sign-out">
                    <a href="/en/sign_out">{t('Sign out')}</a>
                  </Menu.Item>
                </Menu>
              }
            >
              <span style={{ cursor: 'pointer' }}>
                <Icon type="user" className="wcaro-nav-icon" />
              </span>
            </Dropdown>
          )
          : (
            <a href={`/en/sign_in/?next=${window.location.href}`} target="_blank" rel="noopener noreferrer">
              <Icon type="user" className="wcaro-nav-icon" />
            </a>
          )}
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
