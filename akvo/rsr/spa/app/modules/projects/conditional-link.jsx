import React from 'react'
import { Link } from 'react-router-dom'

const ConditionalLink = ({ record, children, isProgram, isOldVersion = false }) => {
  if(record.restricted === true){
    return <a href={`/en/project/${record.id}/`} target="_blank" rel="noopener noreferrer">{children}</a>
  }
  if (record.status === 'unpublished' && record.editable) {
    return (
      <Link to={`/${(isProgram || record.isProgram) ? 'programs' : 'projects'}/${record.id}`}>
        {children}
      </Link>
    )
  }
  if(isProgram) return <Link to={`/programs/${record.id}`}>{children}</Link>
  return isOldVersion ? <a href={`/en/myrsr/my_project/${record.id}/`}>{children}</a> : <Link to={`/projects/${record.id}/results`}>{children}</Link>
}

export default ConditionalLink
