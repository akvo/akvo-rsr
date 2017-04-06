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
})
class Update extends React.Component {

    static propTypes = {
        update: PropTypes.object.isRequired,
        collapseId: PropTypes.string.isRequired,
        periodLocked: PropTypes.bool.isRequired,
    };

    constructor (props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
    }

    formToggle() {
        updateFormToggle(this.props.update.id);
    }

    render() {
        let editUpdateButton;
        if (!this.props.periodLocked) {
            editUpdateButton = <ToggleButton onClick={this.formToggle}
                                                  className={'btn btn-sm btn-default'}
                                                  label={_('edit_update')}/>
        }
        return(
            <div>
                {editUpdateButton}
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


const UpdateHeader = ({update}) => {
    const organisation = update.user_details.approved_organisations[0].name;
    const userName = update.user_details.first_name +" "+ update.user_details.last_name;
    return (
        <span>
            Update: {userName} at {organisation},
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
        ui: store.ui
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

    renderPanels(updates) {
        let actualValue = 0;
        return (updates.map(
            (update) => {
                // Calculate running total of numeric updates data
                const data = parseInt(update.data);
                if (data && update.status == UPDATE_STATUS_APPROVED) {
                    actualValue += data;
                }
                update.actual_value = actualValue;
                return (
                    <Panel header={<UpdateHeader update={update}/>} key={update.id}>
                        <Update update={update}
                                collapseId={this.state.collapseId}
                                periodLocked={this.props.periodLocked}/>
                        <Comments parentId={update.id}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        const { ids, updates } = findChildren(this.props.parentId, 'updates', 'period');
        const toggleKey = createToggleKey(ids, this.activeKey());
        if (!updates) {
            return (
                <p>Loading...</p>
            );
        } else if (updates.length > 0) {
            return (
                <div className={OBJECTS_UPDATES}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    {/*<ToggleButton onClick={this.toggleAll} label="++"*/}
                                  {/*disabled={!this.props.ui.allFetched}/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(updates)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <p>No updates</p>
            );
        }
    }
}
