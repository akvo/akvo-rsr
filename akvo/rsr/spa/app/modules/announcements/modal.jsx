import React from 'react'
import { Modal } from 'antd'
// import AnnBody from './17-06-2020'

export default ({ visible, onCancel, announcement, Body }) => {
  return (
    <Modal {...{visible, onCancel}}>
      <Body />
    </Modal>
  )
}
