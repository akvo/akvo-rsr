import React, { useState } from 'react'
import { Input, Form, InputNumber, Upload, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import './edit-update.scss'

const { Item } = Form


const EditUpdate = ({ period, update, handleUpdateEdit, indicatorType }) => {
  const { t } = useTranslation()
  const [valueLocked, setValueLocked] = useState(true)
  const dsgGroups = {}
  period.disaggregationTargets.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    dsgGroups[item.category].push(item)
  })
  const dsgKeys = Object.keys(dsgGroups)
  const handleValueChange = (value) => {
    handleUpdateEdit({...update, value})
  }
  const handleDsgValueChange = (category, type) => (value) => {
    const dsgIndex = update.disaggregations.findIndex(it => it.category === category && it.type === type)
    const dsgItem = update.disaggregations[dsgIndex]
    if(dsgIndex > -1){
      const disaggregations = [...update.disaggregations.slice(0, dsgIndex), { ...dsgItem, value }, ...update.disaggregations.slice(dsgIndex + 1)]
      const totals = disaggregations.reduce((acc, val) => {
        if(val.value > 0){
          const ind = acc.findIndex(it => val.category === it.key)
          return [...acc.slice(0, ind), {key: val.category, value: acc[ind].value + val.value}, ...acc.slice(ind + 1)]
        }
        return acc
      }, dsgKeys.map(key => ({ key, value: 0 })))
      handleUpdateEdit({ ...update, disaggregations, value: totals.reduce((acc, val) => val.value > acc ? val.value : acc, 0)})
    }
  }
  const handleTextChange = ({ target: { value: text } }) => {
    handleUpdateEdit({...update, text})
  }
  const toggleValueLock = () => {
    setValueLocked(!valueLocked)
  }
  return (
    <Form layout="vertical" className={classNames('edit-update', { 'with-dsgs': dsgKeys.length > 0 })}>
      {indicatorType !== 2 &&
      <div className="values">
        {dsgKeys.map(dsgKey =>
          <div className="dsg-group">
            <div className="h-holder">
              <h5>{dsgKey}</h5>
            </div>
            {dsgGroups[dsgKey].map(dsg => {
              const dsgIndex = update.disaggregations.findIndex(it => it.category === dsgKey && it.type === dsg.type)
              const value = dsgIndex > -1 ? update.disaggregations[dsgIndex].value : ''
              return (
                <Item label={dsg.type}>
                  <InputNumber
                    formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={val => val.replace(/(,*)/g, '')}
                    onChange={handleDsgValueChange(dsgKey, dsg.type)}
                    value={value}
                  />
                </Item>
              )
            }
            )}
          </div>
        )}
        <Item
        label={
          dsgKeys.length === 0 ? 'Value to add'
          :
          <div className="total-label">
            Total value
            <Icon type={valueLocked ? 'lock' : 'unlock'} onClick={toggleValueLock} />
          </div>}
        >
          <InputNumber
            size="large"
            formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={val => val.replace(/(,*)/g, '')}
            onChange={handleValueChange}
            value={update.value}
            disabled={dsgKeys.length > 0 ? valueLocked : false}
          />
        </Item>
      </div>
      }
      <div className="rest">
        <Item label={[<span>{indicatorType !== 2 ? 'Value comment' : 'Narrative' }</span>, <small>Optional</small>]}>
          <Input.TextArea value={update.text} onChange={handleTextChange} />
        </Item>
        <Item label="Internal private note">
          <Input />{/* TODO! */}
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
