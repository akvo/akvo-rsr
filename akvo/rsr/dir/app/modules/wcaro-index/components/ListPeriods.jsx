import React from 'react'
import { Collapse, List, Typography, Badge } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import allCountries from '../../../utils/countries.json'
import { Flex } from './Flex'
import { IconText } from './IconText'
import { setNumberFormat } from '../../../utils/misc'

const { Panel } = Collapse
const { Text } = Typography

export const ListPeriods = ({ result }) => {
  const parse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  const selectedCountries = allCountries
    .filter(item => result.countries.includes(item.code.toLowerCase()))
    .map(item => item.name)
    .join(', ')
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={result.indicators}
      renderItem={item => (
        <List.Item
          key={item.title}
        >
          <List.Item.Meta
            title={<a href={item.href}><Badge status="success" />&nbsp;{item.title}</a>}
            description={mdOutput(parse(item.description))}
          />
          <Flex
            paddingLeft="1em"
            left={<Text className="wcaro-small-text small-primary" strong>QUANTITATIVE</Text>}
            right={<IconText type="global" text={selectedCountries} />}
          />
          <ItemPeriods data={item} />
        </List.Item>
      )}
    />
  )
}


const ItemPeriods = ({ data }) => {
  const firstActualValue = data && data.periods.length > 0 ? data.periods[0].actualValue : 0
  const firstTargetValue = data && data.periods.length > 0 ? data.periods[0].targetValue : 0
  data.periods.shift()
  return (
    <Collapse bordered={false} expandIconPosition="right" style={{ marginBottom: '1em' }} className="wcaro-collapsable">
      <Panel
        header={(
          <Flex
            left={
              (
                <>
                  <Text className="wcaro-small-text small-secondary">ACTUAL VALUE</Text><br />
                  <Text className="wcaro-small-text small-secondary" strong>{setNumberFormat(firstActualValue)}</Text>
                </>
              )
            }
            right={
              (
                <>
                  <Text className="wcaro-small-text">TARGET VALUE</Text><br />
                  <Text className="wcaro-small-text" strong>{setNumberFormat(firstTargetValue)}</Text>
                </>
              )
            }
          />
        )}
      >
        {data.periods &&
          <List
            bordered={false}
            dataSource={data.periods}
            renderItem={item => (
              <List.Item key={item.id}>
                <Flex
                  left={(
                    <>
                      <Text className="wcaro-small-text small-secondary">ACTUAL VALUE</Text><br />
                      <Text className="wcaro-small-text small-secondary" strong>{setNumberFormat(item.actualValue)}</Text>
                    </>
                  )}
                  right={(
                    <>
                      <Text className="wcaro-small-text">TARGET VALUE</Text><br />
                      <Text className="wcaro-small-text" strong>{setNumberFormat(item.targetValue)}</Text>
                    </>
                  )}
                />
              </List.Item>
            )}
          />
        }
      </Panel>
    </Collapse>
  )
}
