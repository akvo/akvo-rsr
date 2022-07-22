import React from 'react'
import { Icon as AntIcon } from 'antd'
import SVGInline from 'react-svg-inline'
import get from 'lodash/get'
import { icons } from '../../../utils/config'

const Icon = ({ type, ...props }) => {
  const customIcon = get(icons, type)
  return customIcon
    ? <SVGInline svg={customIcon} {...props} />
    : <AntIcon type={type} {...props} />
}

export default Icon
