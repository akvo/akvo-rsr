import React from 'react'
import { Button, Divider } from 'antd'
import { Link } from 'react-router-dom'

export default ({ close }) => (
  <div>
    <h3>Improved Results tab</h3>
    <p>An easier way to manage your results data and report on your indicators in now available!</p>
    <Link to="/"><Button type="primary" onClick={close}>Check it out in a published project</Button></Link>
  </div>
)
