/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Map from './map'
import 'reset-css'
import 'antd/dist/antd.css'
import './styles/main.scss'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(Map)

if (module.hot) {
  module.hot.accept('./map', () => {
    const newApp = require('./map').default
    render(newApp)
  })
}
