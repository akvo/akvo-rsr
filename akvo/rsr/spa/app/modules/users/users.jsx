/* global window, document */
import React, { useEffect, useState, useReducer} from 'react'
import { connect } from 'react-redux'
import { Button, Table, Dropdown, Menu, Icon, Select, Modal, Input, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import Search from '../../utils/search'
import api from '../../utils/api'
import { roleTypes, roleDesc, roleLabelDict, TheMatrix } from '../editor/section3/access/access'
import './styles.scss'
import SUOrgSelect from './su-org-select'
import {isRSRAdmin} from '../../utils/feat-flags'

const allOrgsID = 'All Organisations'
const noOrgsID = 'No Organisations'

const Users = ({ userRdr }) => {
  const { t } = useTranslation()
  useEffect(() => { document.title = `${t('Users')} | Akvo RSR` }, [])
  const [users, setUsers] = useState(null)
  const [currentOrg, setCurrentOrg] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [src, setSrc] = useState('')
  const [matrixVisible, setMatrixVisible] = useState(false)

  useEffect(() => {
    if(userRdr && userRdr.organisations){
      const firstOrg = userRdr.organisations.filter(it => it.canEditUsers)[0]
      if(!firstOrg) window.location.href = '/my-rsr/projects'
      api.get('/managed-employments/?format=json')
        .then(d => setUsers(Object.values(d.data)))
      setCurrentOrg(allOrgsID)
    }
  }, [userRdr])
  const itemsPerPage = (window.innerHeight - 184 - 60) / 54 // make the table fit the height of screen
  const _setCurrentOrg = (orgId) => {
    setCurrentOrg(orgId)
  }
  const handleSearch = (s) => {
    setSrc(s)
  }
  const clearSearch = () => {
    setSrc('')
  }
  const changeRole = (user, orgId, role) => {
    role = [role]
    api.patch(`/organisations/${orgId}/users/${user.id}/`, { role })
    const index = users.findIndex(it => it.id === user.id)
    const {organisations} = user
    organisations[orgId].role = role
    const newUser = {...user, organisations}
    setUsers([...users.slice(0, index), newUser, ...users.slice(index + 1)])
  }
  const removeUser = (user, orgId) => {
    api.delete(`/organisations/${orgId}/users/${user.id}/`)
    const index = users.findIndex(it => it.id === user.id)
    const {organisations} = user
    delete organisations[orgId]
    const newUser = {...user, organisations}
    setUsers([...users.slice(0, index), newUser, ...users.slice(index + 1)])
  }
  const onAdded = (user) => {
    setUsers([user, ...users])
  }

  const RolesDropdown = ({user, orgId}) => {
    const value = user?.organisations[orgId].role[0]
    return (
        <Dropdown
          align={{ points: ['tr', 'br'] }}
          trigger={['click']}
          overlay={(
            <Menu className="roles-dropdown">
              {roleTypes.map(role =>
                             <Menu.Item onClick={() => changeRole(user, orgId, role)} key={role}>
                                 {roleLabelDict[role]}<br /><small>{roleDesc[role]}</small>
                                 {role === value && <Icon type="check" />}
                             </Menu.Item>
                            )}
              <Menu.Item key="x" onClick={() => removeUser(user, orgId)}><Icon type="minus" /> Remove</Menu.Item>
            </Menu>
          )}
        >
        <a className="ant-dropdown-link">{roleLabelDict[value]} <Icon type="down" /></a>{/* eslint-disable-line */}
        </Dropdown>
      )
  }

  const defaultColumns = [
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
    }
  ]
  const employmentColumn = {
    title: t('Employments'),
    dataIndex: '',
    key: 'id',
    width: 400,
    render: (user) => {
      return (
        <ul>
          {Object.values(user?.organisations || {}).map(org => (
            <li key={org.id}>
              {org.name}{': '}
              <RolesDropdown orgId={org.id} user={user} />
            </li>
           ))}
        </ul>
      )
    }
  }
  const projectColumn = {
    title: t('Projects'),
    dataIndex: '',
    key: 'id',
    width: 800,
    render: (user) => {
      return (
        <ul>
          {Object.values(user?.projects || {}).map(project => (
            <li key={project.id}>
              <a href={`/my-rsr/projects/${project.id}/partners/`}>{project.title}</a> ({project.role?.[0]?.slice(0, -1)})
            </li>
           ))}
        </ul>
      )
    }
  }
  const roleColumn = {
    title: t('Role'),
    dataIndex: '',
    key: 'id',
    width: 400,
    render: (user) => <RolesDropdown orgId={currentOrg} user={user} />
  }
  const columns = currentOrg === allOrgsID ? [...defaultColumns, projectColumn, employmentColumn] : (currentOrg === noOrgsID) ? [...defaultColumns, projectColumn] : [...defaultColumns, roleColumn]

  const defaultOptions = [{id: allOrgsID, name: allOrgsID},
                          {id: noOrgsID, name: noOrgsID}]
  const allOrgsOption = {label: allOrgsID, value: allOrgsID}
  const noOrgsOption = {label: noOrgsID, value: noOrgsID}
  const orgs = defaultOptions.concat(userRdr?.userManagementOrganisations ? userRdr.userManagementOrganisations.filter(it => it.canEditUsers) : [])
  const RSRAdmin = isRSRAdmin(userRdr)

  return (
    <div id="users-view">
      <div className="topbar-row">
        <div className="left-side">
          {!RSRAdmin && orgs.length > 1 && (
            <Select showSearch filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0} dropdownMatchSelectWidth={false} value={currentOrg} onChange={_setCurrentOrg}>
              {orgs.map(org => <Select.Option value={org.id} data={org.name}>{org.name}</Select.Option>)}
            </Select>
          )}
          {RSRAdmin && <SUOrgSelect value={currentOrg} onChange={_setCurrentOrg} allOrgsOption={allOrgsOption} noOrgsOption={noOrgsOption} />}
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
    dataSource={users?.filter(it => { if(!src) return true; return it.name.toLowerCase().indexOf(src.toLowerCase()) !== -1 || it.email.toLowerCase().indexOf(src.toLowerCase()) !== -1 })
                .filter(it => {
                  switch (currentOrg) {
                  case allOrgsID:
                    return true
                  case noOrgsID:
                    return it?.organisations === undefined
                  default:
                    return it?.organisations?.[currentOrg] !== undefined
                  }
                })}
        columns={columns}
        loading={!users}
        pagination={{ defaultPageSize: itemsPerPage }}
      />
      <InviteUserModal {...{currentOrg, onAdded, userRdr, handleSearch, clearSearch, _setCurrentOrg, orgs}} visible={modalVisible} onCancel={() => setModalVisible(false)} />
      <TheMatrix visible={matrixVisible} onCancel={() => setMatrixVisible(false)} />
    </div>
  )
}


const InviteUserModal = ({ visible, onCancel, currentOrg, onAdded, userRdr, _setCurrentOrg, orgs }) => {
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
    }).catch(() => {
      setState({ sendingStatus: 'error' })
    })
  }
  const RSRAdmin = isRSRAdmin(userRdr)
  const disableInvite = currentOrg === allOrgsID || currentOrg === noOrgsID
  const selectedOrg = !disableInvite ? currentOrg : ' '
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
        state.sendingStatus !== 'sent' ? <Button type="primary" onClick={sendInvite} loading={state.sendingStatus === 'sending'} disabled={disableInvite}>Send Invite</Button> : [
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
        {(RSRAdmin || orgs.length > 1) &&
        <div className="add-to-org">
          <div className="label">
            Add to organisation:
          </div>
          {!RSRAdmin && orgs.length > 1 && (
            <Select dropdownMatchSelectWidth={false} value={selectedOrg} onChange={_setCurrentOrg}>
              {orgs.filter(o => o.id !== allOrgsID && o.id !== noOrgsID)
                   .map(org => <Select.Option value={org.id}>{org.name}</Select.Option>)}
            </Select>
          )}
          {(RSRAdmin && currentOrg !== null) && <SUOrgSelect value={selectedOrg} onChange={_setCurrentOrg} />}
        </div>
        }
      </div>
    </Modal>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Users)
