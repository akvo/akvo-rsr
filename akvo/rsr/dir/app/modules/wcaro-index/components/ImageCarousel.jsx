import { Button, Col, Row, Typography } from 'antd'
import React from 'react'

const { Text, Title } = Typography

export const ImageCarousel = ({ src }) => {
  return (
    <Row style={{ backgroundColor: '#ffffff' }}>
      <Col lg={14} sm={24}>
        <div
          style={{
            width: '100%',
            height: '406px',
            background: `transparent url("${src}") 0% 0% no-repeat padding-box`,
            backgroundSize: 'cover',
            opacity: '1'

          }}
        />
      </Col>
      <Col lg={10} sm={24} style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'justify' }}>
          <Title level={4}>The second phase of the accelerated Water and Sanitation for All Programme (DGIS-ASWA II) was launched on September 26, 2019 in Bamako, Mali.</Title>
          <br />
          <Text>Nearly one million Malian farmers have benefited from DGIS-ASWA. DGIS-ASWA is a UNICEF Programme that aims to improve the health, nutrition and well-being of vulnerable people, especially women and girls, in rural areas.</Text>
          <br />
        </div>
        <div style={{ textAlign: 'center', padding: '3em' }}>
          <Button type="primary">
            INSPECT THE DATA
          </Button>
        </div>
      </Col>
    </Row>
  )
}
