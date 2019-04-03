import React from 'react'
// import { Checkbox, Icon, Popup } from 'semantic-ui-react'
import { Switch, Tooltip, Icon } from 'antd'

const sets = ['RSR', 'NLR', 'Gietrenk SPC', 'IATI', 'EUTF', 'DGIS IATI', 'DFID']

const Settings = () => (
  <div className="settings">
    <p>
      <Switch />
      <span className="switch-label">Private project</span>
      <Tooltip title="What does this mean?"><Icon type="question-circle" /></Tooltip>
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
      {sets.map(set =>
      <li>
        <Switch />
        <span className="switch-label">{set}</span>
        <Tooltip title="What does this mean?"><Icon type="question-circle" /></Tooltip>
      </li>
      )}
    </ul>
  </div>
)

export default Settings
