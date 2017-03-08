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
import { updateModelToBackend } from "../actions/model-actions"

import {
    displayDate, APICall, endpoints, findChildren, createToggleKey, collapseId, createToggleKeys
} from "../utils.js";
import { OBJECTS_PERIODS, OBJECTS_UPDATES, UPDATE_STATUS_APPROVED } from '../const.js';

import Updates from "./updates/Updates";
import { NewUpdateButton } from "./updates/UpdateForm";
import { ToggleButton } from "./common"

class PeriodLockToggle extends React.Component {
    constructor (props) {
        super(props);
        this.lockToggle = this.lockToggle.bind(this);
        this.updatePeriodLock = this.updatePeriodLock.bind(this);
        this.state = {locking: false};
    }

    updatePeriodLock(periodId, data, callback) {
        const url = endpoints.period(periodId);
        updateModelToBackend(OBJECTS_PERIODS, url, data, this.props.collapseId, callback)
    }

    lockingToggle(locking) {
        this.setState({locking: locking});
    }

    lockToggle(e) {
        const period = this.props.period;
        if (!this.state.locking) {
            this.lockingToggle(true);
            this.updatePeriodLock(
                period.id, {locked: !period.locked}, this.lockingToggle.bind(this, false)
            );
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
            <ToggleButton
                onClick={this.lockToggle}
                style={{float: 'right'}}
                label={label}
                icon={icon}/>
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

const PeriodHeader = ({period, actualValue}) => {
    const periodStart = displayDate(period.period_start);
    const periodEnd = displayDate(period.period_end);
    const periodDate = `${periodStart} - ${periodEnd}`;
    return (
        <span>
            <span>
                Period: {periodDate} |
                Target value: {period.target_value} |
                Actual value: {actualValue}
            </span>
            <PeriodLockToggle period={period} />
        </span>
    )
};

PeriodHeader.propTypes = {
    period: PropTypes.object.isRequired,
    actualValue: PropTypes.number,
};


const objectsArrayToLookup = (arr, index) => {
    return arr.reduce((lookup, obj) =>
        Object.assign(lookup, {[obj[index]]: obj}),
        {})
};


@connect((store) => {
    return {
        periods: store.models['periods'],
        keys: store.keys,
        user: store.models['user'],
        ui: store.ui
    }
})
export default class Periods extends React.Component {

    static propTypes = {
        parentId: PropTypes.number.isRequired,
    };

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
            (period) => {
                const { ids, updates } = findChildren(period.id, 'updates', 'period');
                // Calculate actual value for the period
                const lookupUpdates = objectsArrayToLookup(updates, 'id');
                const actualValue = ids && ids.filter(
                    (id) => lookupUpdates[id].status == UPDATE_STATUS_APPROVED
                ).reduce(
                    // Actual value is calculated by adding all approved updates with numerical data
                    (sum, id) => {
                        const data = parseInt(lookupUpdates[id].data);
                        // If data is NaN then data !== data returns true!
                        if (!(data !== data)) {
                            return sum + data;
                        }
                        return sum;
                    }, 0
                );
                return (
                    <Panel
                        header={<PeriodHeader period={period} actualValue={actualValue}/>}
                        key={period.id}>
                        <Updates parentId={period.id}/>
                        <NewUpdateButton
                            period={period} user={this.props.user} dispatch={this.props.dispatch}/>
                    </Panel>
                )
            }
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
                <div className={OBJECTS_PERIODS}>
                    <ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>
                    <ToggleButton onClick={this.toggleAll} label="++"
                                  disabled={!this.props.ui.allFetched}/>
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
