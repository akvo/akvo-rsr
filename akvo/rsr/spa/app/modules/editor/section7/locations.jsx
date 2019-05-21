import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import LocationsItems from './location-items/location-items'
import Countries from './recipient-countries/recipient-countries'
import InputLabel from '../../../utils/input-label'
import Regions from './recipient-regions/recipient-regions'
import { Aux } from '../../../utils/misc'
import { validationType } from '../../../utils/validation-utils'
import SCOPE_OPTIONS from './scope-options.json'
import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'

const { Item } = Form

class LocationsView extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    const isDGIS = this.props.validations.indexOf(validationType.DGIS) !== -1
    return (
      <div className="locations view">
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
            {isIATI &&
            <Item label={<InputLabel optional>Project scope</InputLabel>}>
              <FinalField
                name="projectScope"
                control="select"
                options={SCOPE_OPTIONS}
              />
              <AutoSave sectionIndex={8} />
            </Item>
            }
            <LocationsItems formPush={push} validations={this.props.validations} />
            <hr />
            {/* <Countries formPush={push} /> */}
            {(isIATI || isDGIS) && (
              <Aux>
                <hr />
                <Regions formPush={push} />
              </Aux>
            )}
          </Form>
        )}
      />
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { validations, section7: { fields } } }) => ({ validations, fields })
)(LocationsView)
