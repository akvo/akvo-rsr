import React from 'react'
import { Card, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import ConditionalLink from './conditional-link'

const CardsView = ({ dataSource, loading }) => {
  const { t } = useTranslation()
  return (
    <ul className="cards-view">
      {!loading && dataSource.map(project =>
      <li>
        <Card key={project.id}>
          <div className="top">
            <Icon type={project.isPublic ? 'eye' : 'eye-invisible'} />
            <div className="status">{project.status}</div>
          </div>
          <ConditionalLink record={project}>
            <h3>{project.title !== '' ? project.title : t('Untitled project')}</h3>
          </ConditionalLink>
          {project.subtitle !== '' && <small>{project.subtitle}</small>}
        </Card>
      </li>
      )}
    </ul>
  )
}

export default CardsView
