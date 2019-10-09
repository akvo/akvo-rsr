import React from 'react'
import { Table, Icon, Tag, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import ConditionalLink from './conditional-link'

const TableView = ({ dataSource, loading, pagination, onChange }) => {
  const { t } = useTranslation()
  const columns = [
    {
      title: t('Privacy'),
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: 75,
      render: (value) => {
        return <Icon type={value ? 'eye' : 'eye-invisible'} />
      }
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => (<span>{value}</span>)
    },
    {
      title: t('Project'),
      dataIndex: 'title',
      key: 'title',
      className: 'project-title',
      render: (text, record) => (
        <div>
          {record.parent !== null && (<div><Tag className="parent-tag" color="blue">Part of: <a href="#">{record.parent.title}</a></Tag><br /></div>)/* eslint-disable-line */}
          <ConditionalLink record={record}>
            {text !== '' ? text : t('Untitled project')}
          </ConditionalLink>
          {record.subtitle !== '' && <small><br />{record.subtitle}</small>}
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
        if(sectors.length < 3) return sectors.map(sector => <Tag size="small">{sector.codeLabel}</Tag>)
        return sectors.map(sector => {
          const Wrapper = sector.codeLabel.split(' - ')[1] ? () => <Tooltip title={sector.codeLabel.split(' - ')[1]}><Tag size="small">{sector.codeLabel.split(' - ')[0]}...</Tag></Tooltip> : ({ children }) => children
          return <Wrapper><Tag size="small">{sector.codeLabel.split(' - ')[0]}</Tag></Wrapper>
        })
      }
    },
    {
      title: t('Location'),
      dataIndex: 'primaryLocation.countryLabel',
      key: 'location',
      className: 'location',
      width: 170,
      render: (text, record) => {
        const listOfUniqueCountries = record.locations.map(it => it.country).reduce((acc, val) => { if (acc.indexOf(val) === -1) return [...acc, val]; return acc }, []).join(', ')
        return (<span>{listOfUniqueCountries}</span>)
      }
    }
  ]
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
    />
  )
}

export default TableView
