import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'antd'

export const CalculateTotalChecker = ({ section, paths, path, rdr, prop }) => {
  const fieldArrays = paths ? paths.map(_path => rdr[`section${section}`][_path]) : [rdr[`section${section}`][path]]
  const total = fieldArrays.map(fieldArray => fieldArray.map(it => it[prop]).filter(val => val > 0).reduce((acc, val) => acc + Number(val), 0)).reduce((acc, val) => acc + Number(val), 0)
  const diff = 100 - total
  if(diff !== 0 && total !== 0) {
    const msg = diff > 0 ? `${diff}% more to add` : `${-diff}% too much`
    return <Alert className="calc-total-checker" type="warning" message={msg} showIcon style={{ marginTop: 15 }} />
  }
  return null
}

export default connect(
  ({ editorRdr }) => {
    const sections = [6, 7, 8] // bind only the sections that will use this component
    const rdr = {}
    sections.forEach(index => {
      rdr[`section${index}`] = editorRdr[`section${index}`].fields
    })
    return {rdr}
  }
)(CalculateTotalChecker)
