import React from 'react'
import { Button } from 'antd'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import { doesFieldExist, isFieldOptional, getValidationSets } from '../../../../utils/validation-utils'
import VOCABULARY_OPTIONS from './vocab.json'
import SectionContext from '../../section-context'
import MinRequired from '../../../../utils/min-required'


const References = ({ fieldName, validations, formPush, indicatorId }) => {
  const { t } = useTranslation()
  return (
    <div>
      <div className="min-required-wrapper">
        <InputLabel>{t('References')}</InputLabel>
      </div>
      <ItemArray
        setName={`${fieldName}.references`}
        sectionIndex={5}
        header={(index, vocabulary) => {
          return (
            <span>{t('reference')} {index + 1}: {vocabulary !== '' && VOCABULARY_OPTIONS.find(it => it.value === vocabulary).label}</span>
          )
        }}
        headerField="vocabulary"
        formPush={formPush}
        panel={(name, index) => (
        <div>
          <FinalField
            control="select"
            options={VOCABULARY_OPTIONS}
            name={`${name}.vocabulary`}
            withLabel
            withValuePrefix
            dict={{
              label: t('vocabulary'),
              tooltip: t('This is the code for the vocabulary used to describe the Indicator References')
            }}
          />
          <FinalField
            control="input"
            name={`${name}.vocabularyUri`}
            withLabel optional
            dict={{
              label: t('vocabulary URI'),
              tooltip: t('If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.')
            }}
          />
          <FinalField
            name={`${name}.reference`}
            control="input"
            withLabel
            label={<InputLabel>{t('reference')}</InputLabel>}
          />
        </div>
        )}
        modal={{
          buttonText: t('Add reference'),
          className: 'add-reference-modal',
          component: ({ onClick }) => (
            <div>
              {VOCABULARY_OPTIONS.map(item => {
                const newItem = { vocabulary: item.value, indicator: indicatorId, reference: '', vocabularyUri: '' }
                return (
                <div className="desc-block">
                  <Button block icon="plus" onClick={() => onClick(newItem)}>{item.label}</Button>
                </div>
              )
              })}
            </div>
          )
        }}
      />
    </div>
  )
}

export default References
