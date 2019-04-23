import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

const App = () => (
  <div>Hello world</div>
)

const Test = () => (
  <div>Test</div>
)

const Test2 = () => (
  <div>Something else</div>
)

const Root = () => {
  return (
    <Router basename="/my-rsr">
      <div>
        <Link to="/">Home</Link>
        <span> | </span>
        <Link to="/something">Something</Link>
        <span> | </span>
        <Link to="/something/else">Something else</Link>
        <Switch>
          <Route path="/" component={App} exact />
          <Route path="/something" exact component={Test} />
          <Route path="/something/else" component={Test2} />
        </Switch>
      </div>
    </Router>
  )
}

export default Root
