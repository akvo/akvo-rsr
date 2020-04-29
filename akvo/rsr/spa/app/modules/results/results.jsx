import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse, Button, Form, InputNumber } from 'antd'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'
import api from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'

const { Panel } = Collapse
const { Item } = Form
const Aux = node => node.children

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Results = ({ results = [], isFetched, userRdr, match: {params: {id}}}) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const filteredResults = results.filter(it => {
    return it.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1).length > 0
  })
  return (
    <div className="results-view">
      <div className="sidebar">
        <header>
          <Input value={src} onChange={(ev) => setSrc(ev.target.value)} placeholder="Find an indicator..." prefix={<Icon type="search" />} allowClear />
        </header>
        {/* TODO: make this fetch only section5, then fetch the rest upon tab switch */}
        <ProjectInitHandler id={id} match={{ params: { id, section: 'section1' }}} />
        <ul>
          {!isFetched && <Spin indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />} />}
          {filteredResults.map((result, index) => (
            <Route
              path={`/projects/${id}/results/${result.id}/indicators/:indicatorId`}
              exact
              children={({ match }) =>
              <li className={match && 'active'}>
                <h5><b>{index + 1}.</b> {result.title}</h5>
                <div className="label">{resultTypes.find(it => it.value === result.type).label}</div>
                <div className="count-label">{result.indicators.length + 1} indicators</div>
                {result.indicators.length > 0 && (
                  <ul>
                    {result.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1)
                    .map((indicator, iindex) => {
                      const findex = src === '' ? -1 : indicator.title.toLowerCase().indexOf(src.toLowerCase())
                      return (
                        <Route
                          path={`/projects/${id}/results/${result.id}/indicators/${indicator.id}`}
                          exact
                          children={({ match: _match }) =>
                          <li className={_match && 'active'}>
                            <Link to={`/projects/${id}/results/${result.id}/indicators/${indicator.id}`}>
                            <div>
                              <h5>Indicator <b>{iindex + 1}</b>: {findex === -1 ? indicator.title : [indicator.title.substr(0, findex), <b>{indicator.title.substr(findex, src.length)}</b>, indicator.title.substr(findex + src.length)]}</h5>
                              <div className="label">{indicatorTypes.find(it => it.value === indicator.type).label}</div>
                              <div className="count-label">{t('nperiods', { count: indicator.periods.length })}</div>
                            </div>
                            <Icon type="right" />
                            </Link>
                          </li>
                          }
                        />
                      )
                    })}
                  </ul>
                )}
              </li>
              }
            />
          ))}
        </ul>
      </div>
      <div className="main-content">
        {/* <Collapse accordion bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
          {results.map(result => (
            <Panel header={result.title}>
              <Collapse destroyInactivePanel bordered={false}>
              {result.indicators.map(indicator => (
                <Panel header={indicator.title}>
                  <Indicator userRdr={userRdr} projectId={id} match={{ params: {id: indicator.id }}} />
                </Panel>
              ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse> */}
      <Route path="/projects/:projectId/results/:resId/indicators/:id" exact render={(props) => <Indicator {...{...props, projectId: id, userRdr}} />} />
      </div>
    </div>
  )
}

const Indicator = ({ projectId, match: {params: {id}}, userRdr }) => {
  const [periods, setPeriods] = useState(null)
  const [loading, setLoading] = useState(true)
  const [baseline, setBaseline] = useState({})
  useEffect(() => {
    if(id){
      api.get(`/project/${projectId}/indicator/${id}/`)
      .then(({data}) => {
        setPeriods(data.periods)
        setBaseline({ year: data.baselineYear, value: data.baselineValue })
        setLoading(false)
      })
    }
  }, [id])
  return (
    <Aux>
      {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 25 }} spin />} />}
      <Collapse accordion className="periods" bordered={false}>
        {periods && periods.map((period, index) => <Period {...{period, index, baseline, userRdr}} />
        )}
      </Collapse>
    </Aux>
  )
}

const Period = ({ period, baseline, userRdr, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const updatesListRef = useRef()
  useEffect(() => {
    setUpdates(period.updates)
  }, [])
  const handleAccordionChange = (key) => {
    setPinned(key)
  }
  const addUpdate = () => {
    setUpdates([...updates, {
      isNew: true,
      status: {code: 'D'},
      createdAt: new Date().toISOString(),
      value: 0,
      user: {
        name: `${userRdr.firstName} ${userRdr.lastName}`
      },
      comments: [],
      disaggregations: []
    }])
    setPinned(String(updates.length))
    setEditing(updates.length)
  }
  const cancelNewUpdate = () => {
    setUpdates(updates.slice(0, updates.length - 2))
    setPinned(-1)
  }
  const handleValueChange = (value) => {
    setUpdates([...updates.slice(0, editing), {...updates[editing], value}, ...updates.slice(editing + 1)])
  }
  const handleValueSubmit = () => {
    const { text, value } = updates[editing]
    api.post('/indicator_period_data_framework/', {
      period: period.periodId,
      user: userRdr.id,
      value,
      text,
      status: 'A'
    })
    .then(() => {
      setUpdates([...updates.slice(0, editing), { ...updates[editing], isNew: false, status: {code: 'A'} }, ...updates.slice(editing + 1)])
      setEditing(-1)
    })
  }
  return (
    <Panel {...props} header={<div>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</div>}>
      <div className="graph">
        <div className="sticky">
          <Timeline {...{ updates, period, pinned, updatesListRef, setHover }} />
          {baseline.value &&
          <div className="baseline-values">
            <div className="baseline-value value">
              <div className="label">baseline value</div>
              <div className="value">{baseline.value}</div>
            </div>
            <div className="baseline-value year">
              <div className="label">baseline year</div>
              <div className="value">{baseline.year}</div>
            </div>
          </div>
          }
        </div>
      </div>
      <div className="updates" ref={(ref) => { updatesListRef.current = ref }}>
        <Collapse accordion activeKey={pinned} onChange={handleAccordionChange} className="updates-list">
          {updates.map((update, index) =>
            <Panel
              key={index}
              className={update.isNew && 'new-update'}
              header={
                <Aux>
                  {editing !== index && <div className={classNames('value', { hovered: hover === index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>}
                  <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                  <div className="label">{update.user.name}</div>
                  {update.status.code === 'A' && (
                    <div className="status approved">
                      <SVGInline svg={approvedSvg} />
                      <div className="text">
                        Approved<br />
                        {update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}
                      </div>
                    </div>
                  )}
                  {(update.isNew && editing === index) && (
                    <div className="btns">
                      <Button type="primary" size="small" onClick={handleValueSubmit}>Submit</Button>
                      <Button type="link" size="small" onClick={cancelNewUpdate}>Cancel</Button>
                    </div>
                  )}
                </Aux>
              }
            >
              {editing !== index && ((update.comments && update.comments.length > 0) || (update.disaggregations && update.disaggregations.length > 0)) &&
                <div className="update">
                  {update.disaggregations.length > 0 &&
                    <div className="disaggregations">
                      <span>Disaggregations: Gender breakdown</span>
                      <ul>
                        <li><span>Men</span><span>4 (26%)</span></li>
                        <li><span>Women</span><span>4 (26%)</span></li>
                      </ul>
                    </div>
                  }
                  <div className="comments">
                    <div className="label">Value comments <div className="count">{update.comments.length}</div></div>
                    {update.comments.map(comment => (
                      <div className="comment">
                        <div className="top">
                          <b>{comment.user.name}</b>
                          <b>{moment(comment.createdAt).format('DD MMM YYYY')}</b>
                        </div>
                        <p>{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
              {editing === index && (
                <Form layout="vertical">
                  <Item label="Value to add">
                    <InputNumber
                      size="large"
                      formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={val => val.replace(/(,*)/g, '')}
                      onChange={handleValueChange}
                    />
                  </Item>
                  <Item label={[<span>Value comment</span>, <small>Optional</small>]}>
                    <Input.TextArea />
                  </Item>
                </Form>
              )}
            </Panel>
          )}
        </Collapse>
        {!(updates.length > 0 && updates[updates.length - 1].isNew) && <Button type="dashed" icon="plus" block size="large" onClick={addUpdate}>Add an update</Button>}
      </div>
    </Panel>
  )
}

const Timeline = ({ updates, period, pinned, updatesListRef, setHover }) => {
  let svgHeight = 260
  const approvedUpdates = updates.filter(it => it.status.code === 'A')
  const unapprovedUpdates = updates.filter(it => it.status.code !== 'A')
  const totalValue = approvedUpdates.reduce((acc, val) => acc + val.value, 0)
  const totalProjectedValue = totalValue + unapprovedUpdates.reduce((acc, val) => acc + val.value, 0)
  if (!period.targetValue && totalValue === 0) { svgHeight = 50 }
  const points = [[0, svgHeight]]
  const chartWidth = 350
  let value = 0
  let maxValue = totalProjectedValue > period.targetValue ? totalProjectedValue : period.targetValue
  if (maxValue === 0) maxValue = 1
  // console.log(maxValue)
  const goalReached = period.targetValue && totalValue >= period.targetValue
  approvedUpdates.forEach((update, index) => { value += update.value; points.push([((index + 1) / updates.length) * chartWidth, svgHeight - (value / maxValue) * (svgHeight - 10)]) })

  const projectedPoints = [points[points.length - 1]]
  unapprovedUpdates.forEach((update, index) => { value += update.value; projectedPoints.push([((points.length + index) / updates.length) * chartWidth, svgHeight - (value / maxValue) * (svgHeight - 10)]) })

  const handleBulletEnter = (index) => {
    setHover(index)
  }
  const handleBulletLeave = (index) => {
    setHover(null)
  }
  const handleBulletClick = (index) => {
    updatesListRef.current.children[0].children[index].children[0].click()
  }
  return (
  <div className="timeline-container">
    {updates.length === 0 && (
      <div className="no-updates" style={period.targetValue ? { transform: 'translateY(150px)' } : {}}>No updates yet</div>
    )}
    {(period.targetValue > 0 || updates.length > 0) &&
      <div className="timeline" style={{ height: svgHeight + 50 }}>
        {period.targetValue > 0 &&
          <div className="target">
            <div className="cap">target value</div>
            <div><b>{String(period.targetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></div>
          </div>
        }
        <div
          className="actual"
          style={{
            top: (!period.targetValue && approvedUpdates.length === 0) ? 0 : svgHeight - ((totalValue / maxValue) * (svgHeight - 10)) - 12,
            right: (unapprovedUpdates.length > 0 && approvedUpdates.length > 0) ? (unapprovedUpdates.length / updates.length) * chartWidth + 7 : 0
          }}
        >
          <div className="cap">actual value</div>
          <div className="val">
            {period.targetValue > 0 && <small>{Math.round((totalValue / period.targetValue) * 100 * 10) / 10}%</small>}
            <b>{String(totalValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
          </div>
        </div>
        {unapprovedUpdates.length > 0 && (
          <div
            className="projected actual"
            style={{
              top: (!period.targetValue && approvedUpdates.length === 0) ? 0 : svgHeight - ((value / maxValue) * (svgHeight - 10)) - 12,
            }}
          >
            <small>projected</small>
            <div className="cap">actual value</div>
            <div className="val">
              {period.targetValue > 0 && <small>{Math.round((value / period.targetValue) * 100 * 10) / 10}%</small>}
              <b>{String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            </div>
          </div>
        )}
        {svgHeight > 50 && <div className="actual-line" style={{ top: svgHeight - ((totalValue / maxValue) * (svgHeight - 10)) + 43 }} />}
        <svg width="370px" height={svgHeight + 10} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <line x1="0" y1={svgHeight} x2="365" y2={svgHeight} stroke="#43998f" strokeWidth="1" />
            <g transform={`translate(364, ${svgHeight - 3.5})`}>
              <polygon id="Path-2" fill="#43998f" points="0.897746169 0 0.897746169 6.63126533 6.47011827 3.31563267" />
            </g>
            {svgHeight > 50 && [
              <polyline fill="#eaf3f2" points={[...points, [points[points.length - 1][0], svgHeight]].map(p => p.join(' ')).join(' ')} />,
              <polyline stroke="#43998f" strokeWidth="3" points={points.map(p => p.join(' ')).join(' ')} />
            ]}
            {projectedPoints.length > 1 && [
              <polyline fill="#eaf3f2" opacity="0.7" points={[points.length > 1 ? points[points.length - 2] : null, ...projectedPoints, [projectedPoints[projectedPoints.length - 1][0], svgHeight]].filter(it => it !== null).map(p => p.join(' ')).join(' ')} />,
              <polyline stroke="#43998f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.3 4" points={projectedPoints.map(p => p.join(' ')).join(' ')} />,
              projectedPoints.slice(1).map(point => [
                <line x1={point[0]} y1={point[1]} x2={point[0]} y2={svgHeight + 10} stroke="#43998f" strokeWidth="1.5" strokeDasharray="1.3 4" strokeLinecap="round" />,
                <circle {...{ fill: '#fff', r: 6, stroke: '#43998f' }} strokeWidth="1.5" cx={point[0]} cy={point[1]} />
              ])
            ]}
            <g>
              {points.slice(1).map((point, pi) => [
                <line x1={point[0]} y1={point[1]} x2={point[0]} y2={svgHeight + 10} stroke="#43998f" strokeWidth="1.5" {...pi === points.length - 2 ? {} : { strokeDasharray: '1.3 4' }} strokeLinecap="round" />,
                <circle {...pi === points.length - 2 ? { fill: goalReached ? '#43998f' : '#fff', stroke: '#43998f', strokeWidth: 2, r: 9 } : { fill: '#43998f', r: 6 }} cx={point[0]} cy={point[1]} />
              ])}
            </g>
            {goalReached && (
              <g transform="translate(340, 0)">
                <path d="M20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10" fill="#ecbaa1" />
              </g>
            )}
          </g>
        </svg>
        <div className="bullets">
          {points.slice(1).map((point, pi) => <div style={{ left: point[0] }} className={Number(pinned) === pi && 'pinned'} onMouseEnter={() => handleBulletEnter(pi)} onMouseLeave={() => handleBulletLeave(pi)} onClick={() => handleBulletClick(pi)} role="button" tabIndex="-1"><span>{pi + 1}</span></div>)}
          {projectedPoints.slice(1).map((point, pi) => <div style={{ left: point[0] }} className={Number(pinned) === pi && 'pinned'} onMouseEnter={() => handleBulletEnter(pi)} onMouseLeave={() => handleBulletLeave(pi)} onClick={() => handleBulletClick(pi)} role="button" tabIndex="-1"><span>{points.length - 1 + pi + 1}</span></div>)}
        </div>
      </div>
    }
  </div>
  )
}

export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} }, userRdr }) => ({ results, isFetched, userRdr })
)(Results)
