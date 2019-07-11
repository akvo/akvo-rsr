import React from 'react'
import { connect } from 'react-redux'
import { Switch } from 'antd'
import { Route } from 'react-router-dom'
import { times, isEqual } from 'lodash'
import sections from './sections'
import actionTypes from './action-types'

const ValidationBar = ({ editorRdr, dispatch }) => {
  return (
    <div className="validation-bar">
      {sections.map((section, index) =>
        <Route
          path={`/projects/:id/${section.key}`}
          exact
          render={(props) => {
            const required = editorRdr[`section${index + 1}`].errors
              .filter(it => it.type === 'required' || it.type === 'min')
              .reduce((acc, val) => { if (acc.findIndex(it => it.path === val.path) === -1) return [...acc, val]; return acc }, [])
            return (
              <span>
                Required fields:
                {required.length > 0 && <span> {required.length} more to fill</span>}
                {required.length === 0 && <span> All done</span>}
                <span className="show-required">
                  <Switch size="small" checked={editorRdr.showRequired} onChange={(checked) => dispatch({ type: actionTypes.SHOW_REQUIRED, checked })} /><span role="button" tabIndex="-1" onClick={() => dispatch({ type: 'PE_SHOW_REQUIRED' })}> Show required</span>
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
      && prevProps.editorRdr.showRequired === nextProps.editorRdr.showRequired
  })
)
