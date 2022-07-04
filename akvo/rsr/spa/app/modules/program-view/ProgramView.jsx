/* global */
import React from 'react'
import { Collapse, Empty, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import uniq from 'lodash/uniq'
import classNames from 'classnames'

import countriesDict from '../../utils/countries-dict'
import StickyClass from '../program/sticky-class'
import ExpandIcon from '../program/ExpandIcon'
import Highlighted from '../../components/Highlighted'

const { Panel } = Collapse

const ProgramView = ({
  results
}) => {
  const { t } = useTranslation()
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={results.map((r) => r.id)}
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
    >
      {results.map(result => (
        <Panel
          key={result.id}
          header={(
            <StickyClass offset={20}>
              <h1><Highlighted text={result.title} highlight={null} /></h1>
              <div><i>{result.type}</i><span>{t('nindicators', { count: result.indicators.length })}</span></div>
            </StickyClass>
          )}
        >
          <Collapse
            defaultActiveKey={result.indicators.map((i) => i.id)}
            expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          >
            {result.indicators.map((i) => (
              <Panel
                key={i.id}
                header={(
                  <StickyClass top={40}>
                    <h3><Highlighted text={i.title} highlight={null} /></h3>
                    <div><span className="type">{i.type}</span> <span className="periods">{t('nperiods', { count: i.periods.length })}</span></div>
                  </StickyClass>
                )}
              >
                <div className="indicator">
                  <Collapse
                    destroyInactivePanel
                    expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                  >
                    {i?.periods?.map((p) => {
                      const contributors = p.contributors
                      const countries = uniq(p.contributors
                        .flatMap((c) => [c.country, ...c.contributors.map((cb) => cb.country)])
                        .filter((c) => (c))
                        .map((c) => c.isoCode))
                      return (
                        <Panel
                          key={p.id}
                          header={(
                            <div>
                              <h5>{moment(p.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(p.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</h5>
                              <ul className="small-stats">
                                <li><b>{contributors.length}</b> {t('contributor_s', { count: contributors.length })}</li>
                                <li><b>{countries.length}</b> {t('country_s', { count: countries.length })}</li>
                              </ul>
                            </div>
                          )}
                        >
                          {
                            p.contributors.length
                              ? (
                                <Collapse
                                  className="contributors-list"
                                  expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
                                  accordion
                                >
                                  {p.contributors.map((cb) => (
                                    <Panel
                                      key={cb.id}
                                      className={classNames(i.type)}
                                      header={(
                                        <div className="title">
                                          <h4>{cb.projectTitle}</h4>
                                          <p>
                                            {cb.projectSubtitle && <span>{cb.projectSubtitle}</span>}
                                            {cb.country && <span><Icon type="environment" /> {countriesDict[cb.country.isoCode]}</span>}
                                            &nbsp;
                                            {cb.contributors.length > 0 && <b>{t('nsubcontributors', { count: cb.contributors.length })}</b>}
                                            <b>&nbsp;</b>
                                          </p>
                                        </div>
                                      )}
                                    >
                                      <ul className="sub-contributors">
                                        {cb.contributors.map(subproject => (
                                          <li key={subproject.id}>
                                            <div>
                                              <h5>{subproject.projectTitle}</h5>
                                              <p>
                                                {subproject.projectSubtitle && <span>{subproject.projectSubtitle}</span>}
                                                {subproject.country && <span><Icon type="environment" /> {countriesDict[subproject.country.isoCode]}</span>}
                                              </p>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </Panel>
                                  ))}
                                </Collapse>
                              )
                              : <Empty />
                          }
                        </Panel>
                      )
                    })}
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

export default ProgramView
