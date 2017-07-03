/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import PropTypes from "prop-types";
import { Panel } from "rc-collapse";
import { connect } from "react-redux"
import update from 'immutability-helper';

import * as alertActions from "../../actions/alert-actions"
import { addKey } from "../../actions/collapse-actions"

import {
    updateModel,
    deleteFromModel,
    updateUpdateToBackend,
    saveUpdateToBackend,
    deleteUpdateFromBackend,
} from "../../actions/model-actions"

import * as c from '../../const.js';

import {
    updateFormOpen,
    updateFormClose,
    selectPeriodsThatNeedReporting,
    showUpdates,
} from "../../actions/ui-actions"

import {
    endpoints,
    displayNumber,
    _,
    collapseId,
    isNewUpdate,
} from '../../utils.js';

import {
    ButtonLabel,
    FileReaderInput,
    ToggleButton,
} from '../common';

import {
    getNeedReportingPeriods,
    getPendingUpdates,
    getUpdatesForApprovedPeriods,
} from "../../selectors";


// If the update is approved only M&E managers are allowed to delete
const isAllowedToDelete = (user, update) =>
    update.status !== c.UPDATE_STATUS_APPROVED || user.isMEManager;


const Header = ({update}) => {
    return (
        <div>
            <div className="update-entry-container-header hidden">
                Status: {_('update_statuses')[update.status]}
            </div>
        </div>
    )
};

Header.propTypes = {
    update: PropTypes.object.isRequired,
};


const ActualValueInput = ({update, onChange}) => {
    return (
        <div className="row">
            <div>
                <label htmlFor="actualValue">{_('add_to_actual_value')}</label>
                <input className="form-control"
                       id="data"
                       value={update.data}
                       onChange={onChange}
                       placeholder={_('input_placeholder')} />
            </div>
        </div>
    )
};

ActualValueInput.propTypes = {
    update: PropTypes.object.isRequired,
    updatedActualValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};


const ActualValueDescription = ({update, onChange}) => {
    return (
        <div className="row">
            <div className="update-description">
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
    update: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};


class FileUpload extends React.Component {
    static propTypes = {
        update: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        removeAttachment: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.clearInput = this.clearInput.bind(this);
    }

    clearInput(e) {
        this.input._reactFileReaderInput.value = '';
        this.props.removeAttachment('file');
        e.preventDefault();
    }

    render() {
        let filename, removeFile;
        const update = this.props.update;
        // Update with new file
        if (update._file && update._file != 'delete') {
            filename = <div>{update._file.name}</div>
        // Existing, unmodified update
        } else if (update.file_url) {
            filename = <div>{decodeURIComponent(update.file_url.split('/').pop())}</div>
        }
        if (filename) {
            removeFile = <a id="removeFile" style={{marginLeft: "0.5em"}} onClick={this.clearInput}>
                             {_('remove_file')}
                         </a>
        }
        return (
            <span>
                <FileReaderInput as="url" id="updateFile" onChange={this.props.onChange}
                                 ref={input => this.input = input}>
                    <label className="imageUpload">
                        <a>
                            <i className="fa fa-paperclip"/>
                            {_('attach_file')}
                        </a>
                    </label>
                </FileReaderInput>
                {removeFile}
                {filename}
            </span>
        );
    }
}


class ImageUpload extends React.Component {
    static propTypes = {
        update: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        removeAttachment: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.clearInput = this.clearInput.bind(this);
    }

    clearInput(e) {
        this.input._reactFileReaderInput.value = '';
        this.props.removeAttachment('photo');
        e.preventDefault();
    }

    render() {
        let imageName, removeImage;
        const update = this.props.update;
        // Update with new photo
        if (update._photo && update._photo != 'delete') {
            imageName = <div>{update._photo.file.name}</div>
        // Existing, unmodified update
        } else if (update.photo_url) {
            imageName = <div>{decodeURIComponent(update.photo_url.split('/').pop())}</div>
        }
        if (imageName) {
            removeImage =
                <div className="col-xs-3 update-photo">
                    <div className="image-container">
                        <a onClick={this.clearInput}>
                            <img src={update._photo ? update._photo.img: update.photo_url}/>
                            <div id="removeImage" className="image-overlay text-center">
                                {_('remove_image')}
                            </div>
                        </a>
                    </div>
                </div>
        }

        return (
            <div>
                {removeImage}
                <FileReaderInput as="url" id="updatePhoto" onChange={this.props.onChange}
                                 ref={input => this.input = input}>
                    <label className="imageUpload">
                        <a>
                            <i className="fa fa-camera"/>
                            {removeImage ? _('change_image') : _('add_image')}
                        </a>
                    </label>
                </FileReaderInput>
                {imageName}
            </div>
        );
    }
}


const Attachments = ({update, onChange, removeAttachment}) => {
    return (
        <div className="row">
            <div className="col-xs-3">
                <ImageUpload update={update} onChange={onChange}
                             removeAttachment={removeAttachment}/>
            </div>
            <div className="col-xs-3">
                <FileUpload update={update} onChange={onChange}
                            removeAttachment={removeAttachment}/>
            </div>
        </div>
    )
};

Attachments.propTypes = {
    update: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    removeAttachment: PropTypes.func.isRequired,
};


const UpdateActionButton = ({action, saveUpdate, disabled}) => {
    const labels = {
        [c.UPDATE_ACTION_SAVE]: _('save'),
        [c.UPDATE_ACTION_SUBMIT]: _('submit_for_approval'),
        [c.UPDATE_ACTION_RETURN]: _('return_for_revision'),
        [c.UPDATE_ACTION_APPROVE]: _('approve'),
    };
    return (
        <li role="presentation" className={action}>
            <ToggleButton id={action} onClick={saveUpdate} label={labels[action]}
                          disabled={disabled} className="btn btn-default btn-xs"/>
        </li>
    )
};

UpdateActionButton.propTypes = {
    action: PropTypes.string.isRequired,
    saveUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};


const UpdateFormButtons = ({user, update, callbacks}) => {
    //TODO: change those "buttons" to real button tags so they can easily be disabled and a spinner
    // can be shown when saving is under way
    function getActionButtons(role, updateStatus) {
        let btnKey = 0;
        return c.UPDATE_BUTTONS[role][updateStatus].map(
            action => {
                const disabled = (update.data === null || update.data === "") &&
                                  action !== c.UPDATE_ACTION_SAVE;
                return <UpdateActionButton key={++btnKey} action={action}
                                           saveUpdate={callbacks.saveUpdate} disabled={disabled}/>
            }
        )
    }
    const role = user.isMEManager ? c.ROLE_ME_MANAGER : c.ROLE_PROJECT_EDITOR;
    const actionButtons = getActionButtons(role, update.status);
    return (
        <div className="menuAction">
            <ul className="nav-pills bottomRow navbar-right">
                {!isNewUpdate(update) && isAllowedToDelete(user, update)?
                    <li role="presentation" className="removeUpdate">
                        <ToggleButton onClick={callbacks.deleteUpdate} label={_('delete')}
                                      className="btn btn-default btn-xs"/>
                    </li>
                : ''}
                <li role="presentation" className="cancelUpdate">
                    <ToggleButton onClick={callbacks.onCancel} label={_('cancel')}
                                  className="btn btn-link btn-xs"/>
                </li>
                {actionButtons}
            </ul>
        </div>
    )
};

UpdateFormButtons.propTypes = {
    user: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
};


const pruneForPATCH = (update) => {
    // Only include the listed fields when PATCHing an update
    // currently the list mimics the old MyResults data
    const fields = ['data', 'text', 'relative_data', 'status', '_file', '_photo', 'approved_by',];
    return fields.reduce((acc, f) => {return Object.assign(acc, {[f]: update[f]})}, {});
};

const pruneForPOST = (update) => {
    // Delete the listed fields when POSTing an update
    let updateForPOST = Object.assign({}, update);
    delete updateForPOST['user_details'];
    return updateForPOST;
};

@connect((store) => {
    return {
        user: store.models.user.objects[store.models.user.ids[0]],
        updates: store.models.updates,
        ui: store.ui,
        needReportingPeriods: getNeedReportingPeriods(store),
        draftUpdates: getPendingUpdates(store),
        approvedUpdates: getUpdatesForApprovedPeriods(store),
    }
}, alertActions)
export default class UpdateForm extends React.Component {

    static propTypes = {
        update: PropTypes.object.isRequired,
        collapseId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        // Save original update, used when editing is cancelled
        this.state = {
            originalUpdate: Object.assign({}, this.props.update),
            updateAlertName: 'UpdateAlert-' + this.props.update.id,
        };
        this.saveUpdate = this.saveUpdate.bind(this);
        this.deleteUpdate = this.deleteUpdate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.attachmentsChange = this.attachmentsChange.bind(this);
        this.removeAttachment = this.removeAttachment.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.formClose = this.formClose.bind(this);
        this.refreshFilter = this.refreshFilter.bind(this);
        this.successCallback = this.successCallback.bind(this);
    }

    attachmentsChange(e, results) {
        let changedUpdate;
        const file = results[0][1];
        const event = results[0][0];
        if (file.type.startsWith('image/')) {
            changedUpdate = update(this.props.update, {$merge: {_photo :{file, img: event.target.result}}});
        } else {
            changedUpdate = update(this.props.update, {$merge: {_file: file}});
        }
        updateModel('updates', changedUpdate);
    }

    removeAttachment(type) {
        let changedUpdate;
        if (type == 'file') {
            // only set to delete a file if there was one in the first place
            if (this.state.originalUpdate.file_url)
                changedUpdate = update(this.props.update,
                                       {$merge: {file: '', file_url: '', _file: 'delete'}});
            else
                changedUpdate = update(this.props.update,
                                       {$merge: {file: '', file_url: '', _file: undefined}});
        } else if (type == 'photo') {
            // only set to delete an image if there was one in the first place
            if (this.state.originalUpdate.photo_url)
                changedUpdate = update(this.props.update,
                                       {$merge: {photo: '', photo_url: '', _photo: 'delete'}});
            else
                changedUpdate = update(this.props.update,
                                       {$merge: {photo: '', photo_url: '', _photo: undefined}});
        }
        updateModel('updates', changedUpdate);
    }

    onChange(e) {
        // When  any part of the update form changes, modify the object in store['updates']

        let changedUpdate;
        const field = e.target.id;
        const file = e.target.files && e.target.files[0];

        e.preventDefault();

        // New images have to be handled separately since we need to call updateModel inside the
        // onloadend callback
        if (field == "_photo") {
            let reader = new FileReader();
            reader.onloadend = (evt) => {
                const newImage = update(
                    this.props.update, {$merge:
                        {_photo: {file, img: evt.target.result}}
                    }
                );
                updateModel('updates', newImage);
            };
            reader.readAsDataURL(file);
        } else {
            switch(field) {

                case "_file": {
                    this.setState({fileInput: e.target});
                    changedUpdate = update(this.props.update, {$merge: {_file: file}});
                    break;
                }

                case "removeFile": {
                    this.state.fileInput.value = "";
                    // only set to delete a file if there was one in the first place
                    if (this.state.originalUpdate.file_url) {
                        changedUpdate = update(this.props.update, {$merge: {file: '', file_url: '', _file: 'delete'}});
                    } else {
                        changedUpdate = update(this.props.update, {$merge: {file: '', file_url: '', _file: undefined}});
                    }
                    break;
                }

                case "removeImage": {
                    // only set to delete an image if there was one in the first place
                    if (this.state.originalUpdate.photo_url) {
                        changedUpdate = update(this.props.update, {$merge: {photo: '', photo_url: '', _photo: 'delete'}});
                    } else {
                        changedUpdate = update(this.props.update, {$merge: {photo: '', photo_url: '', _photo: undefined}});
                    }
                    break;
                }

                default: {
                    changedUpdate = update(this.props.update, {$merge: {[field]: e.target.value}});
                }
            }
            updateModel('updates', changedUpdate);
        }
    }

    onCancel() {
        updateFormClose();
        const originalUpdate = this.state.originalUpdate;
        if (isNewUpdate(originalUpdate)) {
            deleteFromModel(c.OBJECTS_UPDATES, originalUpdate, this.props.collapseId);
        } else {
            updateModel(c.OBJECTS_UPDATES, originalUpdate);
        }
    }

    formClose() {
        updateFormClose();
    }

    refreshFilter() {
        const filter = this.props.ui.activeFilter;
        switch (filter) {
            case c.FILTER_NEED_REPORTING: {
                selectPeriodsThatNeedReporting(this.props.needReportingPeriods);
                break;
            }
            case c.FILTER_SHOW_DRAFT: {
                showUpdates(this.props.draftUpdates, true);
                break;
            }
            case c.FILTER_SHOW_APPROVED: {
                showUpdates(this.props.approvedUpdates, false, true);
                break;
            }
        }
    }

    successCallback() {
        updateFormClose();
        // TODO: calling refreshFilter here breaks when deleting an update as
        // this.props.approvedUpdates is "stale" when calling. Currently this leads to an update
        // that has just been approved showing in the Need reporting filter view.
        // Need to find a way to let the state change drive the changing of the hidden panels

        // this.refreshFilter(); // Breaks when deleting an update!!!
    };

    saveUpdate(e) {
        function setUpdateStatus(update, action, userId) {
            /*
            Set the status field of the update according to the action taken
             */
            switch(action) {
                case c.UPDATE_ACTION_SAVE: {
                    if (update.status === c.UPDATE_STATUS_NEW) {
                        update.status = c.UPDATE_STATUS_DRAFT;
                    }
                    break;
                }
                case c.UPDATE_ACTION_SUBMIT: {
                    update.status = c.UPDATE_STATUS_PENDING;
                    break;
                }
                case c.UPDATE_ACTION_RETURN: {
                    update.status = c.UPDATE_STATUS_REVISION;
                    break;
                }
                case c.UPDATE_ACTION_APPROVE: {
                    update.status = c.UPDATE_STATUS_APPROVED;
                    update.approved_by = userId;
                    break;
                }
            }
            return update;
        }


        const callbacksFactory = (id, errorMessage) => {
            return {
                [c.UPDATE_MODEL_FULFILLED]: updateFormClose,
                [c.UPDATE_MODEL_REJECTED]: this.props.createAlert.bind(
                    this, this.state.updateAlertName, errorMessage
                )
            };
        };

        let update = Object.assign({}, this.props.update),
            //The id of the button is used to indicate the action taken
            action = e.target.id;
        if (this.props.updates.changing) {
            //NOOP if we're already talking to the backend
            return;
        } else if (!String(update.data).trim()) {
            if (action === c.UPDATE_ACTION_SAVE) {
                // Explicitly empty data, only allowed when saving a draft
                update.data = null;
            } else {
                this.props.createAlert(this.state.updateAlertName, _('actual_value_required'));
                return;
            }
        }

        update = setUpdateStatus(update, action, this.props.user.id);

        if (isNewUpdate(update)) {
            saveUpdateToBackend(
                endpoints.updates_and_comments(), pruneForPOST(update),
                this.props.collapseId, callbacksFactory(update.id, _('update_not_created'))
            );
        } else {
            updateUpdateToBackend(
                endpoints.update_and_comments(update.id), pruneForPATCH(update),
                this.props.collapseId, callbacksFactory(update.id, _("update_not_saved"))
            );
        }
    }

    deleteUpdate() {
        if (this.props.updates.changing) {
            //NOOP if we're already talking to the backend (technically not really needed)
            return;
        } else {
            const update = this.props.update;
            const url = endpoints.update_and_comments(update.id);
            const deleteUpdateAlertName = 'DeleteUpdateAlert-' + update.period;
            const callbacks = {

                // NOTE: the success callback key, c.UPDATE_MODEL_FULFILLED, is incorrect in
                // relation to the actual event, c.UPDATE_MODEL_DELETE_FULFILLED, that is triggered
                // when an object has been successfully deleted from a model
                // [c.UPDATE_MODEL_FULFILLED]: this.refreshFilter.bind(this),

                [c.UPDATE_MODEL_FULFILLED]: updateFormClose,
                [c.UPDATE_MODEL_REJECTED]: this.props.createAlert.bind(
                    this, deleteUpdateAlertName, _("update_not_deleted")
                )
            };
            deleteUpdateFromBackend(url, this.props.update, this.props.collapseId, callbacks);
        }
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
        const update = this.props.update;
        const updateValue = parseFloat(update.data ? update.data : 0);

        return (
            <div className="update-container">
                <div className="row update-entry-container edit-in-progress">
                    <Header update={update}/>
                    <ActualValueInput update={update} onChange={this.onChange}/>
                    <ActualValueDescription update={update}  onChange={this.onChange}/>
                    <Attachments update={update} onChange={this.attachmentsChange}
                                 removeAttachment={this.removeAttachment}/>
                    <UpdateFormButtons
                        user={this.props.user}
                        update={update}
                        callbacks={{
                            saveUpdate: this.saveUpdate,
                            deleteUpdate: this.deleteUpdate,
                            onCancel: this.onCancel}}/>
                </div>
            </div>
        )
    }
}


let newUpdateID = 1;

export class NewUpdateButton extends React.Component {

    static propTypes = {
        period: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        disabled: PropTypes.bool.isRequired,
    };

    constructor (props) {
        super(props);
        this.state = {collapseId: collapseId(c.OBJECTS_UPDATES, this.props.period.id)};
        this.newUpdate = this.newUpdate.bind(this);
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    newUpdate() {
        const id = `new-${newUpdateID}`;
        let { user, period } = this.props;
        const update = {
            id: id,
            period: period.id,
            user_details: user,
            user: user.id,
            data: '',
            text: '',
            relative_data: true,
            status: c.UPDATE_STATUS_NEW,
        };
        //TODO: promise based solution where addKey is called on completion of updateModel?
        updateModel('updates', update);
        updateFormOpen(id);
        newUpdateID += 1;
    }

    render() {
        return (
                <div className="emptyUpdate">
                    <ToggleButton onClick={this.newUpdate} label={_('new_update')}
                                  disabled={this.props.disabled} className="btn btn-sm btn-default newUpdate"/>
                </div>
        )
    }
}
