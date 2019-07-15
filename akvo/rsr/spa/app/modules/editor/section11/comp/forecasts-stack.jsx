import React from 'react'
import { Button, Row, Col, Form } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'

import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const ForecastsStack = ({ formPush, fssParent }) => {
  return (
    <ItemArray
      setName="forecasts"
      sectionIndex={11}
      header="CRS++ other forecast $index"
      newItem={{ fss: fssParent ? fssParent.id : null }}
      headerMore={(index, value) => {
        return (
          <Field
            name={`forecasts[${index}].currency`}
            render={({input}) => {
              const currencySymbol = getSymbolFromCurrency(input.value)
              return <span className="amount">{currencySymbol}{String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            }}
          />
        )
      }}
      headerMoreField="value"
      formPush={formPush}
      panel={name => (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Item label={<InputLabel tooltip="...">Currency</InputLabel>}>
                <FinalField
                  name={`${name}.currency`}
                  showSearch
                  optionFilterProp="children"
                  control="select"
                  options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item label={<InputLabel tooltip="..." optional>Value</InputLabel>}>
                <FinalField
                  name={`${name}.value`}
                  control="input-number"
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Item label={<InputLabel optional>Year</InputLabel>}>
                <FinalField
                  name={`${name}.year`}
                  control="input-number"
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item label={<InputLabel optional>Value Date</InputLabel>}>
                <FinalField
                  name={`${name}.date`}
                  control="datepicker"
                />
              </Item>
            </Col>
          </Row>
        </div>
      )}
      addButton={({onClick}) => <Button onClick={onClick} className="bottom-btn" block icon="plus" type="dashed" disabled={!fssParent}>Add CRS++ other flag</Button>}
    />
  )
}

export default ForecastsStack
