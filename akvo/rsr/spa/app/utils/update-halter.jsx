import React from 'react'

class UpdateHalter extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    return this.props.children
  }
}

export default UpdateHalter
