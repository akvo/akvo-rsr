import React from 'react'
import lookup from 'country-code-lookup'
import {
  Row,
  Col,
  List,
  Typography
} from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

const ProjectList = ({
  projects,
  processing
}) => {
  const { t } = useTranslation()
  return (
    <Row type="flex" justify="end" align="top">
      <Col span={21} className="project-list-items">
        <List
          itemLayout="horizontal"
          loading={processing}
          dataSource={projects}
          renderItem={project => (
            <List.Item>
              <a href={`/dir/project/${project.id}/`} target="_blank" rel="noopener noreferrer" className="w-full">
                <Row gutter={[{ sm: 32, lg: 16 }, 8]} className="w-full">
                  <Col span={10}>
                    <img src={project.image} alt={project.title} className="w-full" />
                  </Col>
                  <Col span={14} className="item-info">
                    <Title level={4}>{project.title}</Title>
                    <Text className="locations">
                      {project.countries.map(it => {
                        const found = lookup.byIso(it)
                        if (found) return t(found.country)
                        return it
                      }).join(', ')}
                    </Text>
                  </Col>
                </Row>
              </a>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}

export default ProjectList
