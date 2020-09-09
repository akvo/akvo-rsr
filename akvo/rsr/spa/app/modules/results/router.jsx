import React, { useEffect, useState } from 'react'
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
  useEffect(() => {
    api.get(`/rest/v1/project/${id}/results_framework/`)
      .then(({ data }) => {
        setData(data)
        setLoading(false)
        setProjectTitle(data.title)
      })
  }, [])
  return (
    <div className="results-view">
      <LoadingOverlay loading={loading} />
      {!loading && data.view === 'm&e' && <Results results={data.results} id={id} />}
      {!loading && data.view === 'enumerator' && <Enumerator />}
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
    from: { position: 'absolute', opacity: 0, marginTop: 120 },
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
      <div>Fetching Results Framework</div>
      <Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />
      {transitions2.map((props2) =>
        props2.item && <animated.small key={props2.key} style={props2.props}>One moment please...</animated.small>
      )}
    </animated.div>
  )
}

export default connect(
  null, actions
)(Router)
