import React from 'react'
import ReactDOM from 'react-dom/server'
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

const fieldValue = name => <Field
  name={name}
  component={({ input }) => input.value} />

const getFieldDollar = (template) => {
  const $pos = template.indexOf('$')
  if($pos === -1){
    return null
  }
  return template.substr($pos + 1)
}
const replaceHeaderTitle = (template, itemIndex, fieldsetName) => {
  let header = template.replace('$index', itemIndex + 1)
  const field = getFieldDollar(header)
  if(field !== null){
    const value = ReactDOM.renderToString(fieldValue(`${fieldsetName}.${field}`))
    header = header.replace(`$${field}`, value)
    if(value.length === 0){
      header = header.replace(':', '')
    }
  }
  return header
}

class ItemArray extends React.Component{
  state = {
    activeKey: ''
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
      <FieldArray name={this.props.name} subscription={{ pristine: true, value: true }}>
        {({ fields }) => (
          <div>
            <Collapse accordion onChange={this.handleChange} activeKey={this.state.activeKey}>
              {fields.map((name, index) => (
                <Panel
                  header={replaceHeaderTitle(this.props.header, index, name)}
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
