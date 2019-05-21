import React from 'react'
import { FormSpy } from 'react-final-form'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty } from 'lodash'
import {diff} from 'deep-object-diff'
import * as actions from '../modules/editor/actions'

const debounce = 1000

const customDiff = (oldObj, newObj) => {
  const difference = diff(oldObj, newObj)
  // override deep diff to take the entire updated array
  Object.keys(difference).forEach((key) => {
    if(typeof difference[key] === 'object'){
      difference[key] = newObj[key]
    }
  })
  return difference
}

class AutoSave extends React.Component {
  componentWillMount(){
    this.lastSavedValues = cloneDeep(this.props.values)
  }
  componentWillReceiveProps() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(this.save, debounce)
  }

  save = () => {
    const { values, setName, itemIndex, sectionIndex } = this.props

    if(setName !== undefined && itemIndex !== undefined){
      // if this item has changed
      if(this.lastSavedValues[setName].length !== values[setName].length){
        return
      }

      const difference = customDiff(this.lastSavedValues[setName][itemIndex], values[setName][itemIndex])
      if(!isEmpty(difference)){
        this.props.editSetItem(sectionIndex, setName, itemIndex, difference)
        this.lastSavedValues = {...this.lastSavedValues, ...difference}
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
