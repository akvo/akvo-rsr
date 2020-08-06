import React, { Suspense } from 'react'
import { Modal } from 'antd'
import api from '../../utils/api'

export default ({ visible, onCancel, Body, openMenu }) => {
  return (
    <Modal {...{visible, onCancel}} footer={null}>
      <Suspense fallback={<div>Loading...</div>}><Body close={onCancel} {...{openMenu}} /></Suspense>
    </Modal>
  )
}
