import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import './dsg-overview.scss'
import { Icon, InputNumber, Tooltip } from 'antd'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'
import api from '../../utils/api'
import { inputNumberAmountFormatting } from '../../utils/misc'
import ProgressBar from '../../components/ProgressBar'

const TargetValue = ({ targetValue, size = 'default', onUpdate }) => {
  const [editing, setEditing] = useState(false)
  const [value, onChange] = useState()
  useEffect(() => {
    onChange(targetValue)
  }, [])
  const submit = () => {
    setEditing(false)
    onUpdate(value)
  }
  if (!editing) {
    return [
      <div className="value-container">
        <div className="value">{String(targetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        <div className="edit-target-btn" onClick={() => setEditing(true)}><Icon type="edit" /></div>
      </div>
    ]
  }
  return [
    <div className="value-container">
      <div className="value"><InputNumber {...{ value, onChange, size, ...inputNumberAmountFormatting }} /></div>
      <div className="edit-target-btn done" onClick={submit}><Icon type="check" /></div>
    </div>
  ]
}

const DsgOverview = ({ disaggregations, targets, period, values = [], updatesListRef, editPeriod}) => {
  const { t } = useTranslation()
  const dsgGroups = {}
  disaggregations.filter(it => it.value > 0).forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = targets.find(it => it.category === item.category && it.type === item.type)
    const dsgIndex = dsgGroups[item.category].findIndex(it => it.type === item.type)
    if(dsgIndex === -1){
      dsgGroups[item.category].push({ ...item, vals: [{ val: item.value, status: item.status }], target: target ? target.value : null, targetId: target ? target.id : null })
    } else {
      dsgGroups[item.category][dsgIndex].vals.push({ val: item.value, status: item.status })
    }
  })
  const handleUpdateTargetValue = (value) => {
    api.patch(`/indicator_period/${period.id}/`, {
      targetValue: value
    }).then(() => {
      editPeriod({ ...period, targetValue: value })
    }).catch((e) => {
      console.error(e)
    })
  }
  const handleUpdateItemTargetValue = (item) => (value) => {
    api.patch(`/disaggregation_target/${item.targetId}/`, {
      value
    })
    .then(() => {
      const _period = cloneDeep(period)
      const it = _period.disaggregationTargets.find(it => it.id === item.targetId)
      if (it) it.value = value
      editPeriod(_period)
    })
  }
  return (
    <div className="dsg-overview">
      <header>
        <ProgressBar valueRef={updatesListRef} {...{ period, values }} />
      </header>
      <div className="groups">
      {Object.keys(dsgGroups).map(dsgKey => {
        let maxValue = 0
        dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value })
        const withTargets = dsgGroups[dsgKey].filter(it => it.target > 0).length > 0
        return (
          <div className="disaggregation-group">
            <div>
              <h5>{t('Disaggregations')}: {dsgKey}</h5>
              <div className="horizontal bar-chart">
                <ul className="disaggregations-bar">
                {dsgGroups[dsgKey].map(item => {
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
                            <div className="label">{t('Target')}</div>
                            <TargetValue size="small" targetValue={item.target} onUpdate={handleUpdateItemTargetValue(item)} />
                          </div>
                          )}
                      </div>
                      <div className="bar">
                        {item.vals.sort((a, b) => { if(b.status === 'D' && a.status !== 'D') return -1; return 0; }).filter(it => it.status !== 'P').map(({ val, status }, index) => {
                          return (
                            <Tooltip title={String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}>
                            <div
                              className={classNames('fill color', { draft: status === 'D' })} style={{ flex: item.target > 0 ? (val / item.target) : withTargets ? 1 : (val / maxValue) }}
                            >
                                {perc > 0 && status === 'A' && (index === item.vals.length - 1 || item.vals[index + 1].status === 'D') && <span className={classNames('text-color', perc < 20 ? 'flip' : 'no-flip')}>{perc}%</span>}
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
