import React from 'react'
import classNames from 'classnames'
import './dsg-overview.scss'
import { Tooltip } from 'antd'

const DsgOverview = ({ disaggregations, targets, period, values = [], updatesListRef, setHover}) => {
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
  const approvedUpdates = period.updates.filter(it => it.status === 'A')
  const unapprovedUpdates = values.filter(it => it.status !== 'A')
  const totalValue = approvedUpdates.reduce((acc, val) => acc + val.value, 0)
  const handleValueClick = (index) => () => {
    updatesListRef.current.children[0].children[index].children[0].click()
  }
  const perc = period.targetValue > 0 ? Math.round((values.filter(it => it.status === 'A').reduce((a, v) => a + v.value, 0) / period.targetValue) * 100 * 10) / 10 : 0
  return (
    <div className="dsg-overview">
      <header>
        <div className="labels">
          <div className="value-label actual">
            <div className="label">Actual value</div>
            <div className="value">{String(values.filter(it => it.status === 'A').reduce((acc, v) => acc + v.value, 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          </div>
          {period.targetValue > 0 && (
            <div className="value-label target">
              <div className="label">Target value</div>
              <div className="value">{String(period.targetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>
          )}
        </div>
        <div className="bar">
          {values.map((value, index) => {
            return (
              <Tooltip title={String(value.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}>
              <div
                className={classNames('fill', { draft: value.status === 'D'})}
                style={{ flex: period.targetValue > 0 ? value.value / period.targetValue : 1 }}
                onClick={handleValueClick(index)}
                role="button"
                tabIndex="-1"
              >
                {perc > 0 && value.status === 'A' && (index === values.length - 1 || values[index + 1].status === 'D') && <span className={classNames('text-color', perc < 20 ? 'flip' : 'no-flip')}>{perc}%</span>}
              </div>
              </Tooltip>
            )
          })}
          {/* {period.targetValue > 0 && <div className="target">{String(period.targetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>} */}
        </div>
      </header>
      <div className="groups">
      {Object.keys(dsgGroups).map(dsgKey => {
        let maxValue = 0
        dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value })
        const withTargets = dsgGroups[dsgKey].filter(it => it.target > 0).length > 0
        return (
          <div className="disaggregation-group">
            <div>
              <h5>Disaggregations: {dsgKey}</h5>
              <div className="horizontal bar-chart">
                <ul className="disaggregations-bar">
                {dsgGroups[dsgKey].map(item => {
                  const drafts = item.vals.filter(it => it.status === 'D')
                  const perc = item.target > 0 ? Math.round((item.vals.filter(it => it.status === 'A').reduce((a, v) => a + v.val, 0) / item.target) * 100 * 10) / 10 : 0
                  return (
                    <li className="dsg-item">
                      <div className="labels">
                        <div className="value-label actual text-color">
                          <div className="label">{item.type}</div>
                          <div className="value">{String(item.vals.filter(it => it.status === 'A').reduce((acc, v) => acc + v.val, 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                        </div>
                        {item.target > 0 && (
                          <div className="value-label target">
                            <div className="label">Target</div>
                            <div className="value">{String(item.target).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                          </div>
                          )}
                      </div>
                      <div className="bar">
                        {item.vals.map(({ val, status }, index) => {
                          return (
                            <Tooltip title={String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}>
                            <div
                              className={classNames('fill color', { draft: status === 'D' })} style={{ flex: item.target > 0 ? (val / item.target) : withTargets ? 1 : (val / maxValue) }}
                            >
                                {(perc > 0 && index === item.vals.length - 1) && <span className={classNames('text-color', perc < 20 ? 'flip' : 'no-flip')}>{perc}%</span>}
                            </div>
                            </Tooltip>
                          )
                        })}
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
