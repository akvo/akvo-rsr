import React from 'react'
import { Button, Divider, Spin, Table } from 'antd'
import { Link } from 'react-router-dom'
import {useFetch} from '../../utils/hooks'

const columns = [
  {
    title: 'Projects',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <Link to={`/projects/${record.id}`}>{text !== '' ? text : 'Untitled project'}</Link>
  },
  {
    title: 'Location',
    dataIndex: 'primaryLocation',
    key: 'location'
  },
  // {
  //   title: 'Relationship',
  //   dataIndex: '',
  //   key: 'relationship'
  // },
  {
    title: 'Date End (Planned)',
    dataIndex: 'dateEndPlanned',
    key: 'dateEndPlanned'
  }
]
const Projects = () => {
  const [{results}, loading] = useFetch('/project/')
  return (
    <div>
      <h1>My projects</h1>
      <Link to="/projects/new"><Button type="primary" icon="plus">Create new project</Button></Link>
      <Divider />
      {loading && <div style={{ justifyContent: 'center', display: 'flex'}}><Spin size="large" /></div>}
      {!loading && (
        <Table dataSource={results} columns={columns} />
      )}
    </div>
  )
}

export default Projects
