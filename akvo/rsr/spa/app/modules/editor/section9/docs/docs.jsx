import React from 'react'
import { connect } from 'react-redux'
import { Icon, Form, Button, Radio, Upload, Row, Col } from 'antd'

import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { getValidations, doesFieldExist, isFieldOptional, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
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

const Docs = ({ formPush, validations }) => {
  const { isIATI } = getValidations(validations)
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const isOptional = isFieldOptional(validationSets)
  return (
    <div className="links view">
      <h3>Documents</h3>
      <ItemArray
        setName="docs"
        sectionIndex={9}
        header="Document $index: $title"
        newItem={{ categories: [{}]}}
        formPush={formPush}
        panel={name => (
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
          {fieldExists('categories') && <Categories parentName={name} push={formPush} />}
        </div>
        )}
        addButton={props => (
          <Button
            className="bottom-btn"
            icon="plus"
            type="dashed"
            block
            {...props}
          >
            Add another document
          </Button>
        )}
      />
    </div>
  )
}

export default connect(
  ({ editorRdr: { validations } }) => ({ validations })
)(Docs)
