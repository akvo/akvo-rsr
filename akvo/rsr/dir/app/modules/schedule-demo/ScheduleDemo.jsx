/* global document */
import React, { useState, useEffect } from 'react'
import { Col, Form, Row, Typography, Switch, Modal, Result, Button, message } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'

import '../../styles/schedule-demo.scss'
import api from '../../utils/api'
import { RsrLayout } from '../components/layout'
import Section from '../components/Section'
import RsrButton from '../components/RsrButton'

const { Title, Text } = Typography

const ScheduleDemo = () => {
  const [checked, setChecked] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const history = useHistory()
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      akvoHub: '',
      message: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('First name is required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Work email is required'),
      phone: Yup.string().max(15, 'Must be 15 characters or less'),
      akvoHub: Yup.string().required('Akvo Hub is required'),
      message: Yup.string().required('Your message is required')
    }),
    onSubmit: values => {
      api
        .post('demo_request', values)
        .then(() => {
          setLoading(false)
          setModalVisible(true)
        })
        .catch(() => {
          setLoading(false)
          message.error('Something went wrong')
        })
    },
  })
  const validFirstName = formik.touched.firstName ? formik.errors.firstName ? 'error' : 'success' : ''
  const validLastName = formik.touched.lastName ? formik.errors.lastName ? 'error' : 'success' : ''
  const validEmail = formik.touched.email ? formik.errors.email ? 'error' : 'success' : ''
  const validPhone = formik.touched.phone ? formik.errors.phone ? 'error' : 'success' : ''
  const validAkvoHub = formik.touched.akvoHub ? formik.errors.akvoHub ? 'error' : 'success' : ''
  const validMessage = formik.touched.message ? formik.errors.message ? 'error' : 'success' : ''
  const akvoHubItems = [
    'Akvo Americas',
    'Akvo East Africa',
    'Akvo West Africa – Burkina Faso', 'Akvo West Africa – Mali',
    'Akvo Europe',
    'Akvo Asia'
  ]

  useEffect(() => {
    document.title = 'Schedule demo | Akvo RSR'
  }, [])
  return (
    <RsrLayout.Main id="rsr-schedule-demo">
      <RsrLayout.Header.WithLogo
        className="rsr-header"
        left={[3, 3, 6, 8, 8]}
        right={[21, 21, 18, 16, 16]}
      />
      <Section>
        <Modal
          closable={false}
          visible={modalVisible}
          footer={null}
          afterClose={() => {
            setModalVisible(false)
            history.push('/')
          }}
        >
          <Result
            status="success"
            title="Thank You!"
            subTitle={'We\'ll contact you shortly to schedule your RSR demo'}
            extra={(
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setModalVisible(false)
                  history.push('/')
                }}
              >
                Got it!
              </Button>
            )}
          />
        </Modal>
        <Row type="flex" justify="space-between" align="top">
          <Col xl={8} lg={8} md={8} sm={24} xs={24} className="rsr-hero">
            <h1 className="text-6xl">
              <mark>Really</mark>
            </h1>
            <h1 className="text-6xl">
              <mark>Simple</mark>
            </h1>
            <h1 className="text-6xl">
              <mark>Reporting</mark>
            </h1>
          </Col>
          <Col xl={14} lg={14} md={15} sm={24} xs={24} className="rsr-form">
            <Title level={2}>About you</Title>
            <Form onSubmit={formik.handleSubmit} method="post">
              <Row gutter={[8, 8]}>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    hasFeedback
                    validateStatus={validFirstName}
                    help={(formik.touched.firstName && formik.errors.firstName) && formik.errors.firstName}
                  >
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="ant-input"
                      placeholder="First name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    hasFeedback
                    validateStatus={validLastName}
                    help={(formik.touched.lastName && formik.errors.lastName) && formik.errors.lastName}
                  >
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="ant-input"
                      placeholder="Last name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                    />
                  </Form.Item>
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    hasFeedback
                    validateStatus={validEmail}
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
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    validateStatus={validPhone}
                    help={(formik.touched.phone && formik.errors.phone) && formik.errors.phone}
                  >
                    <input
                      id="phoneNumber"
                      name="phone"
                      className="ant-input"
                      type="text"
                      placeholder="Phone number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                    />
                  </Form.Item>
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    hasFeedback
                    validateStatus={validAkvoHub}
                    help={(formik.touched.akvoHub && formik.errors.akvoHub) && formik.errors.akvoHub}
                  >
                    <select
                      id="akvoHub"
                      name="akvoHub"
                      className="ant-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.akvoHub}
                    >
                      <option value="">Which Akvo hub should contact you?</option>
                      {akvoHubItems.map((op, ox) => <option key={ox} value={op}>{op}</option>)}
                    </select>
                  </Form.Item>
                </Col>
              </Row>
              <Row className="input-description">
                <Col>
                  <Title level={4}>{'Tell us why you\'d like to get in touch'}</Title>
                  <Text type="secondary">{'The more specific you are, the better we\'ll be able to help'}</Text>
                </Col>
                <Col>
                  <Form.Item
                    hasFeedback
                    validateStatus={validMessage}
                    help={(formik.touched.message && formik.errors.message) && formik.errors.message}
                  >
                    <textarea
                      name="message"
                      id="message"
                      className="ant-input"
                      rows="3"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      defaultValue={formik.values.message}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 16]}>
                <Col xl={1} lg={2} md={2} sm={2} xs={2}>
                  <Switch
                    size="small"
                    checked={checked}
                    onChange={setChecked}
                  />
                </Col>
                <Col xl={17} lg={16} md={16} sm={22} xs={22}>
                  <Text>
                    By selecting this you agree to the&nbsp;
                    <a href="https://akvo.org/general-privacy-policy/" target="_blank" rel="noopener noreferrer">
                      <u><strong>Privacy Policy</strong></u>
                    </a>
                    &nbsp;and&nbsp;
                    <a href="https://akvo.org/policies/" target="_blank" rel="noopener noreferrer">
                      <u><strong>Cookie Policy</strong></u>
                    </a>
                  </Text>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                  <RsrButton.External
                    type="submit"
                    className={classNames({ active: checked })}
                    disabled={!(checked)}
                    loading={loading}
                    onClick={() => {
                      setLoading(true)
                    }}
                    block
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </RsrButton.External>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Section>
    </RsrLayout.Main>
  )
}

export default ScheduleDemo
