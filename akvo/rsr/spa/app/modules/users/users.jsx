import React, { useEffect, useState, useReducer} from 'react'
import { connect } from 'react-redux'
import { Button, Table, Dropdown, Menu, Icon, Select, Modal, Input, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import Search from '../../utils/search'
import api from '../../utils/api'
import { roleTypes, roleDesc, roleLabelDict} from '../editor/section3/access'

import './styles.scss'


const Users = ({ userRdr }) => {
  const { t } = useTranslation()
  const [users, setUsers] = useState(null)
  const [currentOrg, setCurrentOrg] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [src, setSrc] = useState('')
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
  const handleSearch = (s) => {
    setSrc(s)
  }
  const clearSearch = () => {
    setSrc('')
  }
  const changeRole = (user, role) => {
    role = [role]
    api.patch(`/organisations/${currentOrg}/users/${user.id}/`, { role })
    const index = users.findIndex(it => it.id === user.id)
    setUsers([...users.slice(0, index), {...user, role}, ...users.slice(index + 1)])
  }
  const removeUser = (user) => {
    api.delete(`/organisations/${currentOrg}/users/${user.id}/`)
    const index = users.findIndex(it => it.id === user.id)
    setUsers([...users.slice(0, index), ...users.slice(index + 1)])
  }
  const onAdded = (user) => {
    setUsers([user, ...users])
  }
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
      render: (value, user) =>
      (
          <Dropdown
            align={{ points: ['tr', 'br'] }}
            trigger={['click']}
            overlay={(
              <Menu className="roles-dropdown">
                {roleTypes.map(role =>
                  <Menu.Item onClick={() => changeRole(user, role)} key={role}>
                    {roleLabelDict[role]}<br /><small>{roleDesc[role]}</small>
                    {role === value[0] && <Icon type="check" />}
                  </Menu.Item>
                )}
                <Menu.Item key="x" onClick={() => removeUser(user)}><Icon type="minus" /> Remove</Menu.Item>
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
          <Button type="primary" icon="plus" onClick={() => setModalVisible(true)}>{t('Add new user')}</Button>
        </div>
      </div>
      <Table
        dataSource={users && users.filter(it => { if(!src) return true; return it.name.toLowerCase().indexOf(src.toLowerCase()) !== -1 || it.email.indexOf('src') !== -1 })}
        columns={columns}
        loading={!users}
      />
      <InviteUserModal {...{currentOrg, onAdded}} visible={modalVisible} onCancel={() => setModalVisible(false)} />
    </div>
  )
}


const InviteUserModal = ({ visible, onCancel, currentOrg, onAdded }) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { email: '', name: '', role: 'M&E Managers', sendingStatus: '' }
  )
  const reset = () => {
    setState({
      sendingStatus: '', email: '', name: '', role: 'M&E Managers'
    })
    // if (resetRef.current) resetRef.current()
  }
  const close = () => {
    reset()
    onCancel()
  }
  const sendInvite = () => {
    const { name, email, role } = state
    setState({ sendingStatus: 'sending' })
    api.post(`/organisations/${currentOrg}/users/`, {
      name, email, role: [role]
    }).then((d) => {
      setState({ sendingStatus: 'sent'})
      onAdded(d.data)
    }).error(() => {
      setState({ sendingStatus: 'error' })
    })
  }
  return (
    <Modal
      title="Invite user"
      {...{ visible, onCancel: close }}
      className="invite-user-modal"
      footer={[
        state.sendingStatus !== 'sent' &&
        <div>
          <span>Add as: </span>
          <Dropdown
            align={{ points: ['tr', 'br'] }}
            trigger={['click']}
            overlay={(
              <Menu className="roles-dropdown">
                {roleTypes.map(role => <Menu.Item onClick={() => setState({ role })} key={role}>{roleLabelDict[role]}<br /><small>{roleDesc[role]}</small></Menu.Item>)}
              </Menu>
            )}
          >
            <a className="ant-dropdown-link">{roleLabelDict[state.role]} <Icon type="down" /></a>{/* eslint-disable-line */}
          </Dropdown>
        </div>,
        state.sendingStatus !== 'sent' ? <Button type="primary" onClick={sendInvite} loading={state.sendingStatus === 'sending'}>Send Invite</Button> : [
          <Button onClick={reset}>Invite Another</Button>,
          <Button onClick={close}>Close</Button>
        ]
      ]}
    >
      <div>
        <Input name="email" placeholder="Email" value={state.email} onChange={e => setState({ email: e.target.value })} />
        <Input name="name" placeholder="Full name" value={state.name} onChange={e => setState({ name: e.target.value })} />
        {state.sendingStatus === 'sent' && <Alert message="Invitation sent!" type="success" />}
        {state.sendingStatus === 'error' && <Alert message="Something went wrong" type="error" />}
      </div>
    </Modal>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Users)
