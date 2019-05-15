import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Button, Radio, Upload, Row, Col, Input } from 'antd'

import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'
import InputLabel from '../../../../utils/input-label'
import { getValidations, doesFieldExist, isFieldOptional } from '../../../../utils/validation-utils'
import { getValidationSets } from './validations'
import LANGUAGE_OPTIONS from './languages.json'
import FORMAT_OPTIONS from './formats.json'
import Categories from './categories'

import * as actions from './actions'

const { Panel } = Collapse
const { Item } = Form
const Field = connect(
  ({ docsRdr }) => ({rdr: docsRdr}),
  { editField: actions.editField }
)(_Field)

class Docs extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.rdr.length > 0 ? `${props.rdr.length - 1}` : 0
    }
  }
  addDoc = () => {
    this.setState({
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add()
  }
  removeDoc = (event, index) => {
    event.stopPropagation()
    this.props.remove(index)
  }
  handleRadioSwitch = (event, index) => {
    if(event.target.value === 'upload' && !this.props.rdr[index].document){
      this.props.editField(index, 'document', true)
    }
    else if(event.target.value === 'url' && this.props.rdr[index].document){
      this.props.editField(index, 'document', '')
    }
  }
  render(){
    const { isIATI } = getValidations(this.props.validations)
    const validationSets = getValidationSets(this.props.validations)
    const fieldExists = doesFieldExist(validationSets)
    const isOptional = isFieldOptional(validationSets)
    return (
      <div className="links view">
        <Form layout="vertical">
        <h3>Documents</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((doc, index) =>
          <Panel
            header={`Document ${index + 1}: ${doc.title ? doc.title : 'Untitled'}`}
            extra={<Icon type="delete" onClick={event => this.removeDoc(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter except={['document']} item={doc}>
              <Item>
                <Radio.Group value={doc.document ? 'upload' : 'url'} onChange={ev => this.handleRadioSwitch(ev, index)}>
                  <Radio.Button value="url">URL</Radio.Button>
                  <Radio.Button value="upload">Upload</Radio.Button>
                </Radio.Group>
                {!doc.document &&
                <Field index={index} name="url" control="input" placeholder="http://..." />
                }
                {doc.document &&
                <Upload.Dragger name="files" listType="picture" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <Icon type="picture" theme="twoTone" />
                  </p>
                  <p className="ant-upload-text">Drag file here</p>
                  <p className="ant-upload-hint">or click to browse from computer</p>
                  <p><small>Max: 5MB</small></p>
                </Upload.Dragger>
                }
              </Item>
              <Item label={<InputLabel optional tooltip="...">Title</InputLabel>}>
                <Field name="title" control="input" index={index} />
              </Item>
              {isIATI && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Title Language</InputLabel>}>
                      <Field index={index} name="titleLanguage" control="select" options={LANGUAGE_OPTIONS} showSearch optionFilterProp="children" />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Document Language</InputLabel>}>
                      <Field index={index} name="documentLanguage" control="select" options={LANGUAGE_OPTIONS} showSearch optionFilterProp="children" />
                    </Item>
                  </Col>
                </Row>
              )}
              <Row gutter={16}>
                {fieldExists('documentDate') && (
                <Col span={12}>
                  <Item label={<InputLabel optional>Document Date</InputLabel>}>
                    <Field index={index} name="documentDate" control="datepicker" />
                  </Item>
                </Col>
                )}
                {fieldExists('documentFormat') && (
                <Col span={12}>
                  <Item label={<InputLabel optional={isOptional('documentFormat')}>Format</InputLabel>}>
                    <Field index={index} name="documentFormat" control="select" options={FORMAT_OPTIONS} showSearch />
                  </Item>
                </Col>
                )}
              </Row>
              {fieldExists('categories') && <Categories docIndex={index} />}
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button
          className="bottom-btn"
          icon="plus"
          type="dashed"
          block
          onClick={this.addDoc}
        >
          Add another document
        </Button>
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ docsRdr, infoRdr: { validations } }) => ({ rdr: docsRdr, validations }),
  actions
)(Docs)
