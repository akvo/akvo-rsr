import React from 'react'
import SVGInline from 'react-svg-inline'
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'reset-css'
import 'antd/dist/antd.css'

import rsrSvg from './images/akvorsr.svg'
import Editor from './modules/editor/editor'

const Root = () => {
  return (
    <div id="root">
      <div className="top-bar">
        <div className="ui container">
          <SVGInline svg={rsrSvg} />
        </div>
      </div>
      <div className="ui container">
        <header>
          <h1>Project name here</h1>
        </header>
        <Editor />
      </div>
    </div>
  )
}

export default Root
