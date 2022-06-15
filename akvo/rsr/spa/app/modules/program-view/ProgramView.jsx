/* global */
import React from 'react'
import { Collapse } from 'antd'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Result from '../program/result'
import StickyClass from '../program/sticky-class'
import ExpandIcon from '../program/ExpandIcon'

const { Panel } = Collapse

const ProgramView = ({
  params,
  results,
  loading,
  countryFilter,
  filterCountry,
  targetsAt,
  setResults,
  handleResultChange,
}) => {
  const { t } = useTranslation()
  if (!loading && results.length > 0) {
    return (
      <Collapse bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
        {results.filter(filterCountry(countryFilter)).map((result, index) =>
          <Panel
            key={index}
            header={(
              <StickyClass offset={20}>
                <h1>{result.title}</h1>
                <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorCount })}</span></div>
              </StickyClass>
            )}
          >
            <Result programId={params.projectId} {...{ ...result, countryFilter, results, setResults, targetsAt }} />
          </Panel>
        )}
      </Collapse>
    )
  }
  if (!loading) return <Redirect to={`/programs/${params.projectId}/editor`} />
  return null
}

export default ProgramView
