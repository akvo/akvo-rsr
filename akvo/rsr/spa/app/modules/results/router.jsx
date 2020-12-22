import React, { useEffect, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import { Icon, Spin } from 'antd'
import { connect } from 'react-redux'
import { useLastLocation } from 'react-router-last-location'
import api from '../../utils/api'
import Results from './results'
import Enumerator from './enumerator'
import * as actions from '../editor/actions'
import { keyDict } from '../editor/main-menu'

const reloadPaths = [...Object.keys(keyDict), 'enumerators']

const Router = ({ match: { params: { id } }, setProjectTitle, jwtView, rf, setRF }) => {
  const [loading, setLoading] = useState(true)
  const location = useLastLocation()
  useEffect(() => {
    if (!rf || (location && reloadPaths.filter(key => location.pathname.indexOf(`/${key}`) !== -1).length > 0)){
      api.get(`/project/${id}/results_framework/`)
        .then(({ data }) => {
          data.results.forEach(result => {
            result.indicators.forEach(indicator => {
              indicator.periods.forEach(period => { period.result = result.id })
            })
            setRF(data)
            setLoading(false)
            setProjectTitle(data.title)
          })
        })
    } else {
      setLoading(false)
      setProjectTitle(rf.title)
    }
  }, [])
  const handleSetResults = (results) => {
    if(typeof results === 'function') {
      setRF({ ...rf, results: results(rf.results)})
    } else {
      setRF({...rf, results})
    }
  }
  return (
    <div className="results-view">
      <LoadingOverlay loading={loading} />
      {!loading && (rf.view === 'm&e' && !jwtView) && <Results results={rf.results} id={id} setResults={handleSetResults} />}
      {!loading && (rf.view === 'enumerator' || jwtView) && <Enumerator results={rf.results} title={rf.title} setResults={handleSetResults} {...{ id, jwtView }} />}
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

export default connect(
  null, actions
)(Router)
