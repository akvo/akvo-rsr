/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from 'react'
import PropTypes from 'prop-types';
import { connect } from "react-redux"
import Collapse, {  Panel } from 'rc-collapse';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import * as c from '../const.js';

import {
    getIndicatorsAggregateActualValue,
    getIndicatorsAggregateCompletionPercentage, getIndicatorsChildrenIds,
    getResultsChildrenIds
} from "../selectors";

import { collapseChange } from "../actions/collapse-actions"

import {
    _,
    collapseId,
    createToggleKeys,
    hideMe,
} from '../utils';

import Periods from './Periods';


const IndicatorHeaderPeriodCount = ({count}) => {
    const periodText = count == 1 ? 'period' : 'periods';
    return <li> {count} {periodText}</li>;
};
IndicatorHeaderPeriodCount.propTypes = {
    count: PropTypes.number
};


const IndicatorHeader = (
        {indicator, periodCount, aggregateActualValue, aggregateCompletionPercentage}) => {
    const title = indicator.title.length > 0 ? indicator.title : _("nameless_indicator");
    const type = indicator.type === 1 ? 'Quantitative' : 'Qualitative';
    // Don't show progress bar if there's no target value (aggregateCompletionPercentage is NaN)
    const progress_bar = aggregateCompletionPercentage !== aggregateCompletionPercentage ? undefined : (
        // Limit percentage to 100 for progress bar to work correctly
        <li className="indicatorProgress">
            <Progress type="circle"
                      strokeWidth={5}
                      width={35}
                      percent={Math.min(100, aggregateCompletionPercentage)} />
        </li>
    );
    return (
        <span className="indicatorTitle">
            <ul>
                <li>{title}</li>
                <li>{type}</li>
                <IndicatorHeaderPeriodCount count={periodCount} />
                {progress_bar}
            </ul>
        </span>
    )
};
IndicatorHeader.propTypes = {
    indicator: PropTypes.object,
    periodCount: PropTypes.number,
    aggregateActualValue: PropTypes.number,
    aggregateCompletionPercentage: PropTypes.number,
};


const IndicatorContent = ({indicator}) => {
    const description = indicator.description.length > 0 ? (
        <ul>
            <li className="description">
                <span>{indicator.description}</span>
            </li>
        </ul>
    ): undefined;
    return (
        <div className="indicatorInfo">
            {description}
            <ul>
                <li className="baseline-year">
                    {_('baseline_year')}: <span>{indicator.baseline_year}</span>
                </li>
                <li className="baseline-value">
                    {_('baseline_value')}: <span>{indicator.baseline_value}</span>
                </li>
            </ul>

            <ul>
                <li className="value-header hidden-header">{/* Selction toggle */}</li>
                <li className="value-header hidden-header">{/* Period dates */}</li>
                <li className="value-header">Target</li>
                <li className="value-header">Actual</li>
            </ul>
        </div>
    )
};
IndicatorContent.propTypes = {
    indicator: PropTypes.object
};


@connect((store) => {
    return {
        indicators: store.models.indicators,
        periods: store.models.periods,
        keys: store.keys,
        ui: store.ui,
        resultChildrenIds: getResultsChildrenIds(store),
        indicatorsChildrenIds: getIndicatorsChildrenIds(store),
        aggregateActualValue: getIndicatorsAggregateActualValue(store),
        aggregateCompletionPercentage: getIndicatorsAggregateCompletionPercentage(store),
    }
})
export default class Indicators extends React.Component {

    static propTypes = {
        parentId: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.hideMe = this.hideMe.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(c.OBJECTS_INDICATORS, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, c.OBJECTS_INDICATORS, this.activeKey());
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        })
    }

    hideMe(id) {
        return hideMe(c.OBJECTS_INDICATORS, this.props.parentId, id);
    }

    renderPanels(indicatorIds) {
        return (indicatorIds.map(
            (id) => {
                const indicator = this.props.indicators.objects[id];
                const className = this.hideMe(id) ? 'hidePanel' : '';
                const periods = this.props.indicatorsChildrenIds[id];
                return (
                    <Panel header={<IndicatorHeader
                                        indicator={indicator}
                                        periodCount={periods.length || 0}
                                        aggregateActualValue={
                                            this.props.aggregateActualValue[id]
                                        }
                                        aggregateCompletionPercentage={
                                            this.props.aggregateCompletionPercentage[id]
                                        }/>}
                           className={className}
                           key={id}>
                        <IndicatorContent indicator={indicator}/>
                        <Periods parentId={id}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        const indicatorIds = this.props.resultChildrenIds[this.props.parentId];

        if (!this.props.indicators.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else if (indicatorIds.length > 0) {
            return (
                <div className={c.OBJECTS_INDICATORS}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    {/*<ToggleButton onClick={this.toggleAll} label="++"*/}
                                  {/*disabled={!this.props.ui.allFetched}/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(indicatorIds)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <div className="emptyData">
                  <p>No indicators</p>
                </div>
            );
        }
    }
}
