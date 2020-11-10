import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Collapse, Icon, Input } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { css, jsx } from '@emotion/core'
import * as actions from '../editor/actions'
import api from '../../utils/api'
import LoadingOverlay from '../../utils/loading-overlay'
import { resultTypes } from '../../utils/constants'
import './styles.scss'

const { Panel } = Collapse

const Enumerators = ({ match: { params: { id } }, rf, setRF, setProjectTitle }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [src, setSrc] = useState('')
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
        })
    } else {
      setLoading(false)
      setProjectTitle(rf.title)
    }
  }, [])
  const indicatorsFilter = it => {
    const srcFilter = src.length === 0 || it.title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    return srcFilter
  }
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
                      <Checkbox />
                      <div>
                        <h5>{indicator.title}</h5>
                        <div>
                          <span>Enumerator:</span> <b>-</b>
                        </div>
                      </div>
                    </div>
                    // <Panel header={indicatorTitle(indicator.title)} key={indicator.id}>
                    //   <Indicator {...{ indicator, treeFilter, statusFilter, toggleSelectedPeriod, selectedPeriods, userRdr, periodFilter, pushUpdate, patchPeriod, getSetPeriodsRef: handleSetPeriodsRef(indicator.id) }} projectId={id} indicatorId={indicator.id} resultId={result.id} measure={indicator.measure} />
                    // </Panel>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </div>
          <div css={css`
            padding: 0 10px;
            border: 1px solid #ccc;
            border-top: none;
          `}>
            <div css={css`
              padding: 10px 0;
              border-bottom: 1px solid #ccc;
              text-align: center;
            `}>
              Full Enumerators List
            </div>
            <p>There are no enumerators assigned to this project yet</p>
          </div>
        </div>
      ]}
    </div>
  )
}


const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

export default connect(
  null, actions
)(Enumerators)
