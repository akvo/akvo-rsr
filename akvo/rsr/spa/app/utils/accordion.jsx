import React, { Component } from 'react'
import { Collapse } from 'antd'
import { FormSpy } from 'react-final-form'

class ActiveKeyUpdater extends React.Component{
  componentDidUpdate(prevProps){
    // eval(`if(!prevProps.values.${this.props.name}) return null;`)
    let thisValues, prevValues // eslint-disable-line
    eval(`thisValues = this.props.values.${this.props.name}`)
    eval(`prevValues = prevProps.values.${this.props.name}`)
    if(thisValues.length > prevValues.length
       || thisValues.length <= Number(this.props.activeKey)){
      setTimeout(() => {
        this.props.setActiveKey(String(thisValues.length - 1))
      }, 200)
    }
  }
  render(){
    return null
  }
}
const Aux = node => node.children

class Accordion extends Component {
  state = {
    activeKey: '0'
  }
  handleChange = (activeKey) => {
    if(activeKey !== this.state.activeKey){
      this.setState({
        activeKey
      })
    }
  }
  render() {
    return (
      <Aux>
      <Collapse accordion className={this.props.className} onChange={this.handleChange} activeKey={this.state.activeKey}>
        {this.props.finalFormFields.map(this.props.renderPanel)}
      </Collapse>
      <FormSpy subscription={{ values: true }}>
        {({ values }) => <ActiveKeyUpdater values={values} name={this.props.setName} activeKey={this.state.activeKey} setActiveKey={this.handleChange} />}
      </FormSpy>
      </Aux>
    )
  }
}

export default Accordion
