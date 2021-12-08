import React, { useState } from 'react'
import { Collapse, Button } from 'antd'
import SimpleMarkdown from 'simple-markdown'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { MobileSlider, IndicatorItem } from '../../../components'
import Reported from './Reported'

export const TobeReported = ({
  userRdr,
  scrollPosition,
  indicators,
  selected,
  mobilePage,
  mobileGoBack,
  jwtView,
  mneView,
  deleteUpdate,
  setActiveIndicator,
  ...props
}) => {
  const [activeKey, setActiveKey] = useState(null)
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
            <ul className="indicators" style={{ height: `calc(100vh - ${scrollPosition > 240 ? 55 : 350}px)` }}>
              {indicators?.map(indicator => (
                <IndicatorItem
                  key={indicator?.id}
                  onClick={() => setActiveIndicator(indicator)}
                  {...{
                    mneView,
                    indicator,
                    uid: userRdr?.id,
                    selected: selected?.id === indicator?.id,
                    scrollPosition
                  }}
                />
              ))}
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
                  {selected && selected.periods?.map(period => <Reported {...{ ...props, period, mneView, activeKey, deleteUpdate, indicator: selected }} />)}
                </Collapse>
              </>
            )}
          </div>
        </MobileSlider>
      </div>
    )
}
