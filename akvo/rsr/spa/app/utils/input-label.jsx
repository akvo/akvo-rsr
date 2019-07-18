import React from 'react'
import { Tooltip, Icon } from 'antd'
import { useTranslation } from 'react-i18next'

const InputLabel = ({ more, tooltip, optional, ...args }) => {
  const { t } = useTranslation()
  return (
    <span className="input-label">
      <div>
        {args.children} {tooltip && <Tooltip trigger="click" title={tooltip}><Icon type="info-circle" /></Tooltip>}
        {optional && <span className="optional"> -  {t('optional')}</span>}
      </div>
      {more}
    </span>
  )
}

export default InputLabel
