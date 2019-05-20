import React from 'react'
import { FormSpy } from 'react-final-form'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty } from 'lodash'
import {diff} from 'deep-object-diff'
import * as actions from '../modules/editor/actions'

const debounce = 1000

class AutoSave extends React.Component {
  componentDidMount(){
    this.timeout = setTimeout(() => this.save(null), debounce)
  }
  componentWillReceiveProps() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    const values = cloneDeep(this.props.values)
    this.timeout = setTimeout(() => this.save(values), debounce)
  }

  save = (prevValues) => {
    const { values, setName, itemIndex, sectionIndex } = this.props

    if(setName !== undefined && itemIndex !== undefined){
      if(prevValues === null){
        this.props.editSetItem(sectionIndex, setName, itemIndex, values[setName][itemIndex])
        return
      }
      // if this item has changed
      if(prevValues[setName].length !== values[setName].length){
        return
      }

      const difference = diff(prevValues[setName][itemIndex], values[setName][itemIndex])
      if(!isEmpty(difference)){
        this.props.editSetItem(sectionIndex, setName, itemIndex, difference)
      }
    }
  }

  render() {
    return null
  }
}
AutoSave.propTypes = {
  itemIndex: PropTypes.number,
  setName: PropTypes.string,
  sectionIndex: PropTypes.number
}

export default props => (
  <FormSpy {...props} subscription={{ values: true }} component={connect(null, actions)(AutoSave)} />
)
