/* eslint-disable no-unused-vars */
import React from 'react'
import { List, Card, Divider } from 'antd'
import { IndicatorCard } from '../components/IndicatorCard'
import './Framework.scss'
import { PanelBadge } from '../components'

const Framework = ({ sections, indicators }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={sections}
      style={{ padding: '0 2em 0 2em' }}
      renderItem={item => (
        <List.Item>
          {indicators && indicators[item.name] && (
            <List
              header={(
                <>
                  {item.name.toUpperCase()}&nbsp;
                  <PanelBadge count={indicators[item.name].length || 0} />
                </>
              )}
              grid={{ gutter: 16, column: 3 }}
              dataSource={indicators[item.name]}
              className="wcaro-framework-indicator"
              renderItem={value => (
                <List.Item style={{ paddingTop: '1em' }}>
                  <IndicatorCard indicator={value} />
                </List.Item>
              )}
            />
          )}
        </List.Item>
      )}
    />
  )
}

export default Framework
