/* global document */
import React from 'react'
import { Radio, Button, Tooltip } from 'antd'
import jump from 'jump.js'
import { withTranslation } from 'react-i18next'

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
    const { t } = this.props
    return (
      <div className="menu-container">
        <div className="menu-contents">
        <Radio.Group
          size="small"
          buttonStyle="solid"
          value={this.state.currentAnchor}
          onChange={e => {
            jump(this.sections[e.target.value], { duration: 400, offset: -270 })
          }}
        >
          <Radio.Button value="info">{t('Info')}</Radio.Button>
          <Condition when={`${this.props.fieldName}.type`} is={1}>
            <Radio.Button value="disaggregations">{t('Disaggregations')}</Radio.Button>
          </Condition>
          <Radio.Button value="baseline">{t('Baseline')}</Radio.Button>
          <Radio.Button value="periods">{t('Periods')}</Radio.Button>
        </Radio.Group>
        </div>
      </div>
    )
  }
}

export default withTranslation()(IndicatorNavMenu)
