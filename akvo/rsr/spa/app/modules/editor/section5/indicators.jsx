/* global document */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Menu, Collapse, Divider, Col, Row, Radio, Tag, Popconfirm } from 'antd'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import jump from 'jump.js'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'
import InputLabel from '../../../utils/input-label'
import Accordion from '../../../utils/accordion'
import Condition from '../../../utils/condition'
import AutoSave from '../../../utils/auto-save'
import { getBestAnchorGivenScrollLocation } from '../../../utils/scroll'
import { addSetItem, removeSetItem } from '../actions'
import Periods from './periods/periods'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const Disaggregations = connect(null, {addSetItem, removeSetItem})(({ fieldName, formPush, addSetItem, removeSetItem }) => { // eslint-disable-line
  const add = () => {
    const newItem = { items: [{}, {}]}
    formPush(`${fieldName}.disaggregations`, newItem)
    addSetItem(5, `${fieldName}.disaggregations`, newItem)
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(5, `${fieldName}.disaggregations`, index)
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
                header={(
                  <span>
                    Disaggregation {index + 1}
                    <Field
                      name={`${fieldName}.disaggregations[${index}].name`}
                      render={({input}) => input.value ? `: ${input.value}` : ''}
                    />
                  </span>
                )}
                key={index}
                extra={(
                  /* eslint-disable-next-line */
                  <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                  <div className="delete-btn-holder">
                  <Popconfirm
                    title="Are you sure to delete this disaggregation?"
                    onConfirm={() => remove(index, fields)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button size="small" icon="delete" className="delete-panel" />
                  </Popconfirm>
                  </div>
                  </div>
                )}
              >
                <AutoSave sectionIndex={5} setName={`${fieldName}.disaggregations`} itemIndex={index} />
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
                            label={`Label ${itemIndex + 1}`}
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
                      <Button icon="plus" type="link" onClick={() => props.fields.push({})}>Add item</Button>
                      {props.fields.length > 2 &&
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
})


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
          <Condition when={`${this.props.fieldName}.type`} is={1}>
            <Radio.Button value="disaggregations">Disaggregations</Radio.Button>
          </Condition>
          <Radio.Button value="baseline">Baseline</Radio.Button>
          <Radio.Button value="periods">Periods</Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}

const indicatorTypes = [
  { value: 1, label: 'quantitative'},
  { value: 2, label: 'qualitative'}
]

const Indicators = connect(null, {addSetItem, removeSetItem})(({ fieldName, formPush, addSetItem, removeSetItem, resultId, primaryOrganisation }) => { // eslint-disable-line
  const add = (key) => {
    const newItem = { type: key, periods: [] }
    if(key === 1) newItem.disaggregations = []
    if(resultId) newItem.result = resultId
    formPush(`${fieldName}.indicators`, newItem)
    addSetItem(5, `${fieldName}.indicators`, newItem)
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(5, `${fieldName}.indicators`, index)
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
              header={(
              <span>
                <Field
                  name={`${name}.type`}
                  render={({input}) => {
                    const type = indicatorTypes.find(it => it.value === input.value)
                    return <span><span className="capitalized">{type && type.label}</span>&nbsp;Indicator {index + 1}</span>
                  }}
                />
              </span>)}
              extra={(
                /* eslint-disable-next-line */
                <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                <IndicatorNavMenu fieldName={name} />
                <div className="delete-btn-holder">
                <Popconfirm
                  title="Are you sure to delete this indicator?"
                  onConfirm={() => remove(index, fields)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" icon="delete" className="delete-panel" />
                </Popconfirm>
                </div>
                </div>
              )}
            >
              <AutoSave sectionIndex={5} setName={`${fieldName}.indicators`} itemIndex={index} />
              <div id={`${fieldNameToId(name)}-info`} />
              <Item label={<InputLabel optional>Title</InputLabel>}>
                <FinalField name={`${name}.title`} />
              </Item>
              <Condition when={`${name}.type`} is={1}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label="Measure">
                      <FinalField
                        name={`${name}.measure`}
                        render={({input}) => (
                          <Radio.Group {...input}>
                            <Radio.Button value="1">Unit</Radio.Button>
                            <Radio.Button value="2">Percentage</Radio.Button>
                          </Radio.Group>
                        )}
                      />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel>Order</InputLabel>}>
                      <FinalField
                        name={`${name}.ascending`}
                        render={({input}) => (
                          <Radio.Group {...input}>
                            <Radio.Button value>Ascending</Radio.Button>
                            <Radio.Button value={false}>Descending</Radio.Button>
                          </Radio.Group>
                        )}
                      />
                    </Item>
                  </Col>
                </Row>
              </Condition>
              <Item label={<InputLabel optional>Description</InputLabel>}>
                <FinalField name={`${name}.description`} render={({input}) => <RTE {...input} />} />
              </Item>
              <Divider />
              <div id={`${fieldNameToId(name)}-disaggregations`} />
              <Condition when={`${name}.type`} is={1}>
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
              <FinalField name={`${name}.id`} render={({ input }) => <Periods formPush={formPush} fieldName={name} indicatorId={input.value} primaryOrganisation={primaryOrganisation} />} />
            </Panel>
          )}
        />
        <Dropdown
          overlay={(
            <Menu style={{ textAlign: 'center' }} onClick={(e) => add(Number(e.key))}>
              <Menu.Item key={1}>
                Quantitative
              </Menu.Item>
              <Menu.Item key={2}>
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
})

export default Indicators
