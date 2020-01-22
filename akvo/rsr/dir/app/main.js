/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Map from './map'
import 'reset-css'
import 'antd/dist/antd.css'
import './styles/main.scss'

ReactDOM.render(
  <AppContainer>
    <Map />
  </AppContainer>,
  document.getElementById('root'),
)
