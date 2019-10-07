import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'

import LocationsItems from './location-items/location-items'
import RecipientCountries from './recipient-countries/recipient-countries'
import InputLabel from '../../../utils/input-label'
import RecipientRegions from './recipient-regions/recipient-regions'
import { Aux } from '../../../utils/misc'
import { getValidationSets, doesFieldExist } from '../../../utils/validation-utils'
import SCOPE_OPTIONS from './scope-options.json'
import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import SectionContext from '../section-context'
import validationDefs from './validations'
import CalcTotalChecker from '../../../utils/calc-total-checker'

const { Item } = Form

const LocationsView = ({ validations, fields, primaryOrganisation, showRequired, errors }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const isEUTF = validations.indexOf(5) !== -1
  const passProps = { validations, showRequired, errors }
  return (
    <div className="locations view">
    <SectionContext.Provider value="section7">
      <FinalForm
        onSubmit={() => {}}
        initialValues={fields}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push }
          }
        }) => (
        <Form layout="vertical">
          {isEUTF &&
          <Aux>
            <RecipientCountries formPush={push} {...passProps} />
            <hr />
          </Aux>
          }
          {fieldExists('projectScope') &&
          <Item label={<InputLabel optional tooltip={t('Select the geographical scope of the project.')}>{t('Project Scope')}</InputLabel>}>
            <FinalField
              name="projectScope"
              control="select"
              options={SCOPE_OPTIONS}
            />
            <AutoSave sectionIndex={7} />
          </Item>
          }
          <LocationsItems formPush={push} {...passProps} primaryOrganisation={primaryOrganisation} />
          {!isEUTF &&
          <Aux>
            <hr />
            <RecipientCountries formPush={push} {...passProps} isLast={!fieldExists('recipientRegions')} />
          </Aux>
          }
          {(fieldExists('recipientRegions')) && (
            <Aux>
              <hr />
              <RecipientRegions formPush={push} {...passProps} />
            </Aux>
          )}
          <CalcTotalChecker section="7" paths={['recipientCountries', 'recipientRegions']} prop="percentage" />
        </Form>
      )}
    />
    </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { validations, showRequired, section7: { fields, errors }, section1: { fields: {primaryOrganisation}} } }) => ({ validations, fields, primaryOrganisation, showRequired, errors })
)(React.memo(LocationsView, (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1 || (prevProps.showRequired !== nextProps.showRequired || !isEqual(prevProps.errors, nextProps.errors))
  return !shouldUpdate
}))
