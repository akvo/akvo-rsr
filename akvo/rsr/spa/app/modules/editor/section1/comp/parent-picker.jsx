/* global fetch */
import React from 'react'
import { Form, Switch } from 'antd'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'

const { Item } = Form

class ParentPicker extends React.Component{
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
    return (
      <Item label={(
        <InputLabel
          tooltip="Check this box if you would like to indicate a related project that is not present in RSR. Instead, you will be able to fill in the IATI activity ID of the project."
          optional
          more={(
            <div className="more-switches">
              <FinalField
                name="isParentExternal"
                render={({input}) => <Switch size="small" {...input} />}
              />
              <span>External project</span>
            </div>
          )}
        >Parent
        </InputLabel>
      )}>
        <Condition when="isParentExternal" is={true}>
          <FinalField
            placeholder="IATI Identifier"
            name="parentId"
          />
        </Condition>
        <Condition when="isParentExternal" isNot={true}>
          <FinalField
            name="parentProject"
            control="select"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            options={this.state.projects.map(({id, title}) => ({ value: id, label: title }))}
          />
        </Condition>
      </Item>
    )
  }
}

export default ParentPicker
