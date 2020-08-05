import React from 'react'
import { Button, Divider } from 'antd'
import { Link } from 'react-router-dom'

export default ({ close, openMenu }) => (
  <div>
    <h3>New simplified navigation menu</h3>
    <p>{'A better, more organised way to find what you\'re looking for. '}</p>
    <Button type="primary" onClick={openMenu}>Check it out</Button>
    <Divider />
    <h3>New IATI page</h3>
    <p>An improved way to manage your IATI reporting. Still easy, still seamless.</p>
    <Link to="/iati"><Button type="primary" onClick={close}>Check it out</Button></Link>
  </div>
)
