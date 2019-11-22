import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

const MinRequired = ({ section, setName, rdr }) => {
  const { t } = useTranslation()
  if (rdr.showRequired && rdr[section].errors.findIndex(it => it.type === 'min' && it.path === setName) !== -1){
    return (
      <span className="min-required">{t('Minimum one required')}</span>
    )
  }
  return null
}

export default connect(
  ({ editorRdr }) => {
    const rdr = {showRequired: editorRdr.showRequired}
    for(let i = 1; i <= 11; i += 1){
      rdr[`section${i}`] = {
        errors: editorRdr[`section${i}`].errors
      }
    }
    return {rdr}
  }
)(MinRequired)
