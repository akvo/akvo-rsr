/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react'
import { connect } from "react-redux"
import Collapse, {  Panel } from 'rc-collapse';

import { onChange } from "../actions/collapse-actions"
import { _, createToggleKey, collapseId, createToggleKeys } from '../utils';
import Periods from './Periods';
import { ToggleButton } from "./common"

import { OBJECTS_INDICATORS, OBJECTS_PERIODS } from '../const.js';
import {getIndicatorsChildrenIds, getIndicatorsAggregateActualValue} from "../selectors";


const IndicatorHeader = ({indicator, aggregateActualValue}) => {
    // const periods = indicator._meta && indicator._meta.children || {ids: [], objects: {}};
    // const aggregateActualValue = childPeriods.reduce((acc, period) => {
    //     return acc = period.actual_value
    // }, 0);
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <span>
            {
                "Indicator: " + title + " | Aggregate actual value: " + aggregateActualValue
            }
        </span>
    )
};

IndicatorHeader.propTypes = {
    indicator: PropTypes.object,
    childPeriods: PropTypes.array,
};


const IndicatorContent = ({indicator}) => {
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <div>
            {title}
            <div className="baseline">
                <div className="baseline-year">
                    {_('baseline_year')}: {indicator.baseline_year}
                </div>
                <div className="baseline-value">
                    {_('baseline_value')}: {indicator.baseline_value}
                </div>
            </div>
        </div>
    )
};

IndicatorContent.propTypes = {
    indicator: PropTypes.object
};

const childrenArray = (objects, ids) => {
    // Turn {17: {modelObj1}, {42: {modelObj2}, ...} and [42, 17, ...] into
    // [{modelObj2}, {modelObj1}, ...]
    return ids.map(id => objects[id]);
};

@connect((store) => {
    return {
        indicators: store.models.indicators,
        periods: store.models.periods,
        keys: store.keys,
        ui: store.ui,
        indicatorChildrenIds: getIndicatorsChildrenIds(store),
        aggregateActualValue: getIndicatorsAggregateActualValue(store),
    }
})
export default class Indicators extends React.Component {

    static propTypes = {
        ids: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.childPeriods = this.childPeriods.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(OBJECTS_INDICATORS, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        this.props.dispatch(onChange(this.state.collapseId, activeKey));
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, OBJECTS_INDICATORS, this.activeKey());
        keys.map((collapse) => {
            this.props.dispatch(onChange(collapse.collapseId, collapse.activeKey));
        })
    }

    childPeriods(id) {
        const periods = this.props.periods.objects;
        const periodIds = this.props.indicatorChildrenIds[id] || [];
        return childrenArray(periods, periodIds);
    }

    renderPanels(ids) {
        return (ids.map(
            (id) => {
                const indicator = this.props.indicators.objects[id];
                const ids = this.props.indicatorChildrenIds[id] || [];
                return (
                    <Panel header={<IndicatorHeader
                                        indicator={indicator}
                                        aggregateActualValue={
                                            this.props.aggregateActualValue[id]
                                        }/>}
                           key={id}>
                        <IndicatorContent indicator={indicator}/>
                        <Periods ids={ids}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        // const { ids, indicators } = findChildren(this.props.parentId, OBJECTS_INDICATORS);
        const {ids=undefined} = this.props.indicators;

        // const toggleKey = createToggleKey(ids, this.activeKey());

        if (!ids) {
            return (
                <p>Loading...</p>
            );
        } else if (ids.length > 0) {
            return (
                <div className={OBJECTS_INDICATORS}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    {/*<ToggleButton onClick={this.toggleAll} label="++"*/}
                                  {/*disabled={!this.props.ui.allFetched}/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(ids)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <p>No indicators</p>
            );
        }
    }
}
