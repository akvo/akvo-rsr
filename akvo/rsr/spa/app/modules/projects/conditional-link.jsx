import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const ConditionalLink = connect(({ userRdr: { lang } }) => ({ lang }))(({ record, children, lang }) => {
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
