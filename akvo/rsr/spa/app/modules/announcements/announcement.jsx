import React, { useState } from 'react'
import { Icon } from 'antd'
import list from './list'
import Modal from './modal'
import Body from './17-06-2020' // temp!

export default () => {
  const [showModal, setShowModal] = useState(false)
  return [
    <div className="announcement" role="button" tabIndex={-1} onClick={() => setShowModal(true)}>
      <Icon type="notification" />
      New features are here!
    </div>,
    <Modal visible={showModal} onCancel={() => setShowModal(false)} Body={Body} />
  ]
}
