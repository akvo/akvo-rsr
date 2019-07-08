/* global document */
import React from 'react'
import { Radio } from 'antd'
import jump from 'jump.js'

import Condition from '../../../utils/condition'
import { getBestAnchorGivenScrollLocation } from '../../../utils/scroll'

export const fieldNameToId = name => name.replace(/\[/g, '').replace(/\]/g, '').replace(/\./g, '')

class IndicatorNavMenu extends React.Component{
  state = {
    currentAnchor: 'info',
    gotTargets: false
  }
  componentDidMount(){
    if(this.props.isActive){
      this.getTargets()
    }
  }
  componentDidUpdate(prevProps){
    if(!this.state.gotTargets && this.props.isActive && !prevProps.isActive){
      this.getTargets()
    }
  }
  componentWillUnmount(){
    document.removeEventListener('scroll', this.scroll)
  }
  getTargets = () => {
    const { fieldName } = this.props
    const fieldNameId = fieldNameToId(fieldName)
    this.sections = {
      info: document.getElementById(`${fieldNameId}-info`),
      disaggregations: document.getElementById(`${fieldNameId}-disaggregations`),
      baseline: document.getElementById(`${fieldNameId}-baseline`),
      periods: document.getElementById(`${fieldNameId}-periods`)
    }
    document.addEventListener('scroll', this.scroll)
    this.setState({
      gotTargets: true
    })
  }
  scroll = () => {
    let anchor = getBestAnchorGivenScrollLocation(this.sections, -270)
    if(anchor === undefined) anchor = 'info'
    if(anchor !== this.state.currentAnchor){
      this.setState({
        currentAnchor: anchor
      })
    }
  }
  render(){
    return (
      <div className="menu-container">
        <Radio.Group
          size="small"
          buttonStyle="solid"
          value={this.state.currentAnchor}
          onChange={e => {
            jump(this.sections[e.target.value], { duration: 400, offset: -270 })
          }}
        >
          <Radio.Button value="info">Info</Radio.Button>
          <Condition when={`${this.props.fieldName}.type`} is={1}>
            <Radio.Button value="disaggregations">Disaggregations</Radio.Button>
          </Condition>
          <Radio.Button value="baseline">Baseline</Radio.Button>
          <Radio.Button value="periods">Periods</Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}

export default IndicatorNavMenu
