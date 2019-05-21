import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Links from './links/links'
import Docs from './docs/docs'
import './styles.scss'

class LinksDocs extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    return (
      <div className="links view">
        <FinalForm
          onSubmit={() => {}}
          subscription={{}}
          initialValues={this.props.fields}
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
  }
}

export default connect(
  ({ editorRdr: { section9: { fields }}}) => ({ fields })
)(LinksDocs)
