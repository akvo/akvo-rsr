import React from 'react'

class UpdateHalter extends React.Component{
  shouldComponentUpdate(prevProps){
    if(this.props.except){
      for(let i = 0; i < this.props.except.length; i += 1){
        if(this.props.item[this.props.except[i]] !== prevProps.item[this.props.except[i]]){
          return true
        }
      }
    }
    return false
  }
  render(){
    return this.props.children
  }
}

export default UpdateHalter
