import React, { Suspense } from 'react'
import { Modal } from 'antd'
import api from '../../utils/api'

export default ({ visible, onCancel, Body, openMenu }) => {
  if(Body === null) return null
  return (
    <Modal {...{visible, onCancel}} footer={null}>
      <Suspense fallback={<div>Loading...</div>}><Body close={onCancel} {...{openMenu}} /></Suspense>
    </Modal>
  )
}
