import React from 'react'
import { Collapse } from 'antd'
import { PanelBadge } from './PanelBadge'
import { IndicatorCard } from './IndicatorCard'

const { Panel } = Collapse

export const Indicator = ({ indicators }) => {
  return (
    <Collapse className="wcaro-collapsable" style={{ borderRadius: '0' }}>
      {indicators.Impact && (
        <Panel header="IMPACT" extra={(<PanelBadge count={indicators.Impact.length} />)}>
          {indicators.Impact.map(indicator => <IndicatorCard key={indicator.id} {...{ indicator }} />)}
        </Panel>
      )}
      {indicators.Outcome && (
        <Panel header="OUTCOME" extra={(<PanelBadge count={indicators.Outcome.length} />)}>
          {indicators.Outcome.map(indicator => <IndicatorCard key={indicator.id} {...{ indicator }} />)}
        </Panel>
      )}
      {indicators.Output && (
        <Panel header="OUTPUT" extra={(<PanelBadge count={indicators.Output.length} />)}>
          {indicators.Output.map(indicator => <IndicatorCard key={indicator.id} {...{ indicator }} />)}
        </Panel>
      )}
    </Collapse>
  )
}
