import React from 'react'
import { Button, Popover, Tooltip } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import Flex from '../../components/Flex'
import { setNumberFormat } from '../../utils/misc'
import { popOver } from './config'

const ContentPopOver = ({ status, callback, amount = 2, total = 85 }) => {
  const { t: trans } = useTranslation()
  const content = popOver[status] || {}
  let description = content?.description || ''
  description = description?.replace(':value:', `${amount} ${trans('contributor_s', { count: amount })}`)
  description = description?.replace(':total:', `${total} ${trans('contributor_s', { count: total })}`)
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

const Aggregation = ({ children, ...props }) => {
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

const TooltipComponent = ({ children, placement = 'top', title = 'Hello world', ...props }) => {
  return (
    <Tooltip placement={placement} title={title} {...props}>
      {children}
    </Tooltip>
  )
}

const PopoverComponent = ({ children, status, callback, amount, total, placement = 'top', ...props }) => {
  return (
    <Popover
      placement={placement}
      content={(
        <ContentPopOver
          status={status}
          callback={callback}
          amount={amount}
          total={total}
        />
      )}
      overlayClassName={status} {...props}
    >
      {children}
    </Popover>
  )
}

Aggregation.Col = Col
Aggregation.Value = Value
Aggregation.Tooltip = TooltipComponent
Aggregation.Popover = PopoverComponent

export default Aggregation
