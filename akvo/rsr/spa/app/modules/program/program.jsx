/* global window, document */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import { Route, Link, Redirect, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import useSWR from 'swr'
import moment from 'moment'

import './program.scss'
import Result from './result'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import StickyClass from './sticky-class'
import { setProjectTitle } from '../editor/actions'
import * as programmeActions from './store/actions'
import FilterBar from './FilterBar'
import { handleOnCountFiltering, handleOnFiltering } from './utils/query'
import Highlighted from '../../components/Highlighted'

const { Panel } = Collapse
const { TabPane } = Tabs

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Program = ({
  match: { params, path },
  filterRdr: filtering,
  userRdr,
  editable,
  programmeRdr,
  ...props
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(null)

  const { data: apiData, error: apiError } = useSWR(`/project/${params.projectId}/results?format=json`, url => api.get(url).then(res => res.data))
  const { targetsAt, title } = apiData || {}
  const initiate = () => {
    if (loading && apiData) {
      const { results: apiResults } = apiData
      const _results = apiResults.map(r => {
        const _indicators = r
          ?.indicatorTitles
          ?.map((it) => ({
            title: it,
            type: 'Loading...',
            targetValue: null,
            scoreOptions: [],
            periodCount: r?.periods?.length,
            periods: r?.periods?.map((p) => {
              const { 0: periodStart, 1: periodEnd } = p
              return ({
                periodStart: moment(periodStart, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                periodEnd: moment(periodEnd, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                contributors: []
              })
            })
          }))
        return ({
          ...r,
          indicators: _indicators,
          fetched: false
        })
      })
      props.setProgrammeResults(_results)
      props.setProjectTitle(title)
      document.title = `${title} | Akvo RSR`
      setLoading(false)
    }
    if (loading && (params.projectId === 'new' || apiError)) {
      setLoading(false)
    }
  }
  const handleResultChange = (index) => {
    if (index != null) {
      window.scroll({ top: 142 + index * 88, behavior: 'smooth' })
    }
  }
  useEffect(initiate, [loading, apiData, apiError])
  const resultItems = handleOnFiltering(programmeRdr, filtering, search)
  const totalMatches = handleOnCountFiltering(resultItems, filtering, search)
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
          {(programmeRdr.length > 0 || !params.view) && <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="overview" />}
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
          if (!loading && programmeRdr.length === 0) return <Redirect to={`/programs/${params.projectId}/editor`} />
          return (
            <>
              <div id="program-filter-bar">
                <div className="ui container">
                  <FilterBar programID={params.projectId} {...{ search, setSearch, totalMatches }} />
                </div>
              </div>
              <div className="ui container">
                <div className="program-view">
                  <Collapse defaultActiveKey="0" destroyInactivePanel onChange={handleResultChange} accordion bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
                    {resultItems.map((result, index) =>
                      <Panel
                        key={index}
                        header={(
                          <StickyClass offset={20}>
                            <h1>
                              <Highlighted text={result.title} highlight={search} />
                            </h1>
                            <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorCount })}</span></div>
                          </StickyClass>
                        )}
                      >
                        <Result programId={params.projectId} {...{ ...result, targetsAt, search }} />
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
    programmeRdr,
    filterRdr,
  }) => ({
    title,
    editable,
    userRdr,
    programmeRdr,
    filterRdr,
  }), ({ ...programmeActions, setProjectTitle })
)(Program)
