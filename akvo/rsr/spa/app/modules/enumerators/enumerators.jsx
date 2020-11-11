import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Collapse, Icon, Input } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { css, jsx } from '@emotion/core'
import { useSpring, animated, useTransition } from 'react-spring'
import * as actions from '../editor/actions'
import api from '../../utils/api'
import LoadingOverlay from '../../utils/loading-overlay'
import { resultTypes } from '../../utils/constants'
import './styles.scss'

const { Panel } = Collapse

const enumeratorsDummy = [
  {name: 'Jean Seberg', periods: [], indicators: [], organisation: { name: 'EUTF'}},
  { name: 'Anthony Gonzalez', indicators: [130992, 130993], organisation: {name: 'Akvo'}},
  {name: 'Jose Padillo', indicators: [], organisation: {name: 'EUTF Africa'}}
]

const Enumerators = ({ match: { params: { id } }, rf, setRF, setProjectTitle }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [src, setSrc] = useState('')
  const [selectedIndicators, setSelectedIndicators] = useState([])
  const [indicatorMap, setIndicatorMap] = useState(null)
  const generateIndicatorMap = (data) => {
    const ret = {}
    data.results.forEach(result => {
      result.indicators.forEach(indicator => {
        ret[indicator.id] = indicator
      })
    })
    setIndicatorMap(ret)
  }
  useEffect(() => {
    if (!rf) {
      api.get(`/rest/v1/project/${id}/results_framework/`)
        .then(({ data }) => {
          data.results.forEach(result => {
            result.indicators.forEach(indicator => {
              indicator.periods.forEach(period => { period.result = result.id })
            })
          })
          setRF(data)
          setLoading(false)
          setProjectTitle(data.title)
          generateIndicatorMap(data)
        })
    } else {
      setLoading(false)
      setProjectTitle(rf.title)
      generateIndicatorMap(rf)
    }
  }, [])
  const indicatorsFilter = it => {
    const srcFilter = src.length === 0 || it.title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    return srcFilter
  }
  const handleSelectIndicator = (indicatorId) => ({target: {checked}}) => {
    if(checked){
      setSelectedIndicators([...selectedIndicators, indicatorId])
    } else {
      setSelectedIndicators(selectedIndicators.filter(it => it !== indicatorId))
    }
  }
  console.log(selectedIndicators)
  return (
    <div className="enumerators-tab">
      <LoadingOverlay loading={loading} />
      {!loading && [
        <div className="top-toolbar">
          <div className="checkbox-dropdown">
            <Checkbox />
            <Icon type="caret-down" />
          </div>
          <Input placeholder={t('Find an indicator...')} prefix={<Icon type="search" />} allowClear />
        </div>,
        <div css={css`
          display: flex;
          border-top: 1px solid #ccc;
        `}>
          <div css={css`flex: 1`}>
            <Collapse
              bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
              // activeKey={activeResultKey}
              // onChange={handleChangeResult}
            >
              {rf.results.map(result => (
                <Panel header={[
                  <div className="text">
                    <span>{result.title}</span>
                    <div>
                      <small>{t(resultTypes.find(it => it.value === result.type)?.label)}</small>
                      <i>{t('{{count}} indicators', { count: result.indicators.length })}</i>
                    </div>
                  </div>
                ]} key={result.id}>
                  {result.indicators.filter(indicatorsFilter).map(indicator => (
                    <div className="indicator-li">
                      <Checkbox checked={selectedIndicators.indexOf(indicator.id) !== -1} onChange={handleSelectIndicator(indicator.id)} />
                      <div>
                        <h5>{indicator.title}</h5>
                        <div>
                          <span>Enumerator:</span> <b>-</b>
                        </div>
                      </div>
                    </div>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </div>
          {/* <div className="enum-list"> */}
            {/* <Slider page={selectedIndicators.length === 0 ? 0 : 1}> */}
          <EnumeratorList {...{ selectedIndicators, indicatorMap}} />
              {/* <div className="assignment view">
                <header>
                  Indicator Assignment
                </header>
                <p>{selectedIndicators.length} indicator selected</p>
              </div> */}
            {/* </Slider> */}
          {/* </div> */}
        </div>
      ]}
    </div>
  )
}

const EnumeratorList = ({ selectedIndicators, indicatorMap }) => {
  return [
    <div className="enum-list view">
      <header>
        Enumerators List
      </header>
      {/* <p>There are no enumerators assigned to this project yet</p> */}
      <ul>
      {enumeratorsDummy.sort((a, b) => b.indicators.length - a.indicators.length).map(enumerator => {
        const selectedUnassigned = selectedIndicators.filter(indicatorId => enumerator.indicators.indexOf(indicatorId) === -1)
        return [
          <li>
            <div css={css`width: 100%`}>
              <h5>{enumerator.name}</h5>
              {selectedUnassigned.length > 0 && [
                <div className="selected">
                  {selectedUnassigned.length} indicators selected
                  <Button type="primary" size="small">Assign</Button>
                </div>
              ]}
              {enumerator.indicators.length === 0 ? [
                <div css={css`margin: 10px 14px 14px; color: #aaa;`}>No assignments</div>
              ] : [
                  // <span>Assigned to {enumerator.indicators.length} indicators</span>,
                  <Collapse bordered={false} className="assignment-collapse">
                    <Collapse.Panel header={[
                      <span>Assigned to {enumerator.indicators.length} indicators</span>,
                      <Button size="small">Unassign All</Button>
                    ]}>
                      <ul>
                        {enumerator.indicators.map(indicatorId =>
                          <li>
                            <h5>{indicatorMap?.[indicatorId].title}</h5>
                            <Button size="small">Unassign</Button>
                          </li>
                        )}
                      </ul>
                    </Collapse.Panel>
                  </Collapse>
                ]}
            </div>
            {/* {selectedIndicators.length > 0 && (
              selectedIndicators.filter(indicatorId => enumerator.indicators.indexOf(indicatorId) === -1).length > 0 ?
                <Button type="primary" size="small">Assign</Button> :
                <Button type="primary" disabled size="small">Assigned</Button>
            )
            } */}
          </li>
        ]
      }
      )}
      </ul>
    </div>
  ]
}

const Slider = ({ children, page }) => {
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(0px)' }))
  useEffect(() => {
    xset({ transform: `translateX(${page * -370}px)`, config: { tension: 240, friction: 29 } })
  }, [page])
  return [
    <animated.div style={xprops} className="slider-container">
      {children}
    </animated.div>
  ]
}

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

export default connect(
  null, actions
)(Enumerators)
