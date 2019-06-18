import React from 'react'
import { FormSpy } from 'react-final-form'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty, get, isEqual } from 'lodash'
import {diff} from 'deep-object-diff'
import * as actions from '../modules/editor/actions'
import fieldSets from '../modules/editor/field-sets'
import { validate } from '../modules/editor/validation'
import { camelToKebab } from './misc'

const debounce = 2000

const getSetRootValues = (values) => {
  const sets = ['indicators', 'periods', 'disaggregations']
  const ret = {...values}
  sets.forEach(fieldSet => {
    if(ret.hasOwnProperty(fieldSet)){
      delete ret[fieldSet]
    }
  })
  return ret
}
const customDiff = (oldObj, newObj) => {
  const difference = diff(getSetRootValues(oldObj), getSetRootValues(newObj))
  // override deep diff to take the entire updated array
  Object.keys(difference).forEach((key) => {
    if(typeof difference[key] === 'object'){
      difference[key] = newObj[key]
    }
  })
  return difference
}

const getRootValues = (values, sectionKey) => {
  const ret = {...values}
  if(fieldSets.hasOwnProperty(sectionKey)){
    fieldSets[sectionKey].forEach(set => {
      delete ret[set]
    })
  }
  return ret
}


class AutoSave extends React.Component {
  componentWillMount(){
    const { setName, sectionIndex, itemIndex } = this.props
    if(setName !== undefined){
      this.lastSavedValues = cloneDeep(get(this.props.values, setName))
      console.log(`mounting ${setName}[${itemIndex}]`)
    } else {
      this.lastSavedValues = getRootValues(this.props.values, `section${sectionIndex}`)
    }
  }
  componentWillReceiveProps(nextProps) {
    // TODO: This has been used to udpate lastSavedValues only on project.id update
    // if(!this.props.values.id && nextProps.values.id){
    //   const { setName, sectionIndex } = this.props
    //   this.lastSavedValues = getRootValues(this.props.values, `section${sectionIndex}`)
    //   return
    // }
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(this.save, debounce)
  }

  save = () => {
    const { values, setName, itemIndex, sectionIndex } = this.props

    if(setName !== undefined && itemIndex !== undefined){
      // if new item added do nothing
      console.log(itemIndex, this.lastSavedValues.length, get(values, setName).length)
      if(this.lastSavedValues.length < get(values, setName).length){
        this.lastSavedValues = [...this.lastSavedValues, {}]
        return
      }
      // if item removed: TODO this is unreachable !?
      if(this.lastSavedValues.length > get(values, setName).length){
        console.log('removed', itemIndex)
        return
      }
      const item = get(values, setName)[itemIndex]
      const difference = customDiff(this.lastSavedValues[itemIndex], item)
      // if difference is not empty AND the difference is not just the newly created item id inserted from ADDED_NEW_ITEM
      if(!isEmpty(difference) && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'id')){
        if(validate(`section${sectionIndex}/${camelToKebab(setName)}`, [1], [item])){
          if(!item.id){
            this.props.addSetItem(sectionIndex, setName, item)
          } else {
            this.props.editSetItem(sectionIndex, setName, itemIndex, item.id, difference)
          }
        }
        this.lastSavedValues[itemIndex] = {
          ...this.lastSavedValues[itemIndex],
          ...difference
        }
      }
    } else {
      const rootValues = getRootValues(values, `section${sectionIndex}`)
      const difference = customDiff(this.lastSavedValues, rootValues)
      if(!isEmpty(difference)){
        this.props.saveFields(difference, sectionIndex)
        this.lastSavedValues = {
          ...this.lastSavedValues,
          ...difference
        }
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
