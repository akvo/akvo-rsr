import React from 'react'
import { connect } from 'react-redux'
import { Form, Radio } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
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

const { Item } = Form
const { Group, Button } = Radio

const Focus = ({ validations, fields, primaryOrganisation}) => {
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div className="focus view">
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
          <Sectors validations={validations} formPush={push} primaryOrganisation={primaryOrganisation} />
          {fieldExists('policyMarkers') && <PolicyMarkers validations={validations} formPush={push} />}
          {fieldExists('humanitarian') &&
          <Item label={<InputLabel optional>Humanitarian project</InputLabel>}>
            <FinalField
              name="humanitarian"
              render={({ input }) => (
                <Group {...input}>
                  <Button value>Yes</Button>
                  <Button value={false}>No</Button>
                </Group>
              )}
            />
            <AutoSave sectionIndex={8} />
          </Item>
          }
          {fieldExists('humanitarianScopes') && <HumanitarianScopes formPush={push} />}
        </Form>
        )}
      />
    </div>
  )
}

export default connect(
  ({ editorRdr: { validations }, editorRdr: { section8: { fields }, section1: { fields: { primaryOrganisation }}} }) => ({ validations, fields, primaryOrganisation })
)(React.memo(Focus, (prevProps, nextProps) => isEqual(prevProps.fields, nextProps.fields)))
