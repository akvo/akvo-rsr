import React from 'react'
import moment from 'moment'
import { Icon, Tooltip } from 'antd'

const getAggregatedUpdatesLength = (updates, contributors) => {
  let total = 0
  total += updates.filter(it => it.status && it.status.code === 'A').length
  contributors.forEach(contrib => {
    total += getAggregatedUpdatesLength(updates, contrib)
  })
  return total
}

const ProjectSummary = ({
  _index,
  indicatorType,
  openedItem,
  aggFilteredTotal,
  scoreOptions,
  scoreIndex,
  actualValue,
  updatesValue,
  updates,
  contributors
}) => {
  if (indicatorType === 'quantitative') {
    return (
      <>
        <div className="total">
          <i>total</i>
          <div>
            <b>{String(actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b><br />
          </div>
        </div>
        {
          openedItem === _index
            ? (
              <div className="value">
                <b>{String(updatesValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                {actualValue > 0 && <small>{Math.round(((updatesValue) / actualValue) * 100 * 10) / 10}%</small>}
                {updates.length > 0 &&
                  <div className="updates-popup">
                    <header>{updates.length} approved updates</header>
                    <ul>
                      {updates.map(update => <li><span>{moment(update.createdAt).format('DD MMM YYYY')}</span><span>{update.user.name}</span><b>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></li>)}
                    </ul>
                  </div>
                }
              </div>
            )
            :
            (
              <div className="value">
                <b>{String(actualValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                {aggFilteredTotal > 0 && <small>{Math.round((actualValue / aggFilteredTotal) * 100 * 10) / 10}%</small>}
              </div>
            )
        }
      </>
    )
  }

  if (contributors.length === 0 && scoreIndex != null) {
    return <div className={`project-summary single-score score-${scoreIndex}`}>Score {scoreIndex + 1}</div>
  }

  if (contributors.length > 0 && scoreOptions != null) {
    const scores = {}
    contributors.forEach(contrib => {
      if (contrib.scoreIndex != null) {
        if (!scores[contrib.scoreIndex]) scores[contrib.scoreIndex] = 0
        scores[contrib.scoreIndex] += 1
      }
    })
    return (
      <ul className="project-summary score-aggregate">
        {Object.keys(scores).map(ind =>
          <Tooltip title={scoreOptions[Number(ind)]}>
            <li className={`score-${Number(ind) + 1}`}>
              <div className="cap">score {Number(ind) + 1}</div>
              <div>{scores[ind]} <small>projects</small></div>
            </li>
          </Tooltip>
        )}
      </ul>
    )
  }
  return (
    <div className="updates">
      <Icon type="align-left" /> {getAggregatedUpdatesLength(updates, contributors)} Updates
    </div>
  )
}

export default ProjectSummary
