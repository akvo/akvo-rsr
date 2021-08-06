import React from 'react'
import { Dropdown, Menu, Button, Icon } from 'antd'

export const SelectDropdown = ({ label, selected, items, onClick }) => {
  return (
    <Dropdown
      overlay={(
        <Menu onClick={({ key }) => onClick(key)}>
          <Menu.Item key={label}>{label}</Menu.Item>
          {items && items.map(period => <Menu.Item key={period}>{period}</Menu.Item>)}
        </Menu>
      )}
    >
      <Button type="link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        <Icon type="down" />&nbsp;{selected || label}
      </Button>
    </Dropdown>
  )
}
