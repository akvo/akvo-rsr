import React from 'react'
import { Button } from 'antd'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import { doesFieldExist, isFieldOptional, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import VOCAB_1_CODES from '../vocab-1-codes.json'
import VOCAB_2_CODES from '../vocab-2-codes.json'
import VOCAB_7_CODES from '../vocab-7-codes.json'
import VOCAB_8_CODES from '../vocab-8-codes.json'
import VOCABULARY_OPTIONS from '../vocab.json'
import EUTF_SECTOR_OPTIONS from './eutf-sector-options.json'
import SectionContext from '../../section-context'
import MinRequired from '../../../../utils/min-required'


const Sectors = ({ validations, formPush, primaryOrganisation }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const isOptional = isFieldOptional(validationSets)
  const isDFID = validations.indexOf(6) !== -1 // explicit check for DFID is required to set conditional "optional" flag
  return (
    <div>
      <SectionContext.Provider value="section8">
      <div className="min-required-wrapper">
        <h3>{t('Sectors')}</h3>
        <MinRequired section="section8" setName="sectors" />
      </div>
      <ItemArray
        setName="sectors"
        sectionIndex={8}
        header={(index, vocabulary) => {
          return (
            <span>{t('sector')} {index + 1}: {vocabulary !== '' && VOCABULARY_OPTIONS.find(it => it.value === vocabulary).label}</span>
          )
        }}
        headerField="vocabulary"
        formPush={formPush}
        panel={name => (
        <div>
          <FinalField
            control="select"
            options={VOCABULARY_OPTIONS}
            name={`${name}.vocabulary`}
            withEmptyOption
            withLabel
            optional={isOptional('vocabulary')}
            dict={{
              label: t('vocabulary'),
              tooltip: t('This is the code for the vocabulary used to describe the sector. Sectors should be mapped to DAC sectors to enable international comparison.')
            }}
          />
          {fieldExists('vocabularyUri') && (
            <FinalField
              control="input"
              name={`${name}.vocabularyUri`}
              withLabel optional
              dict={{
                label: t('vocabulary URI'),
                tooltip: t('If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.')
              }}
            />
          )}
          <Field
            name={`${name}.vocabulary`}
            render={
              ({input}) => {
                let options
                // (primaryOrganisation === 3394 && input.value === '99') ? EUTF_SECTOR_OPTIONS : CODE_OPTIONS
                if(input.value === '1') {
                  options = VOCAB_1_CODES
                }
                else if(input.value === '2'){
                  options = VOCAB_2_CODES
                }
                else if(input.value === '7'){
                  options = VOCAB_7_CODES
                }
                else if(input.value === '8'){
                  options = VOCAB_8_CODES
                }
                else if (input.value === '99' && primaryOrganisation === 3394){
                  options = EUTF_SECTOR_OPTIONS
                }
                else {
                  return (
                    <FinalField
                      name={`${name}.sectorCode`}
                      control="input"
                      withLabel
                      label={<InputLabel optional={isDFID ? (input.value === undefined || input.value === '') : isOptional('sectorCode')} tooltip={t('Please reference: <a href="https://iatistandard.org/en/iati-standard/203/codelists/sectorvocabulary/" target="_blank">https://iatistandard.org/en/iati-standard/203/codelists/sectorvocabulary/</a>')}>{t('sector code')}</InputLabel>}
                    />
                  )
                }
                return (
                  <FinalField
                    control="select"
                    options={options}
                    name={`${name}.sectorCode`}
                    showSearch
                    optionFilterProp="children"
                    withEmptyOption
                    withValuePrefix
                    withLabel
                    label={<InputLabel optional={isDFID ? (input.value === undefined || input.value === '') : isOptional('sectorCode')} tooltip={t('Please reference: <a href="https://iatistandard.org/en/iati-standard/203/codelists/sectorvocabulary/" target="_blank">https://iatistandard.org/en/iati-standard/203/codelists/sectorvocabulary/</a>')}>{t('sector code')}</InputLabel>}
                  />
                )
              }
            }
          />
          {fieldExists('percentage') && (
            <div>
              <div className="percentage-row">
                <FinalField
                  control="input"
                  name={`${name}.percentage`}
                  suffix={<span>%</span>}
                  className="percentage-input"
                  withLabel
                  label={<InputLabel optional={isOptional('percentage')} tooltip={t('Percentages should add up to 100% of the activity being reported if they are shown for each sector. Fill in 100% if there\'s one sector.Use a period to denote decimals.')}>{t('Percentage')}</InputLabel>}
                />
                <Field
                  name={`${name}.vocabulary`}
                  render={({input}) => {
                    if (fieldExists('text') || ['98', '99'].includes(input.value)) {
                      return <FinalField
                        control="textarea"
                        rows={2}
                        name={`${name}.text`}
                        withLabel
                        label={<InputLabel optional={isOptional('text')}>{t('description')}</InputLabel>}
                             />
                    }
                    return null
                  }}
                />
              </div>
            </div>
          )}
        </div>
        )}
        modal={{
          buttonText: t('Add sector'),
          className: 'add-sector-modal',
          component: ({ onClick }) => (
            <div>
              {VOCABULARY_OPTIONS.map(item => (
                <div className="desc-block">
                  <Button block icon="plus" onClick={() => onClick({ vocabulary: item.value })}>{item.label}</Button>
                </div>
              ))}
            </div>
          )
        }}
      />
      </SectionContext.Provider>
    </div>
  )
}

export default Sectors
