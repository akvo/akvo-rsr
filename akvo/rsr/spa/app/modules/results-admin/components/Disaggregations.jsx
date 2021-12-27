import React from 'react'
import { nicenum } from '../../../utils/misc'

export const Disaggregations = ({ values }) => {
  if (!values || values?.length === 0) return null
  const dsgGroups = {}
  values.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    dsgGroups[item.category].push(item)
  })
  return Object.keys(dsgGroups).map(dsgKey => {
    let maxValue = 0
    dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value; if (it.target > maxValue) maxValue = it.target })
    return (
      <>
        <div className="label">{dsgKey}</div>
        <div className="dsg-bar">
          {dsgGroups[dsgKey].map(item => (
            <div className="dsg-item color" style={{ flex: item.value }} />
          ))}
        </div>
        <div className="legend">
          {dsgGroups[dsgKey].filter(it => it.value > 0).map(item => (
            <div className="item">
              <b>{nicenum(item.value)}</b> <span>{item.type}</span>
            </div>
          ))}
        </div>
      </>
    )
  })
}
