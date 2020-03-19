import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const ConditionalLink = connect(({ userRdr: { lang } }) => ({ lang }))(({ record, children, lang }) => {
  if(record.restricted === true){
    return <a href={`/en/project/${record.id}/`} target="_blank" rel="noopener noreferrer">{children}</a>
  }
  if (record.status === 'unpublished' && record.editable) {
    return (
      <Link to={`/projects/${record.id}`}>
        {children}
      </Link>
    )
  }
  return (
    <a href={`/${lang}/myrsr/my_project/${record.id}/`}>{children}</a>
  )
})

export default ConditionalLink
