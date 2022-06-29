import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Icon, Spin, Tabs, Select } from 'antd'
import classNames from 'classnames'
import { Route, Link, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { uniq, uniqBy } from 'lodash'
import useSWR from 'swr'

import './styles.scss'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import * as actions from '../editor/actions'
import ProgramView from '../program-view/ProgramView'
import { FilterBar } from '../program-view/filter-bar'

const { TabPane } = Tabs

const Program = ({ match: { params }, userRdr, ...props }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [countryOptions, setCountryOptions] = useState(null)
  const [periodOptions, setPeriodOptions] = useState(null)
  const [contribOptions, setContribOptions] = useState(null)
  const [partnerOptions, setPartnerOptions] = useState(null)
  const { data: apiData, error: apiError } = useSWR(`/program/${params.projectId}/results/?format=json`, url => api.get(url).then(res => res.data))
  const { data: apiOptions, error: errOptions } = useSWR(`/project/${params.projectId}/results`, url => api.get(url).then(res => res.data))
  const { results, title, targetsAt } = apiData || {}
  const { results: resultOptions } = apiOptions || {}
  console.log('apiOptions', resultOptions)
  useEffect(() => {
    if (loading && results) {
      setLoading(false)
    }
  }, [loading, results, countryOptions, periodOptions, contribOptions, partnerOptions])
  const canEdit = userRdr.programs && userRdr.programs.find(program => program.id === parseInt(params.projectId, 10))?.canEditProgram
  const _title = (!props?.title && title) ? title : props?.title ? props.title : t('Untitled program')

  // console.log('partnerOptions', partnerOptions)
  // console.log('periods', periodOptions)
  return (
    <div className="program-view">
      <Route path="/programs/:id/:view?" render={({ match }) => {
        const view = match.params.view ? match.params.view : ''
        return (
          <div className="ui container">
            <header className={classNames('main-header', { editor: match.params.view === 'editor' })}>
              <h1>{!loading && _title}</h1>
            </header>
            <Tabs size="large" activeKey={view}>
              {(results || !match.params.view) && <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="" />}
              {canEdit && <TabPane tab={<Link to={`/programs/${params.projectId}/editor`}>Editor</Link>} key="editor" />}
              <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
              <TabPane tab={<Link to={`/programs/${params.projectId}/reports`}>Reports</Link>} key="reports" />
            </Tabs>
          </div>
        )
      }} />
      <Route path="/programs/:projectId" exact render={() => (
        <div id="program-filter-bar">
          <FilterBar {...{ loading }} />
        </div>
      )} />
      <div className="ui container">
        <div className="program-view">
          {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
          <Route path="/programs/:projectId" exact render={() => (
            <>
              {(apiError) && <Redirect to={`/programs/${params.projectId}/editor`} />}
              {results && (
                <ProgramView
                  {...{
                    results
                  }}
                />
              )}
            </>
          )} />
          <Route path="/programs/:programId/hierarchy/:projectId?" render={(_props) =>
            <Hierarchy {..._props} canEdit={canEdit} program />
          } />
          <Route path="/programs/:projectId/reports" render={() =>
            <Reports programId={params.projectId} />
          } />
          <Route path="/programs/:id/editor" render={({ match: { params } }) =>
            <Editor {...{ params }} program />
          } />
          <div id="bar-tooltip" />
          <div id="disagg-bar-tooltip" />
        </div>
      </div>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { title } } }, userRdr }) => ({ title, userRdr }), actions
)(Program)
