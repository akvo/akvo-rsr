/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Level from './Level.jsx'
import Comments from './Comments.jsx'

import {APICall, endpoints, displayDate, displayNumber} from './utils.js';


const UpdateDisplay = ({i18n, update}) => {
    const userName = update.user_details.first_name + " " + update.user_details.last_name;
    return (
        <div>
            When: {displayDate(update.created_at, i18n.months)} |
            By: {userName} |
            Org: {update.user_details.approved_organisations[0].name} |
            Status: {update.status} <br/>
            Update value: {update.data} | {/*
         NOTE: we use update.actual_value, a value calculated in App.annotateUpdates(),
         not update.period_actual_value from the backend
         */}
            Actual total for this period (including this update): {update.actual_value}
        </div>
    )
};

UpdateDisplay.propTypes = {
    i18n: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired
};


class Update extends React.Component {
    constructor (props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
        this.state = {formOpen: false};
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
                        {this.props.i18n.strings.edit_update}
                    </a>
                </div>
                {this.state.formOpen ?
                    <UpdateForm
                        i18n={this.props.i18n}
                        callbacks={this.props.callbacks}
                        update={this.props.update}
                        formToggle={this.formToggle}/>
                :
                    <UpdateDisplay i18n={this.props.i18n} update={this.props.update}/>}
            </div>
        )
    }
}

Update.propTypes = {
    i18n: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    period: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired
};


export class Updates extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "updates"};
    }

    componentWillMount() {
        this.props.callbacks.loadModel('comments');
    }

    renderPanel(update, i) {
        const organisation = update.user_details.approved_organisations[0].name;
        const userName = update.user_details.first_name +" "+ update.user_details.last_name;
        const data = update.data;
        const headerText = `Update: ${userName} at ${organisation}, data: ${data}`;
        return (
            <Panel header={headerText} key={i}>
                <Update i18n={this.props.i18n}
                        callbacks={this.props.callbacks}
                        period={this.props.period}
                        update={update}/>
                <div>
                    <Comments
                        items={update.comments}
                        callbacks={this.props.callbacks}/>
                </div>
            </Panel>
        )
    }
}

Updates.propTypes = {
    i18n: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    period: PropTypes.object.isRequired,
    items: PropTypes.array,
};


const Header = () => {
    return (
        <div className="col-xs-12">
            <div className="row update-entry-container-header">
                Header
            </div>
        </div>
    )
};


const ActualValueInput = ({i18n, formData, updatedActualValue, setUpdateData}) => {
    return (
        <div className="row">
            <div className="col-xs-6">
                <label htmlFor="actualValue">{i18n.add_to_actual_value}</label>
                <input className="form-control"
                       id="data"
                       value={formData.data}
                       onChange={setUpdateData}
                       placeholder={i18n.input_placeholder} />
            </div>
            <div className="col-xs-6">
                <div className="upActualValue">
                    <label>
                        <span className="update-actual-value-text">
                            {i18n.total_value_after_update}:
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
    i18n: PropTypes.object.isRequired,
    updatedActualValue: PropTypes.string,
    setUpdateData: PropTypes.func.isRequired
};


const ActualValueDescription = ({i18n, formData, setUpdateData}) => {
    return (
        <div className="row">
            <div className="col-xs-9 update-description">
                <div>
                    <label htmlFor="description">{i18n.actual_value_comment}</label>
                    <textarea className="form-control"
                              id="text"
                              value={formData.text}
                              onChange={setUpdateData}
                              placeholder={i18n.comment_placeholder}>
                    </textarea>
                </div>
            </div>
        </div>
    )
};

ActualValueDescription.propTypes = {
    i18n: PropTypes.object.isRequired
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


const UpdateFormButtons = ({i18n, callbacks}) => {
    i18n = i18n.strings;
    return (
        <div className="menuAction">
            <div role="presentation" className="removeUpdate">
                <a className="btn btn-default btn-xs">{i18n.delete}</a>
            </div>
            <ul className="nav-pills bottomRow navbar-right">
                <li role="presentation" className="cancelUpdate">
                    <a onClick={callbacks.formToggle} className="btn btn-link btn-xs">{i18n.cancel}</a>
                </li>

                <li role="presentation" className="saveUpdate">
                    <a onClick={callbacks.saveUpdate} className="btn btn-default btn-xs">{i18n.save}</a>
                </li>
                <li role="presentation" className="approveUpdate">
                    <a className="btn btn-default btn-xs">{i18n.approve}</a>
                </li>
                <span></span>
            </ul>
        </div>
    )
};

UpdateFormButtons.propTypes = {
    i18n: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired
};


class UpdateForm extends React.Component {

    constructor(props) {
        super(props);
        const update = this.props.update;
        if (update) {
            // create state from existing update, NOTE: "new" denotes if this is a new update or not
            this.state = {new: false, text: update.text, data: update.data, period: update.period};
        } else {
            this.state = {new: true, text: "", data: 0, period: this.props.period.id};
        }
        this.saveUpdate = this.saveUpdate.bind(this);
    }

    setUpdateData(e) {
        const field = e.target.id;
        this.setState({[field]: e.target.value});
    }

    saveUpdate() {
        //NOTE: period_actual_value is needed for server side calculations to be correct
        const update = {
            'period': this.state.period,
            'period_actual_value': this.previousActualValue(),
            'user': 1,
            'text': this.state.text.trim(),
            'data': this.state.data.trim()
        };
        let success = function(data) {
            this.props.formToggle();
            this.props.callbacks.updateModel("updates", data);
        };
        if (this.state.new) {
            APICall('POST', endpoints.updates_and_comments(), update, success.bind(this));
        } else {
            APICall('PATCH', endpoints.update_and_comments(this.props.update.id),
                    update, success.bind(this));
        //    "{"text":"More stuff!","data":"5","relative_data":true,"status":"A"}"
        //http://rsr.localdev.akvo.org/rest/v1/indicator_period_data_framework/528/?format=json
        }
    }

    previousActualValue() {
        if (this.props.update) {
            return this.props.update.actual_value - this.props.update.data
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
        const i18n = this.props.i18n.strings;
        const updateValue = parseFloat(this.state.data ? this.state.data : 0);
        const updatedActualValue = displayNumber(this.previousActualValue() + updateValue);
        return (
            <div className="update-container">
                <div className="row update-entry-container edit-in-progress">
                    <Header/>
                    <ActualValueInput
                        i18n={i18n}
                        setUpdateData={this.setUpdateData.bind(this)}
                        formData={this.state}
                        updatedActualValue={updatedActualValue}/>
                    <ActualValueDescription
                        i18n={i18n}
                        setUpdateData={this.setUpdateData.bind(this)}
                        formData={this.state}/>
                    <Attachments/>
                    <UpdateFormButtons
                        i18n={this.props.i18n}
                        callbacks={
                            {formToggle: this.props.formToggle, saveUpdate: this.saveUpdate}
                        }/>
                </div>
            </div>
        )
    }
}

UpdateForm.propTypes = {
    i18n: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    formToggle: PropTypes.func.isRequired,
    period: PropTypes.object,
    update: PropTypes.object
};


export class NewUpdateForm extends React.Component {
    constructor (props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
        this.state = {formOpen: false};
    }

    formToggle() {
        this.setState({formOpen: !this.state.formOpen});
    }

    render() {
        let form;
        if (this.state.formOpen) {
            //TODO: can formToggle be merged into callbacks?
            form = <UpdateForm
                i18n={this.props.i18n}
                callbacks={this.props.callbacks}
                period={this.props.period}
                formToggle={this.formToggle}/>;
        } else {
            form = "";
        }
        return (
            <div>
                <div>
                    <a onClick={this.formToggle}
                       className={'btn btn-sm btn-default'}
                       style={{margin: '0.3em 0.5em'}}>
                        <i className='fa fa-plus' />
                        {this.props.i18n.strings.new_update}
                    </a>
                </div>
                {form}
            </div>
        )
    }
}

NewUpdateForm.propTypes = {
    i18n: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    period: PropTypes.object
};
