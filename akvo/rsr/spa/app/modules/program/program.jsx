/* global document */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Icon, Spin, Tabs } from 'antd'
import { Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import uniq from 'lodash/uniq'
import moment from 'moment'

import './styles.scss'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import * as actions from '../editor/actions'
import ProgramView from './ProgramView'

const { TabPane } = Tabs
const Program = ({ match: { params }, userRdr, ...props }) => {
  const { t } = useTranslation()
  const [results, setResults] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [countryOpts, setCountryOpts] = useState([])
  const [targetsAt, setTargetsAt] = useState(null)
  const [contributors, setContributors] = useState([])
  const [periods, setPeriods] = useState([])
  const [partners, setPartners] = useState([])
  const [preload, setPreload] = useState(true)

  const handleOnUnique = (data, field) => {
    const ds = data
      ?.map((d) => (
        Object.keys(d[field]).map((r) => ({
          id: parseInt(r, 10),
          value: d[field][r]
        }))
      ))
      ?.flatMap((d) => d)
    return uniq(data.flatMap((r) => Object.keys(r[field])))
      ?.map((k) => ds.find((d) => d.id === parseInt(k, 10)))
      ?.sort((a, b) => a?.value?.localeCompare(b?.value))
  }
  const initiate = () => {
    setLoading(true)
    if (params.projectId !== 'new') {
      api.get(`/project/${params.projectId}/results`)
        .then(({ data }) => {
          setResults(data.results.map(it => ({ ...it, indicators: [], fetched: false })))
          setTitle(data.title)
          props.setProjectTitle(data.title)
          document.title = `${data.title} | Akvo RSR`
          setTargetsAt(data.targetsAt)
          // collect country opts
          const opts = []
          data.results.forEach(result => {
            result.countries.forEach(opt => { if (opts.indexOf(opt) === -1) opts.push(opt) })
          })
          setCountryOpts(opts)
          setContributors(handleOnUnique(data.results, 'contributors'))
          setPartners(handleOnUnique(data.results, 'partners'))
          const pds = uniq(data.results
            ?.flatMap((r) => r.periods)
            ?.filter((p) => (p[0] && p[1]))
            ?.map((p) => `${moment(p[0], 'YYYY-MM-DD').format('DD/MM/YYYY')} - ${moment(p[1], 'YYYY-MM-DD').format('DD/MM/YYYY')}`))
            ?.sort((a, b) => {
              const xb = b.split(' - ')
              const xa = a.split(' - ')
              return moment(xb[1], 'DD/MM/YYYY').format('YYYY') - moment(xa[1], 'DD/MM/YYYY').format('YYYY')
            })
          setPeriods(pds)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }
  useEffect(initiate, [params.projectId])
  useEffect(() => {
    const totalResults = results.length
    const totalFetched = results?.filter((r) => (r.fetched)).length
    if (preload && totalResults > 0 && (totalResults === totalFetched)) {
      setPreload(false)
    }
  }, [preload, results])
  const canEdit = userRdr.programs && userRdr.programs.find(program => program.id === parseInt(params.projectId, 10))?.canEditProgram
  const _title = (!props?.title && title) ? title : props?.title ? props.title : t('Untitled program')
  return (
    <div className="program-view">
      <Route path="/programs/:id/:view?" render={({ match }) => {
        const view = match.params.view ? match.params.view : ''
        return [
          <header className={classNames('main-header', { editor: match.params.view === 'editor' })}>
            <h1>{!loading && _title}</h1>
          </header>,
          <Tabs size="large" activeKey={view}>
            {(results.length > 0 || !match.params.view) && <TabPane tab={<Link to={`/programs/${params.projectId}`}>Overview</Link>} key="" />}
            {canEdit && <TabPane tab={<Link to={`/programs/${params.projectId}/editor`}>Editor</Link>} key="editor" />}
            <TabPane tab={<Link to={`/programs/${params.projectId}/hierarchy`}>Hierarchy</Link>} key="hierarchy" />
            <TabPane tab={<Link to={`/programs/${params.projectId}/reports`}>Reports</Link>} key="reports" />
          </Tabs>
        ]
      }} />
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <Route path="/programs/:projectId" exact render={() => (
        <ProgramView
          {...{
            contributors,
            partners,
            periods,
            preload,
            params,
            loading,
            results,
            targetsAt,
            countryOpts,
            setResults
          }}
        />
      )}
      />
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
  )
}

export default connect(
  ({ editorRdr: { section1: { fields: { title } } }, userRdr }) => ({ title, userRdr }), actions
)(Program)
