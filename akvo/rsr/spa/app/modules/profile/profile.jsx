import React, {useRef, useState} from 'react'
import {connect} from 'react-redux'
import { Field, Form as FinalForm } from 'react-final-form'
import { Select, Form, Spin, Divider, Icon, Modal, Button, Upload, Row, Col, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import * as clipboard from 'clipboard-polyfill'
import InputLabel from '../../utils/input-label'
import FinalField from '../../utils/final-field'
import './styles.scss'
import api from '../../utils/api'

const { Item } = Form
const passwordReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*",<>./?\'+=;:-_~`\|{}()])(?=.{8,})')

const Profile = ({userRdr}) => {
  const { t } = useTranslation()
  const formRef = useRef()
  const passFormRef = useRef()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const submit = (values) => {
    setSaving(true)
    api.post(`/user/${userRdr.id}/update_details/`, values)
    .then(() => {
      setSaving(false)
    })
    .catch(() => {
      setSaving(false)
    })
  }
  const submitPass = (values) => {
    setError(null)
    if(values.newPassword1 === values.newPassword2) {
      if(passwordReg.test(values.newPassword1)){
        setSaving(true)
        api.post(`/user/${userRdr.id}/change_password/`, values)
        .then(() => {
          setSaving(false)
        })
        .catch(error => {
          if (error.response && error.response.data){
            setError(error.response.data[Object.keys(error.response.data)[0]])
            setSaving(false)
          }
        })
      } else {
        setError('New password doesn\'t meet requirements')
      }
    } else {
      setError('New passwords do not match')
    }
  }
  const handleSubmitBasic = () => {
    formRef.current.form.submit()
  }
  const handleSubmitPass = () => {
    passFormRef.current.form.submit()
  }
  const handleCopyClick = () => {
    clipboard.writeText(userRdr.apiKey)
    setCopied(true)
  }
  return (
    <div className="profile-view">
      <section>
        <h2>Personal info</h2>
        <Form layout="vertical">
          <FinalForm
            subscription={{}}
            ref={(ref) => { formRef.current = ref }}
            initialValues={userRdr ? {email: userRdr.email, firstName: userRdr.firstName, lastName: userRdr.lastName} : {}}
            onSubmit={submit}
            render={() => [
              <Item label={<InputLabel>{t('Email address')}</InputLabel>}>
                <FinalField name="email" disabled />
              </Item>,
              <Row gutter={16}>
                <Col span={12}>
                  <Item label={<InputLabel>{t('First name')}</InputLabel>}>
                    <FinalField name="firstName" />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel>{t('Last name')}</InputLabel>}>
                    <FinalField name="lastName" />
                  </Item>
                </Col>
              </Row>,
              <Button type="primary" loading={saving} onClick={handleSubmitBasic}>Update details</Button>
            ]
            }
          />
        </Form>
      </section>
      <Divider />
      <section className="orgs">
        <h2>Organisations</h2>
        <ul>
          {userRdr && userRdr.organisations && userRdr.organisations.map(org =>
          <li>{org.name}</li>
          )}
        </ul>
      </section>
      <section className="pass">
        <h2>Password</h2>
        <Form layout="vertical">
          <FinalForm
            subscription={{}}
            ref={(ref) => { passFormRef.current = ref }}
            initialValues={{}}
            onSubmit={submitPass}
            render={() => [
              <Item label={<InputLabel>{t('Current password')}</InputLabel>}>
                <FinalField name="oldPassword" type="password" />
              </Item>,
              <Item label={<InputLabel>{t('New password')}</InputLabel>}>
                <FinalField name="newPassword1" type="password" />
              </Item>,
              <Item label={<InputLabel>{t('Repeat password')}</InputLabel>}>
                <FinalField name="newPassword2" type="password" />
              </Item>,
              error && <Alert message={error} type="error" />,
              <Button type="primary" loading={saving} onClick={handleSubmitPass}>Update password</Button>
            ]
            }
          />
        </Form>
        <ul className="help-block">
          <li>Passwords must be at least 8 characters long</li>
          <li>The password must contain at least one digit, 0-9</li>
          <li>The password must contain at least one uppercase letter, A-Z.</li>
          <li>The password must contain at least one lowercase letter, a-z.</li>
          <li>The password must contain at least one symbol: {'(){}|\\`~!@#$%^&*_-+=;:\'",<>./?'}</li>
        </ul>
      </section>
      <Divider />
      <section className="api">
        <h2>API key</h2>
        <div className="key">
          <span>{userRdr.apiKey}</span>
          <Button icon={copied ? 'check' : 'copy'} shape="circle" size="large" onClick={handleCopyClick} />
          {copied && <div className="copied-caption">Copied to clipboard</div>}
        </div>
        <small>For more information on how to use the RSR API, visit <a href="https://akvorsr.supporthero.io/container/show/api">the support page</a>.</small>
      </section>
    </div>
  )
}

export default connect(({userRdr}) => ({ userRdr }))(Profile)
