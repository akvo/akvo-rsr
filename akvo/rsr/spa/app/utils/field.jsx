import React from 'react'

class Field extends React.Component{
  shouldComponentUpdate(nextProps){
    if(this.props.additionalWatchProp){
      if(nextProps.rdr[this.props.additionalWatchProp] !== this.props.rdr[this.props.additionalWatchProp]) return true
    }
    if(nextProps.rdr[this.props.name] !== this.props.rdr[this.props.name]) return true
    return false
  }
  render(){
    return this.props.render({
      value: this.props.rdr[this.props.name],
      onChange: (...args) => {
        let value
        if(typeof args[0] === 'object' && args[0].hasOwnProperty('target')){
          value = args[0].target.value
        } else {
          value = args[0]
        }
        this.props.editField(this.props.name, value)
      }
    })
  }
}
export default Field
