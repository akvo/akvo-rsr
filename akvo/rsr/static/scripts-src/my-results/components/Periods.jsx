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
import { periodSelectToggle, selectablePeriods } from "../actions/ui-actions"

import {
    displayDate,
    endpoints,
    createToggleKey,
    collapseId,
    createToggleKeys
} from "../utils.js";

import {
    OBJECTS_PERIODS,
    OBJECTS_UPDATES,
    UPDATE_STATUS_APPROVED,
    SELECTED_PERIODS
} from '../const.js';

import Updates from "./updates/Updates";
import { NewUpdateButton } from "./updates/UpdateForm";
import { ToggleButton } from "./common"
import { getPeriodsActualValue, getIndicatorsChildrenIds } from "../selectors";


class PeriodLockToggle extends React.Component {

    static propTypes = {
        period: PropTypes.object,
        callbacks: PropTypes.object,
    };

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
        const toggleCallback = () => {
            this.lockingToggle(false);
            selectablePeriods();
        };
        if (!this.state.locking) {
            this.lockingToggle(true);
            this.updatePeriodLock(
                period.id, {locked: !period.locked}, toggleCallback
            );
        }
        e.stopPropagation();
    }

    render() {
        let icon, label;
        if (this.state.locking) {
            icon = <i className="fa fa-spin fa-spinner" />;
            label = "Updating lock status";
        } else if (this.props.period.locked) {
            icon = <i className={'fa fa-lock'}/>;
            label = "Unlock period";
        } else {
            icon = <i className="fa fa-unlock-alt" />;
            label = "Lock period";
        }
        return (
            <ToggleButton onClick={this.lockToggle}
                          style={{float: 'right'}}
                          label={label}
                          icon={icon}/>
        )
    }
}


const PeriodLockStatus = ({lockStatus}) => {
    return <div style={{float: 'right'}}>{lockStatus}</div>
};
PeriodLockStatus.propTypes = {
    lockStatus: PropTypes.object,
};


const PeriodSelect = ({id, toggleCheckbox, isChecked}) => {
    // NOTE: the onChange event handler can't be used here because it fires too late and the event
    // for opening/closing the collapse panel will be triggered. However when using the onClick
    // handler React complais that the component isn't managed correctly, thus the noop onChange.
    return <input id={id} type="checkbox" checked={isChecked ? "checked" : ""}
                  style={{float: 'right'}} onClick={toggleCheckbox} onChange={()=>{}}/>
};
PeriodSelect.propTypes = {
    id: PropTypes.number.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
};


const PeriodHeader = ({period, user, actualValue, toggleCheckbox, isChecked}) => {
    const periodStart = displayDate(period.period_start);
    const periodEnd = displayDate(period.period_end);
    const periodDate = `${periodStart} - ${periodEnd}`;
    let lockStatus;
    if (user.isMEManager) {
        lockStatus = <PeriodLockToggle period={period} />
    } else {
        lockStatus = <PeriodLockStatus lockStatus={period.locked ? 'Locked' : 'Unlocked'}/>
    }
    return (
        <span>
            <span>
                Period: {periodDate} |
                Target value: {period.target_value} |
                Actual value: {actualValue}
            </span>
            <PeriodSelect id={period.id} toggleCheckbox={toggleCheckbox} isChecked={isChecked}/>
            {lockStatus}
        </span>
    )
};
PeriodHeader.propTypes = {
    period: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    actualValue: PropTypes.number.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
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
        user: store.models.user.objects[store.models.user.ids[0]],
        ui: store.ui,
        indicatorChildrenIds: getIndicatorsChildrenIds(store),
        actualValue: getPeriodsActualValue(store),
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
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
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

    toggleCheckbox(e) {
        e.stopPropagation();
        const periodId = parseInt(e.target.id);
        periodSelectToggle(periodId);
    }

    renderPanels(periodIds) {
        const callbacks = {openNewForm: this.openNewForm};

        return (periodIds.map(
            (id) => {
                const period = this.props.periods.objects[id];
                const actualValue = this.props.actualValue[id];
                const isChecked = new Set(this.props.ui[SELECTED_PERIODS]).has(id);
                const needsReporting = !period.locked && period._meta.children.ids.length == 0

                return (
                    <Panel header={<PeriodHeader period={period}
                                              user={this.props.user}
                                              toggleCheckbox={this.toggleCheckbox}
                                              actualValue={actualValue}
                                              isChecked={isChecked}/>}
                           key={id}
                           className={
                               isChecked ? 'periodSelected' : needsReporting ? 'needsReporting' : ''
                           }>
                        <Updates parentId={id} periodLocked={period.locked}/>
                        {
                            !period.locked &&
                            <NewUpdateButton period={period}
                                             user={this.props.user}
                                             dispatch={this.props.dispatch}/>
                        }
                    </Panel>
                )
            }
        ))
    }

    render() {
        const periodIds = this.props.indicatorChildrenIds[this.props.parentId] || [];

        // const toggleKey = createToggleKey(ids, this.activeKey());
        if (!periodIds) {
            return (
                <p>Loading...</p>
            );
        } else if (periodIds.length > 0) {
            return (
                <div className={OBJECTS_PERIODS}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    {/*<ToggleButton onClick={this.toggleAll}*/}
                                  {/*label="++"*/}
                                  {/*disabled={!this.props.ui.allFetched}/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(periodIds)}
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
