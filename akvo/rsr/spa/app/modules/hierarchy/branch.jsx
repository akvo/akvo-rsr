import React from 'react'
import { Icon } from 'antd'

const Branch = ({ item, level }) => {
  const { locations } = item
  return (
    <div className={`branch level-${level}`}>
      <div className="content">
        {level === 0 && <span className="label">Program</span>}
        {level > 0 && <span className="label">Level {level}</span>}
        <h5>{item.title}</h5>
        <p>{item.subtitle}</p>
        {locations && <div className="countries"><div className="inner"><Icon type="environment" /><span>{locations.filter((_item, index) => locations.findIndex(it => it.country === _item.country) === index && item).map(it => it.country).join(', ')}</span></div></div>}
      </div>
      {item.children && item.children.map(child => <Branch item={child} level={level + 1} />)}
    </div>
  )
}

export default Branch
