import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Input, Button, Radio, Upload } from 'antd'

import InputLabel from '../../../utils/input-label'

import * as actions from './actions'
import './styles.scss'

const { Panel } = Collapse
const { Item } = Form

class Links extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeLinkKey: props.linksRdr.length > 0 ? `l${props.linksRdr.length - 1}` : 0,
      activeDocKey: props.docsRdr.length > 0 ? `d${props.docsRdr.length - 1}` : 0
    }
  }
  addLink = () => {
    this.setState({
      activeLinkKey: `l${this.props.linksRdr.length}`
    })
    this.props.addLink()
  }
  removeLink = (event, index) => {
    event.stopPropagation()
    this.props.removeLink(index)
  }
  addDoc = () => {
    this.setState({
      activeDocKey: `d${this.props.docsRdr.length}`
    })
    this.props.addDoc()
  }
  removeDoc = (event, index) => {
    event.stopPropagation()
    this.props.removeDoc(index)
  }
  handleRadioSwitch = (event, index) => {
    if(event.target.value === 'upload' && !this.props.docsRdr[index].document){
      this.props.editDocField(index, 'document', true)
    }
    else if(event.target.value === 'url' && this.props.docsRdr[index].document){
      this.props.editDocField(index, 'document', '')
    }
  }
  render(){
    return (
      <div className="links view">
        <h3>Links</h3>
        <Collapse accordion activeKey={this.state.activeLinkKey} onChange={(key) => { this.setState({ activeLinkKey: key }) }}>
        {this.props.linksRdr.map((link, index) =>
          <Panel
            header={`Link ${index + 1}: ${link.caption ? link.caption : 'Untitled'}`}
            extra={<Icon type="delete" onClick={event => this.removeLink(event, index)} />}
            key={`l${index}`}
          >
            <Form layout="vertical">
              <Item label={<InputLabel tooltip="...">URL</InputLabel>}>
                <Input placeholder="http://..." value={link.url} onChange={ev => this.props.editLinkField(index, 'url', ev.target.value)} />
              </Item>
              <Item label={<InputLabel optional tooltip="...">Caption</InputLabel>}>
                <Input value={link.caption} onChange={ev => this.props.editLinkField(index, 'caption', ev.target.value)} />
              </Item>
            </Form>
          </Panel>
        )}
        </Collapse>
        <Button
          className="bottom-btn"
          icon="plus"
          type="dashed"
          block
          onClick={this.addLink}
        >
          Add another link
        </Button>

        <h3>Documents</h3>
        <Collapse accordion activeKey={this.state.activeDocKey} onChange={(key) => { this.setState({ activeDocKey: key }) }}>
        {this.props.docsRdr.map((doc, index) =>
          <Panel
            header={`Document ${index + 1}: ${doc.title ? doc.title : 'Untitled'}`}
            extra={<Icon type="delete" onClick={event => this.removeDoc(event, index)} />}
            key={`d${index}`}
          >
            <Form layout="vertical">
              <Item>
                <Radio.Group value={doc.document ? 'upload' : 'url'} onChange={ev => this.handleRadioSwitch(ev, index)}>
                  <Radio.Button value="url">URL</Radio.Button>
                  <Radio.Button value="upload">Upload</Radio.Button>
                </Radio.Group>
                {!doc.document &&
                <Input placeholder="http://..." value={doc.url} onChange={ev => this.props.editDocField(index, 'url', ev.target.value)} />
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
                <Input value={doc.title} onChange={ev => this.props.editDocField(index, 'title', ev.target.value)} />
                {/* <div>
                  <Checkbox>Upload a file</Checkbox>
                </div> */}
              </Item>
            </Form>
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
      </div>
    )
  }
}

export default connect(
  ({ linksRdr, docsRdr }) => ({ linksRdr, docsRdr }),
  actions
)(Links)
