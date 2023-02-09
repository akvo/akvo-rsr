import React, { useEffect } from 'react'
import { Collapse, Icon, Spin } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Indicator from './indicator'
import api from '../../utils/api'
import StickyClass from './sticky-class'
import * as actions from './store/actions'
import Highlighted from '../../components/Highlighted'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Result = ({
  id,
  programId,
  indicators,
  targetsAt,
  fetched,
  search,
  programmeRdr: results,
  ...props
}) => {
  const { t } = useTranslation()
  useEffect(() => {
    if (!fetched) {
      const rx = results.findIndex(it => it.id === id)
      api
        ?.get(`/project/${programId}/result/${id}/`)
        ?.then(({ data }) => {
          if (rx > -1) props.updateProgrammePerResult(rx, { ...data, fetched: true })
        })
        ?.catch(() => {
          props.updateProgrammePerResult(rx, { fetched: true })
        })
    }
  }, [fetched, indicators])
  const defaultActiveKey = indicators?.map((_, ix) => ix)
  return (
    <Spin spinning={!fetched} indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />}>
      <Collapse defaultActiveKey={defaultActiveKey} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {indicators.map((indicator, ix) =>
          <Panel
            key={ix}
            data-id={indicator.id}
            header={
              <StickyClass top={40}>
                <h3><Highlighted text={indicator.title} highlight={search} /></h3>
                <div><span className="type">{indicator.type}</span> <span className="periods">{t('nperiods', { count: indicator.periodCount })}</span></div>
              </StickyClass>}
          >
            <Indicator
              periods={indicator.periods}
              indicatorType={indicator.type}
              scoreOptions={indicator.scoreOptions}
              {...{
                targetsAt,
                indicator,
                fetched,
              }}
            />
          </Panel>
        )}
      </Collapse>
    </Spin>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(Result)
