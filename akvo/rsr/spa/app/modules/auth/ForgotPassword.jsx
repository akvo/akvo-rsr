import React, { useEffect, useState } from 'react'
import { Form, Input, Icon, Button, Typography, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import axios from 'axios'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import AuthLayout from './AuthLayout'
import { validateFormValues } from '../../utils/validation-utils'
import forgotPasswordSchema from './validators/forgotPassword'

const { Paragraph } = Typography

const ForgotPassword = ({ user }) => {
  const [message, setMessage] = useState('Enter the email address you used when you joined and we’ll send you instructions to reset your password.')
  const history = useHistory()

  useEffect(() => {
    if (user?.id) {
      history.push('/')
    }
  })

  const onSubmitForgotPassword = async credentials => {
    await axios({
      url: '/auth/reset-password/',
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
          title: 'Success',
          content: 'Instructions to reset your password has been sent.',
          onOk: () => {
            history.push('/login')
          }
        })
      }).catch(() => {
        setMessage('Failed! we were unable to proceed with your request to reset your password. Please try again later')
      })
  }

  return (
    <AuthLayout>
      <h2 className="login-title">Forgot Password?</h2>
      <Paragraph>{message}</Paragraph>
      <FinalForm
        onSubmit={onSubmitForgotPassword}
        validate={validateFormValues(forgotPasswordSchema)}
        render={({ handleSubmit, submitting, pristine }) => {
          return (
            <Form onSubmit={handleSubmit} className="login-form" layout="vertical">
              <Field
                name="email"
                render={({ input, meta }) => (
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
                )}
              />
              <Form.Item>
                <div className="text-center">
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="login-form-button" size="large"
                    disabled={submitting || pristine}
                    loading={submitting}
                  >
                    Submit
                  </Button>
                  <br />
                  <Link to="/login">Back to login</Link><br />
                </div>
              </Form.Item>
            </Form>
          )
        }}
      />
    </AuthLayout>
  )
}

const mapStateToProps = (state) => {
  return ({
    user: state.userRdr
  })
}

export default connect(mapStateToProps)(ForgotPassword)
