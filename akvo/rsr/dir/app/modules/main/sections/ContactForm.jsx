import React from 'react'
import { Row, Col, Input, Button, Typography, Form } from 'antd'
import { Container } from 'react-awesome-styled-grid'
import styled from 'styled-components'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Title } from '../../components/rsr'
import { homePage } from '../../../utils/ui-text'
import { setValues } from '../../../features/request-demo/requestDemoSlice'

const { Paragraph } = Typography

const Wrapper = styled.div`
  margin: 0 auto;
  @media (min-width: 320px) and (max-width: 576px) {
    max-width: 210px;
  }
  @media (max-width: 320px) {
    max-width: 210px;
  } 
`

const ContactForm = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Your email is required'),
    }),
    onSubmit: values => {
      dispatch(setValues(values))
      history.push('/dir/schedule-demo')
    },
  })
  const { contactUs } = homePage
  return (
    <Row type="flex" justify="center" id="rsr-contact-form">
      <Col lg={12}>
        <Wrapper>
          <Title as="h1" type="bold" color="#fff" align="center">
            {contactUs.title}
          </Title>
        </Wrapper>
        <Container>
          <Paragraph className="text-center">
            {contactUs.description}
          </Paragraph>
        </Container>
        <Form onFinish={formik.handleSubmit} method="post">
          <Row type="flex" justify="center" className="mb-3">
            <Col lg={16} md={16} sm={20} xs={20} className="text-left">
              <Input.Group className="w-full" size="large">
                <Row>
                  <Col lg={20} md={20} sm={14} xs={14}>
                    <Form.Item
                      help={(formik.touched.email && formik.errors.email) && formik.errors.email}
                    >
                      <input
                        id="emailAddress"
                        name="email"
                        className="ant-input"
                        type="email"
                        placeholder="Work email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4}>
                    <Button htmlType="submit" type="primary" size="large">{contactUs.cta}</Button>
                  </Col>
                </Row>
              </Input.Group>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default ContactForm
