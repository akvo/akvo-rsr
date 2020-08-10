/* global window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Select, Button, Table, Switch, Spin, Icon, Dropdown, notification } from 'antd'
import moment from 'moment'
import axios from 'axios'
import * as clipboard from 'clipboard-polyfill'
import { useTranslation } from 'react-i18next'
import SVGInline from 'react-svg-inline'
import SUOrgSelect from '../users/su-org-select'
import api from '../../utils/api'
import './styles.scss'
import NewExportModal from './new-export-modal'
import shareSvg from '../../images/share-icn.svg'

const itemsPerPage = 20
let tmid
let signal

const IATI = ({ userRdr }) => {
  const { t } = useTranslation()
  const [currentOrg, setCurrentOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exports, setExports] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [publicIatiFile, setPublicIatiFile] = useState(null)
  const [showNewExportBtn, setShowNewExportBtn] = useState(false)
  const [showSetLatestBtn, setShowSetLatestBtn] = useState(false)
  const fetchExports = (orgId) => {
    clearTimeout(tmid)
    if (signal) {
      signal.cancel('cancel token')
    }
    signal = axios.CancelToken.source()
    api.get('/iati_export/', {
      reporting_organisation: orgId,
      limit: 1000
    }, undefined, signal.token)
      .then(({ data }) => {
        const _exports = data.results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setExports(_exports)
        setLoading(false)
        if(_exports.findIndex(it => it.status === 1) !== -1){
          // there's a pending item
          tmid = setTimeout(() => fetchExports(orgId), 10000)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const _setCurrentOrg = (orgId) => {
    setCurrentOrg(orgId)
    setLoading(true)
    fetchExports(orgId)
    api.get(`/organisation/${orgId}/`)
    .then(({data}) => {
      setPublicIatiFile(data.publicIatiFile)
      setShowNewExportBtn(data.currentUserPermissions.canCreateIatiExport)
      setShowSetLatestBtn(data.currentUserPermissions.canEditIatiExport)
    })
  }
  useEffect(() => {
    if (userRdr && userRdr.organisations) {
      const firstOrg = userRdr.organisations[0]
      if (!firstOrg) window.location.href = '/my-rsr/projects'
      else _setCurrentOrg(firstOrg.id)
    }
  }, [userRdr])
  useEffect(() => {
    return () => {
      clearTimeout(tmid)
    }
  }, [])
  const handleSetLatest = (index) => () => {
    const currentLatestIndex = exports.findIndex(it => it.isLatest)
    let updated = [...exports]
    if(currentLatestIndex !== -1){
      updated = [...exports.slice(0, currentLatestIndex), { ...exports[currentLatestIndex], isLatest: false }, ...exports.slice(currentLatestIndex + 1)]
    }
    updated = [...updated.slice(0, index), { ...updated[index], isLatest: true }, ...updated.slice(index + 1)]
    setExports(updated)
    api.patch(`/iati_export/${updated[index].id}/`, {isLatest: true})
  }
  const orgs = userRdr && userRdr.userManagementOrganisations ? userRdr.userManagementOrganisations.filter(it => it.canEditUsers) : []
  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 300,
      render: (value, obj) => <span>{obj.statusLabel}</span>
    },
    {
      title: '# of projects',
      dataIndex: 'projects',
      key: 'projects',
      render: (value) => <span>{value.length}</span>
    },
    {
      title: 'Created by',
      dataIndex: 'userName',
      key: 'userName',
      render: (value) => <span>{value}</span>
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => <span>{moment(value).format('DD MMM YYYY')}</span>
    },
    {
      title: 'IATI version',
      dataIndex: 'version',
      key: 'version',
      render: (value) => <span>{value}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (value, obj, i) => {
        if (obj.status === 1) return <Spin indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} />
        return [
          <a href={obj.iatiFile} target="_blank" rel="noopener noreferrer"><Button type={obj.isLatest ? 'primary' : 'link'}>{obj.isLatest ? 'View Latest File' : 'View File'}</Button></a>,
          showSetLatestBtn && obj.isLatest === false ? <Button type="link" className="set-as-latest-btn" onClick={handleSetLatest(i)}>Set as latest</Button> : null
        ]
      }
    }
  ]
  const handleShowLatestSwitch = (val) => {
    setPublicIatiFile(val)
    api.patch(`/organisation/${currentOrg}/`, {
      publicIatiFile: val
    })
  }
  const addExport = (_export) => {
    setExports([_export, ...exports])
    if(_export.status === 1){
      tmid = setTimeout(() => fetchExports(_export.reportingOrganisation), 10000)
    }
  }
  const copyLink = (url) => {
    clipboard.writeText(`${window.location.host}${url}`)
    notification.open({
      message: t('Link copied!'),
      icon: <Icon type="link" style={{ color: '#108ee9' }} />,
    })
  }
  return (
  <div className="iati-view">
    <div className="topbar-row">
      <div className="left-side">
        {!(userRdr && userRdr.isSuperuser) && orgs.length > 1 && (
          <Select showSearch size="large" filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0} dropdownMatchSelectWidth={false} value={currentOrg} onChange={_setCurrentOrg}>
            {orgs.map(org => <Select.Option value={org.id} data={org.name}>{org.name}</Select.Option>)}
          </Select>
        )}
        {(userRdr && userRdr.isSuperuser && currentOrg !== null) && <SUOrgSelect value={currentOrg} onChange={_setCurrentOrg} size="large" />}
        <Dropdown
          trigger={['click']}
          overlayStyle={{ zIndex: 99999 }}
          overlayClassName="share-latest-dropdown"
          overlay={
            <ul>
              <li>
                {t('Latest activity file')}<br />
                <a target="_blank" rel="noopener noreferrer" href={`/organisation/${currentOrg}/iati/`}><Button type="link" icon="export">{t('View file')}</Button></a>
                <Button type="link" icon="copy" onClick={() => copyLink(`/organisation/${currentOrg}/iati/`)}>{t('Copy link')}</Button>
              </li>
              <li>
                {t('Latest organisation file')}<br />
                <a target="_blank" rel="noopener noreferrer" href={`/organisation/${currentOrg}/iati-org/`}><Button type="link" icon="export">{t('View file')}</Button></a>
                <Button type="link" icon="copy" onClick={() => copyLink(`/organisation/${currentOrg}/iati-org/`)}>{t('Copy link')}</Button>
              </li>
              <li>
                  {t('Show latest activity file on public page')}&nbsp;&nbsp;&nbsp;<Switch size="small" checked={publicIatiFile} disabled={publicIatiFile == null} onChange={handleShowLatestSwitch} />
              </li>
            </ul>
          }
        >
          <Button size="large" className="share-latest-btn">
            Share latest files
            <SVGInline svg={shareSvg} />
          </Button>
        </Dropdown>
      </div>
      {showNewExportBtn &&
      <div className="right-side">
        <Button type="primary" icon="plus" onClick={() => setShowModal(true)}>{t('New IATI Export')}</Button>
      </div>
      }
    </div>
    <Table
      rowClassName={(rec) => rec.isLatest ? 'latest' : ''}
      dataSource={exports}
      {...{columns, loading}}
      pagination={{ defaultPageSize: itemsPerPage }}
    />
    <NewExportModal visible={showModal} setVisible={setShowModal} {...{ addExport, currentOrg}} userId={userRdr.id} />
  </div>)
}

export default connect(({ userRdr }) => ({ userRdr }))(IATI)
