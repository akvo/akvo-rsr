/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React, { PropTypes } from "react";
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
import { hideMe } from "../../utils";

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


const UpdateDisplay = ({update}) => {
    const userName = update.user_details.first_name + " " + update.user_details.last_name;
    return (
        <div>
            <ul className="updateMeta">
                <li className="updateDate">{displayDate(update.created_at)}</li>
                <li className="updateName">by
                    <span>{userName}</span> at
                    <span>{update.user_details.approved_organisations[0].name}</span>
                </li>
                <li className="updateStatus">{_('update_statuses')[update.status]}</li>
            </ul>
            <ul className="valueMeta">
                <li className="updateValue">Update value: <span>{update.data}</span></li>
            {/*
         NOTE: we use update.actual_value, a value calculated in App.annotateUpdates(),
         not update.period_actual_value from the backend
         */}
                <li className="totalValue">Actual total for this period (including this update):
                    <span>{update.actual_value}</span>
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
        updateForms: store.ui[c.UPDATE_FORMS]
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
        // let editUpdateButton, updateAlert;
        // if (!this.props.periodLocked) {
        //     editUpdateButton = <ToggleButton onClick={this.formToggle}
        //                                      className={'btn btn-sm btn-default'}
        //                                      label={_('edit_update')}/>;
        //     updateAlert = <this.state.UpdateAlert />
        // }
        return(
            <div className="col-xs-12">
                {/*{editUpdateButton}*/}
                {/*{updateAlert}*/}
                {new Set(this.props.updateForms).has(this.props.update.id) ?
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
        <span><span>{userName}</span> {organisation ? " at " + organisation: ''}</span>
    )
};
UserInfo.propTypes = {
    user_details: PropTypes.object.isRequired,
};


@connect((store) => {
    return {
        updateForms: store.ui[c.UPDATE_FORMS]
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
        openPanel(collapseId, update);
        e.stopPropagation();
    }

    render() {
        let editUpdateButton, updateAlert;
        if (!this.props.periodLocked) {
            let className;
            if (new Set(this.props.updateForms).has(this.props.update.id)) {
                className = 'btn btn-sm btn-default editingForm';
            } else {
                className = 'btn btn-sm btn-default';
            }
            editUpdateButton = <ToggleButton onClick={this.formToggle}
                                             className={className}
                                             label={_('edit_update')}/>;
            updateAlert = <this.state.UpdateAlert />
        }
        const update = this.props.update;
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
        this.hideMe = this.hideMe.bind(this);
        this.state = {collapseId: collapseId(c.OBJECTS_UPDATES, this.props.parentId)};
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
                // Calculate running total of numeric updates data
                const data = parseInt(update.data);
                if (data && update.status == c.UPDATE_STATUS_APPROVED) {
                    actualValue += data;
                }
                update.actual_value = actualValue;
                const className = this.hideMe(id) ? 'hidePanel' : '';
                return (
                    <Panel header={<UpdateHeader update={update}
                                                 periodLocked={this.props.periodLocked}
                                                 collapseId={this.state.collapseId}/>}
                           className={className}
                           key={id}>
                        <div className={'row'}>
                            <Update update={update} collapseId={this.state.collapseId}/>
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
                <div className={c.OBJECTS_UPDATES}>
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
