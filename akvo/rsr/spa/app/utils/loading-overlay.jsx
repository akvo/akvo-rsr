import React, { useState, useEffect } from 'react'
import { Icon, Spin } from 'antd'
import { useTransition, animated } from 'react-spring'
import './loading-overlay.scss'

const LoadingOverlay = ({ loading, title }) => {
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
      <div>{title}</div>
      <Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />
      {transitions2.map((props2) =>
        props2.item && <animated.small key={props2.key} style={props2.props}>One moment please...</animated.small>
      )}
    </animated.div>
  )
}

export default LoadingOverlay
