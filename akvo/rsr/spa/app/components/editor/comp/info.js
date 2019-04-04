import React from 'react'
import {
  Form, Input, Switch, Icon, Tooltip, Slider, DatePicker, Select, Upload
} from 'antd'
import currencies from 'currency-codes/data'

const { Item } = Form
const { RangePicker } = DatePicker
const { Option } = Select

const statuses = [
  'Identification', 'Implementation', 'Completion', 'Post-completion'// , 'Canceled', 'Suspended'
]
const marks = {}
statuses.forEach((status, index) => { marks[index + 1] = { style: { fontSize: 11, marginTop: 6, whiteSpace: 'nowrap' }, label: status } })

const languages = [{ label: 'English', code: 'en'}, { label: 'German', code: 'de' }, { label: 'Spanish', code: 'es' }, { label: 'French', code: 'fr' }, { label: 'Dutch', code: 'nl' }, { label: 'Russian', code: 'ru' }]

const Info = () => (
  <div className="info view">
    <Form layout="vertical">
      <Item label="Project title" validateStatus="success" hasFeedback>
        <Input />
      </Item>
      <Item label={(
        <span className="status-label">
          <div>
            Parent project <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip>
            <span className="optional"> -  optional</span>
          </div>
          <div className="suspend-switches">
            <Switch size="small" /><span>External project <Tooltip title="Not in RSR"><Icon type="info-circle" /></Tooltip></span>
          </div>
        </span>)}
      >
        <Input placeholder="IATI identifier" />
      </Item>
      <Item label={(
        <span className="status-label">
          <div>Status <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip></div>
          <div className="suspend-switches">
            <Switch size="small" className="switch-suspend" /><span>Suspended</span>
          </div>
        </span>)}
      >
        <div style={{ margin: '0 20px' }}><Slider marks={marks} max={4} min={1} /></div>

      </Item>
      <Item label={(<span>Planned duration <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip></span>)}>
        <RangePicker />
      </Item>
      <Item label={(<span>Actual duration <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip></span>)}>
        <RangePicker />
      </Item>
      <Item label={(
        <span>
          Currency <Tooltip title="The default currency for this project. Used in all financial aspects of the project."><Icon type="info-circle" /></Tooltip>
          <span className="optional"> -  optional</span>
        </span>)}
      >
        <Select showSearch>
          {currencies.map(({ code, currency }) => <Option value={`${code} - ${currency}`}>{code} - {currency}</Option>)}
        </Select>
      </Item>
      <Item label={(
        <span>
          Language <Tooltip title="Enter the language used when entering the details for this project."><Icon type="info-circle" /></Tooltip>
          <span className="optional"> -  optional</span>
        </span>)}
      >
        <Select>
          {languages.map(({ code, label }) => <Option value={code}>{label}</Option>)}
        </Select>
      </Item>

      <hr />

      <h3>Project photo</h3>
      <Item label={(
        <span>
          Photo <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip>
        </span>)}
      >
        <Upload.Dragger name="files" listType="picture" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <Icon type="picture" theme="twoTone" />
          </p>
          <p className="ant-upload-text">Drag file here</p>
          <p className="ant-upload-hint">or click to browse from computer</p>
        </Upload.Dragger>
      </Item>

      <Item label={(
        <span>
          Photo credit <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip>
          <span className="optional"> -  optional</span>
        </span>)}
      >
        <Input />
      </Item>

      <Item label={(
        <span>
          Photo caption <Tooltip title="What does this mean?"><Icon type="info-circle" /></Tooltip>
          <span className="optional"> -  optional</span>
        </span>)}
      >
        <Input />
      </Item>
    </Form>
  </div>
)

export default Info
