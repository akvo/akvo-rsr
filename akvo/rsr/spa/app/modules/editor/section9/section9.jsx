import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Links from './links/links'
import Docs from './docs/docs'
import './styles.scss'
import SectionContext from '../section-context'
import { shouldUpdateSectionRoot } from '../../../utils/misc'

const LinksDocs = ({ fields, validations, dispatch }) => (
  <div className="links view">
    <SectionContext.Provider value="section9">
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
          <Docs formPush={push} validations={validations} dispatch={dispatch} initialValues={fields} />
        </Form>
      )}
    />
    </SectionContext.Provider>
  </div>
)

export default connect(
  ({ editorRdr: { section9: { fields }, validations }}) => ({ fields, validations })
)(React.memo(LinksDocs, shouldUpdateSectionRoot))
