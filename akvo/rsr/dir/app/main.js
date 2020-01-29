/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import smoothscroll from 'smoothscroll-polyfill'
import Index from './modules/index/view'
import 'reset-css'
import 'antd/dist/antd.css'
import './styles/main.scss'

smoothscroll.polyfill()

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
