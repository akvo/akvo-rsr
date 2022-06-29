import React, { useEffect, useState } from 'react'
import { Collapse, Empty, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import { groupBy, sumBy } from 'lodash'
import classNames from 'classnames'
import moment from 'moment'

import { setNumberFormat } from '../../utils/misc'
import countriesDict from '../../utils/countries-dict'
import ExpandIcon from '../program/ExpandIcon'
import api from '../../utils/api'
import ApprovedUpdates from '../program/ApprovedUpdates'
import ValueComments from './ValueComments'

const { Panel } = Collapse

const ProgramContributor = ({
  id: periodID,
  dataId,
  pinned,
  type,
  fetched,
  updates,
  openedItem,
  contributors,
  totalActualValues,
  results,
  setResults,
  onChange
}) => {
  const { t } = useTranslation()
  const [preload, setPreload] = useState(true)
  const [fetching, setFetching] = useState(true)
  useEffect(() => {
    if (preload && fetched === undefined) {
      setPreload(false)
      const ids = [
        ...contributors?.map((cb) => cb.id),
        ...contributors?.flatMap((cb) => cb?.contributors)?.map((cb) => cb.id)
      ].join(',')
      api
        .get(`/program/${dataId}/indicator_updates_by_period_id/?format=json&ids=${ids}`)
        .then(res => {
          const groupUpdates = groupBy(res.data, 'period')

          const updateItems = Object.keys(groupUpdates)?.map((_key) => {
            const item = contributors?.flatMap((cb) => [cb, ...cb?.contributors])?.find((c) => `${c.id}` === _key) || {}
            const total = type === 'quantitative' ? sumBy(groupUpdates[_key], 'value') : 0
            return {
              ...item,
              updates: groupUpdates[_key],
              total
            }
          })
          const projects = contributors?.map((cb) => {
            const findUpdate = updateItems.find((u) => u?.id === cb.id) || {}
            if (cb?.contributors?.length && Object.keys(findUpdate).length === 0) {
              const childs = cb.contributors.map((it) => {
                const findChild = updateItems.find((u) => u?.id === it.id) || {}
                return ({
                  ...it,
                  updates: findChild?.updates || [],
                  total: parseInt(findChild?.total || 0, 10)
                })
              })
              const grandTotal = sumBy(childs, 'total')
              return ({
                ...cb,
                contributors: childs,
                total: grandTotal,
                updates: []
              })
            }
            return ({
              ...cb,
              updates: findUpdate?.updates || [],
              total: findUpdate?.total || 0
            })
          })
          const modified = results.map((r) => ({
            ...r,
            indicators: r.indicators.map((i) => ({
              ...i,
              periods: i.periods.map((p) => {
                if (p.id === periodID) {
                  return {
                    ...p,
                    contributors: projects,
                    fetched: true
                  }
                }
                return p
              })
            }))
          }))
          setResults(modified)
          setFetching(false)
        })
        .catch(() => {
          setFetching(false)
        })
    }
  }, [updates, fetching])
  const scoreOptions = []

  return (fetching && fetched === undefined)
    ? (<>Loading...</>)
    : (
      <>
        {
          contributors.length
            ? (
              <Collapse
                onChange={onChange}
                defaultActiveKey={contributors.length === 1 ? '0' : null}
                className="contributors-list"
                expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                accordion
              >
                {contributors?.sort((a, b) => b.total - a.total)?.map((cb, _index) => {
                  const totalParentValues = sumBy(cb.updates, 'value')
                  return (
                    <Panel
                      key={_index}
                      className={classNames(type, { pinned: pinned === _index })}
                      header={(
                        <>
                          <div className="title">
                            <h4>{cb.projectTitle}</h4>
                            <p>
                              {cb.projectSubtitle && <span>{cb.projectSubtitle}</span>}
                              {cb.country && <span><Icon type="environment" /> {countriesDict[cb.country.isoCode]}</span>}
                              &nbsp;
                              {cb?.contributors?.length > 0 && <b>{t('nsubcontributors', { count: cb.contributors.length })}</b>}
                              <b>&nbsp;</b>
                            </p>
                          </div>
                          {type === 'quantitative' && (
                            <>
                              <div className="total">
                                <i>total</i>
                                <div>
                                  <b>{setNumberFormat(cb.total)}</b><br />
                                </div>
                              </div>
                              {
                                openedItem === _index
                                  ? (
                                    <div className="value">
                                      <b>{setNumberFormat(totalParentValues)}</b>
                                      {totalActualValues > 0 && <small>{Math.round((totalParentValues / totalActualValues) * 100 * 10) / 10}%</small>}
                                      {cb.updates.length > 0 &&
                                        <div className="updates-popup">
                                          <header>{cb.updates.length} approved updates</header>
                                          <ul>
                                            {cb.updates.map(update => <li><span>{moment(update.createdAt).format('DD MMM YYYY')}</span><span>{update.user.name}</span><b>{setNumberFormat(update.value)}</b></li>)}
                                          </ul>
                                        </div>
                                      }
                                    </div>
                                  )
                                  :
                                  (
                                    <div className="value">
                                      <b>{setNumberFormat(totalParentValues)}</b>
                                      {totalActualValues > 0 && <small>{Math.round((totalParentValues / totalActualValues) * 100 * 10) / 10}%</small>}
                                    </div>
                                  )}
                            </>
                          )}
                        </>
                      )}
                    >
                      {(type === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={cb.updates} />}
                      <ul className="sub-contributors">
                        {cb?.contributors?.map(subproject => {
                          const totalChildValues = sumBy(subproject.updates, 'value')
                          return (
                            <li key={subproject.id}>
                              <div>
                                <h5>{subproject.projectTitle}</h5>
                                <p>
                                  {subproject.projectSubtitle && <span>{subproject.projectSubtitle}</span>}
                                  {subproject.country && <span><Icon type="environment" /> {countriesDict[subproject.country.isoCode]}</span>}
                                </p>
                              </div>
                              <div className={classNames('value', `score-${subproject.scoreIndex ? subproject.scoreIndex + 1 : 1}`, { score: type === 'qualitative' && scoreOptions != null })}>
                                {type === 'quantitative' && [
                                  <b>{setNumberFormat(cb.total)}</b>,
                                  <small>{Math.round((cb.total / totalChildValues) * 100 * 10) / 10}%</small>
                                ]}
                                {(type === 'qualitative' && scoreOptions != null) && (
                                  <div className="score-box">Score {subproject.scoreIndex + 1}</div>
                                )}
                                {subproject.updates.length > 0 &&
                                  <div className="updates-popup">
                                    <header>{subproject.updates.length} approved updates</header>
                                    <ul>
                                      {subproject.updates.map(update => (
                                        <li key={update.id}>
                                          <span>{moment(update.createdAt).format('DD MMM YYYY')}</span>
                                          <span>{`${update?.userDetails?.firstName} ${update?.userDetails?.lastName}`}</span>
                                          {update.value && <b>{setNumberFormat(update.value)}</b>}
                                          {update.scoreIndex != null && <b><small>Score {update.scoreIndex ? update.scoreIndex + 1 : 1}</small></b>}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                }
                              </div>
                              {(type === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={subproject.updates} />}
                            </li>
                          )
                        })}
                      </ul>
                      {(type === 'quantitative' || scoreOptions != null) && <ValueComments items={cb.updates} />}
                    </Panel>
                  )
                })}
              </Collapse>
            )
            : <Empty />
        }
      </>
    )
}

export default ProgramContributor
