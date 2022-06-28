/* global */
import React from 'react'
import { Collapse } from 'antd'
import { useTranslation } from 'react-i18next'

import StickyClass from '../program/sticky-class'
import ExpandIcon from '../program/ExpandIcon'
import Highlighted from '../../components/Highlighted'

const { Panel } = Collapse

const ProgramView = ({
  results,
  countryFilter,
  filterCountry
}) => {
  const { t } = useTranslation()
  return (
    <Collapse bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {results.filter(filterCountry(countryFilter)).map(result => (
        <Panel
          key={result.id}
          header={(
            <StickyClass offset={20}>
              <h1>{result.title}</h1>
              <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicators.length })}</span></div>
            </StickyClass>
          )}
        >
          <Collapse
            defaultActiveKey={result.indicators.map((i) => i.id)}
            expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          >
            {result.indicators.map((i) => (
              <Panel
                key={i.id}
                header={(
                  <StickyClass top={40}>
                    <h3><Highlighted text={i.title} highlight={null} /></h3>
                    <div><span className="type">{i.type}</span> <span className="periods">{t('nperiods', { count: i.periods.length })}</span></div>
                  </StickyClass>
                )}
              >
                hello
              </Panel>
            ))}
          </Collapse>
        </Panel>
      ))}
    </Collapse>
  )
}

export default ProgramView
