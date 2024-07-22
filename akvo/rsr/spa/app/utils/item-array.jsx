import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Button, Modal, Popconfirm } from 'antd'
import { FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import {Route} from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import AutoSaveFS from './auto-save'
import * as actions from '../modules/editor/actions'
import RequiredHint from './required-hint'

const { Panel } = Collapse

class ActiveKeyUpdater extends React.Component{
  componentDidUpdate(prevProps){
    if(!prevProps.values[this.props.name]) return
    if(this.props.values[this.props.name].length > prevProps.values[this.props.name].length
       || this.props.values[this.props.name].length <= Number(this.props.activeKey)){
      setTimeout(() => {
        this.props.setActiveKey(String(this.props.values[this.props.name].length - 1))
      }, 200)
    }
  }
  render(){
    return null
  }
}

const getKeyFromTemplate = (template) => {
  const $pos = template.indexOf('$')
  if($pos === -1){
    return null
  }
  return template.substr($pos + 1)
}

class UpdateHalter extends React.Component{
  // prevents double render on changed activeKey
  shouldComponentUpdate(nextProps){
    if(nextProps.parentState.activeKey !== this.props.parentState.activeKey){
      return false
    }
    return true
  }
  render(){
    return this.props.children
  }
}

const PanelHeader = ({ template, field, index, name}) => {
  const render = typeof template !== 'string' ? template : null
  let header
  if(!render){
    header = template.replace('$index', index + 1)
    field = getKeyFromTemplate(header)
  }
  return (
    <Field name={`${name}.${field}`} subscription={{ value: true }}>
      {({ input: { value } }) => <span>{render ? render(index, value) : header.replace(`$${field}`, value)}</span>}
    </Field>
  )
}

export const PanelHeaderMore = ({ render, field, name, index}) => {
  // renders a custom value in the more prop
  return (
    <Field name={`${name}.${field}`} subscription={{ value: true }}>
      {({ input: { value } }) => <span>{render(index, value)}</span>}
    </Field>
  )
}

const Aux = node => node.children

class ItemArray extends React.Component{
  state = {
    activeKey: this.props?.activeKey || '0',
    modalVisible: false
  }
  componentDidUpdate(prevProps) {
    if (this.props?.activeKey !== prevProps?.activeKey) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        ...this.state,
        activeKey: this.props.activeKey
      })
    }
  }
  handleChange = (activeKey) => {
    if(activeKey !== this.state.activeKey){
      this.setState({
        activeKey
      })
    }
  }
  handleAddItem = (item) => {
    const newItem = {...(item ? item : (this.props.newItem ? this.props.newItem : {})), project: this.projectId}
    if(this.props.formPush) this.props.formPush(this.props.setName, newItem)
  }
  removeItem = (index, fields) => {
    const { sectionIndex, setName } = this.props
    this.props.removeSetItem(sectionIndex, setName, index)
    fields.remove(index)
  }
  handleModalChoice = (item) => {
    this.handleAddItem(item)
    this.setState({
      modalVisible: false
    })
  }
  render(){
    const { t } = this.props
    return (
      <div>
      <Route path="/projects/:id" component={({ match: { params } }) => { if (params.id) { this.projectId = params.id } return null }} />
      <Route path="/programs/:id" component={({ match: { params } }) => { if (params.id) { this.projectId = params.id } return null }} />
      <FieldArray name={this.props.setName} subscription={{}}>
        {({ fields }) => (
          <div>
            {fields.length > 0 &&
            <Collapse accordion onChange={this.handleChange} activeKey={this.state.activeKey}>
              {fields.map((name, index) => (
                <Field name={`${name}.removing`} render={({ input: { value: removing }, ...pprops }) =>
                <Panel
                  {...pprops}
                  className={removing && 'removing'}
                  header={
                    <span>
                    <PanelHeader template={this.props.header} field={this.props.headerField} name={name} index={index} />
                    <RequiredHint section={`section${this.props.sectionIndex}`} name={name} />
                    </span>}
                  extra={this.props.renderExtra ? this.props.renderExtra(name, index, fields) : (
                    <span onClick={event => event.stopPropagation()}>{/* eslint-disable-line */}
                      {this.props.headerMore && <PanelHeaderMore render={this.props.headerMore} field={this.props.headerMoreField} name={name} index={index} />}
                      {/* <Icon type="delete" onClick={event => this.removeItem(event, index, fields)} /> */}
                      <Popconfirm
                        title={t('Are you sure to delete this?')}
                        onConfirm={() => this.removeItem(index, fields)}
                        okText={t('Yes')}
                        cancelText={(t('No'))}
                      >
                        <Button size="small" icon="delete" className="delete-panel" />
                      </Popconfirm>
                    </span>
                  )}
                  key={`${index}`}
                  id={`${this.props.setName}-${index}`}
                >
                  <UpdateHalter parentState={this.state}>
                    <AutoSaveFS sectionIndex={this.props.sectionIndex} setName={this.props.setName} itemIndex={index} />
                    {this.props.panel(name, index)}
                  </UpdateHalter>
                </Panel>
                }
                />
              ))}
            </Collapse>
            }
            <FormSpy subscription={{ values: true }}>
              {({ values }) => <ActiveKeyUpdater values={values} name={this.props.setName} activeKey={this.state.activeKey} setActiveKey={this.handleChange} />}
            </FormSpy>
            {this.props.addButton && this.props.addButton({
              onClick: () => this.handleAddItem()
            })}
            {this.props.modal && (
              <Aux>
                <Button className="bottom-btn" icon="plus" type="dashed" block onClick={() => this.setState({ modalVisible: true })}>{this.props.modal.buttonText}</Button>
                <Modal
                  visible={this.state.modalVisible}
                  footer={null}
                  onCancel={() => this.setState({ modalVisible: false })}
                  className={this.props.modal.className}
                  title={this.props.modal.buttonText}
                >
                  {this.props.modal.component({ onClick: this.handleModalChoice })}
                </Modal>
              </Aux>
            )}
          </div>
        )}
      </FieldArray>
      </div>
    )
  }
}

export default connect(null, actions)(withTranslation()(ItemArray))
