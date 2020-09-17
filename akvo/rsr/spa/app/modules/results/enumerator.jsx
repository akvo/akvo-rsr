import React, { useEffect, useState } from 'react'
import './enumerator.scss'
import { Collapse, Button, Icon, Form, Input, Divider, Upload } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const { Panel } = Collapse

const Enumerator = ({ results, id }) => {
  const [indicators, setIndicators] = useState([])
  const [selected, setSelected] = useState(null)
  useEffect(() => {
    const indicators = []
    results.forEach(result => {
      result.indicators.forEach(indicator => {
        const periods = indicator.periods.filter(it => it.locked === false)
        if(periods.length > 0){
          const {id, title, type, ascending, description, measure} = indicator
          indicators.push({
            id, title, type, periods, ascending, description, measure
          })
        }
      })
    })
    setIndicators(indicators)
    if(indicators.length > 0){
      setSelected(indicators[0])
    }
  }, [])
  const handleSelectIndicator = (indicator) => {
    setSelected(indicator)
  }
  return (
    <div className="enumerator-view">
      <ul>
        {indicators.map(indicator =>
          <li className={(selected === indicator) && 'selected'} onClick={() => handleSelectIndicator(indicator)}>
            <div className="check-holder">
              <div className="check" />
            </div>
            <h5>{indicator.title}</h5>
          </li>
        )}
      </ul>
      <div className="content">
        {selected && [
          selected.description &&
          <p className="desc">
            {selected.description}
          </p>,
          <Collapse destroyInactivePanel accordion>
            {selected.periods.map(period =>
              <Panel header={[<div><b>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')}</b> - <b>{moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</b></div>, <Button type="primary" disabled>Submit</Button>]}>
                <AddUpdate period={period} indicator={selected} />
              </Panel>
            )}
          </Collapse>
        ]}
      </div>
    </div>
  )
}

const AddUpdate = ({period, indicator}) => {
  const { t } = useTranslation()
  console.log(indicator)
  return (
    <div className="add-update">
      <header>
        {indicator.ascending ? [
          <Icon type="rise" />, <b>Ascending</b>
        ] : [
          <Icon type="fall" />, <b>Descending</b>
        ]}
      </header>
      <Form aria-orientation="vertical">
      <div className="inputs-container">
        <div className="inputs">
          {/* <h5>Value percentage</h5> */}
          <Form.Item label="Numerator">
            <Input />
          </Form.Item>
          {indicator.measure === '2' &&
          <Form.Item label="Denumerator">
            <Input />
          </Form.Item>
          }
        </div>
        {period.updates.length > 0 &&
        ((update) => (
        <div className="prev-value-holder">
          <div className="prev-value">
            <h5>previous value update</h5>
            <div className="date">{moment(update.createdAt).format('DD MMM YYYY')}</div>
            <div className="author">{update.userDetails.firstName} {update.userDetails.lastName}</div>
          </div>
        </div>
        ))(period.updates[period.updates.length - 1])
        }
      </div>
      <Divider />
      <div className="notes">
        <Form.Item label="Value comment">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Internal private note">
          <Input.TextArea />
        </Form.Item>
      </div>
      </Form>
      <div className="upload">
      <Upload.Dragger
        name="document"
        listType="picture"
        method="PATCH"
        withCredentials
        // fileList={fileList}
        beforeUpload={file => {
          // setFileList([file])
          return false
        }}
        onSuccess={(item) => {
        }}
        onRemove={file => {
          // setFileList(state => {
          //   const index = fileList.indexOf(file)
          //   const newFileList = state.slice()
          //   newFileList.splice(index, 1)
          //   return newFileList
          // });
        }}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="picture" theme="twoTone" />
        </p>
        <p className="ant-upload-text">{t('Drag file here')}</p>
        <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
        <p><small>Max: 10MB</small></p>
      </Upload.Dragger>
      </div>
    </div>
  )
}

export default Enumerator
