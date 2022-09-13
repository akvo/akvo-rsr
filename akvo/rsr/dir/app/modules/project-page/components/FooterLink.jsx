import React from 'react'
import { Row, Col } from 'antd'
import { Container } from 'react-awesome-styled-grid'
import styled from 'styled-components'

import { queryProjectDocuments, queryProjectLinks } from '../queries'
import { Text, Section } from '../../components'

const Footer = styled(Section)`
  h6, a, p {
    color: ${props => props.theme.color.gray['25']};
  }
  i {
    font-style: italic;
    cursor: no-drop;
    color: ${props => props.theme.color.primary['200']};
  }
  a:hover {
    border-bottom: 2px solid ${props => props.theme.color.gray['25']};
  }
  ul {
    line-height: 28px;
  }
  h6 {
    margin-bottom: 20px;
  }
`

const FooterLink = ({ projectId }) => {
  const { data: dataDocs } = queryProjectDocuments(projectId)
  const { data: dataLinks } = queryProjectLinks(projectId)

  const { results: documents } = dataDocs || {}
  const { results: links } = dataLinks || {}
  return (
    <Footer gradient>
      <Container>
        <Row gutter={[8, 32]}>
          <Col lg={6} md={12} sm={24} xs={24}>
            <Text as="h6" size="sm" type="bold">RELATED DOCUMENTS</Text>
            {
              documents === undefined
                ? <p>Loading...</p>
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
            <Text as="h6" size="sm" type="bold">RELATED LINKS</Text>
            {
              links === undefined
                ? (<p>Loading...</p>)
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
            <Text as="h6" size="sm" type="bold">WIDGETS</Text>
            <ul>
              <li>
                <a href={`/en/project/${projectId}/widgets/`} target="_blank" rel="noopener noreferrer">
                  Grab a widget
                </a>
              </li>
            </ul>
          </Col>
          <Col lg={6} md={12} sm={24} xs={24}>
            <Text as="h6" size="sm" type="bold">EXPORT DATA</Text>
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
      </Container>
    </Footer>
  )
}

export default FooterLink
