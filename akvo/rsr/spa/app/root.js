import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = () => (
  <div>Hello world</div>
)

const Root = () => {
  return (
    <Router basename="/en/my-rsr">
      <Switch>
        <Route path="/" component={App} exact />
      </Switch>
    </Router>
  )
}

export default Root
