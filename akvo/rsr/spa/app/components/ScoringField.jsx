import { Checkbox, Radio } from 'antd'
import { intersection } from 'lodash'
import React from 'react'

const ScoringField = ({ scores, value = [], disabled = false, onChange }) => {
  const YES_NO_QUESTION = ['Yes', 'No', 'I don\'t know']
  const handleToggleScore = (score) => ({ target: { checked } }) => {
    if (checked) onChange([...value, score])
    else onChange(value.filter(it => it !== score))
  }
  return intersection(YES_NO_QUESTION, scores).length
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
