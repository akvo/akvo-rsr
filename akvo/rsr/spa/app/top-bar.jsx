import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Route, withRouter } from 'react-router-dom'
import { Icon, Button, Dropdown, Menu } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { useSpring, animated, useTransition } from 'react-spring'
import Announcement from './modules/announcements/announcement'

const langs = ['en', 'es', 'fr']
const langNames = { en: 'English', fr: 'Français', es: 'Español'}

const langMenu = ({ userRdr, dispatch, i18n }) => {
  const setLang = (lang) => {
    dispatch({ type: 'SET_LANG', lang })
    i18n.changeLanguage(lang)
  }
  return (
    <Menu className="lang-menu">
      {langs.filter(it => it !== userRdr.lang).map((lang, index) => (
        <Menu.Item key={index} onClick={() => setLang(lang)}>
          <span>{langNames[lang]}</span>
        </Menu.Item>
      ))}
    </Menu>
  )
}


const LinkItem = ({ to, children, basicLink}) => (
  <Route
    path={to}
    exact
    children={({ match }) => {
      if (!basicLink) return <Link className={classNames({ active: match })} to={to}>{children}</Link>
      return <a className={classNames({ active: match })} href={`/my-rsr${to}`}>{children}</a>
    }}
  />
)

const config = {
  mass: 1, tension: 160, friction: 27
}
const TopBar = ({ userRdr, dispatch, location }) => {
  const { t, i18n } = useTranslation()
  const [menuVisible, setMenuVisible] = useState(false)
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(-270px)' }))
  const _setMenuVisible = (value) => {
    setMenuVisible(value)
    if (value) {
      setTimeout(() => xset({ transform: 'translateX(0px)', config }), 100)
    } else {
      xset({ transform: 'translateX(-270px)', config: { tension: 200, friction: 25 } })
    }
  }
  const transitions = useTransition(menuVisible ? [true] : [], item => item.key, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 350 }
  })
  useEffect(() => {
    if(menuVisible){
      _setMenuVisible(false)
    }
  }, [location])
  useEffect(() => {
    i18n.changeLanguage(userRdr.lang)
    setTimeout(() => i18n.changeLanguage(userRdr.lang), 1000)
  }, [])
  return [
    <div className="top-bar">
      <div className="ui container">
        <div className="hamburger" onClick={() => _setMenuVisible(true)} role="button" tabIndex="-1">
          <Icon type="menu" />
        </div>
        <a href="/">
          <img className="logo" src="/logo" />
        </a>
        <div id="top-portal-root" />
        <div className="right-side">
          {userRdr.firstName &&
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item key="0">
                  <a href="/my-rsr/my-details/">{t('My details')}</a>
                </Menu.Item>
                <Menu.Item key="1">
                  <a href="/en/sign_out">{t('Sign out')}</a>
                </Menu.Item>
              </Menu>
            }
          >
            <span className="user ant-dropdown-link">
              {userRdr.firstName} {userRdr.lastName} <Icon type="caret-down" />
            </span>
          </Dropdown>
          }
          <Link to="/"><Button type="primary" ghost>{t('My projects')}</Button></Link>
        </div>
      </div>
      {transitions.map(({props}) => {
        return (
          <div className="side-menu-container">
            <animated.div style={xprops} className="side-menu">
              <header>
                <span className="text">Hi {userRdr.firstName}</span>
                <Button icon="close" type="ghost" onClick={() => _setMenuVisible(false)} />
              </header>
              <ul>
                <li>
                  <Route path="/projects" exact children={({ match }) => (
                    <Link to="/projects" className={match ? 'active' : null}>{t('My projects')}</Link>
                  )} />
                </li>
                {(userRdr.canManageUsers) && <li><LinkItem to="/users">{t('Users')}</LinkItem></li>}
                <li><Link to="/iati">IATI</Link></li>
                <li><Link to="/reports">{t('Organisation Reports')}</Link></li>
              </ul>
              <div className="div">settings</div>
              <ul>
                <li><a href="/my-rsr/my-details/">{t('My details')}</a></li>
                <li><a href="/en/sign_out">{t('Sign out')}</a></li>
              </ul>
              <Dropdown overlay={langMenu({ userRdr, dispatch, i18n })} trigger={['click']} placement="topLeft" overlayStyle={{ zIndex: 99999}}>
                <div className="change-lang">{t('Change language')}<span className="lang"><b>{userRdr.lang}</b></span></div>
              </Dropdown>
            </animated.div>
            <animated.div className="bg" style={props} onClick={() => _setMenuVisible(false)} role="button" tabIndex="-2" />
          </div>
        )
      })}
    </div>,
    userRdr.seenAnnouncements && <Announcement {...{ userRdr, openMenu: () => _setMenuVisible(true) }} />
  ]
}

export default withRouter(connect(
  ({ userRdr }) => ({ userRdr })
)(TopBar))
