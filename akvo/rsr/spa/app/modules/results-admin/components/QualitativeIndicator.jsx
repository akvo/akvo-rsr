/* eslint-disable react/no-danger */
import React from 'react'
import { Form, Icon } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import { wordWrap } from '../../../utils/misc'

const QualitativeIndicator = ({ scores, scoreIndices, narrative }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return (
    <Form layout="vertical">
      {scores.length > 0 && (
        <Form.Item label="Score">
          <ul>
            {scores.map((score, index) => {
              return (scoreIndices?.length && scoreIndices?.includes(index + 1))
                ? (
                  <li key={index} style={{ display: 'flex', gap: 4, color: 'blueviolet' }}>
                    <span>
                      <Icon type="check-circle" theme="filled" />
                    </span>
                    <strong dangerouslySetInnerHTML={{ __html: wordWrap(score, 60) }} />
                  </li>
                )
                : (
                  <li key={index} style={{ display: 'flex', gap: 12 }}>
                    <span>
                      &bull;
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: wordWrap(score, 60) }} />
                  </li>
                )
            })}
          </ul>
        </Form.Item>
      )}
      <Form.Item label="Narrative">
        <div className="md-output">{narrative ? mdOutput(parse(narrative)) : '-'}</div>
      </Form.Item>
    </Form>
  )
}

export default QualitativeIndicator
