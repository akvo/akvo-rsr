/* global window */
import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Index from './modules/index/view'
import UnepIndex from './modules/unep-index/view'
import WcaroIndex from './modules/wcaro-index/view'

export default () => {
  const isUNEP = window.location.href.indexOf('//unep.') !== -1
  const isWcaro = window.location.href.indexOf('//wcaro.') !== -1
  return (
    <Router basename="/">
      <Route path="/" exact component={isUNEP ? UnepIndex : isWcaro ? WcaroIndex : Index} />
      <Route path="/project-directory">
        {/* Added to avoid breaking URLs in browser history */}
        <Redirect to="/" />
      </Route>
    </Router>
  )
}
