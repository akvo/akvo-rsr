import React from 'react'
import { Card, Typography, Col, Row, Skeleton, Button, Spin, Divider } from 'antd'
import { Link } from 'react-router-dom'
import SimpleMarkdown from 'simple-markdown'
import moment from 'moment'
import { uniq } from 'lodash'
import { Stories } from '../components/Stories'
import InfoGraphic from '../components/InfoGraphic'
import { setNumberFormat } from '../../../utils/misc'
import { queryResults } from '../data/queries'
import config from '../config'

const { Text, Title } = Typography

const Home = ({
  user,
  funds,
  projects,
  indicators,
  countries,
  stories,
  setMenuKey,
  statusLabel: status,
  dateStartActual: start,
  dateEndPlanned: end,
  projectPlanSummary: summary
}) => {
  const { data, error } = queryResults()
  if (data) {
    projects = uniq(data.flatMap((d) => Object.values(d.contributors)))
    indicators = uniq(data.flatMap((d) => d.indicatorTitles))
  }
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultReactOutput
  return (
    <div id="home">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            hoverable
            className="card-left"
            cover={(
              <div
                style={{
                  height: 415,
                  backgroundImage: 'url("https://www.unicef.org/sites/default/files/styles/hero_desktop/public/2021-HAC-ESA.jpg?itok=GN5Zfb-r")',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100%'
                }}
              >
                &nbsp;<small style={{ color: '#eee' }}>&copy; UNICEF/2020/Spatari</small>
              </div>
            )}
          >
            <Skeleton paragraph={{ rows: 3 }} loading={!user.status} active>
              <Title level={4}>
                The second phase of the accelerated Water and Sanitation for All Programme (DGIS-ASWA II) was launched on September 26, 2019 in Bamako, Mali.
              </Title>
              <Text>Nearly one million Malian farmers have benefited from DGIS-ASWA. DGIS-ASWA is a UNICEF Programme that aims to improve the health, nutrition and well-being of vulnerable people, especially women and girls, in rural areas.</Text>
            </Skeleton>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="card-right">
            <Skeleton paragraph={{ rows: 6 }} loading={!user.status} active>
              <Row>
                <Col>
                  <Text className="text-green-muted" strong>Program description</Text>
                  <span>{mdOutput(parse(summary))}</span>
                  <Text className="text-green-muted" strong>Status</Text>
                  <h5>{status}</h5>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text className="text-green-muted" strong>Start Date</Text>
                      <h5>{moment(start, 'YYYY-MM-DD').format('DD/MM/YYYY')}</h5>
                    </Col>
                    <Col span={12}>
                      <Text className="text-green-muted" strong>End Date</Text>
                      <h5>{moment(end, 'YYYY-MM-DD').format('DD/MM/YYYY')}</h5>
                    </Col>
                  </Row>
                  <Text className="text-green-muted" strong>Organisation Role</Text>
                  <h5>Funding Partner</h5>
                  <Text className="text-green-muted" strong>Project Partner</Text>
                  <h5>UNICEF</h5>
                  <Text className="text-green-muted" strong>Funding Amount</Text>
                  <h5>$ {setNumberFormat(funds)}</h5>
                </Col>
              </Row>
            </Skeleton>
            <div className="wcaro-footer">
              <Row>
                <Col span={20} offset={2}>
                  <Row>
                    <Col span={8}>
                      <Title>{error ? config.AMOUNT_PROJECT : projects ? projects.length : <Spin />}</Title>
                      <Text id="infographic">PROJECTS</Text>
                    </Col>
                    <Col span={8}>
                      <Title>{(projects && countries) ? countries.length : <Spin />}</Title>
                      <Text>COUNTRIES</Text>
                    </Col>
                    <Col span={8}>
                      <Title>{error ? config.AMOUNT_INDICATORS : indicators ? indicators.length : <Spin />}</Title>
                      <Text>INDICATORS</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="text-center" style={{ padding: 16, marginTop: 16 }}>
                  <Link to="/dir/map">
                    <Button onClick={() => setMenuKey('global')} type="link" size="large">
                      INSPECT THE FRAMEWORK
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <Divider dashed />
      <InfoGraphic {...{ countries }} />
      <Divider dashed />
      <Stories {...{ ...stories }} />
    </div>
  )
}

export default Home
