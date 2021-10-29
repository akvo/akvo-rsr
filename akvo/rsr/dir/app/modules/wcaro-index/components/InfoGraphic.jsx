import React from 'react'
import { Typography, Col, Row, Icon, Card, Divider } from 'antd'
import SVGInline from 'react-svg-inline'
import countryIcon from '../../../images/country.svg'
import familyIcon from '../../../images/family.svg'
import handWashIcon from '../../../images/hand-wash.svg'
import keyNumbers from '../../../images/key-numbers.svg'
import waterTap from '../../../images/water-tap.svg'
import { setNumberFormat } from '../../../utils/misc'

const { Title } = Typography

const InfoGraphic = ({ countries }) => (
  <Card bordered={false}>
    <Row>
      <Col span={8} style={{ padding: 16 }}>
        <Row gutter={[8, 8]}>
          <Col span={11}>
            <SVGInline svg={countryIcon} />
          </Col>
          <Col span={13} className="text-left">
            <h1 style={{ marginBottom: 0, color: '#357594', fontSize: 54 }}>{countries ? countries.length : '...'}</h1>
            <h4 style={{ marginBottom: 0, color: '#357594', fontSize: 24 }}>COUNTRIES IMPACTED</h4>
            <strong style={{ color: '#357594', fontSize: 18 }}>BY 2023</strong>
          </Col>
        </Row>
      </Col>
      <Col span={8} style={{ padding: 16 }}>
        <Row gutter={[8, 8]}>
          <Col span={12} className="text-right">
            <h1 style={{ marginBottom: 0, color: '#DC874A', fontSize: 24, fontWeight: 'bold' }}>{setNumberFormat(26000000)}</h1>
            <h4 style={{ marginBottom: 0, color: '#DC874A', fontSize: 28 }}>PEOPLE IMPACTED</h4>
            <strong style={{ color: '#DC874A', fontSize: 18 }}>BY 2023</strong>
          </Col>
          <Col span={10} style={{ paddingLeft: 15, display: 'flex', justifyContent: 'start' }}>
            <SVGInline svg={familyIcon} width="100%" />
          </Col>
        </Row>
      </Col>
      <Col span={8} style={{ padding: 16 }}>
        <Row gutter={[8, 8]}>
          <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
            <SVGInline svg={handWashIcon} />
          </Col>
          <Col span={16} className="text-left">
            <h1 style={{ marginBottom: 0, color: '#867FD1', fontSize: 24, fontWeight: 'bold' }}>{setNumberFormat(26000000)}</h1>
            <h4 style={{ marginBottom: 0, color: '#867FD1', fontSize: 28 }}>TO HAVE IMPROVED SANITATION</h4>
            <strong style={{ color: '#867FD1', fontSize: 16 }}>BY 2023</strong>
          </Col>
        </Row>
      </Col>
    </Row>
    <Divider dashed />
    <Row style={{ marginTop: 24, marginBottom: 24 }}>
      <Col span={12}>
        <Row gutter={[8, 8]}>
          <Col span={2} />
          <Col span={5} style={{ display: 'flex', justifyContent: 'end' }}>
            <SVGInline svg={waterTap} />
          </Col>
          <Col span={12} className="text-left">
            <h1 style={{ marginBottom: 0, fontSize: 28, fontWeight: 'bold' }}>{setNumberFormat(26000000)}</h1>
            <h4 style={{ marginBottom: 0, fontSize: 24 }}>TO HAVE ACCESS TO SAFE DRINKING WATER</h4>
            <strong style={{ fontSize: 18 }}>BY 2023</strong>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row
          gutter={[16, 16]}
          style={{
            backgroundColor: '#F7FBFD',
            border: '1px solid #3E8CB4',
            borderRadius: 10
          }}
        >
          <Col span={6}>
            <SVGInline svg={keyNumbers} height="125px" width="100%" />
          </Col>
          <Col span={14} style={{ display: 'flex', minHeight: 150 }}>
            <Title level={3} style={{ textTransform: 'uppercase', margin: 'auto', color: '#62ABD5' }}>
              find out more about key numbers
            </Title>
          </Col>
          <Col span={4} style={{ display: 'flex', minHeight: 150 }}>
            <div style={{ margin: 'auto' }}>
              <Icon
                type="right"
                style={{
                  fontSize: 24,
                  color: '#62ABD5',
                  borderRadius: '50%',
                  border: '3px solid #62ABD5',
                  backgroundColor: '#fff',
                  padding: 8
                }}
              />
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  </Card>
)

export default InfoGraphic
