import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Icon } from 'antd'
import { Form as FinalForm, FormSpy } from 'react-final-form'

import FinalField from '../../../utils/final-field'
import { isFieldOptional } from '../../../utils/validation-utils'
import RTE from '../../../utils/rte'
import AutoSave from '../../../utils/auto-save'
import { RSR, getValidationSets } from './validations'
import './styles.scss'

const { Item } = Form

const dict = {
  summary: 'Project summary',
  goals: 'Goals overview',
  background: 'Background',
  baseline: 'Baseline situation',
  targetGroup: 'Target group',
  projectPlan: 'Project plan',
  sustainability: 'Sustainability'
}
const infoDict = {
  summary: 'Enter a brief summary, try to restrict the number of characters to 400 in order to display the summary nicely on the project page.',
  goals: 'Provide a brief description of the overall project goals.',
  background: 'This should describe the geographical, political, environmental, social and/or cultural context of the project, and any related activities that have already taken place or are underway.',
  baseline: 'Describe the situation at the start of the project.',
  targetGroup: 'This should include information about the people, organisations or resources that are being impacted by this project.',
  projectPlan: 'Detailed information about the implementation of the project: the what, how, who and when.',
  sustainability: 'Describe how you aim to guarantee sustainability of the project until 10 years after project implementation. Think about the institutional setting, capacity-building, a cost recovery plan, products used, feasible arrangements for operation and maintenance, anticipation of environmental impact and social integration.'
}

const isEmpty = val => val === '' || val === undefined

class Descriptions extends React.Component {
  constructor(props){
    super(props)
    // get default keys from validation specs
    const added = Object.keys(RSR.fields).filter(descKey => RSR.fields[descKey]._exclusive.required)
    Object.keys(props.fields).forEach(descKey => {
      if(!isEmpty(props.fields[descKey]) && added.indexOf(descKey) === -1){
        added.push(descKey)
      }
    })
    this.state = {
      added,
      modalVisible: false
    }
  }
  addDesc = (key) => {
    const updatedState = {}
    if(this.state.added.indexOf(key) === -1){
      updatedState.added = [...this.state.added, key]
    }
    updatedState.modalVisible = false
    this.setState(updatedState)
  }
  removeDesc = (key, input) => {
    input.onChange('')
    // final-form needs a moment to reflect the change before the field is removed
    setTimeout(() => {
      this.setState({
        added: this.state.added.filter(it => it !== key)
      })
    }, 100)
  }
  render(){
    const isOptional = isFieldOptional(getValidationSets([1])) // validation id is irrelevant here
    return (
      <div className="descriptions view">
        <Form layout="vertical">
        <FinalForm
          onSubmit={() => {}}
          initialValues={this.props.fields}
          subscription={{}}
          render={() => (
          <div>
            {this.state.added.map((descKey) => {
              return (
                <FinalField
                  name={descKey}
                  render={({ input }) => (
                    <Item
                      key={descKey}
                      label={(
                        <div className="desc-label">
                          <span>{dict[descKey]}</span>
                          {isOptional(descKey) && <Icon type="delete" onClick={() => this.removeDesc(descKey, input)} />}
                        </div>
                      )}
                    >
                      <RTE {...input} />
                    </Item>
                  )}
                />
              )
            })}
            {this.state.added.length < 6 &&
              <Button onClick={() => this.setState({ modalVisible: true })} className="bottom-btn" icon="plus" type="dashed" block>
                Add description
              </Button>
            }
            <Modal
              title="Add Description"
              visible={this.state.modalVisible}
              footer={null}
              onCancel={() => this.setState({ modalVisible: false })}
              className="add-description-modal"
            >
              <FormSpy subscription={{ values: true }}>
                {({values}) => (
                  <div>
                  {Object.keys(RSR.fields).filter(descKey => {
                    return !(!isOptional(descKey) || !isEmpty(values[descKey]) || this.state.added.indexOf(descKey) !== -1)
                  }).map(descKey => (
                    <div className="desc-block">
                      <Button block icon="plus" onClick={() => this.addDesc(descKey)}>{dict[descKey]}</Button>
                      <p>{infoDict[descKey]}</p>
                    </div>
                  ))}
                  </div>
                )}
              </FormSpy>
            </Modal>
            <AutoSave sectionIndex={4} />
          </div>
          )}
        />
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { section4: { fields }}}) => ({ fields })
)(Descriptions)
