import React from 'react'
import { connect } from 'react-redux'
import { times, isEqual } from 'lodash'
import { useTranslation } from 'react-i18next'

const RequiredHint = ({ section, name, ...props }) => {
  const { t } = useTranslation()
  const errors = props[section].errors.filter(it => it.path.indexOf(name) !== -1)
  if (errors.length > 0) {
    return <span className="mandatory-hint"><b>{errors.length}</b> {t('more to fill')}</span>
  }
  return null
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
