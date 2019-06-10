/* global fetch */
import React from 'react'
import { Form, Button, Row, Col, Checkbox, Icon } from 'antd'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'
import ItemArray from '../../../../utils/item-array'

const { Item } = Form

class ProjectPicker extends React.Component{
  state = {
    projects: []
  }
  componentWillMount(){
    fetch('/rest/v1/typeaheads/projects?format=json')
      .then(d => d.json())
      .then(({ results }) => {
        this.setState({
          projects: results
        })
      })
  }
  render() {
    const { fieldName } = this.props
    return (
      <Item label={(
        <InputLabel
          tooltip="Check this box if you would like to indicate a related project that is not present in RSR. Instead, you will be able to fill in the IATI activity ID of the project."
          optional
        >Parent
        </InputLabel>
      )}>
        <Condition when={`${fieldName}.isParentExternal`} is={true}>
          <FinalField
            placeholder="IATI Identifier"
            name={`${fieldName}.iatiId`}
          />
        </Condition>
        <Condition when={`${fieldName}.isParentExternal`} isNot={true}>
          <FinalField
            name={`${fieldName}.projectId`}
            control="select"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            options={this.state.projects.map(({id, title}) => ({ value: id, label: title }))}
          />
        </Condition>
        <FinalField
          name={`${fieldName}.isParentExternal`}
          render={({input}) => <Checkbox {...input} className="related-project-checkbox"><span>Related project is not present in RSR <Icon type="info-circle" /></span></Checkbox>}
        />
      </Item>
    )
  }
}

const RelatedProjects = ({ formPush }) => {
  return (
    <div>
    <div className="ant-col ant-form-item-label related-projects-label">
      <InputLabel optional tooltip="asd">Related projects</InputLabel>
    </div>
    <ItemArray
      setName="relatedProjects"
      sectionIndex={1}
      header="Related project $index"
      formPush={formPush}
      panel={name => (
        <Row gutter={16}>
          <Col span={16}>
            <ProjectPicker fieldName={name} />
          </Col>
          <Col span={8}>
            <Item
              label={<InputLabel>Relation</InputLabel>}
            >
              <FinalField
                control="select"
                name={`${name}.relation`}
                options={[
                  { value: 1, label: 'Parent' },
                  { value: 2, label: 'Child'},
                  { value: 3, label: 'Sibling'},
                  { value: 4, label: 'Co-founded'},
                  { value: 5, label: 'Third-party'}
                ]}
              />
            </Item>
          </Col>
        </Row>
      )}
      addButton={({onClick}) => <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add a related project</Button>}
    />
    </div>
  )
}

export default RelatedProjects
