import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin } from 'antd'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'

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
        {/* TODO: make this fetch only section5, then fetch the rest upon switch tab */}
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
    </div>
  )
}

export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} } }) => ({ results, isFetched })
)(Results)
