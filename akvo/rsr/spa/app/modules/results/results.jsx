import React from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin } from 'antd'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'

const Results = ({ results = [], isFetched }) => {
  return (
    <div className="results-view">
      <div className="sidebar">
        <header>
          <Input placeholder="Find an indicator..." prefix={<Icon type="search" />} />
        </header>
        <ul>
          {!isFetched && <Spin indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />} />}
          {results.map((result, index) => (
            <li>
              <h5><b>{index + 1}.</b> {result.title}</h5>
              <div className="label">{resultTypes.find(it => it.value === result.type).label}</div>
              <div className="count-label">{result.indicators.length + 1} indicators</div>
              {result.indicators.length > 0 && (
                <ul>
                  {result.indicators.map((indicator, iindex) => (
                    <li>
                      <div>
                        <h5>Indicator <b>{iindex + 1}</b>: {indicator.title}</h5>
                        <div className="label">{indicatorTypes.find(it => it.value === indicator.type).label}</div>
                        <div className="count-label">{indicator.periods.length + 1} periods</div>
                      </div>
                      <Icon type="right" />
                    </li>
                  ))}
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
