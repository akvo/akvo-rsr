import React from 'react'
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'reset-css'
import 'antd/dist/antd.css'

import TopBar from './components/top-bar'
import Editor from './components/editor/comp'

const App = () => (
  <div>Hello world</div>
)

const Root = () => {
  return (
    <div id="root">
      <TopBar />
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
