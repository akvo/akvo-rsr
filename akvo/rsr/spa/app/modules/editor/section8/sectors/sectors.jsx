import React from 'react'
import { Button } from 'antd'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import { doesFieldExist, isFieldOptional, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import CODE_OPTIONS from '../codes.json'
import VOCABULARY_OPTIONS from '../vocab.json'
import EUTF_SECTOR_OPTIONS from './eutf-sector-options.json'
import SectionContext from '../../section-context'


const Sectors = ({ validations, formPush, primaryOrganisation, showRequired, errors }) => {
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
        {showRequired && errors.findIndex(it => it.type === 'min' && it.path === 'sectors') !== -1 && (
          <span className="min-required">{t('Minimum one required')}</span>
        )}
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
            withValuePrefix
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
              ({input}) => (
                <FinalField
                  control="select"
                  options={(primaryOrganisation === 3394 && input.value === '99') ? EUTF_SECTOR_OPTIONS : CODE_OPTIONS}
                  name={`${name}.sectorCode`}
                  showSearch
                  optionFilterProp="children"
                  withEmptyOption
                  withValuePrefix
                  withLabel
                  label={<InputLabel optional={isDFID ? (input.value === undefined || input.value === '') : isOptional('sectorCode')} tooltip={t('It is possible to specify a variety of sector codes, based on the selected vocabulary. The sector codes for the DAC-5 and DAC-3 vocabularies can be found here: <a href="http://iatistandard.org/202/codelists/Sector/" target="_blank">DAC-5 sector codes</a> and <a href="http://iatistandard.org/202/codelists/SectorCategory/" target="_blank">DAC-3 sector codes</a>.')}>{t('sector code')}</InputLabel>}
                />
              )
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
                {fieldExists('text') && (
                  <FinalField
                    control="textarea"
                    rows={2}
                    name={`${name}.text`}
                    withLabel
                    label={<InputLabel optional={isOptional('text')}>{t('description')}</InputLabel>}
                  />
                )}
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
