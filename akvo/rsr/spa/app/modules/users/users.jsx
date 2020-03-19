/* global window */
import React, { useEffect, useState, useReducer} from 'react'
import { connect } from 'react-redux'
import { Button, Table, Dropdown, Menu, Icon, Select, Modal, Input, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import Search from '../../utils/search'
import api from '../../utils/api'
import { roleTypes, roleDesc, roleLabelDict, TheMatrix } from '../editor/section3/access/access'
import './styles.scss'

let intid
const { Option } = Select

const SUOrgSelect = ({ value, onChange }) => {
  // const [orgs, loading] = useFetch('/typeaheads/organisations')
  const [orgs, setOrgs] = useState([])
  const { t } = useTranslation()
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { options: [], searchStr: '' }
  )
  useEffect(() => {
    api.get('/typeaheads/organisations')
    .then(({ data: {results} }) => {
      setOrgs(results)
      const options = results.filter(it => it.id === value).map(({id, name}) => ({ value: id, label: name }))
      setState({
        options
      })
    })
  }, [])
  const handleBlur = () => {
    setTimeout(() => {
      if (orgs.length > 0) {
        const options = orgs.filter(it => it.value === value)
        setState({
          options,
          searchStr: ''
        })
      }
    }, 200)
  }
  useEffect(handleBlur, [value])
  const filterOptions = _value => {
    clearTimeout(intid)
    if (_value.length > 1) {
      setState({
        options: [],
        searchStr: _value
      })
      intid = setTimeout(() => {
        const options = orgs
          .filter(it => it.name.toLowerCase().indexOf(_value.toLowerCase()) !== -1 || it.longName.toLowerCase().indexOf(_value.toLowerCase()) !== -1)
          .map(({ id, name }) => ({ value: id, label: name })) // eslint-disable-line
        setState({
          options
        })
      }, 300)
    }
  }

  return (
    <Select
      {...{value, onChange}}
      showSearch
      // loading={loading}
      onSearch={filterOptions}
      notFoundContent={<div>{(state.searchStr.length === 0 ? <span>{t('Start typing...')}</span> : <span>{t('No results')}</span>)}</div>}
      filterOption={false}
      dropdownMatchSelectWidth={false}
      dropdownRender={(menuNode) => {
        if(state.options.length === 1 && state.options[0].value === value) return <div className="start-typing">Start typing...</div>
        return menuNode
      }}
      onBlur={handleBlur}
    >
      {state.options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
    </Select>
  )
}

const Users = ({ userRdr }) => {
  const { t } = useTranslation()
  const [users, setUsers] = useState(null)
  const [currentOrg, setCurrentOrg] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [src, setSrc] = useState('')
  const [matrixVisible, setMatrixVisible] = useState(false)
  useEffect(() => {
    if(userRdr && userRdr.organisations){
      const firstOrg = userRdr.organisations.filter(it => it.canEditUsers)[0]
      if(!firstOrg) window.location.href = '/my-rsr/projects'
      api.get(`/organisations/${firstOrg.id}/users`)
      .then(d => setUsers(d.data))
      setCurrentOrg(firstOrg.id)
    }
  }, [userRdr])
  const itemsPerPage = (window.innerHeight - 184 - 60) / 54 // make the table fit the height of screen
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
  console.log(userRdr)
  const orgs = userRdr && userRdr.organisations ? userRdr.organisations.filter(it => it.canEditUsers) : []
  return (
    <div id="users-view">
      <div className="topbar-row">
        <div className="left-side">
          {!(userRdr && userRdr.isSuperuser) && orgs.length > 1 && (
            <Select dropdownMatchSelectWidth={false} value={currentOrg} onChange={_setCurrentOrg}>
              {orgs.map(org => <Select.Option value={org.id}>{org.name}</Select.Option>)}
            </Select>
          )}
          {(userRdr && userRdr.isSuperuser && currentOrg !== null) && <SUOrgSelect value={currentOrg} onChange={_setCurrentOrg} />}
          <Search
            onChange={handleSearch}
            onClear={clearSearch}
          />
        </div>
        <div className="right-side">
          <Button icon="info-circle" type="link" onClick={() => setMatrixVisible(true)}>View Permission Scheme</Button>
          <Button type="primary" icon="plus" onClick={() => setModalVisible(true)}>{t('Add new user')}</Button>
        </div>
      </div>
      <Table
        dataSource={users && users.filter(it => { if(!src) return true; return it.name.toLowerCase().indexOf(src.toLowerCase()) !== -1 || it.email.toLowerCase().indexOf(src.toLowerCase()) !== -1 })}
        columns={columns}
        loading={!users}
        pagination={{ defaultPageSize: itemsPerPage }}
      />
      <InviteUserModal {...{currentOrg, onAdded}} visible={modalVisible} onCancel={() => setModalVisible(false)} />
      <TheMatrix visible={matrixVisible} onCancel={() => setMatrixVisible(false)} />
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
        <Input name="email" placeholder="Email" value={state.email} onChange={e => setState({ email: e.target.value })} style={{ marginBottom: 10 }} />
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
