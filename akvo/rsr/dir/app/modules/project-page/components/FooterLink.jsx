import React from 'react'
import {
  Typography,
  Layout,
  Row,
  Col
} from 'antd'

import { queryProjectDocuments, queryProjectLinks } from '../queries'

const { Footer } = Layout
const { Title, Text } = Typography

const FooterLink = ({ projectId }) => {
  const { data: dataDocs } = queryProjectDocuments(projectId)
  const { data: dataLinks } = queryProjectLinks(projectId)

  const { results: documents } = dataDocs || {}
  const { results: links } = dataLinks || {}
  return (
    <Footer className="footer">
      <Row gutter={[8, 32]}>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Title level={4}>RELATED DOCUMENTS</Title>
          {
            documents === undefined
              ? <Text>Loading...</Text>
              : (
                <>
                  {
                    documents.length
                      ? (
                        <ul>
                          {documents.map((doc, index) => (
                            <li key={index}>
                              <a href={doc.document} target="_blank" rel="noopener noreferrer">
                                {doc.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : <i>No related documents</i>
                  }
                </>
              )
          }

        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Title level={4}>RELATED LINKS</Title>
          {
            links === undefined
              ? (<Text>Loading...</Text>)
              : (
                <>
                  {
                    links.length
                      ? (
                        <ul>
                          {links.map((link, index) => (
                            <li key={index}>
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.caption}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )
                      : <i>No related links</i>
                  }
                </>
              )
          }
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Title level={4}>WIDGETS</Title>
          <ul>
            <li>
              <a href={`/en/project/${projectId}/widgets/`} target="_blank" rel="noopener noreferrer">
                Grab a widget
              </a>
            </li>
          </ul>
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Title level={4}>EXPORT DATA</Title>
          <ul>
            <li>
              <a href={`/rss/updates/${projectId}/`} target="_blank" rel="noopener noreferrer">
                RSS
              </a>
            </li>
            <li>
              <a href={`/rest/v1/project_extra/${projectId}.json`} target="_blank" rel="noopener noreferrer">
                JSON
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Footer>
  )
}

export default FooterLink
