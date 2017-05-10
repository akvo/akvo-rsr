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

import * as c from '../const.js';
import {
    getIndicatorsAggregateActualValue,
    getResultsChildrenIds
} from "../selectors";
import { onChange } from "../actions/collapse-actions"
import {
    _,
    collapseId,
    createToggleKeys, hideMe, levelAbove
} from '../utils';

import Periods from './Periods';
import {noHide} from "../actions/ui-actions";


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
        this.hideMe = this.hideMe.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(c.OBJECTS_INDICATORS, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        this.props.dispatch(onChange(this.state.collapseId, activeKey));
        noHide();
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, c.OBJECTS_INDICATORS, this.activeKey());
        keys.map((collapse) => {
            this.props.dispatch(onChange(collapse.collapseId, collapse.activeKey));
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
                return (
                    <Panel header={<IndicatorHeader
                                        indicator={indicator}
                                        aggregateActualValue={
                                            this.props.aggregateActualValue[id]
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

        if (!indicatorIds) {
            return (
                <p>Loading...</p>
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
