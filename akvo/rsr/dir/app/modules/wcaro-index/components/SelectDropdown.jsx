import React from 'react'
import { Dropdown, Menu, Button, Icon } from 'antd'

export const SelectDropdown = ({ label, selected, items, onClick, disabled = false, error = false, ...props }) => (
  <Dropdown
    disabled={disabled}
    trigger={['click']}
    overlay={(
      <Menu onClick={({ key }) => onClick(key)}>
        <Menu.Item key={label}>{label}</Menu.Item>
        {items && items.map(period => <Menu.Item key={period}>{period}</Menu.Item>)}
      </Menu>
    )}
  >
    <Button className="ant-dropdown-link" onClick={e => e.preventDefault()} {...props}>
      <Icon type="down" />&nbsp;
      {(!error && items.length > 0) ? selected || label : null}
      {(!error && items.length === 0) && 'Loading...'}
      {error ? label : ''}
    </Button>
  </Dropdown>
)
