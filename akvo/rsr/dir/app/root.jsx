/* global window */
import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Index from './modules/index/view'
import UnepIndex from './modules/unep-index/view'
import WcaroRouter from './modules/wcaro-index/router'

export default () => {
  const isUNEP = window.location.href.indexOf('//unep.') !== -1
  const isWcaro = (window.location.href.indexOf('//wcaro.') !== -1 || window.location.href.indexOf('//rsr2.') !== -1)
  return (
    <Router basename="/">
      <Route path="/" exact component={isUNEP ? UnepIndex : isWcaro ? WcaroRouter : Index} />
      <Route path="/project-directory">
        {/* Added to avoid breaking URLs in browser history */}
        <Redirect to="/" />
      </Route>
      <Route path="/dir">
        {!isWcaro && <Redirect to="/" />}
        <WcaroRouter />
      </Route>
    </Router>
  )
}
