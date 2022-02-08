import React from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { resultTypes } from '../utils/constants'

const { Text } = Typography

const ResultType = ({ type, title }) => {
  const { t } = useTranslation()
  const resultName = resultTypes.find((r) => r.value === type)?.label
  const titles = title?.split(':')
  const isIncluded = (titles.length > 1 && title?.toLowerCase()?.includes(resultName))
  return isIncluded
    ? (
      <>
        <Text strong>{titles[0]}</Text>
        <Text>&nbsp;:&nbsp;{titles[1]}</Text>
      </>
    )
    : (
      <>
        <Text strong>{t(resultName)}</Text>
        <Text>&nbsp;:&nbsp;{title}</Text>
      </>
    )
}

export default ResultType
