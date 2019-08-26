import React from 'react'
import { connect } from 'react-redux'
import { Switch } from 'antd'
import { Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { times, isEqual } from 'lodash'
import classNames from 'classnames'
import sections from './sections'
import actionTypes from './action-types'

const ValidationBar = ({ editorRdr, dispatch }) => {
  const { t } = useTranslation()
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
                {t('Required fields:')}
                {required.length > 0 && <span> <b>{required.length}</b> {t('more to fill')}</span>}
                {required.length === 0 && <span className="all-done"> {t('All done')}</span>}
                <span className={classNames('show-required', { 'all-done-toggle': required.length === 0})}>
                  <Switch size="small" checked={editorRdr.showRequired} onChange={(checked) => dispatch({ type: actionTypes.SHOW_REQUIRED, checked })} /><span role="button" tabIndex="-1" onClick={() => dispatch({ type: 'PE_SHOW_REQUIRED' })}> {t('Show required')}</span>
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
