/* global document */
import React, { useState, useEffect, useRef, useReducer } from 'react'
import { Radio, Icon, Button, Modal, Input, Collapse, Dropdown, Menu, Popconfirm, Alert, Table } from 'antd'
import { connect } from 'react-redux'
import './access.scss'
import api from '../../../../utils/api'
import { saveFields } from '../../actions'

const { Panel } = Collapse
export const roleTypes = ['Admins', 'M&E Managers', 'Project Editors', 'User Managers', 'Enumerators', 'Users']
export const roleDesc = {
  Admins: 'Can edit all settings and publish the project',
  'M&E Managers': 'Can post updates, approve results data, (un)lock periods and edit projects',
  'User Managers': 'Can post updates, add new users and view reports',
  'Project Editors': 'Can post updates, view reports and edit projects',
  Enumerators: 'Can post project and indicator updates and view reports',
  Users: 'Can post project updates and view reports',
}
export const roleLabelDict = {
  'Super Admins': 'Contract Admin',
  Admins: 'Admin',
  'M&E Managers': 'M&E Manager',
  'User Managers': 'User Manager',
  'Project Editors': 'Project Editor',
  Enumerators: 'Enumerator',
  Users: 'User',
}

const Access = ({ projectId, partners, roleData, admin, mne, saveFields: _saveFields }) => {
  const [useProjectRoles, setUseProjectRoles] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [matrixVisible, setMatrixVisible] = useState(false)
  const [roles, setRoles] = useState([])
  const [popconfirmVisible, setPopconfirmVisible] = useState(false)
  const [rtypes, setRtypes] = useState(roleTypes)
  useEffect(() => {
    if (!admin && mne) setRtypes(['Enumerators'])
  }, [])
  useEffect(() => {
    setUseProjectRoles(roleData.useProjectRoles)
    if (roleData.roles){
      setRoles(roleData.roles)
    }
  }, [roleData])
  const handleAddRole = (userRole) => {
    const _roles = [...roles, userRole]
    setRoles(_roles)
    api.patch(`project/${projectId}/project-roles/`, {
      roles: _roles.map(({ email, role}) => ({ email, role })),
    })
      .then(() => {
        _saveFields({ lastModifiedAt: new Date() }, 1, false)
      })
  }
  const handleProjectRolesChange = ({ target: {value}}) => {
    if(value !== useProjectRoles){
      setUseProjectRoles(value)
      setRoles([])
      api.patch(`project/${projectId}/project-roles/`, {
        useProjectRoles: value
      })
        .then(() => {
          _saveFields({ lastModifiedAt: new Date() }, 1, false)
        })
    }
  }
  const changeUserRole = (user, role) => {
    const ind = roles.findIndex(it => it.email === user.email)
    const updatedRoles = [...roles.slice(0, ind), {...user, role}, ...roles.slice(ind + 1)]
    setRoles(updatedRoles)
    api.patch(`project/${projectId}/project-roles/`, {
      roles: updatedRoles.map(({ email, role }) => ({ email, role })) // eslint-disable-line
    })
      .then(() => {
        _saveFields({ lastModifiedAt: new Date() }, 1, false)
      })
  }
  const confirmAccessReset = () => {
    setPopconfirmVisible(false)
    handleProjectRolesChange({ target: { value: false } })
  }
  const removeUser = (user) => {
    const updatedRoles = roles.filter(it => it.email !== user.email)
    setRoles(updatedRoles)
    api.patch(`project/${projectId}/project-roles/`, {
      roles: updatedRoles.map(({ email, role }) => ({ email, role })),
    })
      .then(() => {
        _saveFields({ lastModifiedAt: new Date() }, 1, false)
      })
  }
  const handlePopconfirmVisibleChange = (visible) => {
    if(!visible){
      setPopconfirmVisible(false)
      return
    }
    if(roles.length > 0){
      setPopconfirmVisible(true)
    }
    else {
      confirmAccessReset()
    }
  }
  return (
    <div className="access-section">
      <h3>User Access <Button icon="info-circle" type="link" onClick={() => setMatrixVisible(true)}>View Permission Scheme</Button></h3>
      <div className="ant-radio-group">
        <Popconfirm
          title="This would cause you to lose the current user access roles. Proceed?"
          visible={(popconfirmVisible && admin && mne)}
          onConfirm={confirmAccessReset}
          onVisibleChange={handlePopconfirmVisibleChange}
          okText="Yes"
          okType="danger"
          cancelText="No"
        >
          <Radio.Button checked={!useProjectRoles} disabled={(!admin && mne)}>
            <Icon type="unlock" /> <b>Unrestricted</b>
            <p>Members of all project partners have access</p>
          </Radio.Button>
        </Popconfirm>
        <Radio.Button checked={useProjectRoles} onClick={() => handleProjectRolesChange({ target: { value: true } })} disabled={(!admin && mne)}>
          <Icon type="lock" /> <b>Restricted</b>
          <p>Only people you add have access</p>
        </Radio.Button>
      </div>
      {useProjectRoles && [
      <ul>
        {roles.map(user =>
        <li>
          <div className="text">
            {user.name}
          </div>
          <Dropdown
            align={{ points: ['tr', 'br'] }}
            trigger={['click']}
            disabled={(user.role !== 'Enumerators' && (!admin && mne))}
            overlay={(
              <Menu className="roles-dropdown">
                {rtypes.map(role =>
                  <Menu.Item onClick={() => changeUserRole(user, role)} key={role}>
                    {roleLabelDict[role]}<br /><small>{roleDesc[role]}</small>
                    {role === user.role && <Icon type="check" />}
                  </Menu.Item>
                )}
                <Menu.Item key="x" onClick={() => removeUser(user)}><Icon type="minus" /> Remove</Menu.Item>
              </Menu>
            )}
          >
            <a className="ant-dropdown-link">{roleLabelDict[user.role]} <Icon type="down" /></a>{/* eslint-disable-line */}
          </Dropdown>
        </li>
        )}
      </ul>,
      <Button className="bottom-btn" icon="plus" type="dashed" block onClick={() => setModalVisible(true)}>Add user</Button>]}
      <InviteUserModal {...{roles, projectId, admin, mne}} onAddRole={handleAddRole} visible={modalVisible} onCancel={() => setModalVisible(false)} orgs={partners} />
      <TheMatrix visible={matrixVisible} onCancel={() => setMatrixVisible(false)} />
    </div>
  )
}

let tmid
const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const Search = ({ isEmail, onChange, getReset }) => {
  const [value, setValue] = useState('')
  const handleChange = e => {
    setValue(e.target.value);
    clearTimeout(tmid);
    ((val) => {
      tmid = setTimeout(() => onChange(val), 200)
    })(e.target.value)
  }
  if(getReset){
    getReset(() => setValue(''))
  }
  return (
    <Input value={value} onChange={handleChange} allowClear suffix={!isEmail && <Icon type="search" />} placeholder="Type name or email" />
  )
}

const InviteUserModal = ({ visible, onCancel, orgs, onAddRole, roles, projectId, admin, mne }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const prevData = useRef([])
  const [rtypes, setRtypes] = useState(roleTypes)
  useEffect(() => {
    if(prevData.current.filter(it => it.organisation).length !== orgs.filter(it => it.organisation).length){
    setLoading(true)
    prevData.current = orgs
    const reportingOrg = orgs.find(it => it.iatiOrganisationRole === 101)
    api.get(`/members/?orgs=[${orgs.filter(it => it.organisation).map(it => it.organisation).join(',')}]`)
      .then(d => {
        const _data = reportingOrg ? d.data.sort((a, b) => a.id === reportingOrg.organisation ? -1 : 0) : d.data
        setData(_data)
        setLoading(false)
      })
    }
  }, [orgs])
  const resetRef = useRef()
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { src: '', name: '', role: 'M&E Managers', sending: false, sendingStatus: '' }
  )
  const rolesDict = {}; roles.forEach(role => { rolesDict[role.email] = role })
  const filterName = it => { if(state.src === '') return true; return it.name.toLowerCase().indexOf(state.src.toLowerCase()) !== -1 }
  const isEmail = emailRegEx.test(state.src)
  const sendInvite = () => {
    setState({ sendingStatus: 'sending'})
    const {src: email, name, role } = state
    api.post(`/project/${projectId}/invite-user/`, {
      email, name, role
    }).then((e) => {
      saveFields({ lastModifiedAt: new Date() }, 1, false)
      onAddRole({ email, name, role })
      setState({ sendingStatus: 'sent' })
    }).catch(() => {
      setState({ sendingStatus: 'error' })
    })
  }
  const reset = () => {
    setState({
      sendingStatus: '', src: '', name: ''
    })
    if(resetRef.current) resetRef.current()
    const modal = document.getElementsByClassName('invite-user-modal')
    if(modal.length > 0){
      modal[0].parentNode.scrollTop = 0
    }
  }
  const close = () => {
    reset()
    onCancel()
  }
  let hasResults = !loading
  if(state.src && data){
    hasResults = data.map(org => org.members.filter(filterName).length).reduce((prev, value) => prev + value, 0) > 0
  }
  useEffect(() => {
    if (!admin && mne) {
      setState({ role: 'Enumerators' })
      setRtypes(['Enumerators'])
    }
  }, [])
  return (
    <Modal
      title="Invite user"
      {...{ visible, onCancel: close }}
      className="invite-user-modal"
      footer={isEmail ? [
        state.sendingStatus !== 'sent' &&
        <div>
          <span>Add as: </span>
          <Dropdown
            align={{ points: ['tr', 'br'] }}
            trigger={['click']}
            overlay={(
              <Menu className="roles-dropdown">
                {rtypes.map(role => <Menu.Item onClick={() => setState({ role })} key={role}>{roleLabelDict[role]}<br /><small>{roleDesc[role]}</small></Menu.Item>)}
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
      ] : <Button type="primary" onClick={close}>Done</Button>}
    >
      <Search {...{isEmail}} onChange={(src) => setState({ src })} getReset={(ref) => { resetRef.current = ref }} />
      {(!loading && !isEmail && hasResults) &&
      <Collapse defaultActiveKey={data.map((a, i) => i)}>
        {data.map((org, index) => {
          const $org = orgs.find(it => it.organisation === org.id)
          const orgName = $org ? $org.organisationName : ''
          const filteredMembers = org.members.filter(filterName)
          if(filteredMembers.length === 0) return null
          return (
            <Panel key={index} header={<span><i>Members of</i> <span>{orgName}</span></span>}>
              <ul>
                {filteredMembers.map(user => {
                  const role = { email: user.email, role: user.role[0], name: user.name }
                  return (
                    <li>
                      {user.name}&nbsp;<span className="role"> | {user.role.join(', ')}</span>&nbsp;
                      {rolesDict[user.email] && <Button icon="check">Added</Button>}
                      {!rolesDict[user.email] && (
                        <Button
                          type="primary"
                          icon="plus"
                          onClick={() => onAddRole(role)}
                          disabled={((!admin && mne) && role?.role !== 'Enumerators')}
                        >
                          Add
                        </Button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Panel>
          )
        }
        )}
      </Collapse>
      }
      {!hasResults && !isEmail && (
        <div className="invite-section">
          <p>
            {'We couldn\'t find'} <b>{state.src}</b><br />
            {'Enter their email and we\'ll send them an invite'}
          </p>
        </div>
      )}
      {isEmail && (
        <div className="invite-section">
          <p><Icon type="mail" /> {`We'll send a message to ${state.src} and create a new user`}</p>
          <Input name="name" placeholder="Full name" value={state.name} onChange={e => setState({ name: e.target.value })} />
          {state.sendingStatus === 'sent' && <Alert message="Invitation sent!" type="success" />}
          {state.sendingStatus === 'error' && <Alert message="Sorry, you don't have permission" type="error" />}
        </div>
      )}
    </Modal>
  )
}

const roles = ['Users', 'Enumerators', 'User Managers', 'Project Editors', 'M&E Managers', 'Admins', 'Super Admins']
const columns = [
  {
    title: '',
    key: 'text',
    name: 'text',
    dataIndex: 'text'
  },
  ...roles.map(it => ({ title: roleLabelDict[it], name: it, key: it, dataIndex: it }))
]
const Check = <Icon type="check" />
const dataSource = [
  { text: 'Add or edit Project update', [roles[0]]: Check, [roles[1]]: Check, [roles[2]]: Check, [roles[3]]: Check, [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: 'Delete Project update', [roles[5]]: Check, [roles[6]]: Check},
  { text: 'Add indicator update', [roles[1]]: Check, [roles[3]]: Check, [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check},
  { text: 'Add a new project', [roles[6]]: Check},
  { text: 'Edit a project', [roles[3]]: Check, [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: 'Publish a project', [roles[5]]: Check, [roles[6]]: Check},
  { text: 'Approve new user accounts', [roles[2]]: Check, [roles[5]]: Check, [roles[6]]: Check},
  { text: 'Invite new users', [roles[2]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: 'Add new organisations', [roles[3]]: Check, [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: 'Approve results data', [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: '(Un)lock indicator periods', [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: 'Export periods', [roles[0]]: Check, [roles[1]]: Check, [roles[2]]: Check, [roles[3]]: Check, [roles[4]]: Check, [roles[5]]: Check, [roles[6]]: Check },
  { text: 'Choose validation set', [roles[6]]: Check },
  { text: 'Set projects on private', [roles[6]]: Check },
]
export const TheMatrix = ({ visible, onCancel }) => {
  return (
    <Modal
      width={700}
      className="user-roles-modal"
      title="User roles"
      {...{visible, onCancel}}
      footer={[<Button onClick={onCancel}>Close</Button>]}
    >
      <Table {...{ columns, dataSource }} pagination={false} bordered />
    </Modal>
  )
}

export default connect(
  ({ backendError }) => ({ backendError }),
  { saveFields }
)(Access)
