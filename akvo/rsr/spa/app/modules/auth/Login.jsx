/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import { Form, Input, Icon, Button, Alert, Typography, Row, Col } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import AuthLayout from './AuthLayout'
import loginSchema from './validators/login'
import { validateFormValues } from '../../utils/validation-utils'
import api from '../../utils/api'

const { Text } = Typography

const Login = ({ dispatch, user }) => {
  const [alert, setAlert] = useState(null)
  const history = useHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (user?.id) {
      history.push('/')
    }
  }, user)

  const onSubmitLogin = async credentials => {
    await axios({
      url: '/auth/login/',
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data: credentials
    })
      .then(() => {
        api.get('/me')
          .then(({ data }) => {
            dispatch({ type: 'SET_USER', user: data })
          })
        setAlert(null)
        history.push('/')
      }).catch(() => {
        setAlert('Please enter a correct username and password')
      })
  }

  return (
    <AuthLayout>
      <h2 className="login-title">Sign In</h2>
      {
        alert && (
          <Alert
            message={alert}
            type="warning"
            closable
            style={{ marginBottom: '2em' }}
          />
        )
      }
      <FinalForm
        onSubmit={onSubmitLogin}
        validate={validateFormValues(loginSchema)}
        render={({ handleSubmit, submitting, pristine }) => (
          <Form onSubmit={handleSubmit} className="login-form" layout="vertical">
            <Field
              name="username"
              render={({ input, meta }) => {
                return (
                  <Form.Item
                    hasFeedback
                    validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                    help={` ${meta?.error && meta.touched ? meta.error : ''}`}
                    label="E-MAIL"
                  >
                    <Input
                      type="email"
                      prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Your E-mail"
                      {...input}
                    />
                  </Form.Item>
                )
              }}
            />
            <Field
              name="password"
              render={({ input, meta }) => (
                <Form.Item
                  hasFeedback
                  validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                  help={` ${meta?.error && meta.touched ? meta.error : ''}`}
                  label="PASSWORD"
                >
                  <Input.Password
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Your Password"
                    {...input}
                  />
                </Form.Item>
              )}
            />
            <Form.Item>
              <div className="text-center">
                <Button
                  htmlType="submit"
                  type="primary"
                  className="login-form-button"
                  size="large"
                  disabled={submitting || pristine}
                  loading={submitting}
                >
                  {t('Sign In')}
                </Button>

                <Row gutter={[32, 32]}>
                  <Col span={24}>
                    <Link to="/forgot-password">
                      <Text>{t('Don\'t remember your password?')}</Text>
                    </Link>
                  </Col>
                  <Col span={24}>
                    <Text>{t('Don\'t have an account?')} <Link to="/register/">{t('Register')}</Link></Text>
                  </Col>
                </Row>
              </div>
            </Form.Item>
          </Form>
        )}
      />
    </AuthLayout>
  )
}

const mapStateToProps = (state) => {
  return ({
    user: state.userRdr
  })
}

export default connect(mapStateToProps)(Login)
