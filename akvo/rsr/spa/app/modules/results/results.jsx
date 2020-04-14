import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse } from 'antd'
import { Route } from 'react-router-dom'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'

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
                        <div>
                          <h5>Indicator <b>{iindex + 1}</b>: {findex === -1 ? indicator.title : [indicator.title.substr(0, findex), <b>{indicator.title.substr(findex, src.length)}</b>, indicator.title.substr(findex + src.length)]}</h5>
                          <div className="label">{indicatorTypes.find(it => it.value === indicator.type).label}</div>
                          <div className="count-label">{indicator.periods.length + 1} periods</div>
                        </div>
                        <Icon type="right" />
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Route path="/projects/:projectId/results/indicator/:id" exact render={(props) => <Indicator {...props} />} />
    </div>
  )
}

const Indicator = ({ match: {params: {id}} }) => {
  return (
    <div className="indicator-content">
      <Collapse accordion className="periods">
        <Panel header="01 Sep 2019 - 01 Feb 2020">
          <div className="graph">
            <div className="timeline">
              <div className="target">
                <div className="cap">target value</div>
                <div><b>70</b></div>
              </div>
              <div className="actual">
                <div className="text">
                  <div className="cap">actual value</div>
                  <div><small>23%</small><b>23</b></div>
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
          </div>
        </Panel>
      </Collapse>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} } }) => ({ results, isFetched })
)(Results)
