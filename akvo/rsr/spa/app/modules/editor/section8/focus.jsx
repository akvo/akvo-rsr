import React from 'react'
import { connect } from 'react-redux'
import { Form, Radio, Divider } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { diff } from 'deep-object-diff'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'

import Sectors from './sectors/sectors'
import PolicyMarkers from './policy-markers/policy-markers'
import HumanitarianScopes from './humanitarian-scopes/humanitarian-scope'
import { doesFieldExist, getValidationSets } from '../../../utils/validation-utils'
import InputLabel from '../../../utils/input-label'
import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import validationDefs from './validations'
import './styles.scss'
import SectionContext from '../section-context'

const { Item } = Form
const { Group, Button } = Radio
const Aux = node => node.children

const Focus = ({ validations, fields, primaryOrganisation, showRequired, errors}) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const passProps = {showRequired, errors}
  return (
    <div className="focus view">
    <SectionContext.Provider value="section8">
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
          <Sectors validations={validations} {...passProps} formPush={push} primaryOrganisation={primaryOrganisation} />
          {fieldExists('policyMarkers') && (
            <Aux>
              <Divider />
              <PolicyMarkers validations={validations} formPush={push} />
            </Aux>
          )}
          {fieldExists('humanitarian') &&
          <Aux>
            <Divider />
            <Item label={<InputLabel optional tooltip={t('Determines whether this project relates entirely or partially to humanitarian aid.')}>{t('humanitarian project')}</InputLabel>}>
              <FinalField
                name="humanitarian"
                render={({ input }) => (
                  <Group {...input}>
                    <Button value>{t('Yes')}</Button>
                    <Button value={false}>{t('No')}</Button>
                  </Group>
                )}
              />
              <AutoSave sectionIndex={8} />
            </Item>
          </Aux>
          }
          {fieldExists('humanitarianScopes') && <HumanitarianScopes formPush={push} />}
        </Form>
        )}
      />
    </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { validations }, editorRdr: { showRequired, section8: { fields, errors }, section1: { fields: { primaryOrganisation }}} }) => ({ validations, fields, primaryOrganisation, showRequired, errors })
)(React.memo(Focus, (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const shouldUpdate = JSON.stringify(difference).indexOf('"id"') !== -1 || (prevProps.showRequired !== nextProps.showRequired || !isEqual(prevProps.errors, nextProps.errors))
  return !shouldUpdate
}))
