import React from 'react'
import { Radio, Icon, Button, Select } from 'antd'

import './access.scss'


const Access = () => {
  return (
    <div className="access-section">
      <h3>Access</h3>
      <Radio.Group>
        <Radio.Button value={1}>
          <Icon type="team" /> <b>Organization</b>
          <p>Any member of a partner organization has access</p>
        </Radio.Button>
        <Radio.Button value={2}>
          <Icon type="lock" /> <b>Restricted</b>
          <p>Only people you add have access</p>
        </Radio.Button>
      </Radio.Group>
    </div>
  )
}

export default Access
