import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse } from 'antd'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'
import api from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'

const { Panel } = Collapse

const Results = ({ results = [], isFetched, match: {params: {id}}}) => {
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
                          <div className="count-label">{indicator.periods.length + 1} periods</div>
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
        {periods && periods.map(period =>
        <Panel header={<div>{period.periodStart} - {period.periodEnd}</div>}>
          <div className="graph">
            <div className="timeline">
              <div className="target">
                <div className="cap">target value</div>
                <div><b>{period.targetValue}</b></div>
              </div>
              <div className="actual">
                <div className="text">
                  <div className="cap">actual value</div>
                  <div><small>23%</small><b>{period.actualValue}</b></div>
                </div>
              </div>
              <svg width="370px" height="260px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <polyline id="Path" fill="#eaf3f2" points="1 260 40 241 80 200 120 190 160 150 160 260" />
                  <polyline id="Path-Copy" stroke="#43998f" strokeWidth="3" points="1 260 40 241 80 200 120 190 160 150" />
                  <circle id="Oval" fill="#43998f" cx="40" cy="241" r="6" />
                  <circle id="Oval" fill="#43998f" cx="80" cy="200" r="6" />
                  <circle id="Oval" fill="#43998f" cx="120" cy="190" r="6" />
                  <circle id="Oval" fill="#43998f" cx="160" cy="150" r="6" />
                  <line x1="40" y1="241" x2="40" y2="260" stroke="#43998f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.3 4" />
                  <line x1="80" y1="200" x2="80" y2="260" stroke="#43998f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.3 4" />
                  <line x1="120" y1="190" x2="120" y2="260" stroke="#43998f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.3 4" />
                </g>
              </svg>
              <div className="bullets">
                <div style={{ left: 40 }}>1</div>
                <div style={{ left: 80 }}>2</div>
                <div style={{ left: 120 }}>3</div>
              </div>
            </div>
            {/* <div className="disaggregations">
              <div className="cap">disaggregations</div>
              <div className="bars">
                <div className="bar" />
              </div>
            </div> */}
          </div>
          <div className="updates">
            {period.updates.map(update =>
            <div className="update">
              <header>
                <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                <div className="label">{update.user.name}</div>
                {/* <div className="status">Pending approval</div> */}
                {update.status.code === 'A' && (
                  <div className="status approved">
                    <SVGInline svg={approvedSvg} />
                    <div className="text">
                    Approved<br />
                    by {update.approvedBy.name}
                    </div>
                  </div>
                )}
              </header>
              <div className="values">
                <div className="value-container">
                  <div className="value">{update.value}</div>
                </div>
                <div className="disaggregations">
                  <span>Disaggregations: Gender breakdown</span>
                  <ul>
                    <li><span>Men</span><span>4 (26%)</span></li>
                    <li><span>Women</span><span>4 (26%)</span></li>
                  </ul>
                </div>
              </div>
              <div className="comments">
                <div className="label">Value comment</div>
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
            )}
          </div>
        </Panel>
        )}
      </Collapse>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} } }) => ({ results, isFetched })
)(Results)
