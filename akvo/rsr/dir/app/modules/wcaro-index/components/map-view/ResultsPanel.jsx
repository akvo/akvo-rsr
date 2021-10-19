import React, {useEffect} from 'react'
import {Collapse, List} from 'antd'
import classnames from 'classnames'
import {queryResults, queryResult} from './queries'


const Result = ({id, indicator, setIndicator}) => {
  const { data, isLoading, isError } = queryResult(id)
  useEffect(() => {
    if (data && !indicator) {
      setIndicator(data[0])
    }
  }, [data])

  return <>
    {isError ? (
      <div style={{ color: 'red' }}>Failed to load data!</div>
    ) : isLoading ? (
      <div>Loading...</div>
    ) : (
      <List
        dataSource={data}
        renderItem={item => (
          <List.Item
            className={classnames('wcaro-map-indicator', {active: indicator && indicator.id === item.id})}
            onClick={() => setIndicator(item)}
          >
            <div>
              {item.title}
            </div>
          </List.Item>
        )}
      />
    )}
  </>
}

const ResultsPanel = ({indicator, setIndicator}) => {
  const { data, isLoading, isError } = queryResults()

  // TODO: filter results (data) by countries and period

  return <>
    {isError ? (
      <div style={{ color: 'red' }}>Failed to load data!</div>
    ) : isLoading ? (
      <div>Loading...</div>
    ) : (
      <Collapse destroyInactivePanel defaultActiveKey={data[0].id}>
        {data.map(result => (
          <Collapse.Panel header={result.title} key={result.id}>
            <Result id={result.id} {...{indicator, setIndicator}} />
          </Collapse.Panel>
        ))}
      </Collapse>
    )}
  </>
}

export default ResultsPanel
