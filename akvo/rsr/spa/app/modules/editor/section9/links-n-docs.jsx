import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import {isEqual} from 'lodash'

import Links from './links/links'
import Docs from './docs/docs'
import './styles.scss'

const LinksDocs = ({ fields }) => (
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
          <Docs formPush={push} />
        </Form>
      )}
    />
  </div>
)

export default connect(
  ({ editorRdr: { section9: { fields }}}) => ({ fields })
)(React.memo(LinksDocs, (prevProps, nextProps) => isEqual(prevProps.fields, nextProps.fields)))
