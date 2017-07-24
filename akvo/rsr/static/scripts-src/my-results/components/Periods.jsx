/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Collapse, { Panel } from "rc-collapse";
import { connect } from "react-redux"
import update  from 'immutability-helper';

import * as alertActions from "../actions/alert-actions"
import * as collapseActions from "../actions/collapse-actions"
import { updateModelToBackend } from "../actions/model-actions"

import { periodSelectToggle, } from "../actions/ui-actions"

import * as c from "../const"

import {
    getPeriodsActualValue,
    getIndicatorsChildrenIds, getPeriodsChildrenIds,
} from "../selectors";

import {
    displayDate,
    endpoints,
    collapseId,
    createToggleKeys,
} from "../utils.js";


import AlertFactory from "./alertContainer"
import { ToggleButton } from "./common"
import { NewUpdateButton } from "./updates/UpdateForm";
import Updates from "./updates/Updates";

import {
    _,
    hideMe,
} from "../utils";

import { collapseChange } from "../actions/collapse-actions";


const ToggleAlert = ({message, close}) => (
    <div className='lock-toggle-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);


@connect(null, alertActions)
class PeriodLockToggle extends React.Component {

    static propTypes = {
        period: PropTypes.object,
        callbacks: PropTypes.object,
    };

    constructor (props) {
        super(props);
        this.lockToggle = this.lockToggle.bind(this);
        this.updatePeriodLock = this.updatePeriodLock.bind(this);
        const alertName = 'ToggleAlert-' + this.props.period.id;
        this.state = {
            locking: false,
            toggleAlertName: alertName,
            ToggleAlert: AlertFactory({alertName: alertName})(ToggleAlert),
        };
    }

    updatePeriodLock(periodId, data, callbacks) {
        const url = endpoints.period(periodId);
        updateModelToBackend(c.OBJECTS_PERIODS, url, data, this.props.collapseId, callbacks);
    }

    lockingToggle(locking) {
        this.setState({locking: locking});
    }

    setLockMessage(message) {
        this.props.createAlert(this.state.toggleAlertName, message);
    }

    lockToggle(e) {
        const period = this.props.period;
        const toggleCallback = (message) => {
            this.lockingToggle(false);
            if (message) {
                this.setLockMessage(message);
            }
        };
        if (!this.state.locking) {
            this.lockingToggle(true);
            const callbacks = {
                [c.UPDATE_MODEL_FULFILLED]: toggleCallback.bind(this),
                [c.UPDATE_MODEL_REJECTED]: toggleCallback.bind(
                    this, _("lock_change_failed")
                )
            };
            this.updatePeriodLock(period.id, {locked: !period.locked}, callbacks);
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
            <span>
                {<this.state.ToggleAlert />}
                <ToggleButton onClick={this.lockToggle} label={label}/>
            </span>
        )
    }
}


const PeriodLockStatus = ({lockStatus}) => {
    return {lockStatus}
};
PeriodLockStatus.propTypes = {
    lockStatus: PropTypes.string.isRequired,
};


const PeriodSelect = ({id, toggleCheckbox, isChecked}) => {
    // NOTE: the onChange event handler can't be used here because it fires too late and the event
    // for opening/closing the collapse panel will be triggered. However when using the onClick
    // handler React complains that the component isn't managed correctly, thus the noop onChange.
    return <input id={id} type="checkbox" checked={isChecked ? "checked" : ""}
                  onClick={toggleCheckbox} onChange={()=>{}}/>
};
PeriodSelect.propTypes = {
    id: PropTypes.number.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
};


const PeriodHeader = ({period, user, toggleCheckbox, isChecked, newUpdateButton, delUpdateAlert,
                          formOpen, showLockButton}) => {
    const periodStart = displayDate(period.period_start);
    const periodEnd = displayDate(period.period_end);
    const periodDate = `${periodStart} - ${periodEnd}`;
    let periodSelect, lockStatus;
    if (user.isMEManager && showLockButton) {
        periodSelect = <PeriodSelect id={period.id}
                                     toggleCheckbox={toggleCheckbox}
                                     isChecked={isChecked}/>;
        lockStatus = <PeriodLockToggle period={period} />;

    } else {
        lockStatus = period.locked ? _('locked') : _('unlocked');
    }
    return (
        <span className="periodWrap">
            <ul className={formOpen ? "formOpen" : ""}>
                <li>{periodSelect}</li>
                <li>{periodDate}</li>
                <li>{newUpdateButton}{delUpdateAlert}</li>
                <li>{lockStatus}</li>
            </ul>
        </span>
    )
};
PeriodHeader.propTypes = {
    period: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
};


const DeleteUpdateAlert = ({message, close}) => (
    <div className='delete-update-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);


@connect((store) => {
    return {
        periods: store.models.periods,
        keys: store.keys,
        user: store.models.user.ids && store.models.user.ids.length > 0 ?
            store.models.user.objects[store.models.user.ids[0]] : {},
        ui: store.ui,
        indicatorChildrenIds: getIndicatorsChildrenIds(store),
        periodChildrenIds: getPeriodsChildrenIds(store),
        actualValue: getPeriodsActualValue(store),
    }
}, {...alertActions, ...collapseActions})
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
        this.hideMe = this.hideMe.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(c.OBJECTS_PERIODS, this.props.parentId)};
    }

    openNewForm(newKey, data) {
        // Add the key for a new update to the list of open panels
        this.setState(
            {newKeys: update(this.state.newKeys, {$push: [newKey]})},
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel(c.OBJECTS_UPDATES, data)
        );
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, c.OBJECTS_PERIODS, this.activeKey());
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        })
    }

    toggleCheckbox(e) {
        e.stopPropagation();
        const periodId = parseInt(e.target.id);
        periodSelectToggle(periodId);
    }

    hideMe(id) {
        return hideMe(c.OBJECTS_PERIODS, this.props.parentId, id);
    }

    renderPanels(periodIds) {
        return (periodIds.map(
            (id) => {
                const period = this.props.periods.objects[id];
                const actualValue = this.props.actualValue[id];
                const isChecked = new Set(this.props.ui[c.SELECTED_PERIODS]).has(id);
                const formOpen = this.props.periodChildrenIds[id].indexOf(
                    this.props.ui[c.UPDATE_FORM_DISPLAY] || 0
                ) > -1;

                const needsReporting =
                    !period.locked && period._meta && period._meta.children.ids.length == 0;

                const ui = this.props.ui;
                let newUpdateButton, delUpdateAlert;
                if (!period.locked && (
                    !ui.updateFormDisplay && (
                        ui.activeFilter === c.FILTER_NEED_REPORTING || ui.activeFilter === undefined
                ))) {
                    newUpdateButton = <NewUpdateButton period={period} user={this.props.user}/>;
                    // TODO: fix for new updates. The alert won't render since the temp update
                    // object gets deleted when saving.
                    // Possible solution: add an alert action and reducer instead of using callback
                    const DelUpdateAlert = AlertFactory(
                        {alertName: 'DeleteUpdateAlert-' + period.id}
                    )(DeleteUpdateAlert);
                    delUpdateAlert = <DelUpdateAlert />;
                }
                let className = this.hideMe(id) ? 'hidePanel' : '';
                className += isChecked ? ' periodSelected' : needsReporting ? ' needsReporting' : '';
                const showLockButton = this.props.ui.activeFilter !== c.FILTER_NEED_REPORTING &&
                        this.props.ui.activeFilter !== c.FILTER_SHOW_PENDING;
                return (
                    <Panel header={
                        <PeriodHeader period={period}
                                      user={this.props.user}
                                      toggleCheckbox={this.toggleCheckbox}
                                      isChecked={isChecked}
                                      newUpdateButton={newUpdateButton}
                                      delUpdateAlert={delUpdateAlert}
                                      formOpen={formOpen}
                                      showLockButton={showLockButton}/>}
                           key={id}
                           className={className}>
                        <Updates parentId={id} periodLocked={period.locked}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        const periodIds = this.props.indicatorChildrenIds[this.props.parentId];
        if (!this.props.periods.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else if (periodIds.length > 0) {
            return (
                <div className={c.OBJECTS_PERIODS}>
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
                <div className="emptyData">
                    <p>No periods</p>
                </div>
            );
        }
    }
}
