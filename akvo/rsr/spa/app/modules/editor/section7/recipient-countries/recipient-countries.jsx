import React from 'react'
import { Button, Form } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import countries from '../../../../utils/countries.json'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'

const { Item } = Form

const COUNTRY_OPTIONS = countries.map(({ code, name }) => ({ value: code, label: name }))

const RecipientCountries = ({ validations, formPush, showRequired, errors, isLast }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <div className="min-required-wrapper">
        <h3>{t('recipient country')}</h3>
        {showRequired && errors.findIndex(it => it.type === 'min' && it.path === 'recipientCountries') !== -1 && (
          <span className="min-required">{t('Minimum one required')}</span>
        )}
      </div>
      <ItemArray
        setName="recipientCountries"
        sectionIndex={7}
        header={(index, countryCode) => {
          let country
          if (countryCode) country = countries.find(it => it.code === countryCode)
          return (
            <span>{
              t('recipient country')} {index + 1}:&nbsp;
              {country && country.name}
            </span>
          )
        }}
        headerField="country"
        headerMore={(index, percentage) => {
          if (!fieldExists('percentage')){
            return null
          }
          return (
            <span className="amount">{percentage}%</span>
          )
        }}
        headerMoreField="percentage"
        formPush={formPush}
        panel={name => (
          <div>
            <Item label={<InputLabel tooltip={t('The country that benefits from the project.')}>{t('country')}</InputLabel>}>
              <FinalField
                name={`${name}.country`}
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) => {
                  const { children } = option.props
                  return (typeof children === 'string' ? children : children.join('')).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
                control="select"
                options={COUNTRY_OPTIONS}
              />
            </Item>
            <span className="percentage-row">
              {fieldExists('percentage') && (
                <FinalField
                  name={`${name}.percentage`}
                  control="input"
                  suffix={<span>%</span>}
                  className="percentage-input"
                  withLabel
                  dict={{
                    label: t('Percentage'),
                    tooltip: t('The percentage of total commitments or total activity budget allocated to this country. Content must be a positive decimal number between 0 and 100, with no percentage sign. Percentages for all reported countries and regions MUST add up to 100%. Use a period to denote decimals.')
                  }}
                />
              )}
              {fieldExists('text') && (
                <Item label={<InputLabel optional tooltip={t('Enter additional information about the recipient country, if necessary.')}>{t('description')}</InputLabel>}>
                <FinalField
                  name={`${name}.text`}
                  control="textarea"
                  rows={2}
                />
                </Item>
              )}
            </span>
          </div>
        )}
        addButton={({ onClick }) => (
          <Button onClick={onClick} icon="plus" type="dashed" block className={isLast ? 'bottom-btn' : null}>
            {t('Add recipient country')}
          </Button>
        )}
      />
    </div>
  )
}

export default RecipientCountries
