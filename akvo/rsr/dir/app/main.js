/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import Map from './map'
import 'reset-css'
import 'antd/dist/antd.css'
import './styles/main.scss'

const Root = () => (
  <Map />
)

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
)
