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
import { FileReaderInput } from '../common';

import { onChange, addKey } from "../../actions/collapse-actions"
import {
    updateModel, deleteFromModel, updateUpdateToBackend, saveUpdateToBackend, deleteUpdateFromBackend
} from "../../actions/model-actions"
import { updateFormOpen, updateFormClose } from "../../actions/ui-actions"

import {
    endpoints, displayNumber, _, currentUser, isNewUpdate, collapseId, getCookie
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


// const FileUpload = ({update, onChange}) => {
//     let filename, removeFile;
//     // Update with new file
//     if (update._file) {
//         filename = <div>{update._file.name}</div>
//     // Existing, unmodified update
//     } else if (update.file_url) {
//         filename = <div>{decodeURIComponent(update.file_url.split('/').pop())}</div>
//     }
//     if (filename) {
//         removeFile = <a name="removeFile" style={{marginLeft: "0.5em"}} onClick={onChange}>
//                          {_('remove_file')}
//                      </a>
//     }
//     return (
//         <div>
//             <label className="imageUpload">
//                 <input name="_file" type="file" onChange={onChange} />
//                 <a>
//                     <i className="fa fa-paperclip"/>
//                     {_('attach_file')}
//                 </a>
//             </label>
//             {removeFile}
//             {filename}
//         </div>
//     )
// };


class FileUpload extends React.Component {

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
            removeFile = <a name="removeFile" style={{marginLeft: "0.5em"}} onClick={this.clearInput}>
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


// const ImageUpload = ({update, onChange}) => {
//
//     let imageName, removeImage;
//     // Update with new photo
//     if (update._photo) {
//         imageName = <div>{update._photo.name}</div>
//     // Existing, unmodified update
//     } else if (update.photo_url) {
//         imageName = <div>{decodeURIComponent(update.photo_url.split('/').pop())}</div>
//     }
//     if (imageName) {
//         removeImage =
//             <div className="col-xs-3 update-photo">
//                 <div className="image-container">
//                     <a onClick={onChange}>
//                         <img src={update._photo ? update._photo.img: update.photo_url}/>
//                         <div id="removeImage" className="image-overlay text-center">
//                             {_('remove_image')}
//                         </div>
//                     </a>
//                 </div>
//             </div>
//     }
//     return (
//         <div>
//             {removeImage}
//             <label className="imageUpload">
//                 <input id="_photo" type="file" accept="image/*" onChange={onChange} />
//                 <a>
//                     <i className="fa fa-camera"/>
//                     {removeImage ? _('change_image') : _('add_image')}
//                 </a>
//             </label>
//             {imageName}
//         </div>
//     )
// }
class ImageUpload extends React.Component {

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
            <div className="col-xs-6">
                <ImageUpload update={update} onChange={onChange} removeAttachment={removeAttachment}/>
            </div>
            <div className="col-xs-6">
                <FileUpload update={update} onChange={onChange} removeAttachment={removeAttachment}/>
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
    const fields = ['data', 'text', 'relative_data', 'status', '_file', '_photo',];
    return fields.reduce((acc, f) => {return Object.assign(acc, {[f]: update[f]})}, {});
};

const pruneForPOST = (update) => {
    // Delete the listed fields when POSTing an update
    let updateForPOST = Object.assign({}, update);
    delete updateForPOST['user_details'];
    return updateForPOST;
};

export default class UpdateForm extends React.Component {

    constructor(props) {
        super(props);
        // Save original update, used when editing is cancelled
        this.state = {
            originalUpdate: Object.assign({}, this.props.update),
        };
        this.saveUpdate = this.saveUpdate.bind(this);
        this.deleteUpdate = this.deleteUpdate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.attachmentsChange = this.attachmentsChange.bind(this);
        this.removeAttachment = this.removeAttachment.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    attachmentsChange(e, results) {
        /*
                {_file: {file: file, name: name}, _photo: {file: file, img: img}}
         */
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
        const field = e.target.name;
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
        this.props.formToggle();
        const originalUpdate = this.state.originalUpdate;
        if (isNewUpdate(originalUpdate)) {
            deleteFromModel(OBJECTS_UPDATES, originalUpdate, this.props.collapseId);
        } else {
            updateModel(OBJECTS_UPDATES, originalUpdate);
        }
        updateFormClose(originalUpdate.id);
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
        const update = this.props.update;
        const updateValue = parseFloat(update.data ? update.data : 0);
        const updatedActualValue = displayNumber(this.previousActualValue() + updateValue);

        return (
            <div className="update-container">
                <div className="row update-entry-container edit-in-progress">
                    <Header update={update}/>
                    <ActualValueInput update={update} onChange={this.onChange}
                                      updatedActualValue={updatedActualValue}/>
                    <ActualValueDescription update={update}  onChange={this.onChange}/>
                    <Attachments update={update} onChange={this.attachmentsChange} removeAttachment={this.removeAttachment}/>
                    <UpdateFormButtons
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
