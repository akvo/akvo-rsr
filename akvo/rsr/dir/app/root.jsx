import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './modules/index/view'
import UnepIndex from './modules/unep-index/view'

export default () => {
  return (
    <Router basename="/project-directory">
      <Route path="/" exact component={Index} />
      <Route path="/unep" exact component={UnepIndex} />
    </Router>
  )
}
