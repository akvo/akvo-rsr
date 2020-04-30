import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { Icon, Button, Dropdown, Menu } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

const langs = ['en', 'es', 'fr']
const flags = {}
langs.forEach(lang => {
  flags[lang] = require(`./images/${lang}.png`) // eslint-disable-line
})

const langMenu = ({ userRdr, dispatch }) => {
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(userRdr.lang)
  }, [])
  const setLang = (lang) => {
    dispatch({ type: 'SET_LANG', lang })
    i18n.changeLanguage(lang)
  }
  return (
    <Menu className="lang-menu">
      {['en', 'es', 'fr'].filter(it => it !== userRdr.lang).map((lang, index) => (
        <Menu.Item key={index} onClick={() => setLang(lang)}><img src={flags[lang]} /></Menu.Item>
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

const ProgramsMenuItem = ({ programs = [], isAdmin, showNewProgramFlag }) => {
  const { t } = useTranslation()
  if(programs && programs.length === 1 && !isAdmin){
    return <li><LinkItem to={`/programs/${programs[0].id}`}>{t('Program')}</LinkItem></li>
  }
  if((programs && programs.length > 1) || (isAdmin && showNewProgramFlag)){
    const menu = (
    <Menu>
      {programs.map(program => <Menu.Item><LinkItem basicLink to={`/programs/${program.id}`}>{program.name || t('Untitled program')}</LinkItem></Menu.Item>)}
      {showNewProgramFlag && [
        <Menu.Divider />,
        <Menu.Item><a href="/my-rsr/programs/new/editor"><Icon type="plus" /> {t('Create new program')}</a></Menu.Item>
      ]}
    </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <li>
          <Route path={'/programs'} children={({ match }) => <a className={classNames({ active: match })}>{t('Programs')} <Icon type="caret-down" /></a>} />{/* eslint-disable-line */}
        </li>
      </Dropdown>
    )
  }
  return null
}

const TopBar = ({ userRdr, dispatch }) => {
  const { t } = useTranslation()
  // Show new feature only for selected users
  const facOrgs = new Set([42, 3210])
  const prmOrgs = new Set([42, 3394])
  const showNewFeature = userRdr.organisations && userRdr.organisations.findIndex(it => facOrgs.has(it.id)) !== -1
  const showNewProgramFlag = userRdr.organisations && userRdr.organisations.findIndex(it => prmOrgs.has(it.id)) !== -1
  return (
    <div className="top-bar">
      <div className="ui container">
        <a href={`/${userRdr.lang}/projects`}>
        <img className="logo" src="/logo" />
        </a>
        <ul>
          <ProgramsMenuItem programs={userRdr.programs} isAdmin={userRdr.isAdmin} {...{ showNewProgramFlag }} />
          {(userRdr.canManageUsers && showNewFeature) && <li><LinkItem to="/users">{t('Users')}</LinkItem></li>}
          {(userRdr.canManageUsers && !showNewFeature) && <li><a href={`/${userRdr.lang}/myrsr/user_management`}>{t('Users')}</a></li>}
          <li><a href={`/${userRdr.lang}/myrsr/iati`}>IATI</a></li>
          <li><LinkItem to="/reports">{t('Reports')}</LinkItem></li>
        </ul>
        <div className="right-side">
          <Dropdown overlay={langMenu({userRdr, dispatch})} trigger={['click']}>
            <span className="lang"><img src={flags[userRdr.lang]} /></span>
          </Dropdown>
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
          <Link to="/projects"><Button type="primary" ghost>{t('My projects')}</Button></Link>
        </div>
      </div>
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(TopBar)
