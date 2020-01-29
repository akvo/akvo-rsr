import React from 'react'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import classNames from 'classnames'
import './styles.scss'
import Indicator from './indicator'
import {useFetch} from '../../utils/hooks'

const { Panel } = Collapse
const { TabPane } = Tabs

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({ match: {params} }) => {
  const [{results = [], title}, loading] = useFetch(`/project/${params.id}/results`)
  return (
    <div className="program-view">
      <header className="main-header">
        <h1>{title}</h1>
        <Tabs size="large">
          <TabPane tab="Overview" key="1" />
          <TabPane tab="Hierarchy" key="2" />
        </Tabs>
      </header>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
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
      <div id="chartjs-tooltip" />
    </div>
  )
}

export default Program
