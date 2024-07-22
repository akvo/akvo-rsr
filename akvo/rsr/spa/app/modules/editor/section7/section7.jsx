import React from 'react'
import { connect } from 'react-redux'
import { Form, Skeleton } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'

import LocationsItems from './location-items/location-items'
import RecipientCountries from './recipient-countries/recipient-countries'
import InputLabel from '../../../utils/input-label'
import RecipientRegions from './recipient-regions/recipient-regions'
import { Aux, shouldUpdateSectionRoot } from '../../../utils/misc'
import { getValidationSets, doesFieldExist } from '../../../utils/validation-utils'
import SCOPE_OPTIONS from './scope-options.json'
import FinalField from '../../../utils/final-field'
import AutoSaveFS from '../../../utils/auto-save'
import SectionContext from '../section-context'
import validationDefs from './validations'

const { Item } = Form

const LocationsView = ({ projectId, validations, fields, primaryOrganisation }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const isEUTF = validations.indexOf(5) !== -1
  const passProps = { validations }
  const isLoading = ((fields?.projectId !== projectId) && fields?.projectId)
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
          </Item>
          }
          <AutoSaveFS sectionIndex={7} />
          <Skeleton loading={isLoading} paragraph={{ rows: 4 }} active>
            <LocationsItems formPush={push} {...passProps} primaryOrganisation={primaryOrganisation} />
          </Skeleton>
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
        </Form>
      )}
      />
    </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { projectId, validations, showRequired, section7: { fields, errors }, section1: { fields: {primaryOrganisation}} } }) => ({ projectId, validations, fields, primaryOrganisation, showRequired, errors })
)(React.memo(LocationsView, shouldUpdateSectionRoot))
