import React from 'react'
import { Form, Button, Dropdown, Menu, Icon, Collapse, Radio, Tag, Popconfirm, Input } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import Accordion from '../../../utils/accordion'
import Indicators from './indicators'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const AddResultButton = ({ push, ...props }) => (
  <Dropdown overlay={
    <Menu onClick={(e) => push('results', { type: e.key })}>
      <Menu.Item key="input"><Icon type="plus" />Input</Menu.Item>
      <Menu.Item key="activity"><Icon type="plus" />Activity</Menu.Item>
      <Menu.Item key="output"><Icon type="plus" />Output</Menu.Item>
      <Menu.Item key="outcome"><Icon type="plus" />Outcome</Menu.Item>
      <Menu.Item key="impact"><Icon type="plus" />Impact</Menu.Item>
    </Menu>
  }
  trigger={['click']}>
    <Button icon="plus" className="add-result" size="large" {...props}>Add Result</Button>
  </Dropdown>
)

class Summary extends React.Component{
  shouldComponentUpdate(nextProps){
    return nextProps.values.results.length !== this.props.values.results.length
  }
  render(){
    const { values: {results}} = this.props
    if(results.length === 0){
      return (
        <div className="no-results">
          <h3>No results</h3>
          <ul>
            <li>
              <span>
                Import the results framework from parent project
              </span>
              <div><Button type="primary">Import results set</Button></div>
            </li>
            <li>
              <span>Copy the results framework from an existing project</span>
              <div style={{display: 'flex'}}>
                <Input placeholder="Project ID" />
                <Button type="primary">Copy results set</Button>
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
    return (
      <div className="summary">
        <ul>
          <li>Inputs<strong>{results.filter(it => it.type === 'input').length}</strong></li>
          <li>Activities<strong>{results.filter(it => it.type === 'activity').length}</strong></li>
          <li>Outputs<strong>{results.filter(it => it.type === 'output').length}</strong></li>
          <li>Outcomes<strong>{results.filter(it => it.type === 'outcome').length}</strong></li>
          <li>Impacts<strong>{results.filter(it => it.type === 'impact').length}</strong></li>
        </ul>
        <Button type="link" icon="eye">Full preview</Button>
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

const Section5 = () => {
  return (
    <div className="view section5">
      <Form layout="vertical">
      <FinalForm
        onSubmit={() => {}}
        initialValues={{ results: [{ type: 'impact', indicators: [{ type: 'quantitative' }]}] }}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push }
          }
        }) => (
          <Aux>
          <FormSpy subscription={{ values: true }}>
            {({ values }) => <Summary values={values} push={push} />}
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
                        Result {index + 1}
                        &nbsp;
                        <Field
                          name={`${name}.type`}
                          render={({input}) => <Tag>{input.value}</Tag>}
                        />
                      </span>}
                    extra={
                      // eslint-disable-next-line
                      <div onClick={e => e.stopPropagation()}>
                      <Popconfirm
                        title="Are you sure to delete this result?"
                        onConfirm={() => fields.remove(index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button size="small" icon="delete" className="delete-panel" />
                      </Popconfirm>
                      </div>
                    }
                  >
                    <div className="main-form">
                      <Item label="Title" optional style={{ flex: 1 }}>
                        <FinalField
                          name={`${name}.name`}
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
                    <Indicators fieldName={name} formPush={push} />
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

export default Section5
