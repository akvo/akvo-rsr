import React from 'react'
import { Collapse, Icon } from 'antd'
import { FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

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
  removeItem = (event, index, fields) => {
    event.stopPropagation()
    fields.remove(index)
  }
  handleChange = (activeKey) => {
    this.setState({
      activeKey
    })
  }
  render(){
    return (
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
    )
  }
}

export default ItemArray
