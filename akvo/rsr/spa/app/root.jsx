import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import 'reset-css'
import 'antd/dist/antd.css'

import Editor from './modules/editor/editor'
import Projects from './modules/projects/projects'
import TopBar from './top-bar'


const basePath = process.env.DETACHED_FE ? '/' : '/my-rsr'

const Root = () => (
  <Router basename={basePath}>
  <div id="root">
    <TopBar />
    <div className="ui container">
        <Route path="/projects" exact component={Projects} />
        <Route path="/projects/:id" component={Editor} />
    </div>
  </div>
  </Router>
)

export default Root
