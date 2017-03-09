/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React, { PropTypes } from "react";
import Collapse, { Panel } from "rc-collapse";
import { connect } from "react-redux"
import update from 'immutability-helper';

import { onChange, addKey } from "../../actions/collapse-actions"
import {
    updateModel, deleteFromModel, updateUpdateToBackend, saveUpdateToBackend, deleteUpdateFromBackend
} from "../../actions/model-actions"
import { updateFormOpen, updateFormClose } from "../../actions/ui-actions"

import {
    endpoints, displayNumber, _, currentUser, isNewUpdate, collapseId
} from '../../utils.js';

import {
    UPDATE_STATUS_DRAFT, UPDATE_STATUS_NEW, UPDATE_STATUS_APPROVED, OBJECTS_UPDATES
} from '../../const.js';


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
                <a onClick={callbacks.deleteUpdate}
                   className="btn btn-default btn-xs">{_('delete')}</a>
            </div>
        : ''}
            <ul className="nav-pills bottomRow navbar-right">
                <li role="presentation" className="cancelUpdate">
                    <a onClick={callbacks.onCancel}
                       className="btn btn-link btn-xs">{_('cancel')}</a>
                </li>
                <li role="presentation" className="saveUpdate">
                    <a id="save" onClick={callbacks.saveUpdate}
                       className="btn btn-default btn-xs">{_('save')}</a>
                </li>
                <li role="presentation" className="approveUpdate">
                    <a id="approve" onClick={callbacks.saveUpdate}
                       className="btn btn-default btn-xs">{_('approve')}</a>
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
    // Delete the listed fields when POSTing an update
    let updateForPOST = Object.assign({}, update);
    delete updateForPOST['user_details'];
    delete updateForPOST['meta'];
    return updateForPOST;
};

export default class UpdateForm extends React.Component {

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
        // When the form field widgets change, modify the object in store['updates']
        const field = e.target.id;
        const changedUpdate = update(this.props.update, {$merge: {[field]: e.target.value}});
        updateModel('updates', changedUpdate);
    }

    onCancel() {
        this.props.formToggle();
        const originalUpdate = this.state.originalUpdate;
        if (isNewUpdate(originalUpdate)) {
            deleteFromModel(OBJECTS_UPDATES, originalUpdate, this.props.collapseId);
        } else {
            updateModel(OBJECTS_UPDATES, originalUpdate);
        }
        updateFromClose(originalUpdate.id);
    }

    saveUpdate(e) {
        let update = Object.assign({}, this.props.update);
        // All changes to an update revert it to draft unless it is explicitly approved while saving
        if (e.target.id == 'approve') {
            update.status = UPDATE_STATUS_APPROVED;
        } else {
            update.status = UPDATE_STATUS_DRAFT;
        }

        const callback = updateFormClose.bind(null, update.id);
        if (isNewUpdate(update)) {
            saveUpdateToBackend(endpoints.updates_and_comments(), pruneForPOST(update),
                                this.props.collapseId, callback);
        } else {
            updateUpdateToBackend(endpoints.update_and_comments(update.id), pruneForPATCH(update),
                                  this.props.collapseId, callback);
        }
    }

    deleteUpdate() {
        const url = endpoints.update_and_comments(this.props.update.id);
        deleteUpdateFromBackend(url, this.props.update, this.props.collapseId);
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
                    <ActualValueInput onChange={this.onChange} update={this.props.update}
                                      updatedActualValue={updatedActualValue}/>
                    <ActualValueDescription onChange={this.onChange} update={this.props.update}/>
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
        this.state = {collapseId: collapseId(OBJECTS_UPDATES, this.props.period.id)};
        this.newUpdate = this.newUpdate.bind(this);
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    newUpdate() {
        const id = `new-${newUpdateID}`;
        let { user, period } = this.props;
        user = user.objects[user.ids[0]];
        const update = {
            id: id,
            period: period.id,
            user_details: user,
            user: user.id,
            data: 0,
            text: '',
            relative_data: true,
            status: UPDATE_STATUS_NEW,
            // Keep track of the open/closed state of the form
        };
        //TODO: promise based solution where addKey is called on completion of updateModel?
        updateModel('updates', update, this.state.collapseId);
        updateFormOpen(update.id);
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
    callbacks: PropTypes.object,
    period: PropTypes.object
};
