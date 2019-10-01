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
    const defaultSelected = props.activeKey !== -1 ? String(props.activeKey) : '0'
    this.state = {
      activeKey: props.multiple ? [defaultSelected] : defaultSelected
    }
    if(props.setName.indexOf('.periods') !== -1){
      this.isPeriods = true
    } else if(props.setName.indexOf('.indicators') !== -1){
      this.isIndicators = true
    } else if(props.setName.indexOf('results') !== -1){
      this.isResults = true
    }
  }
  handleChange = (activeKey) => {
    if (activeKey !== this.state.activeKey) {
      // when closing, scroll to closed item
      let indexToScrollTo = -1
      if (this.props.multiple && this.state.activeKey.length > activeKey.length) {
        indexToScrollTo = this.state.activeKey.find(it => activeKey.indexOf(it) === -1)
      } else if(!this.props.multiple){
        if (activeKey) {
          indexToScrollTo = activeKey
        } else {
          indexToScrollTo = this.state.activeKey
        }
      }
      this.setState({
        activeKey
      })
      if(indexToScrollTo !== -1){
        if (!this.ref || !this.ref.children) return
        const child = this.ref.children[0].children[indexToScrollTo]
        if (this.isPeriods) {
          const topAccordionOffsetTop = child.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop + child.offsetParent.offsetParent.offsetParent.offsetTop - /* sticky header */ 252
          const top = topAccordionOffsetTop + child.offsetParent.offsetTop + child.offsetParent.offsetParent.offsetTop + (61 * Number(indexToScrollTo))
          window.scroll({ top, behavior: 'smooth' })
        }
        else if(this.isIndicators){
          const topAccordionOffsetTop = child.offsetParent.offsetParent.offsetParent.offsetTop + child.offsetParent.offsetParent.offsetTop - /* sticky header */ 182
          const top = topAccordionOffsetTop + child.offsetParent.offsetTop + child.offsetTop
          if(top < window.scrollY){
            window.scroll({ top, behavior: 'smooth' })
          }
        }
        else if(this.isResults){
          const topAccordionOffsetTop = child.offsetParent.offsetParent.offsetTop + child.offsetParent.offsetTop - /* sticky header */ 101
          const top = topAccordionOffsetTop + child.offsetTop
          if (top < window.scrollY) {
            window.scroll({ top, behavior: 'smooth' })
          }
        }
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
      <Collapse accordion={this.props.multiple !== true} className={this.props.className} onChange={this.handleChange} activeKey={this.state.activeKey} destroyInactivePanel={this.props.destroyInactivePanel}>
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
