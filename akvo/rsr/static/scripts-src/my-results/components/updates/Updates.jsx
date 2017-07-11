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

import * as alertActions from "../../actions/alert-actions"

import {
    collapseChange,
    openPanel,
} from "../../actions/collapse-actions"

import { noHide, updateFormToggle } from "../../actions/ui-actions"
import  * as c from '../../const.js';
import { getPeriodsChildrenIds } from "../../selectors";
import {
    fullUpdateVisibility,
    hideMe
} from "../../utils";

import { ToggleButton } from "../common"

import {
    displayDate,
    _,
    createToggleKeys,
    collapseId,
} from '../../utils.js';

import AlertFactory from "../alertContainer"
import Comments from "../Comments"
import UpdateForm from "./UpdateForm"


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


const UpdateDisplay = ({update}) => {
    //TODO: tranlsate! Will need some refactoring to handle possible different word sequences
    const user = update.user_details;
    const approver = update.approver_details;
    const approvedBy = approver ?
        <ul>
            <li className="approverMeta">Approved on
                <span> {displayDate(update.last_modified_at)}</span> by
                <span> {displayName(user)}</span> at
                <span> {approver.approved_organisations[0].name}</span>
            </li>
        </ul>
    :
        undefined;
    return (
        <div>
            <ul className="valueMeta">
                <li className="updateValue">Update value: <span>{update.data}</span></li>
                {/* NOTE: we use update.actual_value, a value calculated in App.annotateUpdates(),
                 not update.period_actual_value from the backend */}
                <li className="totalValue">Actual total for this period (including this update):
                    <span> {update.actual_value}</span>
                </li>
            </ul>
            <ul>
                <li className="creatorMeta">Created on
                    <span> {displayDate(update.created_at)}</span> by
                    <span> {displayName(user)}</span> at
                    <span> {user.approved_organisations[0].name}</span>
                </li>
            </ul>
            {approvedBy}
            <ul>
                <li className="statusMeta">Status:
                    <span> {_('update_statuses')[update.status]}</span>
                </li>
            </ul>
        </div>
    )
};
UpdateDisplay.propTypes = {
    update: PropTypes.object.isRequired
};


@connect((store) => {
    return {
        [c.UPDATE_FORM_DISPLAY]: store.ui[c.UPDATE_FORM_DISPLAY],
    }
}, alertActions)
class Update extends React.Component {

    static propTypes = {
        update: PropTypes.object.isRequired,
        collapseId: PropTypes.string.isRequired,
        // periodLocked: PropTypes.bool.isRequired,
    };

    constructor (props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
        // // we need a unique name for each alert
        // const alertName = 'UpdateAlert-' + this.props.update.id;
        // this.state = {
        //     updateAlertName: alertName,
        //     UpdateAlert: AlertFactory({alertName: alertName})(Alert),
        // };
    }

    formToggle() {
        updateFormToggle(this.props.update.id);
    }

    render() {
        return(
            <div className="col-xs-12">
                <UpdateDisplay update={this.props.update}/>
            </div>
        )
    }
}

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
        updateFormToggle(update.id);
        // openPanel(collapseId, update);
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
            <span className="UpdateHead">
                <span className="updateName"><UserInfo user_details={update.user_details}/></span>
                <span className="updateData">Actual value: <span>{update.data}</span></span>
                <span className="updateStatus">{_('update_statuses')[update.status]}</span>
                <span>{editUpdateButton}</span>
                <span>{updateAlert}</span>
            </span>
        )
    }
}


@connect((store) => {
    return {
        updates: store.models['updates'],
        keys: store.keys,
        ui: store.ui,
        periodChildrenIds: getPeriodsChildrenIds(store),
    }
})
export default class Updates extends React.Component {

    static propTypes = {
        parentId: PropTypes.number.isRequired,
        periodLocked: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.hideMe = this.hideMe.bind(this);
        this.state = {collapseId: collapseId(c.OBJECTS_UPDATES, props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
        // noHide();
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, c.OBJECTS_UPDATES, this.activeKey());
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        })
    }

    hideMe(id) {
        return hideMe(c.OBJECTS_UPDATES, this.props.parentId, id);
    }

    renderPanels(updateIds) {
        let actualValue = 0;
        return (updateIds.map(
            (id) => {
                const update = this.props.updates.objects[id];
                const activeFilter = this.props.ui.activeFilter;
                // Calculate running total of numeric updates data
                const data = parseInt(update.data);
                if (data && update.status == c.UPDATE_STATUS_APPROVED) {
                    actualValue += data;
                }
                update.actual_value = actualValue;
                const className = fullUpdateVisibility(update, activeFilter) ?
                    'row'
                :
                    'row dimmed';
                return (
                    <div className={className} key={id}>
                        <UpdateHeader update={update} periodLocked={this.props.periodLocked}
                                      collapseId={this.state.collapseId}/>
                        <div className={'row'}>
                            <Update update={update} collapseId={this.state.collapseId}/>
                            <Comments parentId={id} inForm={false}/>
                        </div>
                    </div>
                )
            }
        ))
    }

    render() {
        const updateIds = this.props.periodChildrenIds[this.props.parentId] || [];
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
