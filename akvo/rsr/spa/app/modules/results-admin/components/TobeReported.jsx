import React from 'react'
import { Collapse, Badge, Button } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { MobileSlider, AddUpdate } from '../../../components'

export const TobeReported = ({
  indicators,
  selected,
  mobilePage,
  mobileGoBack,
  jwtView,
  mneView,
  activeKey,
  setActiveKey,
  setActiveIndicator,
  ...props
}) => {
  const { t } = useTranslation()
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return indicators.length === 0
    ? <div className="empty">{t('No submission due')}</div>
    : (
      <div className="enumerator-view mneView">
        <MobileSlider page={mobilePage}>
          <div>
            <header className="mobile-only">
              <h1>{selected?.title}</h1>
            </header>
            <ul className="indicators">
              {indicators?.map(indicator => {
                const isDeclined = indicator.periods.filter(period => period.updates.filter(update => update.status === 'R').length > 0).length > 0
                return (
                  <li key={indicator.id} className={classNames({ selected: selected === indicator, declined: isDeclined })} onClick={() => setActiveIndicator(indicator)}>
                    {isDeclined ? <Badge status="error" text={indicator.title} /> : <h5>{indicator.title}</h5>}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="content">
            {selected && (
              <>
                <header className="mobile-only">
                  <Button icon="left" type="link" size="large" onClick={mobileGoBack} />
                  <div>
                    <h2>{selected.title}</h2>
                    <span className="desc">
                      {mdOutput(mdParse(selected?.description))}
                    </span>
                  </div>
                </header>
                {selected && selected?.description?.length > 0 && (
                  <details open>
                    <summary>{t('Description')}</summary>
                    <p className="desc hide-for-mobile">{mdOutput(mdParse(selected?.description))}</p>
                  </details>
                )}

                <Collapse
                  activeKey={activeKey}
                  onChange={ev => setActiveKey(ev)}
                  destroyInactivePanel
                  className={classNames({ webform: jwtView })}
                >
                  {selected && selected.periods?.map(period =>
                    <AddUpdate key={period.id} {...{ ...props, period, mneView, activeKey, indicator: selected }} />
                  )}
                </Collapse>
              </>
            )}
          </div>
        </MobileSlider>
      </div>
    )
}
