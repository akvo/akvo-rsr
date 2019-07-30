import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Icon, Tooltip } from 'antd'
import { Form as FinalForm, FormSpy } from 'react-final-form'
import { withTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import { isFieldOptional, getValidationSets } from '../../../utils/validation-utils'
import RTE from '../../../utils/rte'
import AutoSave from '../../../utils/auto-save'
import validationDefs, { RSR } from './validations'
import SectionContext from '../section-context'
import './styles.scss'

const { Item } = Form

const isEmpty = val => val === '' || val === undefined

class Descriptions extends React.Component {
  constructor(props){
    super(props)
    // get default keys from validation specs
    const added = Object.keys(validationDefs[1].fields).filter(descKey => validationDefs[1].fields[descKey]._exclusive.required)
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
    const { t } = this.props
    const isOptional = isFieldOptional(getValidationSets([1], validationDefs)) // validation id is irrelevant here
    return (
      <div className="descriptions view">
        <SectionContext.Provider value="section4">
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
                  render={({ input, validateStatus }) => (
                    <Item
                      key={descKey}
                      validateStatus={validateStatus}
                      label={(
                        <div className="desc-label">
                          <span>{t(`section4.${descKey}.label`)}&nbsp;&nbsp;<Tooltip trigger="click" title={<span dangerouslySetInnerHTML={{ __html: t(`section4.${descKey}.info`) }} />}><Icon type="info-circle" /></Tooltip></span>
                          {isOptional(descKey) && <Icon type="delete" onClick={() => this.removeDesc(descKey, input)} />}
                        </div>
                      )}
                    >
                      <RTE {...input} validateStatus={validateStatus} />
                    </Item>
                  )}
                />
              )
            })}
            {this.state.added.length < 6 &&
              <Button onClick={() => this.setState({ modalVisible: true })} className="bottom-btn" icon="plus" type="dashed" block>
                {t('Add description')}
              </Button>
            }
            <Modal
              title={t('Add description')}
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
                      <Button block icon="plus" onClick={() => this.addDesc(descKey)}>{t(`section4.${descKey}.label`)}</Button>
                      <p>{t(`section4.${descKey}.info`)}</p>
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
        </SectionContext.Provider>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { section4: { fields }}}) => ({ fields })
)(withTranslation()(Descriptions))
