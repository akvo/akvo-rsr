import React from 'react'
import { FormSpy } from 'react-final-form'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty, get } from 'lodash'
import {diff} from 'deep-object-diff'
import * as actions from '../modules/editor/actions'
import fieldSets from '../modules/editor/field-sets'
import { validate } from '../modules/editor/validation'
import { camelToKebab } from './misc'

const debounce = 2000

const getSetRootValues = (values) => {
  const sets = ['indicators', 'periods', 'disaggregations', 'sectors', 'administratives']
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
      const thisValues = get(values, setName)
      // if new item added do nothing
      if(this.lastSavedValues.length < thisValues.length){
        this.lastSavedValues = [...this.lastSavedValues, {}]
        return
      }
      // if item removed: TODO this is unreachable !?
      if(this.lastSavedValues.length > thisValues.length){
        console.log('removed', itemIndex)
        return
      }
      const item = thisValues[itemIndex]
      const difference = customDiff(this.lastSavedValues[itemIndex], item)
      delete difference.disaggregationTargets
      // if difference is not empty AND the difference is not just the newly created item id inserted from ADDED_NEW_ITEM
      if(
        !isEmpty(difference)
        && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'id')
        && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'dimensionNames')
      ){
        if(validate(`section${sectionIndex}/${camelToKebab(setName.replace(/\[([^\]]+)]/g, ''))}`, [1], [item], true).length === 0){
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
      if(
        !isEmpty(difference)
        && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'publishingStatus')
      ){
        const isDiffOnlyCurrentImage = Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'currentImage'
        this.props.saveFields(difference, sectionIndex, isDiffOnlyCurrentImage)
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
