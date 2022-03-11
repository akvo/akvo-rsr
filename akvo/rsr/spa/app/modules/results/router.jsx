import React, { useEffect, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import { Icon, Spin } from 'antd'
import { connect } from 'react-redux'
import { useLastLocation } from 'react-router-last-location'
import { withRouter } from 'react-router-dom'
import { uniq } from 'lodash'
import moment from 'moment'
import humps from 'humps'
import api from '../../utils/api'
import Results from './results'
import ResultOverview from '../results-overview/ResultOverview'
import ResultAdmin from '../results-admin/ResultAdmin'
import Enumerator from './enumerator'
import * as actions from '../editor/actions'
import { keyDict } from '../editor/main-menu'
import EnumeratorPage from './EnumeratorPage'

const reloadPaths = [...Object.keys(keyDict), 'enumerators']

const Router = ({ match: { params: { id } }, jwtView, rf, setRF, location, targetsAt, showResultAdmin, role }) => {
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [preload, setPreload] = useState(true)
  const lastLocation = useLastLocation()
  const fetchRF = () => {
    api.get(`/project/${id}/results_framework/`)
      .then(({ data }) => {
        data.results.forEach(result => {
          result.indicators.forEach(indicator => {
            indicator.periods.forEach(period => { period.result = result.id })
          })
        })
        setRF(data)
        setLoading(false)
      })
  }
  useEffect(() => {
    if (loading && !rf) {
      fetchRF()
    }
    if (rf?.title && loading){
      setLoading(false)
    }
  }, [rf, loading])
  useEffect(() => {
    if (lastLocation && location.pathname !== lastLocation.pathname) {
      if (reloadPaths.filter(key => lastLocation.pathname.indexOf(`/${key}`) !== -1).length > 0) {
        fetchRF()
      }
    }
    if (!project && preload) {
      api.get(`/project/${id}`)
        .then(({ data }) => {
          setPreload(false)
          setProject(humps.camelizeKeys(data))
        })
        .catch(() => setPreload(false))
    }
  }, [location, project, preload])

  const handleSetResults = (results) => {
    if (typeof results === 'function') {
      setRF({ ...rf, results: results(rf.results) })
    } else {
      setRF({ ...rf, results })
    }
  }

  const periods = uniq(rf?.results?.flatMap(result => {
    return result.indicators.flatMap(indicator => {
      return indicator.periods
        .filter(period => (period.periodStart && period.periodEnd))
        .map(period => `${period.periodStart} - ${period.periodEnd}`)
    })
  }), true)
    .sort((a, b) => moment(a.split(' - ')[0]).unix() - moment(b.split(' - ')[0]).unix())
  const resultsProps = { showResultAdmin, targetsAt, id, periods, results: rf?.results, setResults: handleSetResults, role }
  return (
    <div className="results-view">
      <LoadingOverlay loading={loading} />
      {!loading && rf && (role === 'm&e' && !jwtView) && (
        <>
          {
            showResultAdmin
              ? location.pathname.indexOf('/results-admin') >= 0 ? <ResultAdmin {...resultsProps} /> : <ResultOverview {...resultsProps} />
              : <Results {...resultsProps} />
          }
        </>
      )}
      {!loading && rf && (role === 'enumerator' || jwtView) && <EnumeratorPage results={rf.results} title={rf.title} setResults={handleSetResults} {...{ id, jwtView, periods, project }} />}
    </div>
  )
}


const LoadingOverlay = ({ loading }) => {
  const [showOneMoment, setShowOneMoment] = useState(false)
  const transitions = useTransition(loading, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  const transitions2 = useTransition(showOneMoment, null, {
    from: { position: 'absolute', opacity: 0, marginTop: 90 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  useEffect(() => {
    setTimeout(() => {
      setShowOneMoment(true)
    }, 4000)
  }, [])
  return transitions.map(({ item, key, props: _props }) =>
    item &&
    <animated.div className="loading-overlay" key={key} style={_props}>
      <div className="inner">
        <div>Fetching Results Framework</div>
        <Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />
        {transitions2.map((props2) =>
          props2.item && <animated.small key={props2.key} style={props2.props}>One moment please...</animated.small>
        )}
      </div>
    </animated.div>
  )
}

export default withRouter(connect(
  null, actions
)(Router))
