import React, { useEffect, useState } from 'react'
import { Input, Form, InputNumber, Upload, Icon, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import './edit-update.scss'
import ScoreCheckboxes from './score-checkboxes'

const { Item } = Form
const inputNumberFormatting = {
  formatter: val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  parser: val => val.replace(/(,*)/g, '')
}

const EditUpdate = ({ update, handleUpdateEdit, indicator }) => {
  const { t } = useTranslation()
  const [valueLocked, setValueLocked] = useState(true)
  const [sizeExceeded, setSizeExceeded] = useState(false)
  const handleValueChange = (value) => {
    handleUpdateEdit({...update, value})
  }
  const handleFieldChange = (field) => (value) => {
    const updated = {...update}
    updated[field] = value
    if(field === 'numerator' || field === 'denominator'){
      const updatedValue = Math.round((updated.numerator / updated.denominator) * 100 * 10) / 10
      if(updatedValue !== Infinity && String(Number(updatedValue)) !== 'NaN') {
        updated.value = updatedValue
      }
    }
    handleUpdateEdit(updated)
  }
  const handleDsgValueChange = (category, type) => (value) => {
    const dsgIndex = update.disaggregations.findIndex(it => it.category === category && it.type === type)
    const dsgItem = update.disaggregations[dsgIndex]
    let disaggregations
    if(dsgIndex > -1){
      disaggregations = [...update.disaggregations.slice(0, dsgIndex), { ...dsgItem, value }, ...update.disaggregations.slice(dsgIndex + 1)]
    } else {
      const catItem = indicator.dimensionNames.find(it => it.name === category)
      const typeId = catItem?.dimensionValues.find(it => it.value === type)?.id
      disaggregations = [...update.disaggregations, { category: catItem?.name, type, typeId, value }]
    }
    const totals = disaggregations.reduce((acc, val) => {
      if(val.value > 0){
        const ind = acc.findIndex(it => val.category === it.key)
        return [...acc.slice(0, ind), {key: val.category, value: acc[ind].value + val.value}, ...acc.slice(ind + 1)]
      }
      return acc
    }, indicator.dimensionNames.map(group => ({ key: group.name, value: 0 })))
    handleUpdateEdit({ ...update, disaggregations, value: totals.reduce((acc, val) => val.value > acc ? val.value : acc, 0)})
  }
  const handleTextChange = ({ target: { value: text } }) => {
    handleUpdateEdit({...update, text})
  }
  const handleNoteChange = ({ target: { value: reviewNote } }) => {
    handleUpdateEdit({ ...update, reviewNote })
  }
  const handleFileListChange = (fileSet) => {
    handleUpdateEdit({ ...update, fileSet })
  }
  const toggleValueLock = () => {
    setValueLocked(!valueLocked)
  }
  useEffect(() => {
    const totalSize = update.fileSet?.reduce((acc, val) => acc + val.size, 0)
    if (totalSize >= 50000000) {
      setSizeExceeded(true)
    } else {
      setSizeExceeded(false)
    }
  }, [update.fileSet])
  return (
    <Form layout="vertical" className={classNames('edit-update', { 'with-dsgs': indicator.dimensionNames.length > 0 })}>
      {indicator.type !== 2 &&
      <div className="values">
        {indicator.dimensionNames.map(group =>
          <div className="dsg-group">
            <div className="h-holder">
              <h5>{group.name}</h5>
            </div>
            {group.dimensionValues.map(dsg => {
              const dsgIndex = update.disaggregations.findIndex(it => it.category === group.name && it.type === dsg.value)
              const value = dsgIndex > -1 ? update.disaggregations[dsgIndex].value : ''
              return (
                <Item label={dsg.value}>
                  <InputNumber
                    formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={val => val.replace(/(,*)/g, '')}
                    onChange={handleDsgValueChange(group.name, dsg.value)}
                    value={value}
                  />
                </Item>
              )
            }
            )}
          </div>
        )}
        {indicator.measure === '1' &&
        <Item
        label={
          indicator.dimensionNames.length === 0 ? 'Value to add'
          :
          <div className="total-label">
            Total value
            <Icon type={valueLocked ? 'lock' : 'unlock'} onClick={toggleValueLock} />
          </div>}
        >
          <InputNumber
            size="large"
            {...inputNumberFormatting}
            onChange={handleValueChange}
            value={update.value}
            disabled={indicator.dimensionNames.length > 0 ? valueLocked : false}
          />
        </Item>
        }
        {indicator.measure === '2' && [
          <Item label="Numerator">
            <InputNumber
              {...inputNumberFormatting}
              value={update.numerator}
              onChange={handleFieldChange('numerator')}
            />
          </Item>,
          <Item label="Denominator">
            <InputNumber
              {...inputNumberFormatting}
              value={update.denominator}
              onChange={handleFieldChange('denominator')}
            />
          </Item>,
          <div className="perc-value">
            {update.value}%
          </div>
        ]}
      </div>
      }
      <div className="rest">
        {indicator.type === 2 && indicator.scores?.length > 0 && (
          <ScoreCheckboxes scores={indicator.scores} value={update.scoreIndices} onChange={handleFieldChange('scoreIndices')} />
        )}
        <Item label={[<span>{indicator.type !== 2 ? 'Value comment' : 'Narrative' }</span>, <small>Optional</small>]}>
          <Input.TextArea value={update.text} onChange={handleTextChange} />
        </Item>
        <Item label={[<span>Internal private note</span>, <small>Optional</small>]}>
          <Input value={update.reviewNote} onChange={handleNoteChange} />
        </Item>
        <Item label={[<span>Attach a file</span>, <small>Optional</small>]}>
          {sizeExceeded && <Alert showIcon type="error" message={t('Your uploads exceed 50mb')} style={{ marginBottom: 10 }} />}
          <Upload.Dragger
            fileSet={update.fileSet}
            multiple
            beforeUpload={(file, files) => {
              handleFileListChange([...update.fileSet, ...files])
              return false
            }}
            onSuccess={(item) => {
            }}
            onRemove={file => {
              handleFileListChange(update.fileSet.filter(_file => _file !== file))
            }}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="picture" theme="twoTone" />
            </p>
            <p className="ant-upload-text">{t('Drag file here')}</p>
            <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
            <p><small>Max: 50MB</small></p>
          </Upload.Dragger>
        </Item>
      </div>
    </Form>
  )
}

export default EditUpdate
