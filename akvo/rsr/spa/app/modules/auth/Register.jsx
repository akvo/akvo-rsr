/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import { Form, Input, Icon, Button, Modal, Alert, Typography } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import axios from 'axios'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import AuthLayout from './AuthLayout'
import { validateFormValues } from '../../utils/validation-utils'
import registerSchema from './validators/register'

const { Paragraph } = Typography

const Register = ({ user }) => {
  const [alert, setAlert] = useState(null)
  const history = useHistory()

  useEffect(() => {
    if (user?.id) {
      history.push('/')
    }
  })

  const onSubmitRegister = async credentials => {
    await axios({
      url: '/auth/register/',
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data: credentials
    })
      .then(() => {
        Modal.success({
          title: `Welcome, ${credentials?.first_name}!`,
          content: 'A confirmation will be sent to you via email. Please click the link in the email to complete the setup of your account.',
          onOk: () => {
            history.push('/login')
          }
        })
      }).catch(() => {
        setAlert('Failed! Please enter a correct data along this Register form')
      })
  }

  return (
    <FinalForm
      onSubmit={onSubmitRegister}
      validate={validateFormValues(registerSchema)}
      render={({ handleSubmit, submitting, pristine }) => {
        return (
          <AuthLayout>
            <h2 className="login-title">Register</h2>
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
            <Form onSubmit={handleSubmit} className="login-form" layout="vertical">
              <Field
                name="email"
                render={({ input, meta }) => {
                  return (
                    <Form.Item
                      hasFeedback
                      validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                      label="E-MAIL"
                      help={` ${meta?.error && meta.touched ? meta.error : ''}`}
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
                name="first_name"
                render={({ input, meta }) => (
                  <Form.Item
                    hasFeedback
                    validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                    help={` ${meta?.error && meta.touched ? meta.error : ''}`}
                    label="FIRST NAME"
                  >
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Your First Name"
                      {...input}
                    />
                  </Form.Item>
                )}
              />
              <Field
                name="last_name"
                render={({ input, meta }) => (
                  <Form.Item
                    hasFeedback
                    validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                    help={` ${meta?.error && meta.touched ? meta.error : ''}`}
                    label="LAST NAME"
                  >
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Your Last Name"
                      {...input}
                    />
                  </Form.Item>
                )}
              />
              <Paragraph>
                <ul>
                  <li>Passwords must be at least 12 characters long</li>
                  <li>The password must contain at least one digit, 0-9</li>
                  <li>The password must contain at least one uppercase letter, A-Z.</li>
                  <li>The password must contain at least one lowercase letter, a-z.</li>
                  <li>The password must contain at least one symbol: ()[]|\`~!@#$%^&*_-+={';:",<>./?'}</li>
                </ul>
              </Paragraph>
              <Field
                name="password1"
                render={({ input, meta }) => (
                  <Form.Item
                    hasFeedback
                    validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                    help={` ${meta?.error && meta.touched ? meta.error : ''}`}
                    label="PASSWORD"
                  >
                    <Input.Password
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Your Password"
                      {...input}
                    />
                  </Form.Item>
                )}
              />
              <Field
                name="password2"
                render={({ input, meta }) => (
                  <Form.Item
                    hasFeedback
                    validateStatus={meta.touched ? meta.error ? 'error' : 'success' : ''}
                    help={` ${meta?.error && meta.touched ? meta.error : ''}`}
                    label="REPEAT PASSWORD"
                  >
                    <Input.Password
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Repeat Your Password"
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
                    Register
                  </Button><br />
                  <p style={{ marginTop: '15px' }}>Have an account?&nbsp;<Link to="/login">Sign In</Link></p>
                </div>
              </Form.Item>
            </Form>
          </AuthLayout>
        )
      }}
    />
  )
}

const mapStateToProps = (state) => {
  return ({
    user: state.userRdr
  })
}

export default connect(mapStateToProps)(Register)
