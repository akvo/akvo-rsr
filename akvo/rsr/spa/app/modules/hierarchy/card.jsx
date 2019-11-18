import React from 'react'
import { Icon, Button, Tooltip } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import ConditionalLink from '../projects/conditional-link'

const Card = ({ project, selected, onClick, filterCountry, countryFilter }) => {
  const { t } = useTranslation()
  const childrenCount = project.childrenCount ? project.childrenCount : (project.children ? project.children.filter(filterCountry).length : -1)
  const { locations, title, subtitle, referenced } = project
  return (
    <li className={classNames('card', { selected, clickable: childrenCount > 0, referenced })} onClick={onClick}>{/* eslint-disable-line */}
      <div className="link-holder"><ConditionalLink record={project}><Button type="primary" icon="export" onClick={e => e.stopPropagation()} /></ConditionalLink></div>
      <h4>{title ? title : 'Untitled project'}</h4>
      {subtitle && <p>{subtitle}</p>}
      <div className="footer">
        {locations && <div className="countries"><div className="inner"><Icon type="environment" /><span>{locations.filter((item, index) => locations.findIndex(it => it.country === item.country) === index && item).map(it => it.country).join(', ')}</span></div></div>}
        {childrenCount > 0 && (
          <div className="children">
            <div className="inner">
              {(countryFilter && project.children) && <Tooltip title="Within location filter"><div className="filtered"><Icon type="filter" /></div></Tooltip>}
              <span><b>{childrenCount}</b> <span>{t('(1){child project};(2-inf){child projects};', { count: childrenCount, postProcess: 'interval' })}</span></span>
            </div>
          </div>)}
      </div>
    </li>
  )
}

export default Card
