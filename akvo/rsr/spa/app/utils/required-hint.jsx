import React from 'react'
import { connect } from 'react-redux'
import { times, isEqual } from 'lodash'

const RequiredHint = ({ section, name, targetsAt, ...props }) => {
  const errors = props[section]
    ?.errors
    ?.filter(it => {
      if (it.path.includes('targetValue') && targetsAt === 'indicator') {
        return false
      }
      return it.path.includes(name)
    })
  if (errors.length) {
    return <span className="req-hint" ref={(ref) => { if (ref && ref.parentNode) ref.parentNode.parentNode.classList.add('contains-mandatory') }} />
  }
  return <span className="req-hint" ref={(ref) => { if (ref && ref.parentNode) ref.parentNode.parentNode.classList.remove('contains-mandatory') }} />
}

export default connect(({ editorRdr }) => {
  const { showRequired, backendError } = editorRdr
  const props = ({ showRequired, backendError })
  // bind validation errors (required) for all sections
  times(11).forEach((i) => {
    const sectionKey = `section${i + 1}`
    props[sectionKey] = { errors: editorRdr[sectionKey].errors.filter(it => it.type === 'required' || it.type === 'typeError' || (it.type === 'min' && it.path !== undefined)) }
  })
  return props
})(React.memo(RequiredHint, (prevProps, nextProps) => isEqual(prevProps, nextProps)))
