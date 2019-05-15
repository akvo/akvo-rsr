import React from 'react'
import { Input, Select, DatePicker } from 'antd'
import { datePickerConfig } from './misc'

const CONTROLS = {
  input: props => <Input {...props} />,
  textarea: props => <Input.TextArea {...props} />,
  select: ({options, ...props}) => (
    <Select {...props}>
      {options.map(({ label, value }) => <Select.Option value={value}>{label}</Select.Option>)}
    </Select>
  ),
  datepicker: props => <DatePicker {...{...props, ...datePickerConfig}} />
}

class Field extends React.Component{
  shouldComponentUpdate(nextProps){
    let thisItem = this.props.rdr
    let nextItem = nextProps.rdr
    if(this.props.index !== undefined){
      thisItem = this.props.rdr[this.props.index]
      nextItem = nextProps.rdr[this.props.index]
    }
    if(this.props.additionalWatchProp){
      if(nextItem[this.props.additionalWatchProp] !== thisItem[this.props.additionalWatchProp]) return true
    }
    if(nextItem[this.props.name] !== thisItem[this.props.name]) return true
    return false
  }
  render(){
    const controlProps = {
      name: this.props.name,
      value: this.props.index === undefined ? this.props.rdr[this.props.name] : this.props.rdr[this.props.index][this.props.name],
      onChange: (...args) => {
        let value
        if(args[0] && typeof args[0] === 'object' && args[0].hasOwnProperty('target')){
          value = args[0].target.value
        } else {
          value = args[0]
        }
        if(this.props.index !== undefined){
          this.props.editField(this.props.index, this.props.name, value)
        } else {
          this.props.editField(this.props.name, value)
        }
      }
    }
    if(this.props.control){
      return CONTROLS[this.props.control]({...controlProps, ...this.props})
    }
    return this.props.render(controlProps)
  }
}
export default Field
