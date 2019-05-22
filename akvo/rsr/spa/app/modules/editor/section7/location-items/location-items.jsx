import React from 'react'
import { Button, Form, Row, Col } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { Aux } from '../../../../utils/misc'
import { validationType } from '../../../../utils/validation-utils'
import SearchItem from './search-item'
import Administratives from './administratives'
import FEATURE_OPTIONS from './feature-options.json'
import '../styles.scss'

const { Item } = Form

const LocationItems = ({ validations, formPush }) => {
  const isIATI = validations.indexOf(validationType.IATI) !== -1
  return (
    <div>
      <h3>Sectors</h3>
      <ItemArray
        setName="locationItems"
        sectionIndex={7}
        header="Location $index"
        formPush={formPush}
        newItem={{ administratives: [{}]}}
        panel={name => (
          <Aux>
            <FinalField
              name={`${name}.location`}
              render={({ input }) => (
                <SearchItem
                  {...input}
                />
              )}
            />
            <Item label={<InputLabel optional>Address 1</InputLabel>}>
            <FinalField
              name={`${name}.address1`}
              control="input"
            />
            </Item>
            <Item label={<InputLabel optional>Address 2</InputLabel>}>
            <FinalField
              name={`${name}.address2`}
              control="input"
            />
            </Item>
            <Item label={<InputLabel optional>Postal code</InputLabel>}>
            <FinalField
              name={`${name}.postalCode`}
              control="input"
            />
            </Item>
            {isIATI && (
              <Aux>
                <Row gutter={16}>
                  <Col span={8}>
                    <Item label={<InputLabel optional>Name</InputLabel>}>
                    <FinalField
                      name={`${name}.name`}
                      control="input"
                    />
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item label={<InputLabel optional>Reference</InputLabel>}>
                    <FinalField
                      name={`${name}.reference`}
                      control="input"
                    />
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item label={<InputLabel optional>Code</InputLabel>}>
                    <FinalField
                      name={`${name}.code`}
                      control="input"
                    />
                    </Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Location description</InputLabel>}>
                    <FinalField
                      name={`${name}.locationDescription`}
                      control="textarea"
                      rows={3}
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Activity description</InputLabel>}>
                    <FinalField
                      name={`${name}.activityDescription`}
                      control="textarea"
                      rows={3}
                    />
                    </Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Location precision</InputLabel>}>
                    <FinalField
                      name={`${name}.locationPrecision`}
                      control="select"
                      options={[
                        {value: '1', label: 'Exact'},
                        {value: '2', label: 'Approximate'}
                      ]}
                      withEmptyOption
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Reach</InputLabel>}>
                    <FinalField
                      name={`${name}.reach`}
                      control="select"
                      options={[
                        {value: '1', label: 'Activity'},
                        {value: '2', label: 'Indended beneficiaries'}
                      ]}
                      withEmptyOption
                    />
                    </Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Class</InputLabel>}>
                    <FinalField
                      name={`${name}.class`}
                      control="select"
                      options={[
                        {value: '1', label: 'Administrative Region'},
                        {value: '2', label: 'Populated Place'},
                        {value: '3', label: 'Structure'},
                        {value: '4', label: 'Other Topographical Feature'}
                      ]}
                      withEmptyOption
                    />
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item label={<InputLabel optional>Feature designation</InputLabel>}>
                    <FinalField
                      name={`${name}.featureDesignation`}
                      control="select"
                      options={FEATURE_OPTIONS}
                      showSearch
                      optionFilterProp="children"
                      withEmptyOption
                    />
                    </Item>
                  </Col>
                </Row>
                <Administratives push={formPush} parentName={name} />
              </Aux>
            )}
          </Aux>
        )}
        addButton={({ onClick }) => (
          <Button onClick={onClick} icon="plus" type="dashed" block>
            Add location
          </Button>
        )}
      />
    </div>
  )
}

// class Locations extends React.Component{
//   state = {
//     activeKey: ''
//   }
//   constructor(props){
//     super(props)
//     if(props.rdr.length > 0){
//       this.state = {
//         activeKey: `${props.rdr.length - 1}`
//       }
//     }
//   }
//   add = () => {
//     this.setState({
//       activeKey: `${this.props.rdr.length}`
//     })
//     this.props.add()
//   }
//   remove = (event, index) => {
//     event.stopPropagation()
//     this.props.remove(index)
//   }
//   render(){
//     return (
//       <Aux>
//         <h3>Locations</h3>
//         <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
//         {this.props.rdr.map((item, index) =>
//           <Panel
//             header={`Location ${index + 1}`}
//             extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
//             key={`${index}`}
//           >
//             <UpdateHalter except={['city']} item={item}>
//             </UpdateHalter>
//           </Panel>
//         )}
//         </Collapse>
//       </Aux>
//     )
//   }
// }

export default LocationItems
