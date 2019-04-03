import React from 'react'
import SVGInline from 'react-svg-inline'

import rsrSvg from '../images/akvorsr.svg'

const TopBar = () => (
  <div className="top-bar">
    <div className="ui container">
      <SVGInline svg={rsrSvg} />
    </div>
  </div>
)

export default TopBar
