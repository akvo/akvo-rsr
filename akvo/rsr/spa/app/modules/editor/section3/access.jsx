import React, { useState, useEffect } from 'react'
import { Radio, Icon, Button, Select } from 'antd'
import { useFetch } from '../../../utils/hooks'
import './access.scss'

const users = [
  { name: 'Anthony Gonzalez', role: 'Admin', org: 'Akvo'},
  { name: 'Martin Christov', role: 'Admin', org: 'Akvo' },
  { name: 'Annabelle', role: 'M&E Manager', org: 'Akvo' },
  { name: 'Lea Pascal', role: 'Editor', org: 'EUTF Africa' }
]

const Access = ({ projectId }) => {
  const [roles, loading] = useFetch(`project/${projectId}/project_roles/`)
  const [useProjectRoles, setUseProjectRoles] = useState(false)
  useEffect(() => {
    setUseProjectRoles(roles.useProjectRoles)
  }, [roles])
  return (
    <div className="access-section">
      <h3>Access</h3>
      <Radio.Group value={useProjectRoles} onChange={e => setUseProjectRoles(e.target.value)} disabled={loading}>
        <Radio.Button value={false}>
          <Icon type="team" /> <b>Organization</b>
          <p>Members of partner organizations have access</p>
        </Radio.Button>
        <Radio.Button value={true}>
          <Icon type="lock" /> <b>Restricted</b>
          <p>Only people you add have access</p>
        </Radio.Button>
      </Radio.Group>
      <ul>
        {users.map(user =>
        <li>
          <div className="text">
            <b>{user.name}</b>
            <p>{user.role} | {user.org}</p>
          </div>
          <Select value={1}>
            <Select.Option value={1}>Admin</Select.Option>
            <Select.Option value={0}>Remove</Select.Option>
          </Select>
        </li>
        )}
      </ul>
      <Button className="bottom-btn" icon="plus" type="dashed" block>Add user</Button>
    </div>
  )
}

export default Access
