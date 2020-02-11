import React, { useState, useEffect, useRef } from 'react'
import { Radio, Icon, Button, Select, Modal, Input, Collapse, Dropdown, Menu } from 'antd'
import { useFetch } from '../../../utils/hooks'
import './access.scss'
import api from '../../../utils/api'

const { Panel } = Collapse
const roleTypes = ['Admins', 'M&E Managers', 'Project Editors', 'Users', 'Enumerators']
const roleDesc = {
  Admins: 'Can view and edit projects, add and remove members and change all settings',
  'M&E Managers': 'Can view and edit projects, add members and change most settings',
  'Project Editors': 'Can view and edit projects and edit some settings',
  Users: 'Can view projects',
  Enumerators: 'Can view projects and post updates'
}
const roleLabelDict = {
  Admins: 'Admin',
  'M&E Managers': 'M&E Manager',
  'Project Editors': 'Project Editor',
  Users: 'User',
  Enumerators: 'Enumerator'
}

const Access = ({ projectId, partners }) => {
  const [roleData, loading] = useFetch(`project/${projectId}/project_roles/`)
  const [useProjectRoles, setUseProjectRoles] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [roles, setRoles] = useState([])
  useEffect(() => {
    setUseProjectRoles(roleData.useProjectRoles)
    if (roleData.roles){
      setRoles(roleData.roles)
    }
  }, [roleData])
  const handleAddRole = (userRole) => {
    const _roles = [...roles, userRole]
    setRoles(_roles)
    api.patch(`project/${projectId}/project_roles/`, {
      roles: _roles.map(({ email, role}) => ({ email, role })),
    })
  }
  const handleProjectRolesChange = ({ target: {value}}) => {
    setUseProjectRoles(value)
    setRoles([])
    api.patch(`project/${projectId}/project_roles/`, {
      useProjectRoles: value
    })
  }
  const changeUserRole = (user, role) => {
    const ind = roles.findIndex(it => it.email === user.email)
    const updatedRoles = [...roles.slice(0, ind), {...user, role}, ...roles.slice(ind + 1)]
    setRoles(updatedRoles)
    api.patch(`project/${projectId}/project_roles/`, {
      roles: updatedRoles.map(({ email, role }) => ({ email, role })) // eslint-disable-line
    })
  }
  const removeUser = (user) => {
    const updatedRoles = roles.filter(it => it.email !== user.email)
    setRoles(updatedRoles)
    api.patch(`project/${projectId}/project_roles/`, {
      roles: updatedRoles.map(({ email, role }) => ({ email, role })),
    })
  }
  return (
    <div className="access-section">
      <h3>User Access</h3>
      <Radio.Group value={useProjectRoles} onChange={handleProjectRolesChange} disabled={loading}>
        <Radio.Button value={false}>
          <Icon type="team" /> <b>Organization</b>
          <p>Members of partner organizations have access</p>
        </Radio.Button>
        <Radio.Button value={true}>
          <Icon type="lock" /> <b>Restricted</b>
          <p>Only people you add have access</p>
        </Radio.Button>
      </Radio.Group>
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
      {!loading && <InviteUserModal {...{roles}} onAddRole={handleAddRole} visible={modalVisible} onCancel={() => setModalVisible(false)} orgs={partners} />}
    </div>
  )
}

const InviteUserModal = ({ visible, onCancel, orgs, onAddRole, roles }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const prevData = useRef([])
  useEffect(() => {
    if(prevData.current.filter(it => it.organisation).length !== orgs.filter(it => it.organisation).length){
    setLoading(true)
    prevData.current = orgs
    api.get(`/members/?orgs=[${orgs.filter(it => it.organisation).map(it => it.organisation).join(',')}]`)
      .then(d => {
        setData(d.data)
        setLoading(false)
      })
    }
  }, [orgs])
  const [src, setSrc] = useState('')
  const rolesDict = {}; roles.forEach(role => { rolesDict[role.email] = role })
  const filterName = it => { if(src === '') return true; return it.name.toLowerCase().indexOf(src) !== -1 }
  return (
    <Modal
      title="Invite user"
      {...{ visible, onCancel }}
      className="invite-user-modal"
      footer={<Button type="primary" onClick={onCancel}>Done</Button>}
    >
      <Input value={src} onChange={e => setSrc(e.target.value)} allowClear suffix={<Icon type="search" />} placeholder="Type name or email" />
      {!loading &&
      <Collapse defaultActiveKey={data.map((a, i) => i)}>
        {data.map((org, index) => {
          const orgName = orgs.find(it => it.organisation === org.id).organisationName
          const filteredMembers = org.members.filter(filterName)
          if(filteredMembers.length === 0) return null
          return (
            <Panel key={index} header={`Members of ${orgName}`}>
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
    </Modal>
  )
}

export default Access
