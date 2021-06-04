import React from 'react'
import { Row, Col, Menu, Dropdown, Button, Icon } from 'antd'
import Search from '../../index/search'

export const HeaderFilter = ({ countries }) => {
  return (
    <Row>
      <Col span={6}>
        <Search loading={false} onClear={() => console.log('clear')} onChange={value => console.log(`check ${value}`)} />
      </Col>
      <Col lg={6} sm={12}>
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item>All Countries</Menu.Item>
              {countries && countries.map((country, index) => <Menu.Item value={country} key={index}>{country}</Menu.Item>)}
            </Menu>
          )}
        >
          <Button type="link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Icon type="down" />&nbsp;All Countries
          </Button>
        </Dropdown>
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item>01/01/2021 - 01/01/2022</Menu.Item>
            </Menu>
          )}
        >
          <Button type="link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Icon type="down" />&nbsp;All Periods
          </Button>
        </Dropdown>
      </Col>
    </Row>
  )
}
