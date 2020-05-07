import React from 'react'
import { Input, Form, InputNumber, Upload, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import './edit-update.scss'

const { Item } = Form


const EditUpdate = ({ period, update, handleUpdateEdit }) => {
  const { t } = useTranslation()
  const handleValueChange = (value) => {
    handleUpdateEdit({...update, value})
  }
  const handleTextChange = ({ target: { value: text } }) => {
    handleUpdateEdit({...update, text})
  }
  const dsgGroups = {}
  period.disaggregationTargets.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    dsgGroups[item.category].push(item)
  })
  console.log(dsgGroups)
  const dsgKeys = Object.keys(dsgGroups)
  return (
    <Form layout="vertical" className={classNames('edit-update', { 'with-dsgs': dsgKeys.length > 0 })}>
      <div className="values">
        {dsgKeys.map(dsgKey =>
          <div className="dsg-group">
            <div className="h-holder">
              <h5>{dsgKey}</h5>
            </div>
            {dsgGroups[dsgKey].map(dsg =>
              <Item label={dsg.type}>
                <InputNumber
                  // size="large"
                  formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={val => val.replace(/(,*)/g, '')}
                  // onChange={handleValueChange}
                  // value={update.value}
                />
              </Item>
            )}
          </div>
        )}
        <Item label={dsgKeys.length > 0 ? 'Total value' : 'Value to add'}>
          <InputNumber
            size="large"
            formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={val => val.replace(/(,*)/g, '')}
            onChange={handleValueChange}
            value={update.value}
          />
        </Item>
      </div>
      <div className="rest">
        <Item label={[<span>Value comment</span>, <small>Optional</small>]}>
          <Input.TextArea value={update.text} onChange={handleTextChange} />
        </Item>
        <Item label="Internal private note">
          <Input />
        </Item>
        <Item label="Attach a file">
        <Upload.Dragger>
          <p className="ant-upload-drag-icon">
            <Icon type="picture" theme="twoTone" />
          </p>
          <p className="ant-upload-text">{t('Drag file here')}</p>
          <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
          <p><small>Max: 10MB</small></p>
        </Upload.Dragger>
        </Item>
      </div>
    </Form>
  )
}

export default EditUpdate
