/* global document */
import React, { useEffect } from 'react'
import { Form, Button, Dropdown, Menu, Icon, Collapse, Divider, Col, Row, Radio, Tag, Popconfirm } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import jump from 'jump.js'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import InputLabel from '../../../utils/input-label'
import Accordion from '../../../utils/accordion'
import Condition from '../../../utils/condition'
import { getBestAnchorGivenScrollLocation } from '../../../utils/scroll'

const { Item } = Form
const { Panel } = Collapse

const Aux = node => node.children

const Disaggregations = ({ fieldName, formPush }) => {
  useEffect(() => {
    formPush(`${fieldName}.disaggregations`, { items: [{}]})
  }, [])
  const add = () => {
    formPush(`${fieldName}.disaggregations`, { items: [{}]})
  }
  return (
    <FieldArray name={`${fieldName}.disaggregations`} subscription={{}}>
      {({ fields }) => (
        <Aux>
          <div className="ant-col ant-form-item-label">
            <InputLabel optional tooltip="asd">Disaggregations</InputLabel>
          </div>
          {fields.length > 0 &&
          <Accordion
            className="disaggregations-list"
            finalFormFields={fields}
            setName={`${fieldName}.disaggregations`}
            renderPanel={(name, index) => (
              <Panel
                header={`Disaggregation ${index + 1}`}
                key={index}
                extra={(
                  /* eslint-disable-next-line */
                  <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                  <Popconfirm
                    title="Are you sure to delete this disaggregation?"
                    onConfirm={() => fields.remove(index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button size="small" icon="delete" className="delete-panel" />
                  </Popconfirm>
                  </div>
                )}
              >
                <Item label="Name">
                  <FinalField name={`${name}.name`} />
                </Item>
                <FieldArray name={`${name}.items`} subscription={{}}>
                  {props => (
                    <Aux>
                      {props.fields.map((itemFieldName, itemIndex) => (
                      <Row gutter={16} key={itemIndex}>
                        <Col span={12}>
                          <FinalField
                            name={`${itemFieldName}.name`}
                            control="input"
                            withLabel
                            label={`Item ${itemIndex + 1}`}
                          />
                        </Col>
                        <Col span={12}>
                          <FinalField
                            name={`${itemFieldName}.value`}
                            control="input"
                            withLabel
                            label={`Target value ${itemIndex + 1}`}
                          />
                        </Col>
                      </Row>
                      ))}
                      <Button icon="plus" type="link" onClick={() => props.fields.push('items', {})}>Add item</Button>
                      {props.fields.length > 1 &&
                      <Button icon="minus" type="link" className="remove-item" onClick={() => props.fields.pop()}>Remove item</Button>
                      }
                    </Aux>
                  )}
                </FieldArray>
              </Panel>
            )}
          />
          }
          <Button icon="plus" block type="dashed" onClick={add}>Add disaggregation</Button>
        </Aux>
      )}
    </FieldArray>
  )
}

const Periods = ({ fieldName, formPush }) => {
  useEffect(() => {
    formPush(`${fieldName}.periods`, {})
  }, [])
  const add = () => {
    formPush(`${fieldName}.periods`, {})
  }
  return (
    <Aux>
    <FieldArray name={`${fieldName}.periods`} subscription={{}}>
      {({ fields }) => (
        <Aux>
        <div className="ant-col ant-form-item-label">
          <InputLabel optional tooltip="asd">Periods</InputLabel>
        </div>
        {fields.length > 0 &&
        <Accordion
          className="periods-list"
          finalFormFields={fields}
          setName={`${fieldName}.periods`}
          renderPanel={(name, index) => (
            <Panel
              header={`Period ${index + 1}`}
              key={index}
              extra={(
                /* eslint-disable-next-line */
                <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                <Popconfirm
                  title="Are you sure to delete this period?"
                  onConfirm={() => fields.remove(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" icon="delete" className="delete-panel" />
                </Popconfirm>
                </div>
              )}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Item label="Start">
                    <FinalField
                      name={`${name}.periodStart`}
                      control="datepicker"
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label="End">
                    <FinalField
                      name={`${name}.periodEnd`}
                      control="datepicker"
                    />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>Target value</InputLabel>}>
                <FinalField name={`${name}.targetValue`} />
              </Item>
              <Item label={<InputLabel optional>Comment</InputLabel>}>
                <FinalField name={`${name}.targetComment`} render={({input}) => <RTE {...input} />} />
              </Item>
            </Panel>
          )}
        />
        }
        <Button icon="plus" block type="dashed" onClick={add}>Add period</Button>
        </Aux>
      )}
    </FieldArray>
    </Aux>
  )
}

const fieldNameToId = name => name.replace(/\[/g, '').replace(/\]/g, '').replace(/\./g, '')

class IndicatorNavMenu extends React.Component{
  state = {
    currentAnchor: 'info'
  }
  componentDidMount(){
    const { fieldName } = this.props
    const fieldNameId = fieldNameToId(fieldName)
    this.sections = {
      info: document.getElementById(`${fieldNameId}-info`),
      disaggregations: document.getElementById(`${fieldNameId}-disaggregations`),
      baseline: document.getElementById(`${fieldNameId}-baseline`),
      periods: document.getElementById(`${fieldNameId}-periods`)
    }
    document.addEventListener('scroll', this.scroll)
  }
  componentWillUnmount(){
    document.removeEventListener('scroll', this.scroll)
  }
  scroll = () => {
    let anchor = getBestAnchorGivenScrollLocation(this.sections, -220)
    if(anchor === undefined) anchor = 'info'
    if(anchor !== this.state.currentAnchor){
      this.setState({
        currentAnchor: anchor
      })
    }
  }
  render(){
    return (
      <div className="menu-container">
        <Radio.Group
          size="small"
          buttonStyle="solid"
          value={this.state.currentAnchor}
          onChange={e => { jump(this.sections[e.target.value], { duration: 400, offset: -220 }) }}
        >
          <Radio.Button value="info">Info</Radio.Button>
          <Condition when={`${this.props.fieldName}.type`} is="quantitative">
            <Radio.Button value="disaggregations">Disaggregations</Radio.Button>
          </Condition>
          <Radio.Button value="baseline">Baseline</Radio.Button>
          <Radio.Button value="periods">Periods</Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}

const Indicators = ({ fieldName, formPush }) => {
  const typeKeyMap = {'0': 'quantitative', '1': 'qualitative'} // eslint-disable-line
  const add = (key) => {
    formPush(`${fieldName}.indicators`, { type: typeKeyMap[key], measure: 0, order: 0 })
  }
  return (
    <FieldArray name={`${fieldName}.indicators`} subscription={{}}>
    {({ fields }) => (
      <Aux>
        <Accordion
          multiple
          className="indicators-list"
          finalFormFields={fields}
          setName={`${fieldName}.indicators`}
          renderPanel={(name, index) => (
            <Panel
              key={`${index}`}
              forceRender
              header={(
              <span>
                <Field
                  name={`${name}.type`}
                  render={({input}) => <span>Indicator {index + 1} <Tag>{input.value}</Tag></span>}
                />
              </span>)}
              extra={(
                /* eslint-disable-next-line */
                <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                <IndicatorNavMenu fieldName={name} />
                <Popconfirm
                  title="Are you sure to delete this indicator?"
                  onConfirm={() => fields.remove(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" icon="delete" className="delete-panel" />
                </Popconfirm>
                </div>
              )}
            >
              <div id={`${fieldNameToId(name)}-info`} />
              <Item label={<InputLabel optional>Title</InputLabel>}>
                <FinalField name={`${name}.title`} />
              </Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Item label="Measure">
                    <FinalField
                      name={`${name}.measure`}
                      render={({input}) => (
                        <Radio.Group {...input}>
                          <Radio.Button value={0}>Unit</Radio.Button>
                          <Radio.Button value={1}>Percentage</Radio.Button>
                        </Radio.Group>
                      )}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel>Order</InputLabel>}>
                    <FinalField
                      name={`${name}.order`}
                      defaultValue={0}
                      render={({input}) => (
                        <Radio.Group {...input}>
                          <Radio.Button value={0}>Ascending</Radio.Button>
                          <Radio.Button value={1}>Descending</Radio.Button>
                        </Radio.Group>
                      )}
                    />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>Description</InputLabel>}>
                <FinalField name={`${name}.description`} render={({input}) => <RTE {...input} />} />
              </Item>
              <Divider />
              <div id={`${fieldNameToId(name)}-disaggregations`} />
              <Condition when={`${name}.type`} is="quantitative">
                <Aux>
                  <Disaggregations formPush={formPush} fieldName={name} />
                  <Divider />
                </Aux>
              </Condition>
              <div id={`${fieldNameToId(name)}-baseline`} />
              <Row gutter={15}>
                <Col span={12}>
                  <Item label={<InputLabel optional>Baseline year</InputLabel>}>
                    <FinalField name={`${name}.baselineYear`} />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional>Baseline value</InputLabel>}>
                  <FinalField name={`${name}.baselineValue`} />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>Baseline comment</InputLabel>}>
                <FinalField name={`${name}.baselineComment`} render={({input}) => <RTE {...input} />} />
              </Item>
              <Divider />
              <div id={`${fieldNameToId(name)}-periods`} />
              <Periods formPush={formPush} fieldName={name} />
            </Panel>
          )}
        />
        <Dropdown
          overlay={(
            <Menu style={{ textAlign: 'center' }} onClick={(e) => add(e.key)}>
              <Menu.Item key="0">
                Quantitative
              </Menu.Item>
              <Menu.Item key="1">
                Qualitative
              </Menu.Item>
            </Menu>
          )}
          trigger={['click']}
        >
          <Button icon="plus" block type="dashed">Add indicator</Button>
        </Dropdown>
      </Aux>
    )}
    </FieldArray>
  )
}

class Summary extends React.Component{
  shouldComponentUpdate(nextProps){
    return nextProps.values.results.length !== this.props.values.results.length
  }
  render(){
    const { values: {results}} = this.props
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
          <FormSpy subscription={{ values: true }} component={Summary} />
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
              <Button icon="plus" className="add-result" size="large">Add Result</Button>
            </Dropdown>
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
