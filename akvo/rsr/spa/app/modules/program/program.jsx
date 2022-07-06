import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Icon, Spin, Tabs, Select } from 'antd'
import classNames from 'classnames'
import { Route, Link, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import uniq from 'lodash/uniq'
import moment from 'moment'
import useSWR from 'swr'

import './styles.scss'
import Hierarchy from '../hierarchy/hierarchy'
import Editor from '../editor/editor'
import api from '../../utils/api'
import Reports from '../reports/reports'
import * as actions from '../editor/actions'
import ProgramView from '../program-view/ProgramView'
import countriesDict from '../../utils/countries-dict'
import { FilterBar } from '../program-view/filter-bar'
import InitialView from '../program-view/InitialView'

const { TabPane } = Tabs

const Program = ({ match: { params }, userRdr, ...props }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [countryOpts, setCountryOpts] = useState([])
  const [contributors, setContributors] = useState([])
  const [periods, setPeriods] = useState([])
  const [partners, setPartners] = useState([])
  const [filtering, setFiltering] = useState({
    countries: {
      items: [],
      apply: false
    },
    contributors: {
      items: [],
      apply: false
    },
    periods: {
      items: [],
      apply: false
    },
    partners: {
      items: [],
      apply: false
    }
  })
  const searchReff = useRef()
  const { data: apiData, error: apiError } = useSWR(`/program/${params.projectId}/results/?format=json`, url => api.get(url).then(res => res.data))
  const { data: apiOptions, error: errOptions } = useSWR(`/project/${params.projectId}/results`, url => api.get(url).then(res => res.data))
  const { results, title, targetsAt } = apiData || {}
  const { results: resultOptions } = apiOptions || {}

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
  useEffect(() => {
    if (loading && results) {
      setLoading(false)
    }
    if (resultOptions && !countryOpts.length && !contributors.length && !partners.length && !periods.length) {
      const opts = []
      resultOptions.forEach(result => {
        result.countries.forEach(opt => { if (opts.indexOf(opt) === -1) opts.push(opt) })
      })
      setCountryOpts(opts)
      setContributors(handleOnUnique(resultOptions, 'contributors'))
      setPartners(handleOnUnique(resultOptions, 'partners'))
      const pds = uniq(resultOptions
        ?.flatMap((r) => r.periods)
        ?.filter((p) => (p[0] && p[1]))
        ?.map((p) => `${moment(p[0], 'YYYY-MM-DD').format('DD/MM/YYYY')} - ${moment(p[1], 'YYYY-MM-DD').format('DD/MM/YYYY')}`))
        ?.sort((a, b) => {
          const xb = b.split(' - ')
          const xa = a.split(' - ')
          return moment(xb[1], 'DD/MM/YYYY').format('YYYY') - moment(xa[1], 'DD/MM/YYYY').format('YYYY')
        })
      setPeriods(pds)
    }
  }, [loading, results, resultOptions, countryOpts, contributors, periods, partners])
  const canEdit = userRdr.programs && userRdr.programs.find(program => program.id === parseInt(params.projectId, 10))?.canEditProgram
  const _title = (!props?.title && title) ? title : props?.title ? props.title : t('Untitled program')
  const itemPeriods = periods?.map((p, px) => ({ id: px, value: p }))
  const countries = countryOpts?.map((c) => ({ id: c, value: countriesDict[c] }))
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
          <FilterBar
            {...{
              contributors,
              partners,
              countries,
              loading,
              searchReff,
              filtering,
              setFiltering
            }}
            periods={itemPeriods}
          />
        </div>
      )} />
      <div className="ui container">
        <div className="program-view">
          <Route path="/programs/:projectId" exact render={() => (
            <>
              {(!resultOptions && loading) && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
              {(apiError) && <Redirect to={`/programs/${params.projectId}/editor`} />}
              {(resultOptions && !results) && <InitialView results={resultOptions} filtering={filtering} />}
              {(resultOptions && results) && (
                <ProgramView
                  {...{
                    results,
                    filtering
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
