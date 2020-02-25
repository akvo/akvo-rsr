import React, { useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { Button, Table, Dropdown, Menu, Icon, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import Search from '../../utils/search'
import api from '../../utils/api'
import { roleTypes, roleDesc, roleLabelDict} from '../editor/section3/access'

import './styles.scss'


const Users = ({ userRdr }) => {
  const { t } = useTranslation()
  const [users, setUsers] = useState(null)
  const [currentOrg, setCurrentOrg] = useState(null)
  useEffect(() => {
    if(userRdr && userRdr.organisations){
      api.get(`/organisations/${userRdr.organisations[0].id}/users`)
      .then(d => setUsers(d.data))
      setCurrentOrg(userRdr.organisations[0].id)
    }
  }, [userRdr])
  const _setCurrentOrg = (orgId) => {
    setCurrentOrg(orgId)
    setUsers(null)
    api.get(`/organisations/${orgId}/users`)
      .then(d => setUsers(d.data))
  }
  const handleSearch = () => {}
  const clearSearch = () => { }
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 300,
      render: (value) => <span>{value}</span>
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span>{value}</span>
    },
    {
      title: t('Role'),
      dataIndex: 'role',
      key: 'role',
      width: 200,
      render: (value) =>
      (
          <Dropdown
            align={{ points: ['tr', 'br'] }}
            trigger={['click']}
            overlay={(
              <Menu className="roles-dropdown">
                {roleTypes.map(role =>
                  <Menu.Item onClick={() => {}} key={role}>
                    {roleLabelDict[role]}<br /><small>{roleDesc[role]}</small>
                    {role === value[0] && <Icon type="check" />}
                  </Menu.Item>
                )}
                <Menu.Item key="x" onClick={() => {}}><Icon type="minus" /> Remove</Menu.Item>
              </Menu>
            )}
          >
            <a className="ant-dropdown-link">{roleLabelDict[value[0]]} <Icon type="down" /></a>{/* eslint-disable-line */}
          </Dropdown>
      )
    }
  ]
  return (
    <div id="users-view">
      <div className="topbar-row">
        <div className="left-side">
          {userRdr && userRdr.organisations && userRdr.organisations.length > 1 && (
            <Select dropdownMatchSelectWidth={false} value={currentOrg} onChange={_setCurrentOrg}>
              {userRdr.organisations.map(org => <Select.Option value={org.id}>{org.name}</Select.Option>)}
            </Select>
          )}
          <Search
            onChange={handleSearch}
            onClear={clearSearch}
          />
        </div>
        <div className="right-side">
          <Button type="primary" icon="plus">{t('Add new user')}</Button>
        </div>
      </div>
      <Table
        dataSource={users}
        columns={columns}
        loading={!users}
        // pagination={pagination}
        // onChange={onChange}
      />
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Users)
