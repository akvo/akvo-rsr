import React from 'react'
import SVGInline from 'react-svg-inline'
import get from 'lodash/get'
import { icons } from '../../../utils/icons'

const Icon = ({ type, ...props }) => {
  const customIcon = get(icons, type)
  return customIcon
    ? <SVGInline svg={customIcon} {...props} />
    : <span />
}

export default Icon
