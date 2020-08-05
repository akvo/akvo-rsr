import React, { useEffect, Suspense } from 'react'
import { Modal } from 'antd'
import api from '../../utils/api'
// import list from './list'

export default ({ visible, onCancel, announcement, Body, userRdr }) => {
  useEffect(() => {
    if(visible){
      // api.patch(`/user/${userRdr.id}/`, {
      //   seenAnnouncements: ['17-06-2020']
      // })
    }
  }, [visible])
  return (
    <Modal {...{visible, onCancel}} footer={null}>
      <Suspense fallback={<div>Loading...</div>}><Body close={onCancel} /></Suspense>
    </Modal>
  )
}
