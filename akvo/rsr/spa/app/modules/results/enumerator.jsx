import React, { useEffect, useState } from 'react'
import './enumerator.scss'

const Enumerator = ({ results, id }) => {
  const [indicators, setIndicators] = useState([])
  const [selected, setSelected] = useState(null)
  useEffect(() => {
    const indicators = []
    results.forEach(result => {
      result.indicators.forEach(indicator => {
        const periods = indicator.periods.filter(it => it.locked === false)
        if(periods.length > 0){
          const {id, title, type} = indicator
          indicators.push({
            id, title, type, periods
          })
        }
      })
    })
    setIndicators(indicators)
    if(indicators.length > 0){
      setSelected(indicators[0])
    }
  }, [])
  return (
    <div className="enumerator-view">
      <ul>
        {indicators.map(indicator =>
          <li>
            <div className="check" />
            <h5>{indicator.title}</h5>
          </li>
        )}
      </ul>
      <div className="content">
        {selected && (
          <div className="indicator">
            <AddUpdate period={selected.periods[0]} />
          </div>
        )}
      </div>
    </div>
  )
}

const AddUpdate = ({period}) => {
  return (
    <div className="add-update">
      <p>Add update for period: <b>{period.periodStart} - {period.periodEnd}</b></p>
    </div>
  )
}

export default Enumerator
