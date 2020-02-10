import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { diff } from 'deep-object-diff'

import Links from './links/links'
import Docs from './docs/docs'
import './styles.scss'
import SectionContext from '../section-context'
// import { shouldUpdateSectionRoot } from '../../../utils/misc'
import { editSetItem } from '../actions'

const LinksDocs = ({ fields, validations, dispatch, editSetItem }) => ( // eslint-disable-line
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
          <Docs formPush={push} {...{ validations, dispatch, editSetItem}} initialValues={fields} />
        </Form>
      )}
    />
    </SectionContext.Provider>
  </div>
)

const shouldUpdateSectionRoot = (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  const json = JSON.stringify(difference)
  const shouldUpdate = json.indexOf('"id"') !== -1 || json.indexOf('"document"') !== -1
  return !shouldUpdate
}

export default connect(
  ({ editorRdr: { section9: { fields }, validations }}) => ({ fields, validations }),
  { editSetItem }
)(React.memo(LinksDocs, shouldUpdateSectionRoot))
