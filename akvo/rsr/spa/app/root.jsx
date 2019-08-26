/* global window */
import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import 'reset-css'
import 'antd/dist/antd.css'

import Editor from './modules/editor/editor'
import Projects from './modules/projects/projects'
import TopBar from './top-bar'
import { useFetch } from './utils/hooks'


const basePath = process.env.DETACHED_FE ? '/' : '/my-rsr'

const Root = ({ dispatch }) => {
  const [data, loading] = useFetch('/me')
  if (!loading && data) {
    if(data !== 403) dispatch({ type: 'SET_USER', user: data })
    else window.location.href = '/en/sign_in/'
  }
  return (
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
}

export default connect()(Root)
