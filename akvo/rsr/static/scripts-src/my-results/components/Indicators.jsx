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

import { onChange } from "../actions/collapse-actions"
import { _, createToggleKey, collapseId, createToggleKeys } from '../utils';
import Periods from './Periods';
import { ToggleButton } from "./common"

import { OBJECTS_INDICATORS, OBJECTS_PERIODS } from '../const.js';
import {getIndicatorsChildrenIds, getIndicatorsAggregateActualValue, getResultsChildrenIds} from "../selectors";


const IndicatorHeader = ({indicator, aggregateActualValue}) => {
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <span className="indicatorTitle">
            <ul>
                <li>{title}</li>
                <li><span className="aggrActualValue">{ "Aggregate actual value: " + aggregateActualValue}</span></li>
            </ul>
        </span>
    )
};

IndicatorHeader.propTypes = {
    indicator: PropTypes.object,
    aggregateActualValue: PropTypes.number,
};


const IndicatorContent = ({indicator}) => {
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <div className="baseline">
            <ul>
                <li className="baseline-year">
                    {_('baseline_year')}: {indicator.baseline_year}
                </li>
                <li className="baseline-value">
                    {_('baseline_value')}: {indicator.baseline_value}
                </li>
            </ul>
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
        resultChildrenIds: getResultsChildrenIds(store),
        aggregateActualValue: getIndicatorsAggregateActualValue(store),
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

    renderPanels(indicatorIds) {
        return (indicatorIds.map(
            (id) => {
                const indicator = this.props.indicators.objects[id];
                return (
                    <Panel header={<IndicatorHeader
                                        indicator={indicator}
                                        aggregateActualValue={
                                            this.props.aggregateActualValue[id]
                                        }/>}
                           key={id}>
                        <IndicatorContent indicator={indicator}/>
                        <Periods parentId={id}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        // const { ids, indicators } = findChildren(this.props.parentId, OBJECTS_INDICATORS);
        // const {ids=undefined} = this.props.indicators;

        const indicatorIds = this.props.resultChildrenIds[this.props.parentId];

        // const toggleKey = createToggleKey(ids, this.activeKey());

        if (!indicatorIds) {
            return (
                <p>Loading...</p>
            );
        } else if (indicatorIds.length > 0) {
            return (
                <div className={OBJECTS_INDICATORS}>
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
