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

import { collapseChange } from "../actions/collapse-actions"

import {
    _,
    collapseId,
    createToggleKeys,
    hideMe,
} from '../utils';

import Periods from './Periods';


const IndicatorHeader = ({indicator, aggregateActualValue}) => {
    const title = indicator.title.length > 0 ? indicator.title : _("nameless_indicator");
    return (
        <span className="indicatorTitle">
            <ul>
                <li>{title}</li>
                <li><span className="aggrActualValue">
                    {_("aggregate_actual_value")}<span>{aggregateActualValue}</span></span>
                </li>
            </ul>   
        </span>
    )
};
IndicatorHeader.propTypes = {
    indicator: PropTypes.object,
    aggregateActualValue: PropTypes.number,
};


const IndicatorContent = ({indicator}) => {
    const description = indicator.description.length > 0 ?
        <ul>
            <li className="description">
                <span>{indicator.description}</span>
            </li>
        </ul>
    :
        undefined;
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
