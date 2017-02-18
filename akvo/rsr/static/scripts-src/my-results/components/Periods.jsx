/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */
import React, { PropTypes } from "react";
import Collapse, { Panel } from "rc-collapse";
import { connect } from "react-redux"
import update  from 'immutability-helper';

import { onChange } from "../actions/collapse-actions"
import {
    displayDate, APICall, endpoints, findChildren, createToggleKey, collapseId, createToggleKeys
} from "../utils.js";
import { OBJECTS_PERIODS, OBJECTS_UPDATES } from '../const.js';

import Updates from "./updates/Updates";
import { NewUpdateButton } from "./updates/UpdateForm";
import { ToggleButton } from "./common"

class PeriodLockToggle extends React.Component {
    constructor (props) {
        super(props);
        this.lockToggle = this.lockToggle.bind(this);
        this.state = {locking: false};
    }

    basePeriodSave(periodId, data, callback) {
        // Base function for saving a period with a data Object.
        const url = endpoints.period(periodId);
        function success(data) {
            this.props.callbacks.updateModel(OBJECTS_PERIODS, data);

            if (callback) {
                callback();
            }
        }
        APICall('PATCH', url, data, success.bind(this));
    }

    lockingToggle(locking) {
        this.setState({locking: locking});
    }

    notLocking() {
        this.lockingToggle(false);
    }

    lockToggle(e) {
        if (!this.state.locking) {
            this.lockingToggle(true);
            this.basePeriodSave(this.props.period.id, {locked: !this.props.period.locked}, this.notLocking.bind(this));
        }
        e.stopPropagation();
    }

    render() {
        let icon, label;
        if (this.state.locking) {
            icon = <i className="fa fa-spin fa-spinner" />;
            label = "Loading";
        } else if (this.props.period.locked) {
            icon = <i className={'fa fa-lock'}/>;
            label = "Unlock period";
        } else {
            icon = <i className="fa fa-unlock-alt" />;
            label = "Lock period";
        }
        return (
            <a onClick={this.lockToggle}
               className={'btn btn-sm btn-default'}
               style={{float: 'right', margin: '0.3em 0.5em'}}>
                {icon}
                {label}
            </a>
        )
    }
}

PeriodLockToggle.propTypes = {
    period: PropTypes.object,
    callbacks: PropTypes.object
};


const periodActualValue = (period) => {
    return period.updates && period.updates.length > 0 ?
        period.updates[period.updates.length-1].actual_value
    :
        "";
};

const PeriodHeader = ({period}) => {
    const periodStart = displayDate(period.period_start);
    const periodEnd = displayDate(period.period_end);
    const periodDate = `${periodStart} - ${periodEnd}`;
    return (
        <span>
            <span>
                Period: {periodDate} |
                Target value: {period.target_value} |
                Actual value: {periodActualValue(period)}
            </span>
            <PeriodLockToggle period={period} />
        </span>
    )
};

PeriodHeader.propTypes = {
    item: PropTypes.object,
};

@connect((store) => {
    return {
        periods: store.models['periods'],
        keys: store.keys,
        user: store.models['user']
    }
})
export default class Periods extends React.Component {

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.openNewForm = this.openNewForm.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(OBJECTS_PERIODS, this.props.parentId)};
    }

    openNewForm(newKey, data) {
        // Add the key for a new update to the list of open panels
        this.setState(
            {newKeys: update(this.state.newKeys, {$push: [newKey]})},
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel(OBJECTS_UPDATES, data)
        );
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        this.props.dispatch(onChange(this.state.collapseId, activeKey));
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, OBJECTS_PERIODS, this.activeKey());
        keys.map((collapse) => {
            this.props.dispatch(onChange(collapse.collapseId, collapse.activeKey));
        })
    }

    renderPanels(periods) {
        const callbacks = {openNewForm: this.openNewForm};
        return (periods.map(
            (period) =>
                <Panel header={<PeriodHeader period={period}/>} key={period.id}>
                    <Updates parentId={period.id}/>
                    <NewUpdateButton
                            period={period} user={this.props.user} dispatch={this.props.dispatch}/>
                </Panel>
        ))
    }

    render() {
        const { ids, periods } = findChildren(this.props.parentId, 'periods', 'indicator');
        const toggleKey = createToggleKey(ids, this.activeKey());
        if (!periods) {
            return (
                <p>Loading...</p>
            );
        } else if (periods.length > 0) {
            return (
                <div>
                    <ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>
                    <ToggleButton onClick={this.toggleAll} label="++"/>
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(periods)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <p>No periods</p>
            );
        }
    }
}

Periods.propTypes = {
    items: PropTypes.array,
    callbacks: PropTypes.object,
};
