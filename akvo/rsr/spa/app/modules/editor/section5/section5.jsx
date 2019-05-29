import React from 'react'
import { Tabs, Form, Input, Button, Dropdown, Menu, Icon, Collapse, Divider, Col, Row, Switch, Radio, Tag } from 'antd'

import RTE from '../../../utils/rte'
import FinalField from '../../../utils/final-field'
import './styles.scss'

const { TabPane } = Tabs
const { Item } = Form
const { Panel } = Collapse

const resultTypesMenu = (
  <Menu>
    <Menu.Item key="0">
      <Icon type="plus" style={{ color: '#fa8c16' }} />
      Input
    </Menu.Item>
    <Menu.Item key="1">
    <Icon type="plus" style={{ color: '#1890ff'}} />
      Activity
    </Menu.Item>
    <Menu.Item key="3"><Icon type="plus" style={{ color: '#52c41a'}} />Output</Menu.Item>
    <Menu.Item key="4"><Icon type="plus" style={{ color: '#13c2c2'}} />Outcome</Menu.Item>
    <Menu.Item key="5"><Icon type="plus" style={{ color: '#eb2f96'}} />Impact</Menu.Item>
  </Menu>
)

const indicatorTypesMenu = (
  <Menu>
    <Menu.Item key="0">
      Quantitative Indicator
    </Menu.Item>
    <Menu.Item key="1">
      Qualitative Indicator
    </Menu.Item>
  </Menu>
)

const renderTabBar = (props, DefaultTabBar) => {
  return (
    // <Sticky bottomOffset={80}>
    //   {({ style }) => (
      <div className="ant-tabbar-wrapper">
        <DefaultTabBar {...props} />
        {/* <Button>add</Button> */}
        <div className="ant-tabs-extra-content">
          <Dropdown overlay={indicatorTypesMenu} trigger={['click']}>
            <span><Icon type="plus" className="ant-tabs-new-tab" /></span>
          </Dropdown>
        </div>
      </div>
        // <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    //   )}
    // </Sticky>
  )
}

const QualitativeIndicator = () => (
  <Tabs>
    <TabPane tab="Info" key="1">
      <Item label="Title">
        <Input />
      </Item>
      <Row gutter={16}>
        <Col span={12}>
          <Item label="Measure">
            <Radio.Group value>
              <Radio.Button value>Unit</Radio.Button>
              <Radio.Button>Percentage</Radio.Button>
            </Radio.Group>
          </Item>
        </Col>
        <Col span={12}>
          <Item label="Order">
            <Radio.Group value>
              <Radio.Button value>Ascending</Radio.Button>
              <Radio.Button>Descending</Radio.Button>
            </Radio.Group>
          </Item>
        </Col>
      </Row>
      <Item label="Description">
        <RTE />
      </Item>
    </TabPane>
    <TabPane tab="Baseline" key="3">
      <Row gutter={15}>
        <Col span={12}>
          <Item label="Baseline year">
            <Input />
          </Item>
        </Col>
        <Col span={12}>
          <Item label="Baseline value">
            <Input />
          </Item>
        </Col>
      </Row>
      <Item label="Baseline comment">
        <RTE />
      </Item>
    </TabPane>
    <TabPane tab="Periods" key="4">
      <Collapse accordion defaultActiveKey="1">
        <Panel header="Period 01" key="1">
          <Row gutter={16}>
            <Col span={12}>
              <Item label="Start">
                <FinalField
                  name="start"
                  control="datepicker"
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item label="End">
                <FinalField
                  name="end"
                  control="datepicker"
                />
              </Item>
            </Col>
          </Row>
          <Item label="Target value">
            <Input />
          </Item>
          <Item label="Comment">
            <RTE />
          </Item>
        </Panel>
      </Collapse>
      <Button icon="plus" block type="dashed">Add period</Button>
    </TabPane>
  </Tabs>
)

const Section5 = () => {
  return (
    <div className="view section5">
      <div className="summary">
        <ul>
          <li>Inputs<strong>0</strong></li>
          <li>Activities<strong>0</strong></li>
          <li>Outputs<strong>0</strong></li>
          <li>Outcomes<strong>1</strong></li>
          <li>Impacts<strong>1</strong></li>
        </ul>
        <Button type="link" icon="eye">Full preview</Button>
      </div>
      <Collapse accordion>
        <Panel key="1" header={<span><Tag color="cyan">Outcome</Tag>Result title here</span>} extra={<Icon type="delete" />}>
          <div className="main-form">
          <Item label="Title" style={{ flex: 1 }}>
            <Input />
          </Item>
          <div style={{ display: 'flex' }}>
          <Item label="Description" style={{ flex: 1 }}>
            <RTE />
          </Item>
          <Item label="Enable aggregation" style={{ marginLeft: 16 }}>
            {/* <Switch /> */}
            <Radio.Group value>
              <Radio.Button value>Yes</Radio.Button>
              <Radio.Button>No</Radio.Button>
            </Radio.Group>
          </Item>
          </div>
          <div className="ant-form-item-label">Indicators:</div>
          </div>
          {/* <Divider /> */}
          <Tabs tabPosition="left" type="editable-card" hideAdd renderTabBar={renderTabBar}>
            <TabPane tab="Indicator 01 - Qualitative" key="1">
              <QualitativeIndicator />
            </TabPane>
            <TabPane tab="Indicator 02 - Quantitative" key="2">
              <Tabs>
                <TabPane tab="Info" key="1">
                  <Item label="Title">
                    <Input />
                  </Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Item label="Measure">
                        <Radio.Group value>
                          <Radio.Button value>Unit</Radio.Button>
                          <Radio.Button>Percentage</Radio.Button>
                        </Radio.Group>
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="Order">
                        <Radio.Group value>
                          <Radio.Button value>Ascending</Radio.Button>
                          <Radio.Button>Descending</Radio.Button>
                        </Radio.Group>
                      </Item>
                    </Col>
                  </Row>
                  <Item label="Description">
                    <RTE />
                  </Item>
                </TabPane>
                <TabPane tab="Disaggregations" key="2">
                  <Collapse accordion defaultActiveKey="1">
                    <Panel header="Disaggregation 01" key="1">
                      <Item label="Name">
                        <Input />
                      </Item>
                      <section>
                        <div className="h-holder">
                          <h5>Disaggregation item 1</h5>
                        </div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Item label="Name">
                              <Input />
                            </Item>
                          </Col>
                          <Col span={12}>
                            <Item label="Value">
                              <Input />
                            </Item>
                          </Col>
                        </Row>
                      </section>
                      <Button icon="plus">Add disaggregation item</Button>
                    </Panel>
                  </Collapse>
                  <Button icon="plus" block type="dashed">Add disaggregation</Button>
                </TabPane>
                <TabPane tab="Baseline" key="3">
                  <Row gutter={15}>
                    <Col span={12}>
                      <Item label="Baseline year">
                        <Input />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="Baseline value">
                        <Input />
                      </Item>
                    </Col>
                  </Row>
                  <Item label="Baseline comment">
                    <RTE />
                  </Item>
                </TabPane>
                <TabPane tab="Periods" key="4">
                  <Collapse accordion defaultActiveKey="1">
                    <Panel header="Period 01" key="1">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Item label="Start">
                            <FinalField
                              name="start"
                              control="datepicker"
                            />
                          </Item>
                        </Col>
                        <Col span={12}>
                          <Item label="End">
                            <FinalField
                              name="end"
                              control="datepicker"
                            />
                          </Item>
                        </Col>
                      </Row>
                      <Item label="Target value">
                        <Input />
                      </Item>
                      <Item label="Comment">
                        <RTE />
                      </Item>
                    </Panel>
                  </Collapse>
                  <Button icon="plus" block type="dashed">Add period</Button>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
          {/* <Button icon="plus">Add Indicator</Button> */}
        </Panel>
        <Panel key="2" header={<span><Tag color="magenta">Impact</Tag>Another result here</span>} extra={<Icon type="delete" />}>
          <Item label="Title">
            <Input />
          </Item>
          <Item label="Aggregation status">
            <Input />
          </Item>
          <Item label="Description">
            <RTE />
          </Item>
          <Button icon="plus">Add Indicator</Button>
        </Panel>
      </Collapse>
      <Dropdown overlay={resultTypesMenu} trigger={['click']}>
        <Button icon="plus" className="add-result" size="large">Add Result</Button>
      </Dropdown>
    </div>
  )
}

export default Section5
