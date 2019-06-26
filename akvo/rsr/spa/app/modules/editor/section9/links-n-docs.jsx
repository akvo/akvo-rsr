import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import {isEqual} from 'lodash'
import {diff} from 'deep-object-diff'

import Links from './links/links'
import Docs from './docs/docs'
import './styles.scss'

const LinksDocs = ({ fields, validations, dispatch }) => (
  <div className="links view">
    <FinalForm
      onSubmit={() => {}}
      subscription={{}}
      initialValues={fields}
      mutators={{ ...arrayMutators }}
      render={({
        form: {
          mutators: { push }
        }
      }) => (
        <Form layout="vertical">
          <Links formPush={push} />
          <Docs formPush={push} validations={validations} dispatch={dispatch} />
        </Form>
      )}
    />
  </div>
)

export default connect(
  ({ editorRdr: { section9: { fields }, validations }}) => ({ fields, validations })
)(React.memo(LinksDocs, (prevProps, nextProps) => {
  let _isEqual = isEqual(prevProps.fields, nextProps.fields)
  if(!_isEqual){
    // prevent update on added empty item
    const _diff = diff(prevProps.fields, nextProps.fields)
    if(_diff.docs){
      if(isEqual(_diff.docs[Object.keys(_diff.docs)[0]], {document: true, categories: []})){
        _isEqual = true
      }
    }
  }
  return isEqual(_isEqual)
}))
