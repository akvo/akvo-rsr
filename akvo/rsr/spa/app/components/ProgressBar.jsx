import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { setNumberFormat } from '../utils/misc'

import './ProgressBar.scss'

const ProgressBar = ({ period, values, valueRef, onlyApproved = false }) => {
  const { t } = useTranslation()

  const handleOnClick = (index) => () => {
    valueRef.current.children[0].children[index].children[0].click()
  }

  const perc = period.targetValue > 0
    ? Math.round((values.filter(it => it.status === 'A').reduce((a, v) => a + v.value, 0) / period.targetValue) * 100 * 10) / 10
    : 0
  const valuesTotal = values.filter(it => it.status !== 'P').reduce((acc, val) => acc + val.value, 0)
  return (
    <div id="progressBar">
      <div className="labels">
        <div className="value-label actual">
          <div className="label">{t('Actual value')}</div>
          <div className="value">{setNumberFormat(values.filter(it => it.status === 'A').reduce((acc, v) => acc + v.value, 0))}</div>
        </div>
        {period.targetValue > 0 && (
          <div className="value-label target">
            <div className="label">{t('Target value')}</div>
            <div className="value-container">
              <div className="value">{setNumberFormat(period.targetValue)}</div>
            </div>
          </div>
        )}
      </div>
      <div className="bar">
        {
          values
            .sort((a, b) => { if (b.status === 'D' && a.status !== 'D') return -1; return 0; })
            .filter((value) => ((onlyApproved && value.status === 'A') || !onlyApproved))
            .map((value, index) => {
              let barProps = {
                className: classNames('fill', {
                  draft: value.status === 'D',
                  pending: value.status === 'P'
                }),
                tabIndex: '-1',
                style: {
                  flex: period.targetValue > 0 ? value.value / period.targetValue : value.value / valuesTotal
                }
              }
              if (valueRef) {
                barProps = {
                  ...barProps,
                  onClick: handleOnClick(values.length - index - 1),
                  role: 'button'
                }
              }
              return (
                <Tooltip title={String(value.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}>
                  <div {...barProps}>
                    {
                      (
                        (perc > 0) &&
                        (value.status === 'A') &&
                        (index === values.length - 1 || values[index + 1].status === 'D')
                      ) && <span className={classNames('text-color', perc < 20 ? 'flip' : 'no-flip')}>{perc}%</span>
                    }
                  </div>
                </Tooltip>
              )
            })
        }
      </div>
    </div>
  )
}

export default ProgressBar
