import React from 'react'
import { connect } from 'react-redux'
import { Switch } from 'antd'
import { Route } from 'react-router-dom'
import { times, isEqual } from 'lodash'
import sections from './sections'

const ValidationBar = ({ editorRdr }) => {
  return (
    <div className="validation-bar">
      {sections.map((section, index) =>
        <Route
          path={`/projects/:id/${section.key}`}
          exact
          render={(props) => {
            const required = editorRdr[`section${index + 1}`].errors.filter(it => it.type === 'required' || it.type === 'min')
            return (
              <span>
                Required fields:
                {required.length > 0 && <span> {required.length} more to fill</span>}
                {required.length === 0 && <span> All done</span>}
                <span className="show-required">
                  <Switch size="small" /><span> Show required</span>
                </span>
              </span>
            )
          }}
        />)
      }
    </div>
  )
}

export default connect(({ editorRdr }) => ({ editorRdr }))(
  React.memo(ValidationBar, (prevProps, nextProps) => {
    return times(11).map(i => isEqual(prevProps.editorRdr[`section${i + 1}`].errors, nextProps.editorRdr[`section${i + 1}`].errors)).reduce((val, acc) => val && acc)
  })
)
