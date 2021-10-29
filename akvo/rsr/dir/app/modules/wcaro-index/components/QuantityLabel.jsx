/* eslint-disable no-restricted-globals */
import React from 'react'
import { Typography, Icon, Tooltip } from 'antd'
import classNames from 'classnames'
import jsoncountries from '../../../utils/countries.json'

const { Text } = Typography

export const QuantityLabel = ({
  onClick,
  indicators,
  countries,
  indicatorCount,
  nCountry
}) => {
  return (
    <ul className="wcaro-indicators">
      <li>
        {countries
          ? (
            <Tooltip
              placement="right"
              title={(
                <>
                  {countries.length
                    ? (
                      <>
                        {countries.map((c) => (
                          <div key={c}>
                            {jsoncountries.find((jc) => jc.code === c.toUpperCase()).name || ''}<br />
                          </div>
                        ))}
                      </>
                    )
                    : ''
                  }
                </>
              )}
            >
              <Text className="text-green-muted">
                <Icon type="global" />&nbsp;
                {isNaN(nCountry) ? nCountry : nCountry > 1 ? `${nCountry} Countries` : `${nCountry} Country`}
              </Text>
            </Tooltip>
          ) : (
            <Text className="text-green-muted">
              <Icon type="global" />&nbsp;
              {isNaN(nCountry) ? nCountry : nCountry > 1 ? `${nCountry} Countries` : `${nCountry} Country`}
            </Text>
          )}
      </li>
      <li>
        <Text
          className={classNames({
            'text-green-muted': !(onClick)
          })}
          onClick={onClick}
          strong={(onClick)}
        >
          <Icon type="dashboard" theme="filled" />&nbsp;
          {indicators ? `${indicators.length} indicators` : indicatorCount > 0 ? ` ${indicatorCount} indicators` : ' Loading...'}&nbsp;&nbsp;
          {onClick && <Icon type="right" />}
        </Text>
      </li>
    </ul>
  )
}
