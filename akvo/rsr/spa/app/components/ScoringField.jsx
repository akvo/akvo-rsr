/* eslint-disable react/no-danger */
import { Radio } from 'antd'
import React from 'react'
import { wordWrap } from '../utils/misc'

const ScoringField = ({ scores, value = [], disabled = false, id = null, onChange }) => (
  <Radio.Group
    style={{ marginTop: 5, marginBottom: 15, maxWidth: 435 }}
    onChange={(e) => onChange([e.target.value])}
    value={value[0]}
  >
    <ul>
      {scores.map((score, index) => (
        <li key={index} style={{ display: 'flex', gap: 6, flexDirection: 'row' }}>
          <Radio value={index + 1} disabled={disabled} />
          <span dangerouslySetInnerHTML={{ __html: wordWrap(score, 60) }} />
        </li>
      ))}
    </ul>
  </Radio.Group>
)

export default ScoringField
