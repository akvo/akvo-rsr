import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

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

const { Item } = Form

class LocationsView extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    const validationSets = getValidationSets(this.props.validations, validationDefs)
    const fieldExists = doesFieldExist(validationSets)
    const isEUTF = this.props.validations.indexOf(5) !== -1
    return (
      <div className="locations view">
      <SectionContext.Provider value="section7">
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
            {isEUTF &&
            <Aux>
              <RecipientCountries formPush={push} validations={this.props.validations} />
              <hr />
            </Aux>
            }
            {fieldExists('projectScope') &&
            <Item label={<InputLabel optional>Project scope</InputLabel>}>
              <FinalField
                name="projectScope"
                control="select"
                options={SCOPE_OPTIONS}
              />
              <AutoSave sectionIndex={7} />
            </Item>
            }
            <LocationsItems formPush={push} validations={this.props.validations} />
            {!isEUTF &&
            <Aux>
              <hr />
              <RecipientCountries formPush={push} validations={this.props.validations} />
            </Aux>
            }
            {(fieldExists('recipientRegions')) && (
              <Aux>
                <hr />
                <RecipientRegions formPush={push} validations={this.props.validations} />
              </Aux>
            )}
          </Form>
        )}
      />
      </SectionContext.Provider>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { validations, section7: { fields } } }) => ({ validations, fields })
)(LocationsView)
