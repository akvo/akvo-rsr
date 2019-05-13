import React from 'react'
import { connect } from 'react-redux'
import { Form, Radio } from 'antd'

import Sectors from './sectors/sectors'
import { getValidations } from '../../../utils/validation-utils'
import InputLabel from '../../../utils/input-label'
import _Field from '../../../utils/field'
import * as actions from './actions'
import './styles.scss'

const { Item } = Form
const { Group, Button } = Radio
const Field = connect(
  ({ focusRdr }) => ({rdr: focusRdr}),
  actions
)(_Field)

class Focus extends React.Component{
  render(){
    const {isIATI, isDGIS} = getValidations(this.props.validations)
    return (
      <div className="focus view">
        <Form layout="vertical">
          <Sectors validations={this.props.validations} />
          {isIATI &&
          <Item label={<InputLabel optional>Humanitarian project</InputLabel>}>
            <Field
              name="humanitarianProject"
              render={input => (
                <Group {...input}>
                  <Button value>Yes</Button>
                  <Button value={false}>No</Button>
                </Group>
              )}
            />
          </Item>
          }
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ infoRdr: { validations } }) => ({ validations }),
  // actions
)(Focus)
