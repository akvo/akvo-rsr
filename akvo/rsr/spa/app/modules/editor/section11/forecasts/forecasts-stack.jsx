import React from 'react'
import { Button, Row, Col, Form } from 'antd'
import currencies from 'currency-codes/data'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import getSymbolFromCurrency from '../../../../utils/get-symbol-from-currency'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const ForecastsStack = ({ formPush, fssParent }) => {
  const { t } = useTranslation()
  return (
    <ItemArray
      setName="forecasts"
      sectionIndex={11}
      header={`${t('CRS++ other forecast')} $index`}
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
              <FinalField
                name={`${name}.currency`}
                showSearch
                optionFilterProp="children"
                control="select"
                options={currencies.map(item => ({ value: item.code, label: `${item.code} - ${item.currency}`}))}
                withLabel
                optional
                dict={{ label: t('currency') }}
              />
            </Col>
            <Col span={12}>
              <FinalField
                name={`${name}.value`}
                control="input-number"
                optional
                withLabel
                dict={{ label: t('value'), tooltip: t('The forecast value for each year.') }}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FinalField
                name={`${name}.year`}
                control="input"
                withLabel
                dict={{ label: t('year'), tooltip: t('The calendar year that the forward spend covers.') }}
              />
            </Col>
            <Col span={12}>
              <FinalField
                name={`${name}.date`}
                control="datepicker"
                withLabel
                optional
                dict={{ label: t('value date'), tooltip: t('Enter the specific date (DD/MM/YYYY) for the forecast value.') }}
              />
            </Col>
          </Row>
        </div>
      )}
      addButton={({onClick}) => <Button onClick={onClick} className="bottom-btn" block icon="plus" type="dashed" disabled={!fssParent}>{t('Add CRS++ other flag')}</Button>}
    />
  )
}

export default ForecastsStack
