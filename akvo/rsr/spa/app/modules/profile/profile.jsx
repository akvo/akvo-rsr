import React, {useRef} from 'react'
import {connect} from 'react-redux'
import { Field, Form as FinalForm } from 'react-final-form'
import { Select, Form, Spin, Divider, Icon, Modal, Button, Upload, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import InputLabel from '../../utils/input-label'
import FinalField from '../../utils/final-field'
import './styles.scss'

const { Item } = Form

const Profile = ({userRdr}) => {
  const { t } = useTranslation()
  const formRef = useRef()
  const passFormRef = useRef()
  const submit = () => {}
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
              <Button type="primary">Update details</Button>
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
            onSubmit={submit}
            render={() => [
              <Item label={<InputLabel>{t('Current password')}</InputLabel>}>
                <FinalField name="oldPassword" type="password" />
              </Item>,
              <Item label={<InputLabel>{t('New password')}</InputLabel>}>
                <FinalField name="password" type="password" />
              </Item>,
              <Item label={<InputLabel>{t('Repeat password')}</InputLabel>}>
                <FinalField name="passwordAgain" type="password" />
              </Item>,
              <Button type="primary">Update password</Button>
            ]
            }
          />
        </Form>
        <ul className="help-block">
          <li>Passwords must be at least  characters long</li>
          <li>The password must contain at least one digit, 0-9</li>
          <li>The password must contain at least one uppercase letter, A-Z.</li>
          <li>The password must contain at least one lowercase letter, a-z.</li>
          <li>The password must contain at least one symbol: {'()[]{}|\\`~!@#$%^&amp;*_-+=;:\'",&lt;&gt;./?'}</li>
        </ul>
      </section>
      <Divider />
      <section className="api">
        <h2>API key</h2>
        <div className="key">
          <span>asdasdasdasdasdasdas</span>
          <Button icon="copy" shape="circle" size="large" />
        </div>
        <small>For more information on how to use the RSR API, visit <a href="https://akvorsr.supporthero.io/container/show/api">the support page</a>.</small>
      </section>
    </div>
  )
}

export default connect(({userRdr}) => ({ userRdr }))(Profile)
