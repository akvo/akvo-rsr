import React from 'react'
import { connect } from 'react-redux'
import { Icon, Form, Button, Radio, Upload, Row, Col } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { getValidations, doesFieldExist, isFieldOptional } from '../../../../utils/validation-utils'
import { getValidationSets } from './validations'
import LANGUAGE_OPTIONS from './languages.json'
import FORMAT_OPTIONS from './formats.json'
import Categories from './categories'

const { Item } = Form

const handleRadioSwitch = (event, input) => {
  if(event.target.value === 'upload' && !input.value){
    input.onChange(true)
  }
  else if(event.target.value === 'url' && input.value){
    input.onChange('')
  }
}

class Docs extends React.Component{
  render(){
    const { isIATI } = getValidations(this.props.validations)
    const validationSets = getValidationSets(this.props.validations)
    const fieldExists = doesFieldExist(validationSets)
    const isOptional = isFieldOptional(validationSets)
    return (
      <div className="links view">
        <FinalForm
          onSubmit={() => {}}
          subscription={{ pristine: true }}
          mutators={{ ...arrayMutators }}
          render={({
            form: {
              mutators: { push }
            },
            values
          }) => (
            <Form layout="vertical">
            <h3>Documents</h3>
            <ItemArray
              values={values}
              name="items"
              header="Document $index: $title"
              panel={(name, index) => (
              <div>
                <Item>
                  <FinalField
                    name={`${name}.document`}
                    render={({ input }) => (
                      <Radio.Group value={input.value ? 'upload' : 'url'} onChange={ev => handleRadioSwitch(ev, input)}>
                        <Radio.Button value="url">URL</Radio.Button>
                        <Radio.Button value="upload">Upload</Radio.Button>
                      </Radio.Group>
                    )}
                  />
                  <Condition when={`${name}.document`} isNot={true}>
                    <FinalField
                      name={`${name}.url`}
                      control="input"
                      placeholder="http://..."
                    />
                  </Condition>
                  <Condition when={`${name}.document`} is={true}>
                    <Upload.Dragger name="files" listType="picture" action="/upload.do">
                      <p className="ant-upload-drag-icon">
                        <Icon type="picture" theme="twoTone" />
                      </p>
                      <p className="ant-upload-text">Drag file here</p>
                      <p className="ant-upload-hint">or click to browse from computer</p>
                      <p><small>Max: 5MB</small></p>
                    </Upload.Dragger>
                  </Condition>
                </Item>
                <Item label={<InputLabel tooltip="...">Title</InputLabel>}>
                  <FinalField name={`${name}.title`} control="input" />
                </Item>
                {isIATI && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Item label={<InputLabel optional>Title Language</InputLabel>}>
                        <FinalField name={`${name}.titleLanguage`} control="select" options={LANGUAGE_OPTIONS} showSearch optionFilterProp="children" />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label={<InputLabel optional>Document Language</InputLabel>}>
                        <FinalField name={`${name}.documentLanguage`} control="select" options={LANGUAGE_OPTIONS} showSearch optionFilterProp="children" />
                      </Item>
                    </Col>
                  </Row>
                )}
                <Row gutter={16}>
                  {fieldExists('documentDate') && (
                  <Col span={12}>
                    <Item label={<InputLabel optional>Document Date</InputLabel>}>
                      <FinalField name={`${name}.documentDate`} control="datepicker" />
                    </Item>
                  </Col>
                  )}
                  {fieldExists('documentFormat') && (
                  <Col span={12}>
                    <Item label={<InputLabel optional={isOptional('documentFormat')}>Format</InputLabel>}>
                      <FinalField name={`${name}.documentFormat`} control="select" options={FORMAT_OPTIONS} showSearch />
                    </Item>
                  </Col>
                  )}
                </Row>
                {fieldExists('categories') && <Categories parentName={name} push={push} />}
              </div>
              )}
            />
            <Button
              className="bottom-btn"
              icon="plus"
              type="dashed"
              block
              onClick={() => push('items', { categories: [undefined]})}
            >
              Add another document
            </Button>
            </Form>
          )}
        />
      </div>
    )
  }
}

export default connect(
  ({ infoRdr: { validations } }) => ({ validations })
)(Docs)
