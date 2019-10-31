import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Icon, Tooltip } from 'antd'
import { Form as FinalForm, FormSpy, Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import { isFieldOptional, getValidationSets } from '../../../utils/validation-utils'
import RTE from '../../../utils/rte'
import api from '../../../utils/api'
import { snakeToCamel, camelToSnake, arrayMove } from '../../../utils/misc'
import AutoSave from '../../../utils/auto-save'
import validationDefs, { RSR } from './validations'
import SectionContext from '../section-context'
import './styles.scss'
import CustomFields from '../custom-fields'

const { Item } = Form

const isEmpty = val => val === '' || val === undefined

const Desc = ({ fields, descriptionsOrder, projectId }) => {
  const [added, setAdded] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const formRef = useRef()
  useEffect(() => {
    const defaultAdded = Object.keys(validationDefs[1].fields).filter(descKey => validationDefs[1].fields[descKey]._exclusive.required)
    Object.keys(fields).forEach(descKey => {
      if (!isEmpty(fields[descKey]) && defaultAdded.indexOf(descKey) === -1) {
        defaultAdded.push(descKey)
      }
    })
    const defaultOrdered = []
    descriptionsOrder.forEach(descKey => {
      if(defaultAdded.indexOf(descKey) !== -1){
        defaultOrdered.push(descKey)
      }
    })
    setAdded(defaultOrdered)
  }, [])
  const addDesc = (key) => {
    const updatedAdded = [...added, key]
    if (added.indexOf(key) === -1) {
      setAdded(updatedAdded)
    }
    setModalVisible(false)
    api.patch(`/project/${projectId}/`, {
      descriptionsOrder: updatedAdded.map(it => camelToSnake(it))
    })
  }
  const removeDesc = (key, input) => {
    input.onChange('')
    // final-form needs a moment to reflect the change before the field is removed
    setTimeout(() => {
      setAdded(added.filter(it => it !== key))
    }, 100)
  }
  const move = (from, to) => {
    const updatedAdded = arrayMove(added, from, to)
    setAdded(updatedAdded)
    api.patch(`/project/${projectId}/`, {
      descriptionsOrder: updatedAdded.map(it => camelToSnake(it))
    })
  }
  const { t } = useTranslation()
  const isOptional = isFieldOptional(getValidationSets([1], validationDefs)) // validation id is irrelevant here
  return (
    <div className="descriptions view">
      <SectionContext.Provider value="section4">
        <Form layout="vertical">
          <FinalForm
            onSubmit={() => { }}
            initialValues={fields}
            subscription={{}}
            render={({ form }) => {
              formRef.current = form
              const Comp = ({ descKey, index }) => (
                <Field
                  name={descKey}
                  render={({ input, validateStatus }) => (
                    <Item
                      key={descKey}
                      validateStatus={validateStatus}
                      label={(
                        <div className="desc-label">
                          <span>{t(`section4::${descKey}::label`)}&nbsp;&nbsp;<Tooltip trigger="click" title={<span dangerouslySetInnerHTML={{ __html: t(`section4::${descKey}::info`) }} />}><Icon type="info-circle" /></Tooltip></span>
                          <Button.Group>
                            {index > 1 &&
                              <Tooltip title={t('Move up')}>
                                <Button size="small" icon="up" onClick={() => move(index, index - 1)} />
                              </Tooltip>
                            }
                            {(index > 0 && index < added.length - 1) &&
                              <Tooltip title={t('Move down')}>
                                <Button size="small" icon="down" onClick={() => move(index, index + 1)} />
                              </Tooltip>
                            }
                            {isOptional(descKey) && <Button size="small" icon="delete" onClick={() => removeDesc(descKey, input)} />}
                          </Button.Group>
                        </div>
                      )}
                    >
                      <RTE {...input} index={index} validateStatus={validateStatus} />
                    </Item>
                  )}
                />
              )
              return (
                <div>
                  {added.map((descKey, index) => <Comp descKey={descKey} index={index} />)}
                  {added.length < 6 &&
                    <Button onClick={() => setModalVisible(true)} className="bottom-btn" icon="plus" type="dashed" block>
                      {t('Add description')}
                    </Button>
                  }
                  <Modal
                    title={t('Add description')}
                    visible={modalVisible}
                    footer={null}
                    onCancel={() => setModalVisible(false)}
                    className="add-description-modal"
                  >
                    <FormSpy subscription={{ values: true }}>
                      {({ values }) => (
                        <div>
                          {Object.keys(RSR.fields).filter(descKey => {
                            return !(!isOptional(descKey) || !isEmpty(values[descKey]) || added.indexOf(descKey) !== -1)
                          }).map(descKey => (
                            <div className="desc-block">
                              <Button block icon="plus" onClick={() => addDesc(descKey)}>{t(`section4::${descKey}::label`)}</Button>
                              <p>{t(`section4::${descKey}::info`)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormSpy>
                  </Modal>
                  <AutoSave sectionIndex={4} />
                </div>
              )
            }}
          />
        </Form>
      </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { projectId, section4: { fields }, section1: { fields: { descriptionsOrder } } } }) => ({ projectId, fields, descriptionsOrder: descriptionsOrder.map(it => snakeToCamel(it)) })
)(Desc)
