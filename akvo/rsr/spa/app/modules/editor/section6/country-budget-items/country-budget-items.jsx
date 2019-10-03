import React from 'react'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import CalcTotalChecker from '../../../../utils/calc-total-checker'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import CODE_OPTIONS from './options.json'

const { Item } = Form

const CountryBudgetItems = ({ formPush }) => {
  const { t } = useTranslation()
  return (
    <div>
    <ItemArray
      setName="countryBudgetItems"
      sectionIndex={6}
      header={(index, code) => {
        return <span>{code ? CODE_OPTIONS.find(it => it.value === code).label : `${t('Country budget item')} ${index + 1}`}</span>
      }}
      headerField="code"
      formPush={formPush}
      panel={name => (
        <div>
        <Item
          label={
          <InputLabel optional tooltip={t('This item encodes the alignment of activities with both the functional and administrative classifications used in the recipient country’s Chart of Accounts. This applies to both on- and off-budget activities.')}>
            {t('Item code')}
          </InputLabel>}
        >
        <FinalField
          name={`${name}.code`}
          control="select"
          options={CODE_OPTIONS}
        />
        </Item>
        <div className="percentage-row">
          <Item label={
            <InputLabel tooltip={t('If more than one identifier is reported, the percentage share must be reported and all percentages should add up to 100 percent. Use a period to denote decimals.')}>
              {t('Percentage')}
            </InputLabel>
          }>
          <FinalField
            name={`${name}.percentage`}
            suffix={<span>%</span>}
            className="capital-percentage"
          />
          </Item>
          <Item label={<InputLabel optional>{t('Description')}</InputLabel>}>
          <FinalField
            name={`${name}.description`}
          />
          </Item>
        </div>
        </div>
      )}
      addButton={({onClick}) => (
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add country budget item')}</Button>
      )}
    />
      <CalcTotalChecker section="6" path="countryBudgetItems" prop="percentage" />
    </div>
  )
}

export default CountryBudgetItems
