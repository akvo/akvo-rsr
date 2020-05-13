import React, { useEffect, useState } from 'react'
import { Collapse, Icon, Spin } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import Indicator from './indicator'
import api from '../../utils/api'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const Aux = node => node.children

const Result = ({ programId, id, countryFilter, results, setResults }) => {
  const { t } = useTranslation()
  const [indicators, setIndicators] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const resultIndex = results.findIndex(it => it.id === id)
    if (resultIndex > -1 && results[resultIndex].indicators.length > 0) {
      setIndicators(results[resultIndex].indicators)
      setLoading(false)
    } else {
      api.get(`/project/${programId}/result/${id}/`)
        .then(({ data }) => {
          setIndicators(data.indicators)
          setLoading(false)
          if (resultIndex > -1){
            setResults([...results.slice(0, resultIndex), {...results[resultIndex], indicators: data.indicators}, ...results.slice(resultIndex + 1)])
          }
        })
    }
  }, [id])
  return (
    <Aux>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} /></div>}
      {!loading &&
      <Collapse defaultActiveKey={indicators.map(it => it.id)} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {indicators.map(indicator =>
        <Panel
          key={indicator.id}
          header={
            <div>
              <h3>{indicator.title}</h3>
              <div><span className="type">{indicator.type}</span> <span className="periods">{t('nperiods', { count: indicator.periodCount })}</span></div>
            </div>}
          destroyInactivePanel
        >
          <Indicator periods={indicator.periods} indicatorType={indicator.type} {...{countryFilter}} />
        </Panel>
      )}
      </Collapse>
      }
    </Aux>
  )
}

export default Result
