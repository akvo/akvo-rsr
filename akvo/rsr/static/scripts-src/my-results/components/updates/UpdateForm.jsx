/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux"
import update from 'immutability-helper';
import {Tooltip} from 'react-lightweight-tooltip';

import * as alertActions from "../../actions/alert-actions"
import { addKey } from "../../actions/collapse-actions"

import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';

import {
    updateModel,
    updateUpdateToBackend,
    saveUpdateToBackend,
    deleteUpdateFromBackend,
} from "../../actions/model-actions"

import * as c from '../../const.js';

import {
    updateFormOpen,
    updateFormClose,
    uiHideMode,
    updateMarkdownPreviewToggle,
} from "../../actions/ui-actions"

import {
    endpoints,
    _,
    collapseId,
    isNewUpdate,
    isNumeric,
    getAncestor,
    computePercentage,
} from '../../utils.js';

import AlertFactory from "../alertContainer"

import {
    FileReaderInput,
    ToggleButton,
} from '../common';

import Comments from "../Comments";
import {closeNodes, openNodes} from "../../utils";

import ReactMde, { ReactMdeCommands } from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';


// If the update is approved only M&E managers are allowed to delete
const isAllowedToDelete = (user, update) =>
    update.status !== c.UPDATE_STATUS_APPROVED || user.isMEManager;


const UpdateAlert = ({message, close}) => (
    <div className='results-alert update-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);
UpdateAlert.propTypes = {
    message: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

const toolTipStyle = {
  wrapper: {
    position: 'relative',
    display: 'inline-block',
    zIndex: '98',
    color: 'black',
    cursor: 'help',
    left: '0',
  },
  tooltip: {
    zIndex: '99',
    background: 'white',
    marginBottom: '10px',
    padding: '5px',
    top: '20px',
    left: '165px',
  },
  content: {
    color: '#000',
    background: '#fff',
    border: '1px solid  #ccc',
    fontSize: '.8em',
    padding: '.3em 1em',
    whiteSpace: 'wrap',
  },
  arrow: {
    position: 'absolute',
    width: '0',
    height: '0',
    top: '-6px',
    left: '4px',
    marginLeft: '0px',
    borderBottom: 'solid #000 5px',
    borderLeft: 'solid transparent 5px',
    borderRight: 'solid transparent 5px',
  },
  gap: {
    position: 'absolute',
    width: '100%',
    height: '20px',
    bottom: '-20px',
  },
};
const targetLabelStyle = {
  marginLeft: '25px',
}
const QuantitativeHeader = ({targetValue, targetComment}) => {

    const comment = targetComment ?
        <Tooltip content={targetComment} styles={toolTipStyle}>
            <span className="glyphicon glyphicon-info-sign info-icon"></span>
        </Tooltip>
    :
        undefined;
    return (
        <div>
            <div className="targetLabel" styles={targetLabelStyle}>
                {_('target_value')}: <span>{targetValue}</span>
            </div>
            {comment}
        </div>
    )
};
QuantitativeHeader.propTypes = {
    targetValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

const QualitativeHeader = ({targetValue}) => {
    return (
        <div>
            <div className="targetLabel">
                {_('target')}: <span>{targetValue}</span>
            </div>
        </div>
    )
};
QualitativeHeader.propTypes = {
    targetValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};


const QuantitativeActualValueInput = ({update, onChange, onClose, isPercentage}) => {
    const readOnly = isPercentage,
          value = isPercentage ? update.value + '%' : update.value,
          label = isPercentage ? _('percentage') : _('add_to_actual_value'),
          numerator = isPercentage ? (
              <div>
                  {/* FIXME: Use translated strings*/}
                  <label htmlFor="actualValueNumerator">Numerator</label>
                  <input className="form-control"
                         id="numerator"
                         value={update.numerator}
                         onChange={onChange}
                         placeholder={_('input_placeholder')} />
              </div>
          ) : undefined,
          denominator = isPercentage ? (
              <div>
                  {/* FIXME: Use translated strings*/}
                  <label htmlFor="actualValueDenominator">Denominator</label>
                  <input className="form-control"
                         id="denominator"
                         value={update.denominator}
                         onChange={onChange}
                         placeholder={_('input_placeholder')} />
              </div>
          ) : undefined;

    return (
        <div className="">
            <div>
                <label htmlFor="actualValue">{label}</label>
                <ToggleButton onClick={onClose} label="X"
                              className="btn btn-default btn-xs closingBtn"/>
                <input className="form-control"
                       readOnly={readOnly}
                       id="value"
                       value={value}
                       onChange={onChange}
                       placeholder={_('input_placeholder')} />
            </div>
            {numerator}
            {denominator}
        </div>
    )
};
QuantitativeActualValueInput.propTypes = {
    update: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    isPercentage: PropTypes.bool.isRequired,
};

@connect((store) => {
    return {
        showing_preview: store.ui[c.SHOWING_UPDATE_MARKDOWN_PREVIEW],
    }
})
class QualitativeActualValueInput extends React.Component {
    constructor(props) {
        super(props);
        const {narrative} = this.props.update;
        this.state = {
            reactMde: {text: narrative, selection: null},
        };
    }

    render () {
        const {update, onClose, onChange, hideTarget, showing_preview} = this.props;
        const show_editor = !showing_preview;
        const editorChange = (reactMde) => {
            this.setState({reactMde});
            // HACK: Create fake event
            const e = {
                preventDefault: () => {},
                target: {
                    id: "narrative",
                    value: reactMde.text
                }
            }
            onChange(e);
        }
        return (
            <div className="">
                <div>
                    {hideTarget ?
                     <label htmlFor="actualValue">{_('narrative_reporting')}</label>
                     :
                     <label htmlFor="actualValue">{_('actual')}</label>
                    }
                    <ToggleButton onClick={onClose} label="X"
                                  className="btn btn-default btn-xs"/>
                    <ReactMde value={this.state.reactMde}
                              textAreaProps={{
                                  id: "narrative",
                                  className: "form-control",
                                  placeholder: _('input_placeholder')}}
                              visibility={{
                                  textarea: show_editor,
                                  toolbar: show_editor,
                                  preview: showing_preview,
                              }}
                              onChange={editorChange}
                              commands={ReactMdeCommands.getDefaultCommands()}/>
                </div>
            </div>
        )
    }
};
QualitativeActualValueInput.propTypes = {
    update: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};


const ActualValueDescription = ({update, onChange}) => {
    return (
        <div className="">
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
                <div className="filesName">{filename}</div>
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


const UpdateActionButton = ({action, updateActions, icon, disabled}) => {
    const labels = {
        [c.UPDATE_ACTION_DELETE]: _('delete'),
        [c.UPDATE_ACTION_SAVE]: _('save'),
        [c.UPDATE_ACTION_SUBMIT]: _('submit_for_approval'),
        [c.UPDATE_ACTION_RETURN]: _('return_for_revision'),
        [c.UPDATE_ACTION_APPROVE]: _('approve'),
    };
    return (
        <li role="presentation" className={action}>
            <ToggleButton id={action}
                          onClick={updateActions}
                          label={labels[action]}
                          icon={icon}
                          disabled={disabled}
                          className="btn btn-default btn-xs"/>
        </li>
    )
};
UpdateActionButton.propTypes = {
    action: PropTypes.string.isRequired,
    updateActions: PropTypes.func.isRequired,
    icon: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
};


@connect((store) => {
    return {
        showing_preview: store.ui[c.SHOWING_UPDATE_MARKDOWN_PREVIEW],
    }
})
class UpdateFormButtons extends React.Component {

    render () {
        const {user, update, measure, changing, updateActions, showing_preview} = this.props;

        function getActionButtons(role, updateStatus, icon) {
            let btnKey = 0;
            const hasComment = update._comment !== undefined || update._meta !== undefined;
            return c.UPDATE_BUTTONS[role][updateStatus].map(
                action => {
                    let disabled = action !== c.UPDATE_ACTION_SAVE &&  action !== c.UPDATE_ACTION_DELETE ||
                                   action === c.UPDATE_ACTION_SAVE && !hasComment;
                    switch (measure) {
                        case c.MEASURE_UNIT: {
                            disabled = disabled && !(update.value !== null && update.value !== "");
                            break;
                        }
                        case c.MEASURE_PERCENTAGE: {
                            disabled = disabled &&
                                       (
                                           !(update.numerator !== undefined && update.numerator !== "") ||
                                           !(update.denominator!== undefined && update.denominator !== "")
                                       );
                            break;
                        }
                        case c.MEASURE_QUALITATIVE: {
                            disabled = disabled &&
                                       !(update.narrative !== null && update.narrative !== "");
                            break;
                        }
                    }

                    return <UpdateActionButton key={++btnKey}
                                               action={action}
                                               icon={icon}
                                               updateActions={updateActions}
                                               disabled={disabled}/>
                }
            )
        }

        const role = user.isMEManager ? c.ROLE_ME_MANAGER : c.ROLE_PROJECT_EDITOR;
        const icon = changing ? <i className="fa fa-spin fa-spinner form-button" /> : undefined;
        const actionButtons = getActionButtons(role, update.status, icon);
        const previewButtonText = showing_preview ? _("edit") : _("preview");

        return (
            <div className="menuAction">
                <ul className="nav-pills bottomRow navbar-right">
                    {measure == c.MEASURE_QUALITATIVE
                     ? <ToggleButton label={previewButtonText}
                                     onClick={updateMarkdownPreviewToggle}
                                     className="btn btn-default btn-xs" />
                     : undefined}
                    {actionButtons}
                </ul>
            </div>
        )
    }
};
UpdateFormButtons.propTypes = {
    user: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    measure: PropTypes.string.isRequired,
    changing: PropTypes.bool.isRequired,
    updateActions: PropTypes.func.isRequired,
};


const QuantitativeUpdateForm = ({period, update, measure, self, dimensions, disaggregations}) => {
    const updateValue = parseFloat(update.value ? update.value : 0);
    const percentageUpdate = measure === c.MEASURE_PERCENTAGE;

    return (
        <div className="update-container quantitativeUpdate">
            <div className="update-entry-container edit-in-progress">
                <QuantitativeHeader targetValue={period.target_value} targetComment={period.target_comment}/>
                <QuantitativeActualValueInput update={update}
                                              onChange={self.onChange}
                                              onClose={self.props.onClose}
                                              isPercentage={percentageUpdate}/>
                {<self.state.UpdateAlert/>}
                <ActualValueDescription update={update}
                                        onChange={self.onChange}/>
                <Attachments update={update}
                             onChange={self.attachmentsChange}
                             removeAttachment={self.removeAttachment}/>
                <DisaggregatedInputs measure={measure}
                                     dimensions={dimensions}
                                     disaggregations={disaggregations}
                                     onChange={self.onDisaggregationsChange}/>
                <UpdateFormButtons
                    user={self.props.user}
                    update={update}
                    measure={measure}
                    changing={self.props.updates.changing}
                    updateActions={self.updateActionsHandler}/>
            </div>
            <Comments parentId={update.id}
                      inForm={true}/>
        </div>
    )
};
QuantitativeUpdateForm.propTypes = {
    period: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    measure: PropTypes.string.isRequired,
    self: PropTypes.object.isRequired,
    dimensions: PropTypes.array.isRequired,
    disaggregations: PropTypes.array.isRequired,
};


const QualitativeUpdateForm = ({period, update, measure, self, dimensions, disaggregations, hideTarget}) => {
    return (
        <div className="update-container qualitativeUpdate">
            <div className="update-entry-container edit-in-progress">
                {hideTarget ?
                    undefined
                :
                    <QualitativeHeader targetValue={period.target_value} hideTarget={hideTarget}/>
                }
                <QualitativeActualValueInput update={update}
                                             onClose={self.props.onClose}
                                             onChange={self.onChange}
                                             hideTarget={hideTarget}/>
                {<self.state.UpdateAlert/>}
                <Attachments update={update}
                             onChange={self.attachmentsChange}
                             removeAttachment={self.removeAttachment}/>
                <DisaggregatedInputs measure={measure}
                                     dimensions={dimensions}
                                     disaggregations={disaggregations}
                                     onChange={self.onDisaggregationsChange}/>
                <UpdateFormButtons
                    user={self.props.user}
                    update={update}
                    measure={measure}
                    changing={self.props.updates.changing}
                    updateActions={self.updateActionsHandler}/>
            </div>
            <Comments parentId={update.id}
                      inForm={true}/>
        </div>
    )
};
QualitativeUpdateForm.propTypes = {
    period: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    measure: PropTypes.string.isRequired,
    self: PropTypes.object.isRequired,
    dimensions: PropTypes.array.isRequired,
    disaggregations: PropTypes.array.isRequired,
};

const DisaggregatedInputs = ({measure, dimensions, disaggregations, onChange}) => {
    const grouped_dimensions = groupBy(dimensions, 'name'),
          dimension_disaggregations = keyBy(disaggregations, 'dimension'),
          dimension_elements = Object.entries(grouped_dimensions).map(([dimension, values]) => {
              const inputs = values.map((value) => {
                  const disaggregation = dimension_disaggregations[value.id];
                  return disaggregation ? (
                      <DisaggregatedValueInput key={value.value}
                                               dimension={value}
                                               disaggregation={disaggregation}
                                               onChange={onChange}
                                               measure={measure}/>
                  ) : undefined;
              });
              return (
                  <div key={"dimension-" + dimension} className="disaggregationInput">
                      <h5>{dimension}</h5>
                      {inputs}
                  </div>
              );
          }),
          headline = dimensions.length > 0 ?  (<h4>Disaggregations</h4>): undefined;
          return  (
              <div className="disaggregationFields">
                  {headline}
                  {dimension_elements}
              </div>
          );
};
DisaggregatedInputs.propTypes = {
    measure: PropTypes.string.isRequired,
    dimensions: PropTypes.array.isRequired,
    disaggregations: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};


const DisaggregatedValueInput = ({dimension, disaggregation, measure, onChange}) => {
    let input;
    switch (measure) {
        case c.MEASURE_UNIT: {
            input = (
                <input className="form-control"
                       value={disaggregation.value}
                       onChange={onChange}
                       data-dimension={dimension.id}
                       data-field='value'
                       placeholder={_('input_placeholder')} />
            );
            break;
        }
        case c.MEASURE_PERCENTAGE: {
            const numerator = (
                <div>
                    {/* FIXME: Use translated strings*/}
                    <label htmlFor="actualValueNumerator">Numerator</label>
                    <input className="form-control"
                           value={disaggregation.numerator}
                           onChange={onChange}
                           data-dimension={dimension.id}
                           data-field='numerator'
                           placeholder={_('input_placeholder')} />
                </div>),
                  denominator = (
                      <div>
                          {/* FIXME: Use translated strings*/}
                          <label htmlFor="actualValueDenominator">Denominator</label>
                          <input className="form-control"
                                 value={disaggregation.denominator}
                                 onChange={onChange}
                                 data-dimension={dimension.id}
                                 data-field='denominator'
                                 placeholder={_('input_placeholder')} />
                      </div>);

            input = (
                <div>
                    <input className="form-control"
                           readOnly={true}
                           value={disaggregation.value}
                           onChange={onChange}
                           data-dimension={dimension.id}
                           data-field='value'
                           placeholder={_('input_placeholder')} />
                    {numerator}
                    {denominator}
                </div>
            );
            break;
        }
        case c.MEASURE_QUALITATIVE: {
            input = (
                <textarea className="form-control"
                          id="disaggregated-narrative"
                          value={disaggregation.narrative}
                          onChange={onChange}
                          data-dimension={dimension.id}
                          data-field='narrative'
                          placeholder={_('input_placeholder')}>
                </textarea>
            );
            break;
        }
    }
    return (
        <div>
            <span>{dimension.value}</span>
            <div className="">
                <div>
                    {input}
                </div>
            </div>
        </div>
    );
};
DisaggregatedValueInput.propTypes = {
    measure: PropTypes.string.isRequired,
    dimensions: PropTypes.array.isRequired,
    disaggregations: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};


const pruneForPATCH = (update) => {
    // Only include the listed fields when PATCHing an update
    // currently the list mimics the old MyResults data
    const fields = ['value', 'narrative', 'numerator', 'denominator', 'text',
                    'status', '_file', '_photo', 'approved_by', 'disaggregations'];
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
        primaryOrganisationId: store.page.project.primaryOrganisationId,
    }
}, alertActions)
export default class UpdateForm extends React.Component {

    static propTypes = {
        indicator: PropTypes.object.isRequired,
        period: PropTypes.object.isRequired,
        update: PropTypes.object.isRequired,
        disaggregations: PropTypes.array.isRequired,
        originalUpdate: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        collapseId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        // Save original update, used when editing is cancelled
        const alertName = 'UpdateAlert-' + this.props.update.id;
        this.state = {
            updateAlertName: alertName,
            UpdateAlert: AlertFactory({alertName: alertName})(UpdateAlert),
        };
        this.saveUpdate = this.saveUpdate.bind(this);
        this.deleteUpdate = this.deleteUpdate.bind(this);
        this.updateActionsHandler = this.updateActionsHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDisaggregationsChange = this.onDisaggregationsChange.bind(this);
        this.attachmentsChange = this.attachmentsChange.bind(this);
        this.removeAttachment = this.removeAttachment.bind(this);
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
        const {originalUpdate} = this.props;
        if (type == 'file') {
            // only set to delete a file if there was one in the first place
            if (originalUpdate.file_url)
                changedUpdate = update(this.props.update,
                                       {$merge: {file: '', file_url: '', _file: 'delete'}});
            else
                changedUpdate = update(this.props.update,
                                       {$merge: {file: '', file_url: '', _file: undefined}});
        } else if (type == 'photo') {
            // only set to delete an image if there was one in the first place
            if (originalUpdate.photo_url)
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
        const {originalUpdate} = this.props;
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
                    if (originalUpdate.file_url) {
                        changedUpdate = update(this.props.update,
                                               {$merge: {file: '', file_url: '', _file: 'delete'}});
                    } else {
                        changedUpdate = update(this.props.update,
                                               {$merge: {file: '', file_url: '', _file: undefined}});
                    }
                    break;
                }

                case "removeImage": {
                    // only set to delete an image if there was one in the first place
                    if (originalUpdate.photo_url) {
                        changedUpdate = update(this.props.update,
                                               {$merge: {photo: '', photo_url: '', _photo: 'delete'}});
                    } else {
                        changedUpdate = update(this.props.update,
                                               {$merge: {photo: '', photo_url: '', _photo: undefined}});
                    }
                    break;
                }

                default: {
                    let {value} = e.target;
                    if (this.props.indicator.type === c.INDICATOR_QUANTATIVE && !this.checkNumeric(field, value)) {
                        value = '';
                    }
                    changedUpdate = update(this.props.update, {$merge: {[field]: value}});
                    if (field == "numerator" || field == "denominator") {
                        changedUpdate = update(changedUpdate,
                                               {$merge: {["value"]: this.computePercentage(changedUpdate)}});
                    }
                }
            }
            updateModel('updates', changedUpdate);
        }
    }

    checkNumeric(field, value, onSubmit=false) {
        const allowed = isNumeric(value) || value === '-' || value === '';
        if ((field == 'value' || field === 'numerator' || field === 'denominator') && !allowed) {
            this.props.createAlert(this.state.updateAlertName, _('only_numeric_value'));
            return false;
        }
        return true;
    }

    onDisaggregationsChange(e){
        let changedDisaggregation;
        const dimension_id = e.target.getAttribute('data-dimension'),
              field = e.target.getAttribute('data-field'),
              disaggregations = keyBy(this.props.disaggregations, 'dimension'),
              disaggregation = disaggregations[dimension_id],
              value = e.target.value;
        if (!this.checkNumeric(field, value)) {
            return;
        }
        changedDisaggregation = update(disaggregation, {$merge: {[field]: e.target.value}});
        if (field === 'numerator' || field === 'denominator') {
            changedDisaggregation = update(
                changedDisaggregation,
                {$merge: {["value"]: this.computePercentage(changedDisaggregation)}}
            );
        }
        updateModel('disaggregations', changedDisaggregation);
    }

    computePercentage(object) {
        if (!object.numerator || !object.denominator ) {
            return 0;
        } else {
            return computePercentage(object.numerator, object.denominator);
        }
    }

    onCancel() {
        this.props.formToggle();
        const originalUpdate = this.state.originalUpdate;
        if (isNewUpdate(originalUpdate)) {
            deleteFromModel(c.OBJECTS_UPDATES, originalUpdate, this.props.collapseId);
        } else {
            updateModel(c.OBJECTS_UPDATES, originalUpdate);
        }
        updateFormClose(originalUpdate.id);
    }

    formClose(id) {
        updateFormClose(id);
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

    successCallback(id) {
        this.formClose.bind(id);
        // TODO: calling refreshFilter here breaks when deleting an update as
        // this.props.approvedUpdates is "stale" when calling. Currently this leads to an update
        // that has just been approved showing in the Need reporting filter view.
        // Need to find a way to let the state change drive the changing of the hidden panels

        // this.refreshFilter(); // Breaks when deleting an update!!!
    };

    updateActionsHandler(e) {
        //The id of the button is used to indicate the action taken
        const action = e.target.id;
        if (action === c.UPDATE_ACTION_DELETE) {
            this.deleteUpdate();
        } else {
            this.saveUpdate(action);
        }

    }

    saveUpdate(action) {
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
            }
        };

        const setNullValues = (action, update) => {
            if (action === c.UPDATE_ACTION_SAVE) {
                for (const field of ['value', 'numerator', 'denominator']) {
                    if (!String(update[field]).trim()) {
                        update[field] = null;
                    }
                }
            }
        };

        const submittable = (action, update) => {
            const indicator = getAncestor(c.OBJECTS_UPDATES, update.id, c.OBJECTS_INDICATORS);
            const emptyAllowed = action === c.UPDATE_ACTION_SAVE;
            switch(indicator.measure) {
                case c.MEASURE_UNIT: {
                    return emptyAllowed && update.value === '' || isNumeric(update.value);
                }
                case c.MEASURE_PERCENTAGE: {
                    return (emptyAllowed && update.numerator === '' && update.denominator === '') ||
                        (isNumeric(update.numerator) && isNumeric(update.denominator) &&
                            update.denominator !== 0)
                }
                case c.MEASURE_QUALITATIVE: {
                    return true;
                }
            }
            return false;
        };

        let update = Object.assign({}, this.props.update);
        if (this.props.updates.changing) {
            //NOOP if we're already talking to the backend
            return;
        } else if (!String(update.value).trim()) {
            if (action === c.UPDATE_ACTION_SAVE) {
                // Explicitly empty data, only allowed when saving a draft
                update.value = null;
            } else {
                this.props.createAlert(this.state.updateAlertName, _('actual_value_required'));
                return;
            }
        }

        update = setUpdateStatus(update, action, this.props.user.id);

        // Don't save Empty disaggregations
        const isNonEmptyDisaggregation = (disaggregation) => {
            return (
                disaggregation.value ||
                disaggregation.numerator ||
                disaggregation.denominator ||
                disaggregation.narrative
            );
        };
        const pruneDisaggregation = (disaggregation) => {
            let pruned = Object.assign({}, disaggregation);
            const attributes = ['value', 'numerator', 'denominator', 'narrative'];
            attributes.forEach((attribute) => {
                if (pruned[attribute] === '') {
                    delete pruned[attribute];
                }
            });
            return pruned;
        };

        update.disaggregations = this.props.disaggregations.filter(isNonEmptyDisaggregation).map(pruneDisaggregation);

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
                    this, this.state.updateAlertName, _("update_not_deleted")
                )
            };
            deleteUpdateFromBackend(url, this.props.update, this.props.collapseId, callbacks);
        }
    }

    previousActualValue() {
        if (this.props.update) {
            return this.props.update.actual_value - this.props.update.value;
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
        const {
            dimensions, disaggregations, indicator, period, update, primaryOrganisationId
        } = this.props;
        const hideTarget = primaryOrganisationId === c.IUCN_ORG_ID;
        switch(indicator.type) {
            case c.INDICATOR_QUANTATIVE: {
                return <QuantitativeUpdateForm period={period}
                                               update={update}
                                               dimensions={dimensions}
                                               disaggregations={disaggregations}
                                               self={this}
                                               measure={indicator.measure || c.MEASURE_UNIT}/>
            }
            case c.INDICATOR_QUALITATIVE: {
                return <QualitativeUpdateForm period={period}
                                              update={update}
                                              dimensions={dimensions}
                                              disaggregations={disaggregations}
                                              self={this}
                                              measure={c.MEASURE_QUALITATIVE}
                                              hideTarget={hideTarget}/>
            }
        }
    }
}


let newUpdateID = 1;

export class NewUpdateButton extends React.Component {

    static propTypes = {
        period: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
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
            value: '',
            narrative: '',
            text: '',
            status: c.UPDATE_STATUS_NEW,
        };
        //TODO: promise based solution where addKey is called on completion of updateModel?
        updateModel('updates', update);
        updateFormOpen(id);
        uiHideMode(c.OBJECTS_PERIODS);
        openNodes(c.OBJECTS_PERIODS, [update.period]);
        closeNodes(c.OBJECTS_PERIODS, [update.period]);
        newUpdateID += 1;
    }

    render() {
        return (
            <ToggleButton onClick={this.newUpdate}
                          label={_('add_indicator_value')}
                          className="btn btn-sm btn-default newUpdate" />
        )
    }
}
