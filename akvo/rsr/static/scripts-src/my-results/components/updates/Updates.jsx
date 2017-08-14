/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux"

import * as alertActions from "../../actions/alert-actions"

import { collapseChange } from "../../actions/collapse-actions"
import {uiHideMode, updateFormOpen} from "../../actions/ui-actions"
import  * as c from '../../const.js';
import {
    getPeriodsChildrenIds,
    getUpdatesForApprovedPeriods,
    getUpdatesForNeedReportingPeriods,
    getUpdatesForPendingApprovalPeriods,
} from "../../selectors";
import {
    closeNodes,
    fullUpdateVisibility,
    hideMe, openNodes
} from "../../utils";
import {
    displayDate,
    _,
    createToggleKeys,
    collapseId,
} from '../../utils.js';

import AlertFactory from "../alertContainer"
import { ToggleButton } from "../common"
import Comments from "../Comments"


const Alert = ({message, close}) => (
    <div className='update-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);
Alert.propTypes = {
    message: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};


function displayName(user) {
    return user.last_name ?
        user.first_name ?
            user.first_name + " " + user.last_name
        :
            user.last_name
    :
        user.first_name ?
            user.first_name
        :
            user.email;
}


const TimestampInfo =({update, user, label}) => {
    //TODO: tranlsate! Will need some refactoring to handle possible different word sequences
    return (
        <ul>
            <li className="approverMeta">{label}
                <span className="UpdateDate"> {displayDate(update.last_modified_at)}</span>
                <span className="hide"> {displayName(user)}</span>
                <span className="hide"> {user.approved_organisations[0].name}</span>
            </li>
        </ul>
    )
};
TimestampInfo.propTypes = {
    update: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
};


const UpdateValue =({update}) => {
    const {value, actual_value} = update;
    return (
        <ul className="valueMeta">
            <li className="updateValue">Update value: <span>{value}</span></li>
            <li className="totalValue">Actual total for this period (including this update):
                <span> {actual_value}</span>
            </li>
        </ul>
    )
};
UpdateValue.propTypes = {
    update: PropTypes.object.isRequired
};


const UpdateStatus =({update}) => {
    return (
        <ul>
            <li className="statusMeta">Status:
                <span> {_('update_statuses')[update.status]}</span>
            </li>
        </ul>
    )
};
UpdateStatus.propTypes = {
    update: PropTypes.object.isRequired
};


const QuantitativeUpdateBody = ({update}) => {
    const {user_details, approver_details} = update;
    const approvedBy = approver_details ?
        <TimestampInfo update={update} user={approver_details} label="Approved on " />
    :
        undefined;
    return (
        <div className="UpdateBody">
            <UpdateValue update={update} />
            <TimestampInfo update={update} user={user_details} label="Created on " />
            {approvedBy}
            <UpdateStatus update={update} />
        </div>
    )
};
QuantitativeUpdateBody.propTypes = {
    update: PropTypes.object.isRequired
};


const UpdateNarrative =({period, update}) => {
    return (
        <ul className="valueMeta">
            <li className="updateValue">Target: <span>{period.target_value}</span></li>
            <li className="updateValue">Actual: <span>{update.narrative}</span></li>
        </ul>
    )
};
UpdateValue.propTypes = {
    update: PropTypes.object.isRequired
};


const QualitativeUpdateBody = ({period, update}) => {
    const {user_details, approver_details} = update;
    const approvedBy = approver_details ?
        <TimestampInfo update={update} user={approver_details} label="Approved on" />
    :
        undefined;
    return (
        <div className="UpdateBody">
            <UpdateNarrative period={period} update={update} />
            <TimestampInfo update={update} user={user_details} label="Created on" />
            {approvedBy}
            <UpdateStatus update={update} />
        </div>
    )
};
QualitativeUpdateBody.propTypes = {
    period: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
};


const UserInfo = ({user_details}) => {
    const organisation = user_details.approved_organisations.length ?
        user_details.approved_organisations[0].name
    :
        null;
    const userName = user_details.first_name +" "+ user_details.last_name;

    return (
        <span><span>{userName}</span> {organisation ? " at " + organisation: ''}</span>
    )
};
UserInfo.propTypes = {
    user_details: PropTypes.object.isRequired,
};

const QuantitativeUpdate = ({id, update, periodLocked, collapseId}) => {
    return (
        <div className="row" key={id}>
            <UpdateHeader update={update} periodLocked={periodLocked}
                          collapseId={collapseId}/>
            <div className="row">
                <QuantitativeUpdateBody update={update}/>
                <Comments parentId={id} inForm={false}/>
                <hr className="delicate"/>
            </div>
        </div>
    )
};
QuantitativeUpdate.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]).isRequired,
    update: PropTypes.object.isRequired,
    periodLocked: PropTypes.bool.isRequired,
    collapseId: PropTypes.string.isRequired,
};


const QualitativeUpdate = ({id, period, update, collapseId}) => {
    return (
        <div className="row" key={id}>
            <UpdateHeader update={update} periodLocked={period.locked} collapseId={collapseId}/>
            <div className="row">
                <QualitativeUpdateBody period={period} update={update}/>
                <Comments parentId={id} inForm={false}/>
                <hr className="delicate"/>
            </div>
        </div>
    )
};
QualitativeUpdate.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]).isRequired,
    period: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    collapseId: PropTypes.string.isRequired,
};


@connect((store) => {
    return {
        [c.UPDATE_FORM_DISPLAY]: store.ui[c.UPDATE_FORM_DISPLAY],
        activeFilter: store.ui.activeFilter,
        user: store.models.user.objects[store.models.user.ids[0]],
    }
}, alertActions)
class UpdateHeader extends React.Component {

    static propTypes = {
        update: PropTypes.object.isRequired,
        collapseId: PropTypes.string.isRequired,
        periodLocked: PropTypes.bool.isRequired,
    };

    constructor (props) {
        super(props);

        this.formToggle = this.formToggle.bind(this);
        this.showEditButton = this.showEditButton.bind(this);
        // we need a unique name for each alert
        const alertName = 'UpdateAlert-' + this.props.update.id;
        this.state = {
            updateAlertName: alertName,
            UpdateAlert: AlertFactory({alertName: alertName})(Alert),
        };
    }

    formToggle(e) {
        const {collapseId, update} = this.props;
        updateFormOpen(update.id);
        uiHideMode(c.OBJECTS_PERIODS);
        openNodes(c.OBJECTS_PERIODS, [update.period]);
        closeNodes(c.OBJECTS_PERIODS, [update.period]);
        e.stopPropagation();
    }

    showEditButton() {
        // Only show the Edit update button if the period is unlocked, the update is shown in the
        // relevant filter and the user can edit at this time
        const {update, activeFilter} = this.props;
        const show = fullUpdateVisibility(update, activeFilter);
        if (!show) {
            return false
        }
        if (this.props.periodLocked) {
            return false
        }
        // M&E manager
        if (this.props.user.isMEManager) {
            // M&E manager can always edit updates
            return true;
        // Project editor
        } else {
            // Can't edit other's updates
            if (this.props.user.id !== update.user) {
                return false;
            }
            // Can't update submitted or approved
            return (
                update.status !== c.UPDATE_STATUS_PENDING &&
                update.status !== c.UPDATE_STATUS_APPROVED
            );
        }
    }

    render() {
        let editUpdateButton, updateAlert;
        const {updateFormDisplay, update} = this.props;

        if (this.showEditButton()) {
            let className;
            if (updateFormDisplay) {
                className = 'btn btn-sm btn-default editingForm';
            } else {
                className = 'btn btn-sm btn-default';
            }
            editUpdateButton = <ToggleButton onClick={this.formToggle}
                                             className={className}
                                             label={_('edit_indicator_value')}
                                             disabled={updateFormDisplay !== false}/>;
            updateAlert = <this.state.UpdateAlert />
        }
        return (
            <div className="UpdateHead">
                <span className="updateName"><UserInfo user_details={update.user_details}/></span>
                <span className="updateStatus">{_('update_statuses')[update.status]}</span>
                <span>{editUpdateButton}</span>
                <span>{updateAlert}</span>
            </div>
        )
    }
}


@connect((store) => {
    return {
        indicators: store.models.indicators,
        updates: store.models.updates,
        keys: store.keys,
        ui: store.ui,
        periodChildrenIds: getPeriodsChildrenIds(store),
        needReportingUpdates: getUpdatesForNeedReportingPeriods(store),
        pendingApprovalUpdates: getUpdatesForPendingApprovalPeriods(store),
        approvedUpdates: getUpdatesForApprovedPeriods(store),
    }
})
export default class Updates extends React.Component {

    static propTypes = {
        indicatorId: PropTypes.number.isRequired,
        period: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.hideMe = this.hideMe.bind(this);
        this.state = {collapseId: collapseId(c.OBJECTS_UPDATES, this.props.period.id)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
        // noHide();
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.period.id, c.OBJECTS_UPDATES, this.activeKey());
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        })
    }

    hideMe(id) {
        return hideMe(c.OBJECTS_UPDATES, this.props.period.id, id);
    }

    getUpdateIds() {
        let updateIds = this.props.periodChildrenIds[this.props.period.id] || [];
        const updates = this.props.updates.objects;
        const needReporting = [c.UPDATE_STATUS_NEW, c.UPDATE_STATUS_DRAFT, c.UPDATE_STATUS_REVISION];
        const pending = [c.UPDATE_STATUS_PENDING];
        const approved = [c.UPDATE_STATUS_APPROVED];

        const filterUpdatesByStatus = (ids, status) => {
            return ids.filter(
                id => status.indexOf(updates[id].status) > -1
            )
        };

        switch(this.props.ui.activeFilter) {
            case c.FILTER_NEED_REPORTING: {
                updateIds = filterUpdatesByStatus(updateIds, needReporting);
                break;
            }
            case c.FILTER_SHOW_PENDING: {
                updateIds = filterUpdatesByStatus(updateIds, pending);
                break;
            }
            case c.FILTER_SHOW_APPROVED: {
                updateIds = filterUpdatesByStatus(updateIds, approved);
                break;
            }
        }
        return updateIds;
    }

    renderPanels(updateIds) {
        let actualValue = 0;
        return (updateIds.map(
            (id) => {
                const indicator = this.props.indicators.objects[this.props.indicatorId];
                const update = this.props.updates.objects[id];
                // Calculate running total of numeric update values
                const value = parseInt(update.value);
                if (value && update.status == c.UPDATE_STATUS_APPROVED) {
                    actualValue += value;
                }
                update.actual_value = actualValue;
                switch(indicator.type) {
                    case 1: {
                        return <QuantitativeUpdate key={id}
                                                   id={id}
                                                   update={update}
                                                   periodLocked={this.props.period.locked}
                                                   collapseId={this.state.collapseId}/>
                    }
                    case 2: {
                        return <QualitativeUpdate key={id}
                                                  id={id}
                                                  update={update}
                                                  period={this.props.period}
                                                  collapseId={this.state.collapseId}/>
                    }
                }
            }
        ))
    }

    render() {
        let updateIds = this.getUpdateIds();

        // const toggleKey = createToggleKey(ids, this.activeKey());
        if (!this.props.updates.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else if (updateIds.length > 0) {
            return (
                <div className={c.OBJECTS_UPDATES}>
                    {this.renderPanels(updateIds)}
                </div>
            );
        } else {
            return (
                <div className="emptyData">
                    <p>No updates</p>
                </div>
            );
        }
    }
}
