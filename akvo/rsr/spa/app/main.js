/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import axios from 'axios'
import 'babel-polyfill'
import smoothscroll from 'smoothscroll-polyfill'
import './i18n'
import Root from './root'
import configureStore from './store/config'
import ErrorOverlay from './error-overlay'

smoothscroll.polyfill()
JavascriptTimeAgo.locale(en)

const store = configureStore()

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
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

axios.interceptors.response.use(resp => resp, (error) => {
  if (error.response.status === 503) {
    ReactDOM.render(<ErrorOverlay />, document.getElementById('root'))
  }
  return Promise.reject(error)
})
