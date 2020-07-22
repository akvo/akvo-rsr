import React from 'react'
import { Table, Icon, Tag, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ConditionalLink from './conditional-link'
import COUNTRIES from '../../utils/countries.json'

const countryDict = {}
COUNTRIES.forEach(({ name, code }) => { countryDict[code.toLowerCase()] = name })

const TableView = ({ dataSource, loading, pagination, onChange }) => {
  const { t } = useTranslation()
  const columns = [
    {
      title: t('Privacy'),
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: 82,
      render: (value) => {
        return <Tooltip title={value ? t('public') : t('private')}><Icon type={value ? 'eye' : 'eye-invisible'} /></Tooltip>
      }
    },
    {
      title: t('Project'),
      dataIndex: 'title',
      key: 'title',
      className: 'project-title',
      render: (text, record) => (
        <div>
          {(record.parent !== null && !record.parent.isLead) && (<div className="parent-caption"><span>Contributes to:</span> <Link to={`/hierarchy/${record.id}`}>{record.parent.title}</Link><br /></div>)/* eslint-disable-line */}
          {(record.parent !== null && record.parent.isLead) && (<div className="parent-caption"><span>Program:</span> <Link to={`/programs/${record.parent.id}`}>{record.parent.title}</Link><br /></div>)/* eslint-disable-line */}
          <ConditionalLink record={record}>
            {text !== '' ? text : t('Untitled project')}
          </ConditionalLink>
          {record.subtitle !== '' && <small><br /><span className="subtitle">{record.subtitle}</span></small>}
          {record.useProjectRoles && [
            <Tooltip placement="right" overlayClassName="member-access-tooltip" title={<span><i>Only these members can access: </i><br /><div className="divider" />{record.roles.map(role => <span><b>{role.name}</b> | <i>{role.role}</i><br /></span>)}</span>}>
              <span className="access"><Icon type="lock" /> restricted access</span>
            </Tooltip>
          ]}
          {!record.useProjectRoles &&
            <Tooltip title={<span>Members of all project partners have access</span>}>
            <span className="access"><Icon type="unlock" /> unrestricted access</span>
            </Tooltip>
          }
        </div>
      )
    },
    {
      title: t('Sector'),
      dataIndex: 'sectors',
      key: 'sectors',
      className: 'sectors',
      render: (sectors) => {
        // return (<small>{sectors.map(sector => sector.codeLabel).join(', ')}</small>)
        if (sectors.length < 3) return sectors.filter(it => it.codeLabel !== '').map(sector => <Tag size="small">{sector.codeLabel}</Tag>)
        return (
          <div className="sectors-wrapper">
            {sectors.filter(it => it.codeLabel !== '').map(sector => {
              const Wrapper = sector.codeLabel.split(' - ')[1] ? () => <Tooltip title={sector.codeLabel.split(' - ')[1]}><Tag size="small">{sector.codeLabel.split(' - ')[0]}...</Tag></Tooltip> : ({ children }) => children
              return <Wrapper><Tag size="small">{sector.codeLabel.split(' - ')[0]}</Tag></Wrapper>
            })}
          </div>
        )
      }
    },
    {
      title: t('Location'),
      dataIndex: 'primaryLocation.countryLabel',
      key: 'location',
      className: 'location',
      width: 170,
      render: (text, record) => {
        const listOfUniqueCountries =
          [
            ...record.locations.map(it => countryDict[it.isoCode]),
            ...record.recipientCountries.map(it => countryDict[it.country.toLowerCase()])
          ]
          .reduce((acc, val) => { if (acc.indexOf(val) === -1) return [...acc, val]; return acc }, []).join(', ')
        return (<span>{listOfUniqueCountries}</span>)
      }
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 104,
      className: 'status',
      render: (value) => (<span className={value}>{t(value)}</span>)
    }
  ]
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
      rowClassName={(record) => record.restricted ? 'inaccessible' : ''}
    />
  )
}

export default TableView
