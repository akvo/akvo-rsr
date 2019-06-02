import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import FinalField from '../../../utils/final-field'
import InputLabel from '../../../utils/input-label'
import AutoSave from '../../../utils/auto-save'
import RTE from '../../../utils/rte'
import tempAvailableKeywords from './temp-keywords.json'

import './styles.scss'

const { Item } = Form

class CommentsKeywords extends React.Component{
  shouldComponentUpdate(){
    return false
  }
  render(){
    return (
      <div className="comments-n-keywords view">
        <Form layout="vertical">
          <FinalForm
            onSubmit={() => {}}
            initialValues={this.props.fields}
            mutators={{ ...arrayMutators }}
            subscription={{}}
            render={() => (
            <div>
              <AutoSave sectionIndex={10} />
              <Item label={<InputLabel optional tooltip="...">Comments</InputLabel>}>
                <FinalField
                  name="comments"
                  render={({input}) => <RTE {...input} />}
                />
              </Item>
              <h3>Keywords</h3>
              <FinalField
                name="keywords"
                control="select"
                mode="multiple"
                optionFilterProp="children"
                options={tempAvailableKeywords.map(({id, label}) => ({ value: id, label }))}
                placeholder="Please select..."
              />
            </div>
            )}
          />
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ editorRdr: { section10: {fields}} }) => ({ fields }),
)(CommentsKeywords)
