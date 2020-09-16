import React, { useEffect, useState } from 'react'
import './enumerator.scss'
import { Collapse, Button, Icon, Form, Input } from 'antd'

const { Panel } = Collapse

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
            <div className="check-holder">
              <div className="check" />
            </div>
            <h5>{indicator.title}</h5>
          </li>
        )}
      </ul>
      <div className="content">
        {selected && [
          selected.description &&
          <p className="desc">
            {selected.description}
          </p>,
          <Collapse destroyInactivePanel accordion>
            {selected.periods.map(period =>
              <Panel header={[<div><b>{period.periodStart}</b> - <b>{period.periodEnd}</b></div>, <Button type="primary" disabled>Submit</Button>]}>
                <AddUpdate period={period} indicator={selected} />
              </Panel>
            )}
          </Collapse>
        ]}
      </div>
    </div>
  )
}

const AddUpdate = ({period, indicator}) => {
  return (
    <div className="add-update">
      <header>
        {indicator.ascending ? [
          <Icon type="rise" />, <b>Ascending</b>
        ] : [
          <Icon type="fall" />, <b>Descending</b>
        ]}
      </header>
      <div className="inputs-container">
        <div className="inputs">
          {/* <h5>Value percentage</h5> */}
          <Form aria-orientation="vertical">
            <Form.Item label="Numerator">
              <Input />
            </Form.Item>
            <Form.Item label="Denumerator">
              <Input />
            </Form.Item>
          </Form>
        </div>
        <div className="prev-value">
          <h5>your previous value update</h5>
          <div className="date">3 sep 2020</div>
          <div className="author">John Snow</div>
        </div>
      </div>
    </div>
  )
}

export default Enumerator
