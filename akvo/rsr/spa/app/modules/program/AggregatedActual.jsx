import React from 'react'
import { Button } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import classNames from 'classnames'

import { Flex, Icon } from '../../components'
import { setNumberFormat } from '../../utils/misc'
import { popOver, statusIcons } from './config'

const ContentPopOver = ({ status, callback }) => {
  const content = popOver[status] || {}
  let description = content?.description || ''
  description = description?.replace(':value:', '2 projects')
  description = description?.replace(':total:', '85 projects')
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return (
    <>
      <h3 className="title">{content?.title}</h3>
      <div className="description">
        {mdOutput(mdParse(description))}
      </div>
      {(content?.action && callback) && (
        <div className="action">
          <Button type="link" onClick={callback}>
            {content?.action}
          </Button>
        </div>
      )}
    </>
  )
}

const AggregatedActual = ({ children, ...props }) => {
  return (
    <Flex {...props}>
      {children}
    </Flex>
  )
}

const Col = ({ children, icon = false, className = '', ...props }) => (
  <Flex.Col className={classNames(className, { icon })} {...props}>
    {children}
  </Flex.Col>
)

const Value = ({ children, ...props }) => <b {...props}>{setNumberFormat(children)}</b>

const IconComponent = ({ status, width = '24px', height = '24px' }) => {
  const iconType = statusIcons[status] || null
  return <Icon type={iconType} className={status} width={width} height={height} />
}

AggregatedActual.Col = Col
AggregatedActual.Value = Value
AggregatedActual.Popover = ContentPopOver
AggregatedActual.Icon = IconComponent

export default AggregatedActual
