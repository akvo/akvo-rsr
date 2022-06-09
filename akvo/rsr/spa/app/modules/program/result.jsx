import React, { useEffect } from 'react'
import { Collapse, Icon, Spin } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import Indicator from './indicator'
import api from '../../utils/api'
import StickyClass from './sticky-class'
import Highlighted from '../../components/Highlighted'
import { filterByKeywords, filterByPeriods } from './filters'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const Aux = node => node.children

const Result = ({
  id,
  search,
  filtering,
  programId,
  indicators,
  targetsAt,
  fetched,
  results,
  setResults,
  periods: listPeriods,
  type: indicatorType,
  indicatorTitles
}) => {
  const { t } = useTranslation()
  useEffect(() => {
    if (!fetched && !(indicators.length)) {
      const resultIndex = results.findIndex(it => it.id === id)
      api
        ?.get(`/project/${programId}/result/${id}/`)
        ?.then(({ data }) => {
          if (resultIndex > -1) {
            setResults([
              ...results.slice(0, resultIndex),
              { ...results[resultIndex], indicators: data.indicators, fetched: true },
              ...results.slice(resultIndex + 1)
            ])
          }
        })
        ?.catch(() => {
          setResults([
            ...results.slice(0, resultIndex),
            { ...results[resultIndex], fetched: true },
            ...results.slice(resultIndex + 1)
          ])
        })
    }
  }, [fetched, indicators])
  return (
    <Aux>
      <Collapse defaultActiveKey={indicatorTitles.map((_, tx) => tx)} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {
          fetched
            ? indicators?.filter((i) => filterByKeywords(i.title, search))?.map((indicator, ix) => {
              const periods = indicator.periods.filter((p) => filterByPeriods(p, filtering))
              return (
                <Panel
                  key={ix}
                  header={
                    <StickyClass top={40}>
                      <h3><Highlighted text={indicator.title} highlight={search} /></h3>
                      <div><span className="type">{indicator.type}</span> <span className="periods color-periods">{t('nperiods', { count: periods?.length })}</span></div>
                    </StickyClass>}
                >
                  <Indicator indicatorType={indicator.type} scoreOptions={indicator.scoreOptions} {...{ targetsAt, indicator, periods, filtering }} />
                </Panel>
              )
            })
            : indicatorTitles?.filter((i) => filterByKeywords(i, search))?.map((title, tx) => (
              <Panel
                key={tx}
                header={
                  <StickyClass top={40}>
                    <h3><Highlighted text={title} highlight={search} /></h3>
                    <div><span className="type">{indicatorType}</span> <span className="periods color-periods">{t('nperiods', { count: listPeriods.length })}</span></div>
                  </StickyClass>}
              >
                <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} /></div>
              </Panel>
            ))
        }
      </Collapse>
    </Aux>
  )
}

export default Result
