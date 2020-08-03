/* global window */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Select, Button, Table, Switch } from 'antd'
import moment from 'moment'
import {cloneDeep} from 'lodash'
import SUOrgSelect from '../users/su-org-select'
import api from '../../utils/api'
import './styles.scss'
import NewExportModal from './new-export-modal'

const itemsPerPage = 20

const IATI = ({ userRdr }) => {
  const [currentOrg, setCurrentOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exports, setExports] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [publicIatiFile, setPublicIatiFile] = useState(null)
  const _setCurrentOrg = (orgId) => {
    setCurrentOrg(orgId)
    setLoading(true)
    api.get(`/iati_export/?reporting_organisation=${orgId}&limit=1000`)
    .then(({data}) => {
      setExports(data.results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setLoading(false)
    })
    .catch(() => {
      setLoading(false)
    })
    api.get(`/organisation/${orgId}/`)
    .then(({data}) => {
      setPublicIatiFile(data.publicIatiFile)
    })
  }
  useEffect(() => {
    if (userRdr && userRdr.organisations) {
      const firstOrg = userRdr.organisations.filter(it => it.canEditUsers)[0]
      if (!firstOrg) window.location.href = '/my-rsr/projects'
      else _setCurrentOrg(firstOrg.id)
    }
  }, [userRdr])
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
        return [
          <a href={obj.iatiFile} target="_blank" rel="noopener noreferrer"><Button type={obj.isLatest ? 'primary' : 'default'}>View file</Button></a>,
          obj.isLatest === false ? <Button type="link" className="set-as-latest-btn" onClick={handleSetLatest(i)}>Set as latest</Button> : null
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
        <a target="_blank" rel="noopener noreferrer" href={`/organisation/${currentOrg}/iati/`}><Button type="link">View Latest Activity File</Button></a>
        <a target="_blank" rel="noopener noreferrer" href={`/organisation/${currentOrg}/iati-org/`}><Button type="link">View Latest Organisation File</Button></a>
        <div className="show-latest-switch">
          <Switch size="small" checked={publicIatiFile} disabled={publicIatiFile == null} onChange={handleShowLatestSwitch} /> <small>Show latest activity file on public page</small>
        </div>
      </div>
      <div className="right-side">
        <Button type="primary" icon="plus" onClick={() => setShowModal(true)}>New IATI Export</Button>
      </div>
    </div>
    <Table
      rowClassName={(rec) => rec.isLatest ? 'latest' : ''}
      dataSource={exports}
      {...{columns, loading}}
      pagination={{ defaultPageSize: itemsPerPage }}
    />
    <NewExportModal visible={showModal} setVisible={setShowModal} currentOrg={currentOrg} />
  </div>)
}

export default connect(({ userRdr }) => ({ userRdr }))(IATI)
