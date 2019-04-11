import React from 'react'
import { Tooltip, Icon } from 'antd'

const InputLabel = ({ more, tooltip, optional, ...args }) => (
  <span className="input-label">
    <div>
      {args.children} {tooltip && <Tooltip trigger="click" title={tooltip}><Icon type="info-circle" /></Tooltip>}
      {optional && <span className="optional"> -  optional</span>}
    </div>
    {more}
  </span>
)

export default InputLabel
