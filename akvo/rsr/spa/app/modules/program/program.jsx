import React, { useEffect } from 'react'
import { Collapse, Icon } from 'antd'
import classNames from 'classnames'
import './styles.scss'
import Indicator from './indicator'
import {useFetch} from '../../utils/hooks'

const { Panel } = Collapse

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({ match: {params} }) => {
  const [results, loading] = useFetch(`/program/${params.id}/results`)
  return (
    <div className="program-view">
      <Collapse defaultActiveKey={['0']} bordered={false} expandIcon={({isActive}) => <ExpandIcon isActive={isActive} />}>
      {results.map((result, index) =>
        <Panel key={index} header={<div><h1>{result.title}</h1><span>{result.indicators.length} indicators</span></div>}>
          <Collapse expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
          {result.indicators.map(indicator =>
          <Panel
            header={
            <div>
              <h3>{indicator.title}</h3>
              <div><span className="type">{indicator.type}</span> <span className="periods">{indicator.periodCount} periods</span></div>
            </div>}
            destroyInactivePanel
          >
            <Indicator id={indicator.id} programId={params.id} />
          </Panel>
          )}
          </Collapse>
        </Panel>
      )}
      </Collapse>
    </div>
  )
}

export default Program
