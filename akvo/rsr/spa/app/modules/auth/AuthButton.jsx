import React from 'react'
import { Button } from 'antd'
import SVGInline from 'react-svg-inline'
import logoWindows from '../../images/icons8-windows8.svg'
import logoGoogle from '../../images/icons8-google-plus.svg'

const icons = {
  windows: logoWindows,
  google: logoGoogle
}

const AuthButton = ({ color, icon, text, ...props }) => {
  return (
    <Button type={color} style={{ height: '48px' }} {...props}>
      <span style={{ display: 'flex', alignContent: 'start' }}>
        <SVGInline svg={icons[icon] || logoGoogle} width="32px" />&nbsp;
        <span style={{ paddingTop: '5px', fontSize: '16px' }}>{text}</span>
      </span>
    </Button>
  )
}

export default AuthButton
