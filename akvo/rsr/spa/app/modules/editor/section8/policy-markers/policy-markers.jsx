import React from 'react'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import MARKER_OPTIONS from './markers.json'
import SIGNIFICANCE_OPTIONS from './significances.json'

const { Item } = Form

const PolicyMarker = ({ validations, formPush }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <h3>{t('Policy markers')}</h3>
      <ItemArray
        setName="policyMarkers"
        sectionIndex={8}
        header={(index, value) => {
          return (
            <span>{t('policy marker')} {index + 1}: {value !== '' && MARKER_OPTIONS.find(it => it.value === value).label}</span>
          )
        }}
        headerField="policyMarker"
        formPush={formPush}
        panel={name => (
          <div>
            <FinalField
              control="select"
              options={MARKER_OPTIONS}
              name={`${name}.policyMarker`}
              withLabel
              dict={{
                label: t('policy marker'),
                tooltip: t('A policy or theme addressed by the activity, based on DAC policy markers. These indicators track key policy issues, like gender equality, environment, and trade development.')
              }}
            />
            <FinalField
              control="select"
              options={SIGNIFICANCE_OPTIONS}
              name={`${name}.significance`}
              withLabel
              dict={{
                label: t('Significance'),
                tooltip: t('Each reported marker must contain the significance of the policy marker for this activity. Choices are:\
0 - Not targeted\
1 - Significant objective: the policy objectives are important, but were not the prime motivation for undertaking the activity.\
          2 - Principal objective: the policy objective was the primary reason to undertake this activity.\
          3 - Principal objective AND in support of an action programme: valid for the markers dealing with Desertification only.\
          4 - Explicit primary objective: only to be used in combination with policy marker.\
9 - reproductive, maternal, newborn and child health.')
              }}
            />
            {fieldExists('description') && (
              <FinalField
                control="input"
                name={`${name}.description`}
                withLabel
                optional
                dict={{ label: t('description')}}
              />
            )}
            {fieldExists('vocabulary') && (
              <FinalField
                control="select"
                options={[{ value: '1', label: '1 - OECD DAC CRS' }, { value: '99', label: '99 - Reporting Organisation' }]}
                name={`${name}.vocabulary`}
                withLabel
                optional
                dict={{
                  label: t('vocabulary')
                }}
              />
            )}
            {fieldExists('vocabularyUri') && (
              <FinalField
                control="input"
                name={`${name}.vocabularyUri`}
                withLabel
                optional
                dict={{
                  label: t('vocabulary URI'),
                  tooltip: t('If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.')
                }}
              />
            )}
          </div>
        )}
        modal={{
          buttonText: t('Add Policy Marker'),
          className: 'add-sector-modal',
          component: ({ onClick }) => (
            <div>
              {MARKER_OPTIONS.map(item => (
                <div className="desc-block">
                  <Button block icon="plus" onClick={() => onClick({ policyMarker: item.value })}>{item.label}</Button>
                </div>
              ))}
            </div>
          )
        }}
      />
    </div>
  )
}

export default PolicyMarker
