import React from 'react'
import { FormSpy } from 'react-final-form'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty, get } from 'lodash'
import { diff } from 'deep-object-diff'
import * as actions from '../modules/editor/actions'
import fieldSets from '../modules/editor/field-sets'
import { filteroutFns, swapNullValues } from './misc'

const debounce = 2000

const getSetRootValues = (values) => {
  const sets = ['indicators', 'periods', 'disaggregations', 'sectors', 'administratives', 'references']
  const ret = { ...values }
  sets.forEach(fieldSet => {
    if (ret.hasOwnProperty(fieldSet)) {
      delete ret[fieldSet]
    }
  })
  return ret
}
const customDiff = (oldObj, newObj) => {
  const difference = diff(getSetRootValues(oldObj), getSetRootValues(newObj))
  // override deep diff to take the entire updated array
  Object.keys(difference).forEach((key) => {
    if (typeof difference[key] === 'object') {
      difference[key] = newObj[key]
    }
  })
  return swapNullValues(difference)
}

const getRootValues = (values, sectionKey) => {
  const ret = { ...values }
  if (fieldSets.hasOwnProperty(sectionKey)) {
    fieldSets[sectionKey].forEach(set => {
      delete ret[set]
    })
  }
  return ret
}

const transformUndefinedToEmptyStringOrNull = (difference, lastSavedValues) => {
  const dms = lastSavedValues?.dimensionNames?.flatMap((dm) => dm?.values)
  Object.keys(difference).forEach(key => {
    if (key === 'disaggregationTargets') {
      difference[key] = difference[key]?.length === 1
        ? dms?.map((dm, ix) => ({
          dimensionValue: dm?.id,
          value: (parseInt(difference[key][0]?.index[0], 10) === ix) ? difference[key][0]?.value : null
        }))
        : difference[key]?.map(item => {
          return item?.value === undefined
            ? ({ ...item, value: null })
            : ({ dimensionValue: item?.dimensionValue || dms[item?.index[0]]?.id, value: item?.value })
        })
    } else if (difference[key] === undefined && lastSavedValues && String(Number(lastSavedValues[key])) === 'NaN') {
      difference[key] = ''
    }
    else if (difference[key] === undefined && lastSavedValues && String(Number(lastSavedValues[key])) !== 'NaN') {
      difference[key] = null
    }
  })
}

class AutoSave extends React.Component {
  componentWillMount() {
    if (!this.inited) {
      this.save()
    }
  }
  componentWillReceiveProps(nextProps) {
    const difference = diff(nextProps.values, this.props.values)
    if (isEmpty(difference)) {
      return
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(this.save, debounce)
  }

  save = () => {
    const { values, setName, itemIndex, sectionIndex } = this.props

    if (setName !== undefined && itemIndex !== undefined) {
      const thisValues = get(values, `${setName}[${itemIndex}]`)
      if (!thisValues) return
      const savedValues = get(this.props.editorRdr[`section${sectionIndex}`].fields, `${setName}[${itemIndex}]`)
      const item = thisValues
      const difference = customDiff(savedValues, item)
      // if difference is not empty AND the difference is not just the newly created item id inserted from ADDED_NEW_ITEM
      if (!isEmpty(difference)) {
        if (
          !(Object.keys(difference).indexOf('id') !== -1)
          && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'dimensionNames')
          && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'document')
          && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'removing')
        ) {
          transformUndefinedToEmptyStringOrNull(difference, savedValues)
          const { disaggregationTargets, id: itemID, ...itemValues } = item
          const allValues = disaggregationTargets && disaggregationTargets?.length > 0 ? { ...itemValues, disaggregationTargets } : itemValues
          if(itemID){
            if (
              (sectionIndex === 5 && difference?.hasOwnProperty('scores') && difference?.scores?.length) ||
              (sectionIndex === 5 && !difference?.hasOwnProperty('scores')) ||
              (sectionIndex !== 5)
              ) {
                this.props.editSetItem(sectionIndex, setName, itemIndex, itemID, difference)
            }
          } else {
            if (
              (sectionIndex === 5 && allValues?.hasOwnProperty('periodEnd') && allValues?.hasOwnProperty('indicator')) ||
              (sectionIndex === 5 && !allValues?.hasOwnProperty('periodEnd')) ||
              (sectionIndex !== 5)
            ) {
              this.props.addSetItem(sectionIndex, setName, allValues)
            }
          }
        }
      }
    } else {
      const thisValues = getRootValues(values, `section${sectionIndex}`)
      const savedValues = getRootValues(this.props.editorRdr[`section${sectionIndex}`].fields, `section${sectionIndex}`)
      const difference = customDiff(savedValues, thisValues)
      if (
        !isEmpty(difference)
        && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'publishingStatus')
        && !(Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'currentImage')
      ) {
        transformUndefinedToEmptyStringOrNull(difference, savedValues)
        const isDiffOnlyCurrentImage = Object.keys(difference).length === 1 && Object.keys(difference)[0] === 'currentImage'
        this.props.saveFields(difference, sectionIndex, isDiffOnlyCurrentImage)
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

export {
  AutoSave
}

const stripObj = (props) => {
  const ret = {}
  const avoid = ['form', 'mutators']
  Object.keys(props).forEach(prop => {
    if (avoid.indexOf(prop) === -1) ret[prop] = props[prop]
  })
  return ret
}


const CntComp = connect(({ editorRdr }) => ({ editorRdr }), actions)(React.memo(AutoSave, (prevProps, nextProps) => {
  const _diff = diff(stripObj(filteroutFns(prevProps)), stripObj(filteroutFns(nextProps)))
  const keys = Object.keys(_diff)
  let ret = false
  if (keys.length === 1 && keys[0] === 'editorRdr') ret = true
  else ret = keys.length === 0
  return ret
}))
export default props => (
  <FormSpy {...props} subscription={{ values: true }} component={CntComp} />
)
