import React, { useState } from 'react'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import classNames from 'classnames'
import { Route, Link } from 'react-router-dom'
import './styles.scss'
import Result from './result'
import {useFetch} from '../../utils/hooks'
import Hierarchy from '../hierarchy/hierarchy'

const { Panel } = Collapse
const { TabPane } = Tabs

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({ match: {params} }) => {
  const [{results = [], title}, loading] = useFetch(`/project/${params.projectId}/results`)
  return (
    <div className="program-view">
      <header className="main-header">
        <h1>{title}</h1>
        <Route path={`/programs/${params.projectId}/:view`} children={({match}) => {
          const view = match ? match.params.view : ''
          return (
            <Tabs size="large" activeKey={view}>
              <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="" />
              <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
              <TabPane tab="Reports" disabled key="3" />
            </Tabs>
          )
        }} />
      </header>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Route path="/programs/:projectId" exact render={() =>
      <Collapse defaultActiveKey="0" accordion bordered={false} expandIcon={({isActive}) => <ExpandIcon isActive={isActive} />}>
      {results.map((result, index) =>
        <Panel key={index} header={<div><h1>{result.title}</h1><span>{result.indicatorCount} indicators</span></div>}>
          <Result programId={params.projectId} id={result.id} />
        </Panel>
      )}
      </Collapse>
      } />
      <Route path="/programs/:projectId/hierarchy" render={() =>
        <Hierarchy {...{ match: { params } }} noHeader />
      } />
      <div id="chartjs-tooltip" />
      <div id="bar-tooltip" />
    </div>
  )
}

export default Program
