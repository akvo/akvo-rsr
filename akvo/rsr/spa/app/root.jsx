/* global window, env */
import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import { LastLocationProvider } from 'react-router-last-location'
import 'reset-css'
import 'antd/dist/antd.css'

import ProjectView from './modules/project-view/project-view'
import Projects from './modules/projects/projects'
import Hierarchy from './modules/hierarchy/hierarchy'
import TopBar from './top-bar'
import { useFetch } from './utils/hooks'
import ProgramRouter from './modules/program/router'
import Users from './modules/users/users'
import Reports from './modules/reports/reports'
import IATI from './modules/iati/iati'
import Profile from './modules/profile/profile'

if (!(env && env.LOCALDEV)) {
  Sentry.init({
    dsn: 'https://5ca590f001844d1493e459a38e3d75f3@sentry.io/218288',
    release: window.SENTRY_RELEASE,
    environment: window.SENTRY_ENVIRONMENT,
  })
}

const isJWTView = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const reqToken = urlParams.get('rt')
  return reqToken !== null
}

const Root = ({ dispatch }) => {
  const jwtView = isJWTView()
  if (! jwtView) {
    const [data, loading] = useFetch('/me')
    if (!loading && data) {
      if(data !== 403) {
        dispatch({ type: 'SET_USER', user: data })
        if (!(env && env.LOCALDEV)) {
          const { id, email } = data
          Sentry.configureScope(scope => {
            scope.setUser({ id, email })
          })
        }
      }
      else window.location.href = `/en/sign_in/?next=${window.location.href}`
    }
  }
  return (
    <Router basename="/my-rsr">
      <LastLocationProvider>
      <div id="root">
        {!jwtView && <TopBar />}
        {jwtView && <div className="top-bar"><div className="ui container"><img className="logo" src="/logo" /></div></div>}
        <div className="ui container">
          <Route path="/" exact component={Projects} />
          <Route path="/projects" exact component={Projects}>
            {/* Added to not break URLs in browser history */}
            <Redirect to="/" />
          </Route>
          <Route path="/hierarchy/:projectId?" component={Hierarchy} />
          <Route path="/projects/:id" render={({ match }) => <ProjectView {...{ jwtView, match }} />} />
          <Route path="/programs/:projectId" component={ProgramRouter} />
          <Route path="/users" component={Users} />
          <Route path="/reports" component={Reports} />
          <Route path="/iati" component={IATI} />
          <Route path="/my-details" component={Profile} />
        </div>
      </div>
      </LastLocationProvider>
    </Router>
  )
}

export default connect()(Root)
