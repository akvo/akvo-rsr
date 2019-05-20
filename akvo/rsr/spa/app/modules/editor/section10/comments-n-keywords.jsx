import React from 'react'
import { connect } from 'react-redux'
import { Form, Select, Icon, Button } from 'antd'

import InputLabel from '../../../utils/input-label'
import RTE from '../../../utils/rte'
import * as actions from './actions'
import availableKeywords from './temp-keywords.json'

import './styles.scss'

const { Item } = Form
const { Option } = Select

const Comp = ({ keywordsRdr, commentsRdr, ...props }) => (
  <div className="comments-n-keywords view">
    <Form layout="vertical">
      <Item label={<InputLabel optional tooltip="...">Comments</InputLabel>}>
        <RTE value={commentsRdr} onChange={value => props.editComments(value)} />
      </Item>

      <h3>Keywords</h3>
      {keywordsRdr.map((keyword, index) =>
        <div className="keyword-item">
          <Item label={<InputLabel optional tooltip="..." more={<Icon type="delete" onClick={() => props.removeKeyword(index)} />}>Label</InputLabel>}>
            <Select
              showSearch
              optionFilterProp="children"
              value={keyword}
              onChange={value => props.editKeyword(index, value)}
            >
              {availableKeywords.map(option =>
              <Option value={option.id}>{option.label}</Option>
              )}
            </Select>
          </Item>
        </div>
      )}
      <Button className="bottom-btn" block icon="plus" type="dashed" onClick={props.addKeyword}>Add keyword</Button>
    </Form>
  </div>
)

export default connect(
  ({ commentsRdr, keywordsRdr }) => ({ commentsRdr, keywordsRdr }),
  actions
)(Comp)
