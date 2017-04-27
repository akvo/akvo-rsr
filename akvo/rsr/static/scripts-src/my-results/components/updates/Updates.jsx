/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React, { PropTypes } from "react";
import Collapse, { Panel } from "rc-collapse";
import { connect } from "react-redux"

import { onChange } from "../../actions/collapse-actions"
import { updateFormToggle } from "../../actions/ui-actions"

import Comments from "../Comments"

import {
    displayDate, _, currentUser, findChildren, createToggleKey, collapseId, createToggleKeys
} from '../../utils.js';

import { OBJECTS_UPDATES, UPDATE_STATUS_APPROVED, UPDATE_FORMS } from '../../const.js';

import { ToggleButton } from "../common"
import UpdateForm from "./UpdateForm"
import {getUpdatesChildrenIds, getPeriodsChildrenIds} from "../../selectors";

import * as alertActions from "../../actions/alert-actions"

import AlertFactory from "../alertContainer"
import {UPDATE_MODEL_FULFILLED, UPDATE_MODEL_REJECTED} from "../../reducers/modelsReducer";


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


const UpdateDisplay = ({update}) => {
    const userName = update.user_details.first_name + " " + update.user_details.last_name;
    return (
        <div>
            When: {displayDate(update.created_at)} |
            By: {userName} |
            Org: {update.user_details.approved_organisations[0].name} |
            Status: {_('update_statuses')[update.status]} <br/>
            Update value: {update.data} | {/*
         NOTE: we use update.actual_value, a value calculated in App.annotateUpdates(),
         not update.period_actual_value from the backend
         */}
            Actual total for this period (including this update): {update.actual_value}
        </div>
    )
};
UpdateDisplay.propTypes = {
    update: PropTypes.object.isRequired
};


@connect((store) => {
    return {
        ui: store.ui
    }
}, alertActions)
class Update extends React.Component {

    static propTypes = {
        update: PropTypes.object.isRequired,
        collapseId: PropTypes.string.isRequired,
        periodLocked: PropTypes.bool.isRequired,
    };

    constructor (props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
        // we need a unique name for each alert
        const alertName = 'UpdateAlert-' + this.props.update.id;
        this.state = {
            updateAlertName: alertName,
            UpdateAlert: AlertFactory({alertName: alertName})(Alert),
        };

    }

    formToggle() {
        updateFormToggle(this.props.update.id);
    }

    render() {
        let editUpdateButton, updateAlert;
        if (!this.props.periodLocked) {
            editUpdateButton = <ToggleButton onClick={this.formToggle}
                                                  className={'btn btn-sm btn-default'}
                                                  label={_('edit_update')}/>
            updateAlert = <this.state.UpdateAlert />
        }
        return(
            <div className="col-xs-7">
                {editUpdateButton}
                {updateAlert}
                {new Set(this.props.ui[UPDATE_FORMS]).has(this.props.update.id) ?
                    <UpdateForm
                        update={this.props.update}
                        formToggle={this.formToggle}
                        collapseId={this.props.collapseId}/>
                :
                    <UpdateDisplay update={this.props.update}/>}
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
        <span>Update: {userName}{organisation ? " at " + organisation: ''}</span>
    )
};

UserInfo.propTypes = {
    user_details: PropTypes.object.isRequired,
};


const UpdateHeader = ({update}) => {
    return (
        <span>
            <UserInfo user_details={update.user_details}/>,
            Data: {update.data} Status: {_('update_statuses')[update.status]}
        </span>
    )
};

UpdateHeader.propTypes = {
    update: PropTypes.object.isRequired,
};


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
        this.state = {collapseId: collapseId(OBJECTS_UPDATES, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        this.props.dispatch(onChange(this.state.collapseId, activeKey));
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, OBJECTS_UPDATES, this.activeKey());
        keys.map((collapse) => {
            this.props.dispatch(onChange(collapse.collapseId, collapse.activeKey));
        })
    }

    renderPanels(updateIds) {
        let actualValue = 0;
        return (updateIds.map(
            (id) => {
                const update = this.props.updates.objects[id];
                // Calculate running total of numeric updates data
                const data = parseInt(update.data);
                if (data && update.status == UPDATE_STATUS_APPROVED) {
                    actualValue += data;
                }
                update.actual_value = actualValue;
                return (
                    <Panel header={<UpdateHeader update={update}/>} key={id}>
                        <div className={'row'}>
                            <Update update={update}
                                    collapseId={this.state.collapseId}
                                    periodLocked={this.props.periodLocked}/>
                            <Comments parentId={id}/>
                        </div>
                    </Panel>
                )
            }
        ))
    }

    render() {
        const updateIds = this.props.periodChildrenIds[this.props.parentId] || [];
        // const toggleKey = createToggleKey(ids, this.activeKey());
        if (!updateIds) {
            return (
                <p>Loading...</p>
            );
        } else if (updateIds.length > 0) {
            return (
                <div className={OBJECTS_UPDATES}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    {/*<ToggleButton onClick={this.toggleAll} label="++"*/}
                                  {/*disabled={!this.props.ui.allFetched}/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(updateIds)}
                    </Collapse>
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
