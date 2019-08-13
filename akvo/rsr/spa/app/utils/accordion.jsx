/* global window */
import React, { Component } from 'react'
import { Collapse } from 'antd'
import { FormSpy } from 'react-final-form'
import { get } from 'lodash'

class ActiveKeyUpdater extends React.Component{
  componentDidUpdate(prevProps){
    const thisValues = get(this.props.values, this.props.name)
    if(thisValues !== undefined){
      const prevValues = get(prevProps.values, this.props.name)
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
  }
  render(){
    return null
  }
}

class Accordion extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.multiple ? ['0'] : '0'
    }
  }
  handleChange = (activeKey, lengthChange) => {
    if(activeKey !== this.state.activeKey){
      this.setState({
        activeKey
      })
      if (this.props.autoScrollToActive && lengthChange) {
        if (!this.ref.children) return
        const child = this.ref.children[0].children[activeKey]
        window.scroll({ top: child.offsetParent.offsetTop + (61 * Number(activeKey)) + 413, left: 0, behavior: 'smooth' })
      }
    }
  }
  handleLengthChange = (lastIndex) => {
    if(this.props.multiple !== true){
      this.handleChange(lastIndex, true)
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
      {this.props.finalFormFields.length > 0 &&
      <Collapse accordion={this.props.multiple !== true} className={this.props.className} onChange={this.handleChange} activeKey={this.state.activeKey}>
        {this.props.finalFormFields.map((name, index) => this.props.renderPanel(name, index, this.state.activeKey))}
      </Collapse>
      }
      <FormSpy subscription={{ values: true }}>
        {({ values }) => <ActiveKeyUpdater values={values} name={this.props.setName} activeKey={this.state.activeKey} setActiveKey={this.handleLengthChange} />}
      </FormSpy>
      </div>
    )
  }
}

export default Accordion
