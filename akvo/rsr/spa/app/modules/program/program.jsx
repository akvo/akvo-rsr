/* global window, document */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import classNames from 'classnames'
import { Route, Link, Redirect, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './styles.scss'
import Result from './result'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import StickyClass from './sticky-class'
import { setProjectTitle } from '../editor/actions'
import * as programmeActions from './store/actions'
import FilterBar from './FilterBar'

const { Panel } = Collapse
const { TabPane } = Tabs

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({
  match: { params, path },
  userRdr,
  editable,
  programmeRdr: results,
  ...props
}) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [targetsAt, setTargetsAt] = useState(null)
  const initiate = () => {
    if (params.projectId !== 'new') {
      api.get(`/project/${params.projectId}/results?format=json`)
        .then(({ data }) => {
          const _results = data.results.map(it => ({ ...it, indicators: [], fetched: false }))
          props.setProgrammeResults(_results)
          setTitle(data.title)
          props.setProjectTitle(data.title)
          document.title = `${data.title} | Akvo RSR`
          setLoading(false)
          setTargetsAt(data.targetsAt)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }
  useEffect(initiate, [params.projectId])
  const handleResultChange = (index) => {
    if (index != null) {
      window.scroll({ top: 142 + index * 88, behavior: 'smooth' })
    }
  }
  const canEdit = (editable || (userRdr.programs && userRdr.programs.find(program => program.id === parseInt(params.projectId, 10))?.canEditProgram))
  const _title = (!props?.title && title) ? title : props?.title ? props.title : t('Untitled program')
  const location = useLocation()
  const currentView = location?.pathname?.split('/')
  return (
    <div className="program-view">
      <div className="ui container">
        <header className={classNames('main-header', { editor: params.view === 'editor' })}>
          <h1>{_title || t('Untitled program')}</h1>
        </header>
        <Tabs size="large" activeKey={currentView[3] || 'overview'}>
          {(results.length > 0 || !params.view) && <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="overview" />}
          {canEdit && <TabPane tab={<Link to={`/programs/${params.projectId}/editor`}>Editor</Link>} key="editor" />}
          <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
          <TabPane tab={<Link to={`/programs/${params.projectId}/reports`}>Reports</Link>} key="reports" />
        </Tabs>
      </div>
      <Route
        exact
        path={path}
        render={() => {
          if (loading) {
            return (
              <div className="loading-container">
                <Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} />
              </div>
            )
          }
          if (!loading && results?.length === 0) return <Redirect to={`/programs/${params.projectId}/editor`} />
          return (
            <>
              <div id="program-filter-bar">
                <div className="ui container">
                  <FilterBar source={results} loading={loading} />
                </div>
              </div>
              <div className="ui container">
                <div className="program-view">
                  <Collapse defaultActiveKey="0" destroyInactivePanel onChange={handleResultChange} accordion bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
                    {results.map((result, index) =>
                      <Panel
                        key={index}
                        header={(
                          <StickyClass offset={20}>
                            <h1>{result.title}</h1>
                            <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorCount })}</span></div>
                          </StickyClass>
                        )}
                      >
                        <Result programId={params.projectId} {...{ ...result, targetsAt }} />
                      </Panel>
                    )}
                  </Collapse>
                </div>
              </div>
            </>
          )
        }}
      />
      <Route path={`${path}/hierarchy`} render={(_props) =>
        <div className="ui container mt-30">
          <Hierarchy {..._props} canEdit={canEdit} program />
        </div>
      }
      />
      <Route path={`${path}/reports`} render={() =>
        <div className="ui container mt-30">
          <Reports programId={params.projectId} />
        </div>
      }
      />
      <Route path="/programs/:id/editor" render={({ match: { params } }) =>
        <div className="ui container">
          <Editor {...{ params }} program />
        </div>
      }
      />
      <div id="bar-tooltip" />
      <div id="disagg-bar-tooltip" />
    </div>
  )
}

export default connect(
  ({
    editorRdr: {
      section1: {
        fields: {
          title,
          editable,
        }
      }
    },
    userRdr,
    programmeRdr
  }) => ({
    title,
    editable,
    userRdr,
    programmeRdr
  }), ({ ...programmeActions, setProjectTitle })
)(Program)
