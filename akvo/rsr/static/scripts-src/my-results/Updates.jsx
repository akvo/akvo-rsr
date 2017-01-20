/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';
import update  from 'immutability-helper';

import Level from "./Level.jsx";
import Comments from './Comments.jsx';

import {
    APICall, endpoints, displayDate, displayNumber, _, currentUser, isNewUpdate, levelToggle
} from './utils.js';
import {STATUS_DRAFT_CODE, STATUS_APPROVED_CODE, OBJECTS_UPDATES, OBJECTS_COMMENTS} from './const.js';


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


class Update extends React.Component {
    constructor (props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
        this.state = {formOpen: isNewUpdate(props.update)};
    }

    formToggle() {
        this.setState({formOpen: !this.state.formOpen});
    }

    render() {
        return(
            <div>
                <div>
                    <a onClick={this.formToggle}
                       className={'btn btn-sm btn-default'}
                       style={{margin: '0.3em 0.5em'}}>
                        {_('edit_update')}
                    </a>
                </div>
                {this.state.formOpen ?
                    <UpdateForm
                        callbacks={this.props.callbacks}
                        update={this.props.update}
                        formToggle={this.formToggle}/>
                :
                    <UpdateDisplay update={this.props.update}/>}
            </div>
        )
    }
}

Update.propTypes = {
    callbacks: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired
};


class UpdatesBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {model: OBJECTS_UPDATES}
    }

    componentWillMount() {
        this.props.callbacks.loadModel(OBJECTS_COMMENTS);
    }

    renderPanel(update) {
        const organisation = update.user_details.approved_organisations[0].name;
        const userName = update.user_details.first_name +" "+ update.user_details.last_name;
        const headerText = `Update: ${userName} at ${organisation}, Data: ${update.data}
                            Status: ${_('update_statuses')[update.status]}`;
        return (
            <Panel header={headerText} key={update.id}>
                <Update
                    update={update}
                    callbacks={this.props.callbacks}/>
                <div>
                    <Comments
                        items={update.comments}
                        callbacks={this.props.callbacks}/>
                </div>
            </Panel>
        )
    }

    render() {
        // Combine activeKey with state.newKeys to create a new activeKey
        // Note that the order of the props in the call to Level is important as the local activeKey
        // overwrites props.activeKey
        const activeKey = update(this.props.activeKey, {$push: this.props.newKeys});
        return (
            <Level
                {...this.props}
                renderPanel={this.renderPanel.bind(this)}
                activeKey={activeKey}/>
        );
    }

}

UpdatesBase.propTypes = {
    callbacks: PropTypes.object.isRequired,
    items: PropTypes.array,
};

export const Updates = levelToggle(UpdatesBase);

const Header = ({update}) => {
    return (
        <div className="col-xs-12">
            <div className="row update-entry-container-header">
                Status: {_('update_statuses')[update.status]}
            </div>
        </div>
    )
};


const ActualValueInput = ({update, updatedActualValue, onChange}) => {
    return (
        <div className="row">
            <div className="col-xs-6">
                <label htmlFor="actualValue">{_('add_to_actual_value')}</label>
                <input className="form-control"
                       id="data"
                       value={update.data}
                       onChange={onChange}
                       placeholder={_('input_placeholder')} />
            </div>
            <div className="col-xs-6">
                <div className="upActualValue">
                    <label>
                        <span className="update-actual-value-text">
                            {_('total_value_after_update')}:
                        </span>
                    </label>
                    <div className="update-actual-value-data">
                        {updatedActualValue}
                    </div>
                </div>
            </div>
        </div>
    )
};

ActualValueInput.propTypes = {
    update: PropTypes.object,
    updatedActualValue: PropTypes.string,
    onChange: PropTypes.func.isRequired
};


const ActualValueDescription = ({update, onChange}) => {
    return (
        <div className="row">
            <div className="col-xs-9 update-description">
                <div>
                    <label htmlFor="description">{_('actual_value_comment')}</label>
                    <textarea className="form-control"
                              id="text"
                              value={update.text}
                              onChange={onChange}
                              placeholder={_('comment_placeholder')}>
                    </textarea>
                </div>
            </div>
        </div>
    )
};

ActualValueDescription.propTypes = {
    update: PropTypes.object,
    onChange: PropTypes.func.isRequired
};


const Attachments = () => {
    return (
        <div className="row">
            <div className="col-xs-6">
                <div>
                    <label className="imageUpload">
                        <input type="file" accept="image/*"/>
                        <a>
                            <i className="fa fa-camera"/>
                            <span></span>
                            <span>Add image</span>
                        </a>
                    </label>
                </div>
            </div>
            <div className="col-xs-6">
                <div>
                    <label className="fileUpload">
                        <input type="file"/>
                        <a>
                            <i className="fa fa-paperclip"/>
                            <span></span>
                            <span>Attach file</span>
                        </a>
                    </label>
                </div>
            </div>
        </div>
    )
};


const UpdateFormButtons = ({update, callbacks}) => {
    return (
        <div className="menuAction">
        {!isNewUpdate(update) ?
            <div role="presentation" className="removeUpdate">
                <a onClick={callbacks.deleteUpdate} className="btn btn-default btn-xs">{_('delete')}</a>
            </div>
        : ''}
            <ul className="nav-pills bottomRow navbar-right">
                <li role="presentation" className="cancelUpdate">
                    <a onClick={callbacks.onCancel} className="btn btn-link btn-xs">{_('cancel')}</a>
                </li>
                <li role="presentation" className="saveUpdate">
                    <a id="save" onClick={callbacks.saveUpdate} className="btn btn-default btn-xs">{_('save')}</a>
                </li>
                <li role="presentation" className="approveUpdate">
                    <a id="approve" onClick={callbacks.saveUpdate} className="btn btn-default btn-xs">{_('approve')}</a>
                </li>
                <span></span>
            </ul>
        </div>
    )
};

UpdateFormButtons.propTypes = {
    callbacks: PropTypes.object.isRequired
};


const pruneForPATCH = (update) => {
    // Only include the listed fields when PATCHing an update
    // currently the list mimics the old MyResults data
    const fields = ['data', 'text', 'relative_data', 'status'];
    return fields.reduce((acc, f) => {return Object.assign(acc, {[f]: update[f]})}, {});
};

const pruneForPOST = (update) => {
    // Only include the listed fields when POSTing an update
    let updateForPOST = Object.assign({}, update);
    delete updateForPOST['user_details'];
    return updateForPOST;
};

class UpdateForm extends React.Component {

    constructor(props) {
        super(props);
        // Save original update
        this.state = {originalUpdate: Object.assign({}, this.props.update)};
        this.saveUpdate = this.saveUpdate.bind(this);
        this.deleteUpdate = this.deleteUpdate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onChange(e) {
        // When the form field widgets change, modify the model data in App.state[model]
        const field = e.target.id;
        this.props.callbacks.updateModel(
            OBJECTS_UPDATES, update(this.props.update, {$merge: {[field]: e.target.value}}));
    }

    onCancel() {
        this.props.formToggle();
        const update = this.state.originalUpdate;
        if (isNewUpdate(update)) {
            this.props.callbacks.deleteFromModel(OBJECTS_UPDATES, update.id);
        } else {
            this.props.callbacks.updateModel(OBJECTS_UPDATES, update);
        }
    }

    saveUpdate(e) {
        let update = Object.assign({}, this.props.update);
        // All changes to an update revert it to draft unless it is explicitly approved while saving
        if (e.target.id == 'approve') {
            update.status = STATUS_APPROVED_CODE;
        } else {
            update.status = STATUS_DRAFT_CODE;
        }
        let success = function(data) {
            this.props.formToggle();
            // Always save the instance using data coming from the backend
            // TODO: look at having a replaceModel method?
            this.props.callbacks.deleteFromModel(OBJECTS_UPDATES, update.id);
            this.props.callbacks.updateModel(OBJECTS_UPDATES, data);
        };
        if (isNewUpdate(update)) {
            APICall('POST', endpoints.updates_and_comments(),
                    pruneForPOST(update), success.bind(this));
        } else {
            APICall('PATCH', endpoints.update_and_comments(update.id),
                    pruneForPATCH(update), success.bind(this));
        }
    }

    deleteUpdate() {
        const data = {id: this.props.update.id};
        let success = function() {
            this.props.formToggle();
            this.props.callbacks.updateModel(OBJECTS_UPDATES, data, true);
        };

        APICall('DELETE', endpoints.update_and_comments(data.id), null, success.bind(this));
    }

    previousActualValue() {
        if (this.props.update) {
            return this.props.update.actual_value - this.props.update.data;
        } else {
            const updates = this.props.period.updates;
            if (updates && updates.length > 0) {
                const latest = updates[updates.length - 1];
                return latest.actual_value;
            }
            return 0;
        }
    }

    render() {
        const updateValue = parseFloat(this.props.update.data ? this.props.update.data : 0);
        const updatedActualValue = displayNumber(this.previousActualValue() + updateValue);
        return (
            <div className="update-container">
                <div className="row update-entry-container edit-in-progress">
                    <Header update={this.props.update}/>
                    <ActualValueInput
                        onChange={this.onChange}
                        update={this.props.update}
                        updatedActualValue={updatedActualValue}/>
                    <ActualValueDescription
                        onChange={this.onChange}
                        update={this.props.update}/>
                    <Attachments/>
                    <UpdateFormButtons
                        update={this.props.update}
                        callbacks={{
                            saveUpdate: this.saveUpdate,
                            deleteUpdate: this.deleteUpdate,
                            onCancel: this.onCancel}}/>
                </div>
            </div>
        )
    }
}

UpdateForm.propTypes = {
    callbacks: PropTypes.object.isRequired,
    formToggle: PropTypes.func.isRequired,
    update: PropTypes.object.isRequired,
    period: PropTypes.object
};

let newUpdateID = 1;

export class NewUpdateButton extends React.Component {
    constructor (props) {
        super(props);
        this.newUpdate = this.newUpdate.bind(this);
    }

    newUpdate() {
        const user = this.props.callbacks.currentUser();
        const id = `new-${newUpdateID}`;
        const data = {
            id: id,
            period: this.props.period.id,
            user_details: user,
            user: user.id,
            data: 0,
            text: '',
            relative_data: true,
            status: STATUS_DRAFT_CODE
        };
        this.props.callbacks.openNewForm(id, data);
        newUpdateID += 1;
    }

    render() {
        return (
            <div>
                <div>
                    <a onClick={this.newUpdate}
                       className={'btn btn-sm btn-default'}
                       style={{margin: '0.3em 0.5em'}}>
                        <i className='fa fa-plus' />
                        {_('new_update')}
                    </a>
                </div>
            </div>
        )
    }
}

NewUpdateButton.propTypes = {
    callbacks: PropTypes.object.isRequired,
    period: PropTypes.object
};
