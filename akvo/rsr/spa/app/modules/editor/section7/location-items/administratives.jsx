import React from 'react'
import { Form, Row, Col } from 'antd'

import ItemArrayTabs from '../../../../utils/item-array-tabs'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import VOCABULARY_OPTIONS from './admin-vocab-options.json'

const { Item } = Form

const Administratives = ({push, parentName}) => {
  return (
    <div>
      <ItemArrayTabs
        name={`${parentName}.administratives`}
        tabName="Administrative"
        push={push}
        pane={name => (
          <div>
          <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
          <FinalField
            name={`${name}.vocabulary`}
            control="select"
            options={VOCABULARY_OPTIONS}
            withEmptyOptions
          />
          </Item>
          <Row gutter={16}>
            <Col span={12}>
              <Item label={<InputLabel optional>Administrative code</InputLabel>}>
              <FinalField
                name={`${name}.code`}
                control="input"
              />
              </Item>
            </Col>
            <Col span={12}>
              <Item label={<InputLabel optional>Level</InputLabel>}>
              <FinalField
                name={`${name}.level`}
                control="input"
              />
              </Item>
            </Col>
          </Row>
          </div>
        )}
      />
    </div>
  )
}


export default Administratives
