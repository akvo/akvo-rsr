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
import { _, findChildren, createToggleKey, collapseId, createToggleKeys } from '../utils';
import Periods from './Periods';
import { ToggleButton } from "./common"

import { OBJECTS_INDICATORS } from '../const.js';


const IndicatorHeader = ({indicator}) => {
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <span>
            {"Indicator: " + title}
        </span>
    )
};

IndicatorHeader.propTypes = {
    indicator: PropTypes.object
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


@connect((store) => {
    return {
        indicators: store.models['indicators'],
        keys: store.keys,
        ui: store.ui
    }
})
export default class Indicators extends React.Component {

    static propTypes = {
        parentId: PropTypes.number.isRequired,
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

    renderPanels(indicators) {
        return (indicators.map(
            (indicator) =>
                <Panel header={<IndicatorHeader indicator={indicator}/>} key={indicator.id}>
                    <IndicatorContent indicator={indicator}/>
                    <Periods parentId={indicator.id}/>
                </Panel>
        ))
    }

    render() {
        const { ids, indicators } = findChildren(this.props.parentId, 'indicators', 'result');
        const toggleKey = createToggleKey(ids, this.activeKey());

        if (!indicators) {
            return (
                <p>Loading...</p>
            );
        } else if (indicators.length > 0) {
            return (
                <div className={OBJECTS_INDICATORS}>
                    <ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>
                    <ToggleButton onClick={this.toggleAll} label="++"
                                  disabled={!this.props.ui.allFetched}/>
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(indicators)}
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
