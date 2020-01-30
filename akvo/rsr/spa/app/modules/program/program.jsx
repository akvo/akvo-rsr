import React from 'react'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import classNames from 'classnames'
import './styles.scss'
import Indicator from './indicator'
import Result from './result'
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
      <Collapse defaultActiveKey="0" accordion bordered={false} expandIcon={({isActive}) => <ExpandIcon isActive={isActive} />}>
      {results.map((result, index) =>
        <Panel key={index} header={<div><h1>{result.title}</h1><span>{result.indicatorCount} indicators</span></div>}>
          <Result programId={params.id} id={result.id} />
        </Panel>
      )}
      </Collapse>
      <div id="chartjs-tooltip" />
    </div>
  )
}

export default Program
