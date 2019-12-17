import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { Icon, Button, Dropdown, Menu } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSpring, animated, useTransition } from 'react-spring'

const langs = ['en', 'es', 'fr']
const langNames = { en: 'English', fr: 'Français', es: 'Español'}
const flags = {}
langs.forEach(lang => {
  flags[lang] = require(`./images/${lang}.png`) // eslint-disable-line
})

const langMenu = ({ userRdr, dispatch, i18n }) => {
  const setLang = (lang) => {
    dispatch({ type: 'SET_LANG', lang })
    i18n.changeLanguage(lang)
  }
  return (
    <Menu className="lang-menu">
      {['en', 'es', 'fr'].filter(it => it !== userRdr.lang).map((lang, index) => (
        <Menu.Item key={index} onClick={() => setLang(lang)}>
          <span>{langNames[lang]}</span>
          <img src={flags[lang]} />
        </Menu.Item>
      ))}
    </Menu>
  )
}

const config = {
  mass: 1, tension: 160, friction: 27
}

const TopBar = ({ userRdr, dispatch }) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(-270px)' }))
  const _setMenuVisible = (value) => {
    setMenuVisible(value)
    if(value){
      setTimeout(() => xset({ transform: 'translateX(0px)', config}), 100)
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
  const { t, i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(userRdr.lang)
  }, [])
  return (
    <div className="top-bar">
      <div className="ui container">
        <div className="hamburger" onClick={() => _setMenuVisible(true)} role="button" tabIndex="-1">
          <Icon type="menu" />
        </div>
        <a href={`/${userRdr.lang}/projects`}>
          <img className="logo" src="/logo" />
        </a>
        <div className="right-side">
          {userRdr.firstName &&
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item key="0">
                  <a href="/en/myrsr/details/">{t('My details')}</a>
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
          {/* <Link to="/projects"><Button type="primary" ghost>{t('My projects')}</Button></Link> */}
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
                    <Link to="/projects" className={match ? 'active' : null}>Projects</Link>
                  )} />
                </li>
                <li><a href="#1">Programs</a></li>
                {userRdr.canManageUsers && <li><a href={`/${userRdr.lang}/myrsr/user_management`}>{t('Users')}</a></li>}
                <li><a href={`/${userRdr.lang}/myrsr/iati`}>IATI</a></li>
                <li><a href={`/${userRdr.lang}/myrsr/reports`}>{t('Reports')}</a></li>
              </ul>
              <div className="div">settings</div>
              <ul>
                <li><a href="/en/myrsr/details/">{t('My details')}</a></li>
                <li><a href="/en/sign_out">{t('Sign out')}</a></li>
              </ul>
              <Dropdown overlay={langMenu({ userRdr, dispatch, i18n })} trigger={['click']} placement="topLeft" overlayStyle={{ zIndex: 99999}}>
                <div className="change-lang">Change language<span className="lang"><img src={flags[userRdr.lang]} /></span></div>
              </Dropdown>
            </animated.div>
            <animated.div className="bg" style={props} onClick={() => _setMenuVisible(false)} role="button" tabIndex="-2" />
          </div>
        )
      })}
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(TopBar)
