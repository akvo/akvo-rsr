/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { ThemeProvider } from 'styled-components'
import smoothscroll from 'smoothscroll-polyfill'
import 'babel-polyfill'
import Root from './root'
import './i18n'
import 'reset-css'
import 'antd/dist/antd.css'
import './styles/main.scss'
import { theme, gridConf } from './theme.js'
import GlobalStyle from './global-style.js'

smoothscroll.polyfill()

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider theme={{ ...theme, awesomegrid: gridConf }}>
        <GlobalStyle />
        <Component />
      </ThemeProvider>
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
