import React, { useState } from 'react'
import { Modal, Input, InputNumber } from 'antd'
import api from '../../utils/api'

export default ({ visible, onCancel, periodId, initialValue = 0, onUpdated }) => {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const submit = () => {
    setSaving(true)
    api.patch(`/indicator_period/${periodId}/`, {
      targetValue: value
    }).then(() => {
      setSaving(false)
      onUpdated(value)
    }).catch((e) => {
      setSaving(false)
      console.error(e)
      // onCancel()
    })
  }
  const handleChange = (ev) => {
    setValue(ev)
  }
  return (
    <Modal
      {...{visible, onCancel}}
      title="Update target"
      onOk={submit}
      confirmLoading={saving}
      className="update-target-modal"
      width={300}
    >
      <InputNumber
        value={value}
        onChange={handleChange}
        size="large"
        formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={val => val.replace(/(,*)/g, '')}
      />
    </Modal>
  )
}
