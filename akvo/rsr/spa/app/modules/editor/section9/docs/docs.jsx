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

const Docs = ({ formPush, validations, dispatch, initialValues, editSetItem }) => {
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
    dispatch({ type: actionTypes.ADDED_SET_ITEM, sectionIndex: 9, setName: 'docs', item: {id, document}, validate: true })
  }
  const handleDocumentUpdated = (itemIndex, itemId) => (document) => {
    dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex: 9, setName: 'docs', itemIndex, itemId, fields: { document }})
    dispatch({ type: actionTypes.BACKEND_SYNC })
  }
  const handleDocumentRemove = (itemIndex, itemId) => () => {
    editSetItem(9, 'docs', itemIndex, itemId, { document: null })
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
            <div className="url-input-wrapper">
            {!uploadOn[index] &&
              <FinalField
                name={`${name}.url`}
                control="input"
                placeholder="https://..."
                withLabel
                label={<span />}
              />
            }
            </div>
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
                        onRemoveDocument={handleDocumentRemove(index, input.value)}
                      />
                    )}
                  />
                )}
              />
            }
          </Item>
          <FinalField
            name={`${name}.title`}
            control="input"
            withLabel
            optional={isOptional}
            dict={{
              label: t('title'),
              tooltip: t('Enter the title of your document.')
            }}
          />
          <Row gutter={16}>
            {fieldExists('titleLanguage') &&
            <Col span={12}>
              <FinalField
                name={`${name}.titleLanguage`}
                control="select"
                options={LANGUAGE_OPTIONS}
                showSearch
                optionFilterProp="children"
                withLabel
                optional={isOptional}
                dict={{
                  tooltip: 'Select the language of the document title.',
                  label: 'title language'
                }}
              />
            </Col>
            }
            {fieldExists('language') &&
            <Col span={12}>
              <FinalField
                name={`${name}.language`}
                control="select"
                options={LANGUAGE_OPTIONS}
                showSearch
                optionFilterProp="children"
                withLabel
                optional={isOptional}
                dict={{
                  label: t('document language'),
                  tooltip: t('Select the language that the document is written in.')
                }}
              />
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
              <FinalField
                name={`${name}.format`}
                control="select"
                options={MIME_LIST.map(({ title, mime }) => ({ value: mime, label: title, small: mime }))}
                showSearch optionFilterProp="children"
                dropdownMatchSelectWidth={false}
                withLabel
                optional={isOptional}
                dict={{
                  label: 'document format'
                }}
              />
            </Col>
            )}
          </Row>
          {fieldExists('categories') &&
          <FinalField
            name={`${name}.categories`}
            control="select"
            mode="multiple"
            optionFilterProp="children"
            options={CATEGORY_OPTIONS}
            placeholder={t('Please select...')}
            withLabel
            optional={isOptional}
            dict={{
              tooltip: t('The description of the type of content contained within the document.'),
              label: t('Document categories')
            }}
          />
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
