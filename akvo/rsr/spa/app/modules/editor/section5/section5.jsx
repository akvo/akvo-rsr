import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Menu, Icon, Collapse, Radio, Tag, Popconfirm, Input, Modal, Switch, Divider } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { isEqual } from 'lodash'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import Accordion from '../../../utils/accordion'
import Indicators from './indicators'
import AutoSave from '../../../utils/auto-save'
import {addSetItem, removeSetItem} from '../actions'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children
// const resultTypes = ['input', 'activity', 'output', 'outcome', 'impact']
const resultTypes = [
  {label: 'output', value: '1'},
  {label: 'outcome', value: '2'},
  {label: 'impact', value: '3'},
  {label: 'other', value: '9'}
]

const AddResultButton = connect(null, {addSetItem})(({ push, addSetItem, ...props }) => { // eslint-disable-line
  const addResult = ({ key }) => {
    const newItem = { type: key, indicators: [] }
    push('results', newItem)
    addSetItem(5, 'results', newItem)
  }
  return (
    <Dropdown overlay={
      <Menu onClick={addResult}>
        {resultTypes.map(type =>
        <Menu.Item key={type.value}><Icon type="plus" />{type.label}</Menu.Item>
        )}
      </Menu>
    }
    trigger={['click']}>
      <Button icon="plus" className="add-result" size="large" {...props}>Add result</Button>
    </Dropdown>
  )
})

class Summary extends React.Component{
  state = {
    showModal: false
  }
  shouldComponentUpdate(nextProps, nextState){
    return nextProps.values.results.length !== this.props.values.results.length || nextState !== this.state
  }
  render(){
    const { values: {results}} = this.props
    if(results.length === 0){
      return (
        <div className="no-results">
          <h3>No results</h3>
          <Divider />
          <ul>
            {this.props.hasParent &&
            <li>
              <span>
                Import the results framework from parent project
              </span>
              <div><Button type="primary">Import results set</Button></div>
            </li>
            }
            <li className="copy-framework">
              <span>Copy the results framework from an existing project</span>
              <div>
                <Input placeholder="Project ID" />
                <Button type="primary">Copy results</Button>
              </div>
            </li>
            <li>
              <span>Create a new results framework</span>
              <div className="button-container">
                <AddResultButton push={this.props.push} size="default" type="primary" />
              </div>
            </li>
          </ul>
        </div>
      )
    }
    const groupedResults = {}
    resultTypes.forEach(type => {
      groupedResults[type.value] = results.filter(it => it.type === type.value)
    })
    return (
      <div className="summary">
        <ul>
          {resultTypes.map(type =>
          <li>{type.label}<strong>{groupedResults[type.value].length}</strong></li>
          )}
        </ul>
        <Button type="link" icon="eye" onClick={() => this.setState({ showModal: true })}>Full preview</Button>
        <Modal
          title="Results framework preview"
          visible={this.state.showModal}
          onCancel={() => this.setState({ showModal: false })}
          footer={null}
          className="full-preview-modal"
          width={640}
        >
          <Collapse bordered={false}>
            {Object.keys(groupedResults).map(groupKey =>
            <Panel header={<span className="group-title">{resultTypes.find(it => it.value === groupKey).label}<b> ({groupedResults[groupKey].length})</b></span>}>
              <Collapse bordered={false}>
                {groupedResults[groupKey].map((result, resultIndex) =>
                <Panel header={<span><b>{resultIndex + 1}. </b>{result.title}</span>}>
                  <ul>
                    {result.indicators.map((indicator, index) =>
                    <li>Indicator <b>{index + 1}</b>: {indicator.title}</li>
                    )}
                  </ul>
                </Panel>
                )}
              </Collapse>
            </Panel>
            )}
          </Collapse>
        </Modal>
      </div>
    )
  }
}

class UpdateIfLengthChanged extends React.Component{
  shouldComponentUpdate(nextProps){
    return nextProps.items.length !== this.props.items.length
  }
  render(){
    return this.props.children
  }
}

class Section5 extends React.Component{
  shouldComponentUpdate(nextProps){
    return !isEqual(nextProps, this.props)
  }
  removeSection = (fields, index) => {
    fields.remove(index)
    this.props.removeSetItem(5, 'results', index)
  }
  render(){
    const hasParent = this.props.relatedProjects && this.props.relatedProjects.filter(it => it.relation === '1').length > 0
    return (
      <div className="view section5">
        <Form layout="vertical">
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
            <Aux>
            <FormSpy subscription={{ values: true }}>
              {({ values }) => <Summary values={values} push={push} hasParent={hasParent} />}
            </FormSpy>
            <FieldArray name="results" subscription={{}}>
            {({ fields }) => (
              <Aux>
                <Accordion
                  className="results-list"
                  finalFormFields={fields}
                  setName="results"
                  renderPanel={(name, index) => (
                    <Panel
                      key={`${index}`}
                      header={
                        <span>
                          <Field
                            name={`${name}.type`}
                            render={({input}) => <span className="capitalized">{resultTypes.find(it => it.value === input.value).label}</span>}
                          />
                          &nbsp;Result {index + 1}
                          <Field
                            name={`${name}.title`}
                            render={({input}) => input.value ? `: ${input.value}` : ''}
                          />
                        </span>}
                      extra={
                        // eslint-disable-next-line
                        <div onClick={e => e.stopPropagation()}>
                          <div className="delete-btn-holder">
                            <Popconfirm
                              title="Are you sure to delete this result?"
                              onConfirm={() => this.removeSection(fields, index)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button size="small" icon="delete" className="delete-panel" />
                            </Popconfirm>
                          </div>
                        </div>
                      }
                    >
                      <AutoSave sectionIndex={5} setName="results" itemIndex={index} />
                      <div className="main-form">
                        <Item label="Title" optional style={{ flex: 1 }}>
                          <FinalField
                            name={`${name}.title`}
                            control="input"
                          />
                        </Item>
                        <div style={{ display: 'flex' }}>
                        <Item label="Description" optional style={{ flex: 1 }}>
                          <RTE />
                        </Item>
                        <Item label="Enable aggregation" style={{ marginLeft: 16 }}>
                          {/* <Switch /> */}
                          <Radio.Group value>
                            <Radio.Button value>Yes</Radio.Button>
                            <Radio.Button>No</Radio.Button>
                          </Radio.Group>
                        </Item>
                        </div>
                        <div className="ant-form-item-label">Indicators:</div>
                      </div>
                      <Field
                        name={`${name}.id`}
                        render={({input}) => <Indicators fieldName={name} formPush={push} resultId={input.value} />}
                      />
                    </Panel>
                  )}
                />
                <FormSpy subscription={{ values: true }}>
                  {({ values: { results } }) =>
                  <UpdateIfLengthChanged items={results}>
                    {results.length > 0 &&
                    <AddResultButton push={push} />
                    }
                  </UpdateIfLengthChanged>}
                </FormSpy>
              </Aux>
            )}
            </FieldArray>
            </Aux>
          )}
        />
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { section5: { fields }, section1: { fields: { relatedProjects } }}}) => ({ fields, relatedProjects }),
  { removeSetItem }
)(Section5)
