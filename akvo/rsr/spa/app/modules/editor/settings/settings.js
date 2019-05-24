import React from 'react'
import { connect } from 'react-redux'
// import { Checkbox, Icon, Popup } from 'semantic-ui-react'
import { Switch, Tooltip, Icon } from 'antd'

import './styles.scss'
import * as actions from '../actions'

// const sets = ['RSR', 'NLR', 'Gietrenk SPC', 'IATI', 'EUTF', 'DGIS IATI', 'DFID']

const sets = [
  { value: 1, label: 'RSR' },
  { value: 4, label: 'NLR'},
  { value: 7, label: 'Gietrenk SPC'},
  { value: 2, label: 'IATI'},
  { value: 8, label: 'IATI Basic'},
  { value: 5, label: 'EUTF'},
  { value: 3, label: 'DGIS IATI'},
  { value: 6, label: 'DFID'},
]

const Settings = ({ isPublic, validations, ...props }) => (
  <div className="settings view">
    <p>
      <Switch checked={!isPublic} onChange={checked => props.togglePrivacy(!checked)} />
      <span className="switch-label">Private project</span>
      <Tooltip title="Private projects do not appear in any public lists. These projects can only be viewed in the My Projects portfolio a user that has the permission rights to edit the project."><Icon type="info-circle" /></Tooltip>
    </p>
    <hr />
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
  </div>
)

export default connect(
  ({ editorRdr: { validations, isPublic } }) => ({ validations, isPublic }),
  actions
)(Settings)
