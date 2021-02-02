import { Checkbox } from 'antd'
import React from 'react'

const ScoreCheckboxes = ({ scores, value = [], onChange }) => {
  const handleToggleScore = (score) => ({ target: { checked } }) => {
    if (checked) onChange([...value, score])
    else onChange(value.filter(it => it !== score))
  }
  return (
    <div className="score-checkboxes">
      <h5>Scores</h5>
      <ul>
        {scores.map((score, index) =>
          <li><Checkbox checked={value?.indexOf(index + 1) !== -1} onChange={handleToggleScore(index + 1)}>{score}</Checkbox></li>
        )}
      </ul>
    </div>
  )
}

export default ScoreCheckboxes
