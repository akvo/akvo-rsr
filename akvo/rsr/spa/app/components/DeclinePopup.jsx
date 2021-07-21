import React, { useState } from 'react'
import { Modal, Input } from 'antd'

export const DeclinePopup = ({ children, onConfirm }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [comment, setComment] = useState('')
  const handleClick = (e) => {
    e.stopPropagation()
    setComment('')
    setModalVisible(true)
  }
  const handleConfirm = () => {
    onConfirm(comment)
    setModalVisible(false)
  }
  return [
    <span onClick={e => e.stopPropagation()}>
      <span onClick={handleClick}>{children}</span>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} okText="Return for revision" okType="danger" closable={false} onOk={handleConfirm}>
        <Input.TextArea placeholder="Optional comment" value={comment} onChange={ev => setComment(ev.target.value)} />
      </Modal>
    </span>
  ]
}
