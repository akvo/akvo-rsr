import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTransition, animated } from 'react-spring'
import { Icon, Spin } from 'antd'
import { connect } from 'react-redux'
import api from '../../utils/api'
import Results from './results'
import Enumerator from './enumerator'
import * as actions from '../editor/actions'


const Router = ({ match: { params: { id } }, setProjectTitle }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const query = new URLSearchParams(useLocation().search)
  const reqToken = query.get('rt')
  const baseURL = `/rest/v1/project/${id}/results_framework/`
  const url = reqToken === null ? baseURL : `${baseURL}?rt=${reqToken}`

  useEffect(() => {
    api.get(url)
      .then(({ data }) => {
        data.results.forEach(result => {
          result.indicators.forEach(indicator => {
            indicator.periods.forEach(period => { period.result = result.id })
          })
        })
        setData(data)
        setLoading(false)
        setProjectTitle(data.title)
      })
  }, [])
  const handleSetResults = (results) => {
    setData({...data, results})
  }
  return (
    <div className="results-view">
      <LoadingOverlay loading={loading} />
      {!loading && data.view === 'm&e' && <Results results={data.results} id={id} setResults={handleSetResults} />}
      {!loading && data.view === 'enumerator' && <Enumerator results={data.results} setResults={handleSetResults} id={id} />}
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
