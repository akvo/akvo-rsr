import React from 'react'
import { connect } from 'react-redux'
import { Form, Radio } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Sectors from './sectors/sectors'
import PolicyMarkers from './policy-markers/policy-markers'
import HumanitarianScopes from './humanitarian-scopes/humanitarian-scope'
import { getValidations } from '../../../utils/validation-utils'
import InputLabel from '../../../utils/input-label'
import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import './styles.scss'

const { Item } = Form
const { Group, Button } = Radio

class Focus extends React.Component{
  render(){
    const {isIATI, isDGIS} = getValidations(this.props.validations)
    return (
      <div className="focus view">
        <FinalForm
          onSubmit={() => {}}
          initialValues={this.props.fields}
          subscription={{}}
          mutators={{ ...arrayMutators }}
          render={({
            form: {
              mutators: { push }
            }
          }) => (
          <Form layout="vertical">
            <Sectors validations={this.props.validations} formPush={push} />
            {(isIATI || isDGIS) && <PolicyMarkers validations={this.props.validations} formPush={push} />}
            {isIATI &&
            <Item label={<InputLabel optional>Humanitarian project</InputLabel>}>
              <FinalField
                name="humanitarianProject"
                render={({ input }) => (
                  <Group {...input}>
                    <Button value>Yes</Button>
                    <Button value={false}>No</Button>
                  </Group>
                )}
              />
              <AutoSave sectionIndex={8} />
            </Item> /* TODO: AutoSave root fields */
            }
            {isIATI && <HumanitarianScopes formPush={push} />}
          </Form>
          )}
        />
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { validations }, editorRdr: { section8: { fields }} }) => ({ validations, fields })
)(Focus)
