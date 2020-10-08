/* global window */
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './modules/index/view'
import UnepIndex from './modules/unep-index/view'

export default () => {
  const isUNEP = window.location.href.indexOf('//unep.') !== -1
  return (
    <Router basename="/project-directory">
      <Route path="/" component={isUNEP ? UnepIndex : Index} />
    </Router>
  )
}
