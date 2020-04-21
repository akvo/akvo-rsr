import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse, Button } from 'antd'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { useTranslation } from 'react-i18next'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'
import api from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'

const { Panel } = Collapse
const Aux = node => node.children

const Results = ({ results = [], isFetched, match: {params: {id}}}) => {
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
            <li>
              <h5><b>{index + 1}.</b> {result.title}</h5>
              <div className="label">{resultTypes.find(it => it.value === result.type).label}</div>
              <div className="count-label">{result.indicators.length + 1} indicators</div>
              {result.indicators.length > 0 && (
                <ul>
                  {result.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1)
                  .map((indicator, iindex) => {
                    const findex = src === '' ? -1 : indicator.title.toLowerCase().indexOf(src.toLowerCase())
                    return (
                      <li>
                        <Link to={`/projects/${id}/results/indicator/${indicator.id}`}>
                        <div>
                          <h5>Indicator <b>{iindex + 1}</b>: {findex === -1 ? indicator.title : [indicator.title.substr(0, findex), <b>{indicator.title.substr(findex, src.length)}</b>, indicator.title.substr(findex + src.length)]}</h5>
                          <div className="label">{indicatorTypes.find(it => it.value === indicator.type).label}</div>
                          <div className="count-label">{t('nperiods', { count: indicator.periods.length })}</div>
                        </div>
                        <Icon type="right" />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {/* <Collapse accordion>
          {results.map(result => (
            <Panel header={result.title}>
              <div>
                <Collapse>
                {result.indicators.map(indicator => (
                  <Panel header={indicator.title}>asd</Panel>
                ))}
                </Collapse>
              </div>
            </Panel>
          ))}
        </Collapse> */}
      <Route path="/projects/:projectId/results/indicator/:id" exact render={(props) => <Indicator {...{...props, projectId: id}} />} />
      </div>
    </div>
  )
}

const Indicator = ({ projectId, match: {params: {id}} }) => {
  const [periods, setPeriods] = useState(null)
  const [loading, setLoading] = useState(true)
  // const [data, loading] = useFetch(`/project/${projectId}/indicator/${id}/`)
  useEffect(() => {
    if(id){
      api.get(`/project/${projectId}/indicator/${id}/`)
      .then(({data}) => {
        setPeriods(data.periods)
        setLoading(false)
        console.log(data.periods)
      })
    }
  }, [id])
  return (
    <div className="indicator-content">
      {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 25 }} spin />} />}
      <Collapse accordion className="periods">
        {periods && periods.map(period => {
          const points = [[0, 260]]
          const chartWidth = 377 - String(period.actualValue).length * 20 - 20
          let value = 0
          const totalValue = period.updates.reduce((acc, val) => acc + val.value, 0)
          const maxValue = totalValue > period.targetValue ? totalValue : period.targetValue
          const goalReached = totalValue >= period.targetValue
          period.updates.forEach((update, index) => { value += update.value; points.push([((index + 1) / period.updates.length) * chartWidth, 260 - (value / maxValue) * 250]) })
          return (
            <Panel header={<div>{period.periodStart} - {period.periodEnd}</div>}>
              <div className="graph">
                <div className="sticky">
                  <div className="timeline-container">
                    <div className="timeline">
                      <div className="target">
                        <div className="cap">target value</div>
                        <div><b>{period.targetValue}</b></div>
                      </div>
                      <div className="actual" style={{ top: 270 - (value / maxValue) * 257 }}>
                        <div className="text">
                          <div className="cap">actual value</div>
                          <div className="val"><small>{Math.round((period.actualValue / period.targetValue) * 100 * 10) / 10}%</small><b>{period.actualValue}</b></div>
                        </div>
                      </div>
                      <svg width="370px" height="270px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <polyline id="Path" fill="#eaf3f2" points={[...points, [points[points.length - 1][0], 260]].map(p => p.join(' ')).join(' ')} />
                          <polyline id="Path-Copy" stroke="#43998f" strokeWidth="3" points={points.map(p => p.join(' ')).join(' ')} />
                          {points.slice(1).map((point, pi) => [
                            <line x1={point[0]} y1={point[1]} x2={point[0]} y2="270" stroke="#43998f" strokeWidth="1.5" {...pi === points.length - 2 ? {} : { strokeDasharray: '1.3 4'}} strokeLinecap="round" />,
                            <circle {...pi === points.length - 2 ? { fill: goalReached ? '#43998f' : '#fff', stroke: '#43998f', strokeWidth: 2, r: 9} : { fill: '#43998f', r: 6 }} cx={point[0]} cy={point[1]} />
                          ])}
                          {goalReached && (
                            <g transform="translate(247, 0)">
                              <path d="M20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10" fill="#ecbaa1" />
                            </g>
                          )}
                          <line x1="0" y1="260" x2="350" y2="260" stroke="#43998f" strokeWidth="1" />
                          <g transform="translate(345.5, 257)">
                            <polygon id="Path-2" fill="#43998f" points="0.897746169 0 0.897746169 6.63126533 6.47011827 3.31563267" />
                          </g>
                        </g>
                      </svg>
                      <div className="bullets">
                        {points.slice(1).map((point, pi) => <div style={{ left: point[0] }}><span>{pi + 1}</span></div>)}
                      </div>
                    </div>
                  </div>
                  <div className="baseline-values">
                    <div className="baseline-value value">
                      <div className="label">baseline value</div>
                      <div className="value">250</div>
                    </div>
                    <div className="baseline-value year">
                      <div className="label">baseline year</div>
                      <div className="value">2019</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="updates">
                <Collapse accordion defaultActiveKey="0" className="updates-list">
                {period.updates.map((update, index) =>
                  <Panel
                    key={index}
                    header={
                      <Aux>
                        <div className="value">{update.value}</div>
                        <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                        <div className="label">{update.user.name}</div>
                        {/* <div className="status">Pending approval</div> */}
                        {update.status.code === 'A' && (
                          <div className="status approved">
                            <SVGInline svg={approvedSvg} />
                            <div className="text">
                              Approved<br />
                              by {update.approvedBy && update.approvedBy.name}
                            </div>
                          </div>
                        )}
                      </Aux>
                    }
                  >
                  {(update.comments.length > 0 || update.disaggregations.length > 0) &&
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
                  </Panel>
                )}
                </Collapse>
                <Button type="dashed" icon="plus" block size="large">Add an update</Button>
              </div>
            </Panel>
            )
        }
        )}
      </Collapse>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} } }) => ({ results, isFetched })
)(Results)
