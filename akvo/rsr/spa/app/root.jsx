/* global window, env */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import { LastLocationProvider } from 'react-router-last-location'
import axios from 'axios'
import 'reset-css'
import 'antd/dist/antd.css'

import Cookies from 'js-cookie'
import ProjectView from './modules/project-view/project-view'
import Projects from './modules/projects/projects'
import Hierarchy from './modules/hierarchy/hierarchy'
import TopBar from './top-bar'
import { useFetch } from './utils/hooks'
import Program from './modules/program/program'
import Users from './modules/users/users'
import Reports from './modules/reports/reports'
import IATI from './modules/iati/iati'
import Profile from './modules/profile/profile'
import Login from './modules/auth/Login'
import ForgotPassword from './modules/auth/ForgotPassword'
import Register from './modules/auth/Register'

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

const Root = ({ dispatch, user }) => {
  const jwtView = isJWTView()
  const [data, loading] = useFetch('/me')
  const [lastPath, setLastPath] = useState(null)
  const [csrfToken, setCsrfToken] = useState(Cookies.get('csrftoken'))

  const handleFetchCsrfToken = async () => {
    await axios({
      url: '/auth/csrf-token/',
      method: 'GET'
    }).then(() => {
      setCsrfToken(Cookies.get('csrftoken'))
    })
  }

  if (csrfToken === undefined) {
    handleFetchCsrfToken()
  }

  if (!lastPath && window) {
    setLastPath(window.location.pathname?.replace('/my-rsr/', '/'))
  }

  if (data?.id && !user.id) {
    dispatch({
      type: 'SET_USER',
      user: data
    })
  }

  return loading
    ? <p>Loading...</p>
    : (
      <Router basename="/my-rsr">
        <LastLocationProvider>
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/register" component={Register} />
          {(data === 403 && !loading) && (
            <>
              {['/login', '/register', '/forgot-password'].includes(lastPath)
                ? <Redirect to={lastPath} />
                : <Redirect to="/login" />
              }
            </>
          )}
          {(data?.id && !loading) && (
            <Redirect to={{
              pathname: lastPath,
              state: { preventLastLocation: true },
            }}
            />
          )}
          <div id="root">
            {!jwtView && user?.id && <TopBar />}
            {jwtView && user?.id && <div className="top-bar"><div className="ui container"><img className="logo" src="/logo" /></div></div>}
            <div className="ui container">
              <Route path="/" exact component={Projects} />
              <Route path="/projects" exact component={Projects}>
                {/* Added to not break URLs in browser history */}
                <Redirect to="/" />
              </Route>
              <Route path="/hierarchy/:projectId?" component={Hierarchy} />
              <Route path="/projects/:id" render={({ match }) => <ProjectView {...{ jwtView, match }} />} />
              <Route path="/programs/:projectId" component={Program} />
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

const mapStateToProps = (state) => {
  return ({
    user: state.userRdr
  })
}

export default connect(mapStateToProps)(Root)
