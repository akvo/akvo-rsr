import React, { useState } from 'react'
import { Form, Button, Radio, Row, Col, Tag } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import Condition from '../../../../utils/condition'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { doesFieldExist, isFieldOptional, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import LANGUAGE_OPTIONS from './languages.json'
import MIME_LIST from './mime-list.json'
import CATEGORY_OPTIONS from './categories.json'
import Uploader from './uploader'
import actionTypes from '../../action-types'

const { Item } = Form

const Docs = ({ formPush, validations, dispatch, initialValues }) => {
  const { t } = useTranslation()
  const initialState = {}
  initialValues.docs.forEach((doc, index) => {
    if(doc.document !== '' && doc.document !== null){
      initialState[index] = true
    }
  })
  const [uploadOn, setUploadOn] = useState(initialState)
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const isOptional = isFieldOptional(validationSets)
  const handleNewDocumentUploading = () => {
    dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex: 9, setName: 'docs', item: {categories: []} })
  }
  const handleNewDocumentUploaded = (id, document) => {
    dispatch({ type: actionTypes.ADDED_SET_ITEM, sectionIndex: 9, setName: 'docs', item: {id, document} })
  }
  const handleDocumentUpdated = (itemIndex, itemId) => (document) => {
    dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex: 9, setName: 'docs', itemIndex, itemId, fields: { document }})
    dispatch({ type: actionTypes.BACKEND_SYNC })
  }
  const handleRadioSwitch = ({target: {value}}, index) => {
    if (value === 'upload') {
      const val = {}
      val[index] = true
      setUploadOn({...uploadOn, ...val})
    }
    else if (value === 'url') {
      const val = {}
      val[index] = false
      setUploadOn({ ...uploadOn, ...val })
    }
  }
  console.log(uploadOn)
  return (
    <div>
      <h3>{t('Documents')}</h3>
      <ItemArray
        setName="docs"
        sectionIndex={9}
        header={(index, title) =>
          <FinalField
            name={`docs[${index}].categories`}
            render={({input}) => (
              <span>
                {input.value && input.value.map(category => <Tag>{category}</Tag>)}
                <span>{t('Document')} {index + 1}: {title}</span>
              </span>
            )}
          />
        }
        headerField="title"
        newItem={{ categories: [], document: '' }}
        formPush={formPush}
        panel={(name, index) => (
        <div>
          <Item>
            <Condition when={`${name}.document`} is="">
            <Radio.Group value={uploadOn[index] ? 'upload' : 'url'} onChange={ev => handleRadioSwitch(ev, index)}>
              <Radio.Button value="url">URL</Radio.Button>
              <Radio.Button value="upload">{t('Upload')}</Radio.Button>
            </Radio.Group>
            </Condition>
            {!uploadOn[index] &&
              <FinalField
                name={`${name}.url`}
                control="input"
                placeholder="https://..."
              />
            }
            {uploadOn[index] &&
              <FinalField
                name={`${name}.id`}
                render={({ input }) => (
                  <FinalField
                    name={`${name}.document`}
                    render={(props) => (
                      <Uploader
                        fieldName={`${name}.document`}
                        documentId={input.value}
                        document={props.input.value}
                        onNewDocumentUploading={handleNewDocumentUploading}
                        onNewDocumentUploaded={handleNewDocumentUploaded}
                        onDocumentUpdated={handleDocumentUpdated(index, input.value)}
                      />
                    )}
                  />
                )}
              />
            }
          </Item>
          <Item label={<InputLabel tooltip={t('Enter the title of your document.')}>{t('title')}</InputLabel>}>
            <FinalField name={`${name}.title`} control="input" />
          </Item>
          <Row gutter={16}>
            {fieldExists('titleLanguage') &&
            <Col span={12}>
              <Item label={<InputLabel optional tooltip={t('Select the language of the document title.')}>{t('title language')}</InputLabel>}>
                <FinalField name={`${name}.titleLanguage`} control="select" options={LANGUAGE_OPTIONS} showSearch optionFilterProp="children" />
              </Item>
            </Col>
            }
            {fieldExists('language') &&
            <Col span={12}>
              <Item label={<InputLabel optional tooltip={t('Select the language that the document is written in.')}>{t('document language')}</InputLabel>}>
                <FinalField name={`${name}.language`} control="select" options={LANGUAGE_OPTIONS} showSearch optionFilterProp="children" />
              </Item>
            </Col>
            }
            {fieldExists('documentDate') && (
            <Col span={12}>
              <Item label={<InputLabel optional tooltip={t('Enter the date (DD/MM/YYYY) to be used for the production or publishing date of the relevant document to identify the specific document version.')}>{t('document date')}</InputLabel>}>
                <FinalField name={`${name}.documentDate`} control="datepicker" />
              </Item>
            </Col>
            )}
            {fieldExists('format') && (
            <Col span={12}>
              <Item label={<InputLabel optional={isOptional('format')}>{t('document format')}</InputLabel>}>
                <FinalField
                  name={`${name}.format`}
                  control="select"
                  options={MIME_LIST.map(({ title, mime }) => ({ value: mime, label: title, small: mime }))}
                  showSearch optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                />
              </Item>
            </Col>
            )}
          </Row>
          {fieldExists('categories') &&
          <Item label={<InputLabel optional tooltip={t('The description of the type of content contained within the document.')}>{t('Document categories')}</InputLabel>}>
          <FinalField
            name={`${name}.categories`}
            control="select"
            mode="multiple"
            optionFilterProp="children"
            options={CATEGORY_OPTIONS}
            placeholder={t('Please select...')}
          />
          </Item>
          }
        </div>
        )}
        addButton={props => (
          <Button
            className="bottom-btn"
            icon="plus"
            type="dashed"
            block
            {...props}
          >
            {t('Add document')}
          </Button>
        )}
      />
    </div>
  )
}

export default React.memo(Docs, () => true)
