/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import smoothscroll from 'smoothscroll-polyfill'
import Root from './root'
import './i18n'
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

render(Root)

if (module.hot) {
  module.hot.accept('./root', () => {
    const newApp = require('./root').default
    render(newApp)
  })
}
