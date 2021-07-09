/* eslint-disable no-unused-vars */
import React from 'react'
import { List } from 'antd'
import { IndicatorCard } from '../components/IndicatorCard'

const Framework = ({ sections, indicators }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={sections}
      style={{ padding: '0 2em 0 2em' }}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta title={item.name} />
        </List.Item>
      )}
    />
  )
}

export default Framework
