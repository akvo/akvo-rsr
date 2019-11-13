import React from 'react'
import { Icon, Button } from 'antd'
import classNames from 'classnames'
import ConditionalLink from '../projects/conditional-link'

const Card = ({ project, selected, onClick }) => {
  const childrenCount = project.childrenCount ? project.childrenCount : (project.children ? project.children.length : -1)
  const { locations, title, subtitle } = project
  return (
    <li className={classNames('card', { selected })} onClick={onClick}>{/* eslint-disable-line */}
      <div className="link-holder"><ConditionalLink record={project}><Button size="large" type="primary" icon="export" onClick={e => e.stopPropagation()} /></ConditionalLink></div>
      <h4>{title ? title : 'Untitled project'}</h4>
      {subtitle && <p>{subtitle}</p>}
      <div className="footer">
        {locations && <div className="countries"><div className="inner"><Icon type="environment" /><span>{locations.filter((item, index) => locations.findIndex(it => it.country === item.country) === index && item).map(it => it.country).join(', ')}</span></div></div>}
        {childrenCount > 0 && <div className="children"><div className="inner"><b>{childrenCount}</b> <span>child projects</span></div></div>}
      </div>
    </li>
  )
}

export default Card
