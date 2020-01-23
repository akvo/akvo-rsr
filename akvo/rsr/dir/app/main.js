/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Index from './modules/index/view'
// import Map from './map'
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

render(Index)

if (module.hot) {
  module.hot.accept('./modules/index/view', () => {
    const newApp = require('./modules/index/view').default
    render(newApp)
  })
}
