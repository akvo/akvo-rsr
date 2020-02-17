import React, { useState, useEffect, useRef, useReducer } from 'react'
import { Radio, Icon, Button, Modal, Input, Collapse, Dropdown, Menu, Popconfirm, Alert } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { useFetch } from '../../../utils/hooks'
import './access.scss'
import api from '../../../utils/api'

const { Panel } = Collapse
const roleTypes = ['Admins', 'M&E Managers', 'Project Editors', 'User Managers', 'Enumerators', 'Users']
const roleDesc = {
  Admins: 'Can add new projects and edit all settings',
  'M&E Managers': 'Can post updates, approve results data, (un)lock periods and edit projects',
  'User Managers': 'Can post updates, add new users and view reports',
  'Project Editors': 'Can post updates, view reports and edit projects',
  Enumerators: 'Can post project and indicator updates and view reports',
  Users: 'Can post project updates and view reports',
}
const roleLabelDict = {
  Admins: 'Admin',
  'M&E Managers': 'M&E Manager',
  'User Managers': 'User Manager',
  'Project Editors': 'Project Editor',
  Enumerators: 'Enumerator',
  Users: 'User',
}

const Access = ({ projectId, partners }) => {
  const [roleData, loading] = useFetch(`project/${projectId}/project-roles/`)
  const [useProjectRoles, setUseProjectRoles] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [roles, setRoles] = useState([])
  const [popconfirmVisible, setPopconfirmVisible] = useState(false)
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
  }
  const handleProjectRolesChange = ({ target: {value}}) => {
    setUseProjectRoles(value)
    setRoles([])
    api.patch(`project/${projectId}/project-roles/`, {
      useProjectRoles: value
    })
  }
  const changeUserRole = (user, role) => {
    const ind = roles.findIndex(it => it.email === user.email)
    const updatedRoles = [...roles.slice(0, ind), {...user, role}, ...roles.slice(ind + 1)]
    setRoles(updatedRoles)
    api.patch(`project/${projectId}/project-roles/`, {
      roles: updatedRoles.map(({ email, role }) => ({ email, role })) // eslint-disable-line
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
      <h3>User Access</h3>
      <div className="ant-radio-group">
        <Popconfirm
          title="This would cause you to lose the current user access roles. Proceed?"
          visible={popconfirmVisible}
          onConfirm={confirmAccessReset}
          onVisibleChange={handlePopconfirmVisibleChange}
          okText="Yes"
          okType="danger"
          cancelText="No"
        >
          <Radio.Button checked={!useProjectRoles}>
            <Icon type="unlock" /> <b>Unrestricted</b>
            <p>Members of all project partners have access</p>
          </Radio.Button>
        </Popconfirm>
        <Radio.Button checked={useProjectRoles} onClick={() => handleProjectRolesChange({ target: { value: true } })}>
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
            overlay={(
              <Menu className="roles-dropdown">
                {roleTypes.map(role => <Menu.Item onClick={() => changeUserRole(user, role)} key={role}>{roleLabelDict[role]}<br /><small>{roleDesc[role]}</small></Menu.Item>)}
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
      {!loading && <InviteUserModal {...{roles, projectId}} onAddRole={handleAddRole} visible={modalVisible} onCancel={() => setModalVisible(false)} orgs={partners} />}
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

const InviteUserModal = ({ visible, onCancel, orgs, onAddRole, roles, projectId }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const prevData = useRef([])
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
  const filterName = it => { if(state.src === '') return true; return it.name.toLowerCase().indexOf(state.src) !== -1 }
  const isEmail = emailRegEx.test(state.src)
  const sendInvite = () => {
    setState({ sendingStatus: 'sending'})
    const {src: email, name, role } = state
    api.post(`/project/${projectId}/invite-user/`, {
      email, name, role
    }).then((e) => {
      onAddRole({ email, name, role })
      setState({ sendingStatus: 'sent' })
      setTimeout(() => {
        // setState({ name: '', src: '', sendingStatus: '' })
      }, 1000)
    }).error(() => {
      setState({ sendingStatus: 'error' })
    })
  }
  const reset = () => {
    setState({
      sendingStatus: '', src: '', name: ''
    })
    if(resetRef.current) resetRef.current()
  }
  const close = () => {
    reset()
    onCancel()
  }
  let hasResults = !loading
  if(state.src && data){
    hasResults = data.map(org => org.members.filter(filterName).length).reduce((prev, value) => prev + value, 0) > 0
  }
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
      ] : <Button type="primary" onClick={close}>Done</Button>}
    >
      <Search {...{isEmail}} onChange={(src) => setState({ src })} getReset={(ref) => { resetRef.current = ref }} />
      {(!loading && !isEmail && hasResults) &&
      <Collapse defaultActiveKey={data.map((a, i) => i)}>
        {data.map((org, index) => {
          const orgName = orgs.find(it => it.organisation === org.id).organisationName
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
                      {!rolesDict[user.email] && <Button type="primary" icon="plus" onClick={() => onAddRole(role)}>Add</Button>}
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
          {state.sendingStatus === 'error' && <Alert message="Something went wrong" type="error" />}
        </div>
      )}
    </Modal>
  )
}

export default Access
