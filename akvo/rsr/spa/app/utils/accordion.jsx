import React, { Component } from 'react'
import { Collapse } from 'antd'
import { FormSpy } from 'react-final-form'
import jump from 'jump.js'

class ActiveKeyUpdater extends React.Component{
  componentDidUpdate(prevProps){ // eslint-disable-line
    try{
      // prevent error on an unmounted component
      eval(`this.props.values.${this.props.name}`)
    } catch(e) {
      return null
    }
    let thisValues = [], prevValues = [] // eslint-disable-line
    eval(`thisValues = this.props.values.${this.props.name}`)
    eval(`prevValues = prevProps.values.${this.props.name}`)
    let shouldUpdate = false
    if(Array.isArray(this.props.activeKey)){
      shouldUpdate = thisValues.length !== prevValues.length
    } else {
      shouldUpdate = thisValues.length > prevValues.length || thisValues.length <= Number(this.props.activeKey)
    }
    if(shouldUpdate){
      setTimeout(() => {
        this.props.setActiveKey(String(thisValues.length - 1))
      }, 200)
    }
  }
  componentWillUnmount(){
    console.log('unmounting Accordion', this.props.name)
  }
  render(){
    return null
  }
}
const Aux = node => node.children

class Accordion extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.multiple ? ['0'] : '0'
    }
  }
  handleChange = (activeKey) => {
    if(activeKey !== this.state.activeKey){
      this.setState({
        activeKey
      })
      // if(this.ref) {
      //   setTimeout(() => {
      //     jump(this.ref.getElementsByClassName('ant-collapse-content')[0], { duration: 200 })
      //   }, 200)
      // }
    }
  }
  handleLengthChange = (lastIndex) => {
    if(this.props.multiple !== true){
      this.handleChange(lastIndex)
    } else {
      const activeKey = []
      this.state.activeKey.forEach(key => {
        if(key < lastIndex){
          activeKey.push(key)
        }
      })
      activeKey.push(lastIndex)
      this.handleChange(activeKey)
    }
  }
  render() {
    return (
      <div className="accordion-container" ref={(ref) => { this.ref = ref }}>
      <Collapse accordion={this.props.multiple !== true} className={this.props.className} onChange={this.handleChange} activeKey={this.state.activeKey}>
        {this.props.finalFormFields.map(this.props.renderPanel)}
      </Collapse>
      <FormSpy subscription={{ values: true }}>
        {({ values }) => <ActiveKeyUpdater values={values} name={this.props.setName} activeKey={this.state.activeKey} setActiveKey={this.handleLengthChange} />}
      </FormSpy>
      </div>
    )
  }
}

export default Accordion
