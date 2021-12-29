/* eslint-disable react/no-danger */
import { Radio, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { wordWrap } from '../utils/misc'

const ScoringField = ({ scores, value = [], disabled = false, id = null, onChange }) => {
  const [preload, setPreload] = useState(true)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (preload) {
      setPreload(false)
      setTimeout(() => {
        if ((typeof value === 'string' && !id) || !value) {
          setLoading(false)
        }
      }, 500) // max waiting for checkbox value ready
    }
    if (loading && (id && typeof value === 'object')) setLoading(false)
  }, [preload, loading, id, value])
  return (
    <Skeleton loading={loading} paragraph={{ rows: scores?.length }}>
      <Radio.Group
        style={{ marginTop: 5, marginBottom: 15, maxWidth: 435 }}
        onChange={(e) => onChange([e.target.value])}
        value={value[0]}
      >
        <ul>
          {scores.map((score, index) => (
            <li key={index} style={{ display: 'flex', gap: 6 }}>
              <Radio value={index + 1} disabled={disabled} />
              <span dangerouslySetInnerHTML={{ __html: wordWrap(score, 60) }} />
            </li>
          ))}
        </ul>
      </Radio.Group>
    </Skeleton>
  )
}

export default ScoringField
