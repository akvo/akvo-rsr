/* global */
import React from 'react'
import { Collapse, Icon, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import moment from 'moment'

import StickyClass from '../program/sticky-class'
import ExpandIcon from '../program/ExpandIcon'
import Highlighted from '../../components/Highlighted'

const { Panel } = Collapse

const InitialView = ({ results, search }) => {
  const { t } = useTranslation()
  const defaultActiveKey = results.slice(0, 1).map((_, ix) => `${ix}`)
  return (
    <Collapse
      defaultActiveKey={defaultActiveKey}
      bordered={false}
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
    >
      {results.map((result, rx) => (
        <Panel
          key={rx}
          header={(
            <StickyClass offset={20}>
              <h1><Highlighted text={result.title} highlight={search} /></h1>
              <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicatorTitles.length })}</span></div>
            </StickyClass>
          )}
        >
          <Collapse
            defaultActiveKey={result.indicatorTitles.slice(0, 1).map((_, tx) => tx)}
            expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          >
            {result.indicatorTitles.map((title, tx) => (
              <Panel
                key={tx}
                header={
                  <StickyClass top={40}>
                    <h3><Highlighted text={title} highlight={search} /></h3>
                    <div><span className="type">{result.type}</span> <span className={classNames('periods', { 'color-periods': false })}>{t('nperiods', { count: result.periods.length })}</span></div>
                  </StickyClass>}
              >
                <div className="indicator">
                  <Collapse
                    defaultActiveKey={Array.from({ length: result.periods.length }).map((_, key) => `${key}`)}
                    expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                  >
                    {
                      result
                        .periods
                        .filter((p) => (p[0] && p[1]))
                        .sort((a, b) => moment(b[0], 'DD/MM/YYYY').unix() - moment(a[0], 'DD/MM/YYYY').unix())
                        .map((p, px) => {
                          const { 0: periodStart, 1: periodEnd } = p
                          return (
                            <Panel
                              key={px}
                              header={(
                                <div>
                                  <h5 className={classNames({ 'color-periods': false })}>{moment(periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')} - {moment(periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')}</h5>
                                  <ul className="small-stats">
                                    <li>Loading...</li>
                                  </ul>
                                </div>
                              )}
                            >
                              <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} /></div>
                            </Panel>
                          )
                        })
                    }
                  </Collapse>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Panel>
      ))}
    </Collapse>
  )
}

export default InitialView
