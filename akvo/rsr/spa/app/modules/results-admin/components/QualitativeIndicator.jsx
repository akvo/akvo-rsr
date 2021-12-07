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
            {scores.map((score, index) => (
              <li key={index} style={{ display: 'flex', gap: 6 }}>
                <span>
                  {(scoreIndices?.length && scoreIndices?.includes(index + 1)) ? <Icon type="check" /> : <Icon type="minus" />}
                </span>
                <span dangerouslySetInnerHTML={{ __html: wordWrap(score, 60) }} />
              </li>
            ))}
          </ul>
        </Form.Item>
      )}
      <Form.Item label="Narrative">
        <div className="md-output">{mdOutput(parse(narrative))}</div>
      </Form.Item>
    </Form>
  )
}

export default QualitativeIndicator
