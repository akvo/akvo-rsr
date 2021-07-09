import React from 'react'
import { Collapse } from 'antd'
import { PanelBadge } from './PanelBadge'
import { IndicatorCard } from './IndicatorCard'

const { Panel } = Collapse

export const Indicator = ({ sections, indicators }) => {
  return (
    <Collapse className="wcaro-collapsable">
      {sections.map(section => (
        <Panel key={section.id} header={section.name} extra={(<PanelBadge count={indicators[section.id].length || 0} />)}>
          {indicators[section.id] && (
            <>
              {indicators[section.id].map(indicator => <IndicatorCard {...{ indicator }} />)}
            </>
          )}
        </Panel>
      ))}
    </Collapse>
  )
}
