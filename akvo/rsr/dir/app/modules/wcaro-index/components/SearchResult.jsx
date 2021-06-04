import React from 'react'
import { Avatar, List } from 'antd'
import allCountries from '../../../utils/countries.json'

export const SearchResult = ({ items }) => {
  return (
    <List
      style={{
        width: '25em',
        height: '350px',
        overflowY: 'scroll'
      }}
      dataSource={items}
      renderItem={item => {
        const city = allCountries.find(country => country.code === item.countries[0] || '')
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar shape="square" src={item.image} alt={item.title} />}
              title={<a href={`/en/project/${item.id}/`} target="_blank" rel="noopener noreferrer">{item.title}</a>}
              description={city ? city.name : ''}
            />
          </List.Item>
        )
      }}
    />
  )
}
