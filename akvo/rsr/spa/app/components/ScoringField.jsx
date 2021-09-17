import { Checkbox, Radio } from 'antd'
import { intersection } from 'lodash'
import React from 'react'

const ScoringField = ({ scores, value = [], disabled = false, onChange }) => {
  const single = [
    'yes', 'no', "don't know", "i don't know",
    'very poor', 'poor', 'average', 'good', 'excellent'
  ]
  const handleToggleScore = (score) => ({ target: { checked } }) => {
    if (checked) onChange([...value, score])
    else onChange(value.filter(it => it !== score))
  }
  return scores.filter((s) => (single.filter((i) => {
    const sl = s.toLowerCase()
    const prefix = sl.split(/\s+/)[0] || ''
    return sl === i || prefix.includes(i)
  }).length)).length
    ? (
      <Radio.Group style={{ marginTop: 5, marginBottom: 15 }} onChange={(e) => onChange([e.target.value])} value={value[0]}>
        {scores.map((score, index) => <Radio key={index} value={index + 1} {...{ disabled }}>{score}</Radio>)}
      </Radio.Group>
    ) : (
      <div className="score-checkboxes">
        <h5>Scores</h5>
        <ul>
          {scores.map((score, index) =>
            <li key={index}><Checkbox checked={value?.indexOf(index + 1) !== -1} onChange={handleToggleScore(index + 1)} {...{ disabled }}>{score}</Checkbox></li>
          )}
        </ul>
      </div>
    )
}

export default ScoringField
