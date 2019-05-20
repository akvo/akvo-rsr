import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon } from 'antd'
import { FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import AutoSave from './auto-save'
import * as actions from '../modules/editor/actions'

const { Panel } = Collapse

class ActiveKeyUpdater extends React.Component{
  componentDidUpdate(prevProps){
    if(!prevProps.values[this.props.name]) return
    if(this.props.values[this.props.name].length > prevProps.values[this.props.name].length
       || this.props.values[this.props.name].length <= Number(this.props.activeKey)){
      setTimeout(() => {
        this.props.setActiveKey(String(this.props.values[this.props.name].length - 1))
      }, 200)
    }
  }
  render(){
    return null
  }
}

const getKeyFromTemplate = (template) => {
  const $pos = template.indexOf('$')
  if($pos === -1){
    return null
  }
  return template.substr($pos + 1)
}

const PanelHeader = ({ template, index, name}) => {
  const header = template.replace('$index', index + 1)
  const field = getKeyFromTemplate(header)
  return (
    <Field name={`${name}.${field}`} subscription={{ value: true }}>
      {({ input: { value } }) => <span>{header.replace(`$${field}`, value)}</span>}
    </Field>
  )
}

class ItemArray extends React.Component{
  state = {
    activeKey: '0'
  }
  handleChange = (activeKey) => {
    this.setState({
      activeKey
    })
  }
  handleAddItem = () => {
    const { sectionIndex, setName } = this.props
    const newItem = {}
    this.props.form.mutators.push(this.props.setName, newItem)
    this.props.addSetItem(sectionIndex, setName, newItem)
  }
  removeItem = (event, index, fields) => {
    event.stopPropagation()
    const { sectionIndex, setName } = this.props
    this.props.removeSetItem(sectionIndex, setName, index)
    fields.remove(index)
  }
  render(){
    return (
      <div>
      <FieldArray name={this.props.name} subscription={{ pristine: true }}>
        {({ fields }) => (
          <div>
            <Collapse accordion onChange={this.handleChange} activeKey={this.state.activeKey}>
              {fields.map((name, index) => (
                <Panel
                  header={<PanelHeader template={this.props.header} name={name} index={index} />}
                  extra={<Icon type="delete" onClick={event => this.removeItem(event, index, fields)} />}
                  key={`${index}`}
                  forceRender
                >
                  <AutoSave sectionIndex={this.props.sectionIndex} setName={this.props.setName} itemIndex={index} />
                  {this.props.panel(name, index)}
                </Panel>
              ))}
            </Collapse>
            <FormSpy subscription={{ values: true }}>
              {({ values }) => <ActiveKeyUpdater values={values} name={this.props.name} activeKey={this.state.activeKey} setActiveKey={this.handleChange} />}
            </FormSpy>
          </div>
        )}
      </FieldArray>
      {this.props.addButton && this.props.addButton({
        onClick: this.handleAddItem
      })}
      </div>
    )
  }
}

export default connect(null, actions)(ItemArray)
