import React, { useEffect } from 'react'
import { Collapse, Icon, Spin } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Indicator from './indicator'
import api from '../../utils/api'
import StickyClass from './sticky-class'
import * as actions from './store/actions'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const Aux = node => node.children

const Result = ({
  id,
  programId,
  countryFilter,
  indicators,
  targetsAt,
  fetched,
  programmeRdr: results,
  ...props
}) => {
  const { t } = useTranslation()
  useEffect(() => {
    if (!fetched && !(indicators.length)) {
      const resultIndex = results.findIndex(it => it.id === id)
      api
        .get(`/project/${programId}/result/${id}/`)
        .then(({ data }) => {
          if (resultIndex > -1) {
            props.updateProgrammePerResult(resultIndex, { ...data, fetched: true })
          }
        })
        .catch(() => {
          props.updateProgrammePerResult(resultIndex, { fetched: true })
        })
    }
  }, [fetched, indicators])
  return (
    <Aux>
      {!fetched && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} /></div>}
      {fetched &&
      <Collapse defaultActiveKey={indicators.map(it => it.id)} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {indicators.map((indicator) =>
        <Panel
          key={indicator.id}
          header={
            <StickyClass top={40}>
              <h3>{indicator.title}</h3>
              <div>
                <span className="type">{indicator.type}</span>
                <span className="periods">{t('nperiods', { count: indicator.periodCount })}</span>
                {indicator.cumulative && (<span className="cumulative-flag">Cumulative</span>)}
              </div>
            </StickyClass>}
          destroyInactivePanel
        >
          <Indicator {...indicator} {...{ countryFilter, targetsAt }} />
        </Panel>
      )}
      </Collapse>
      }
    </Aux>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(Result)
