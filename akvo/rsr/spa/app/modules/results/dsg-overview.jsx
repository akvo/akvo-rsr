import React from 'react'
import classNames from 'classnames'
import './dsg-overview.scss'

const DsgOverview = ({disaggregations, targets, period, values = []}) => {
  const dsgGroups = {}
  disaggregations.filter(it => it.value > 0).forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = targets.find(it => it.category === item.category && it.type === item.type)
    const dsgIndex = dsgGroups[item.category].findIndex(it => it.type === item.type)
    if(dsgIndex === -1){
      dsgGroups[item.category].push({ ...item, vals: [{ val: item.value, status: item.status}], target: target ? target.value : null })
    } else {
      dsgGroups[item.category][dsgIndex].vals.push({ val: item.value, status: item.status })
    }
  })
  console.log(dsgGroups)
  const approvedUpdates = period.updates.filter(it => it.status.code === 'A')
  const unapprovedUpdates = values.filter(it => it.status.code !== 'A')
  const totalValue = approvedUpdates.reduce((acc, val) => acc + val.value, 0)
  return (
    <div className="dsg-overview">
      <header>
        <div className="labels">
          <div className="label">Actual value</div>
          {period.targetValue > 0 && (
            <div className="target">
              <b>{Math.round((totalValue / period.targetValue) * 100 * 10) / 10}%</b>
              {unapprovedUpdates.length > 0 && <i>&nbsp;({Math.round((values.reduce((a, v) => a + v.value, 0) / period.targetValue) * 100 * 10) / 10}%)</i>}
              <span>&nbsp;of target</span>
            </div>
          )}
        </div>
        <div className="bar">
          {values.map((value, index) => {
            return (
              <div className={classNames('fill', { draft: value.status.code === 'D'})} style={{ flex: period.targetValue > 0 ? value.value / period.targetValue : 1 }}>
                {/* {totalValue}{(period.actualValue > period.targetValue && period.targetValue > 0) && ` of ${period.targetValue}`} */}
                {value.status.code === 'A' && (index === values.length - 1 || values[index + 1].status.code === 'D') && <span>{totalValue}{(period.actualValue > period.targetValue && period.targetValue > 0) && ` of ${period.targetValue}`}</span>}
              </div>
            )
          })}
          {period.targetValue > 0 && <div className="target">{period.targetValue}</div>}
        </div>
      </header>
      <div className="groups">
      {Object.keys(dsgGroups).map(dsgKey => {
        let maxValue = 0
        dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value })
        const withTargets = dsgGroups[dsgKey].filter(it => it.target > 0).length > 0
        console.log(maxValue)
        return (
          <div className="disaggregation-group">
            <div>
              <h5>Disaggregations: {dsgKey}</h5>
              <div className="horizontal bar-chart">
                <ul className="disaggregations-bar">
                {dsgGroups[dsgKey].map(item => {
                  const drafts = item.vals.filter(it => it.status === 'D')
                  return (
                    <li className="dsg-item">
                      <div className="labels">
                        <div className="label">{item.type}</div>
                        {item.target > 0 && (
                          <div className="target">
                            <b>{Math.round((item.vals.filter(it => it.status === 'A').reduce((a, v) => a + v.val, 0) / item.target) * 100 * 10) / 10}%</b>
                            {drafts.length > 0 && <i>&nbsp;({Math.round((item.vals.reduce((a, v) => a + v.val, 0) / item.target) * 100 * 10) / 10}%)</i>}
                            <span>of target</span>
                          </div>)}
                      </div>
                      <div className="bar">
                        {item.vals.map(({ val, status }, index) => {
                          return (
                            <div className={classNames('fill color', { draft: status === 'D' })} style={{ flex: item.target > 0 ? (val / item.target) : withTargets ? 1 : (val / maxValue) }}>
                              {status === 'A' && (index === item.vals.length - 1 || item.vals[index + 1].status === 'D') && <span>{item.value}{(item.value > item.target && item.target > 0) && ` of ${item.target}`}</span>}
                            </div>
                          )
                        })}
                        {item.target > 0 && <div className="target">{item.target}</div>}
                      </div>
                    </li>
                    )
                })}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default DsgOverview
