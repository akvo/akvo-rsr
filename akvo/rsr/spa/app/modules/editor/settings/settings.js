import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Switch, Tooltip, Icon, Button, Divider } from 'antd'
import { withRouter, Link } from 'react-router-dom'

import './styles.scss'
import * as actions from '../actions'
import api from '../../../utils/api'


export const sets = [
  { value: 1, label: 'RSR' },
  { value: 4, label: 'NLR'},
  { value: 7, label: 'Gietrenk SPC'},
  { value: 2, label: 'IATI'},
  { value: 8, label: 'IATI Basic'},
  { value: 5, label: 'EUTF'},
  { value: 3, label: 'DGIS IATI'},
  { value: 6, label: 'DFID'},
]


const Settings = ({ isPublic, validations, match: { params }, history, ...props }) => {
  const [loading, setLoading] = useState(false)
  const [newlyCreated, setNewlyCreated] = useState(false)
  const createProject = () => {
    setLoading(true)
    api.post('/project', { validations }).then(project => {
      setLoading(false)
      setNewlyCreated(true)
      history.push(`/projects/${project.id}/settings`)
      props.setProjectId(project.id)
    })
  }
  return (
    <div className="settings view">
      <p>
        <Switch checked={!isPublic} onChange={checked => props.togglePrivacy(!checked)} />
        <span className="switch-label">Private project</span>
        <Tooltip title="Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project."><Icon type="info-circle" /></Tooltip>
      </p>
      <Divider />
      <strong>Validation sets</strong>
      <br />
      <small>
        It is possible to add or remove validation sets to your project.
        This determines which fields will be mandatory and which fields will be hidden.
        Only admins or partners with an RSR contract are able to edit this.
      </small>
      <ul>
        {sets.map(({ value, label }, index) =>
        <li key={value}>
          <Switch disabled={index === 0} checked={validations.indexOf(value) !== -1} onChange={checked => props.checkValidation(value, checked)} />
          <span className="switch-label">{label}</span>
          <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip>
        </li>
        )}
      </ul>
      {params.id === 'new' && <Button type="primary" onClick={createProject} loading={loading}>Create New Project</Button>}
      {newlyCreated && <div><Divider /><Link to={`/projects/${params.id}/info`}><Button>Next: Edit Project Info<Icon type="right" /></Button></Link></div>}
    </div>
  )
}

export default connect(
  ({ editorRdr: { validations, isPublic } }) => ({ validations, isPublic }),
  actions
)(withRouter(Settings))
