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

import {APICall, endpoints, displayDate, displayNumber, _} from './utils.js';


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


export class Updates extends React.Component {
    componentWillMount() {
        this.props.callbacks.loadModel('comments');
    }

    renderPanel(update) {
        const organisation = update.user_details.approved_organisations[0].name;
        const userName = update.user_details.first_name +" "+ update.user_details.last_name;
        const headerText = `Update: ${userName} at ${organisation}, Data: ${update.data}
                            Status: ${_('update_statuses')[update.status]}`;
        return (
            <Panel header={headerText} key={update.id}>
                <Update callbacks={this.props.callbacks}
                        update={update}/>
                <div>
                    <Comments
                        items={update.comments}
                        callbacks={this.props.callbacks}/>
                </div>
            </Panel>
        )
    }

    render() {
        const items = this.props.items;
        if (!items) {
            console.log(this.constructor.name + " " + this._reactInternalInstance._debugID + " loading...");
            return (
                <p>Loading...</p>
            );
        } else if (items.length > 0) {
            return (
                <Collapse onChange={this.props.callbacks.onChange} activeKey={this.props.activeKey}>
                    {items.map((item) => this.renderPanel(item))}
                </Collapse>
            )
        } else {
            return (
                <p>No items</p>
            );
        }
    }

}

Updates.propTypes = {
    callbacks: PropTypes.object.isRequired,
    items: PropTypes.array,
};


const Header = ({status}) => {
    return (
        <div className="col-xs-12">
            <div className="row update-entry-container-header">
                {`Status: ${status}`}
            </div>
        </div>
    )
};


const ActualValueInput = ({formData, updatedActualValue, setUpdateData}) => {
    return (
        <div className="row">
            <div className="col-xs-6">
                <label htmlFor="actualValue">{_('add_to_actual_value')}</label>
                <input className="form-control"
                       id="data"
                       value={formData.data}
                       onChange={setUpdateData}
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
    formData: PropTypes.object,
    updatedActualValue: PropTypes.string,
    setUpdateData: PropTypes.func.isRequired
};


const ActualValueDescription = ({formData, setUpdateData}) => {
    return (
        <div className="row">
            <div className="col-xs-9 update-description">
                <div>
                    <label htmlFor="description">{_('actual_value_comment')}</label>
                    <textarea className="form-control"
                              id="text"
                              value={formData.text}
                              onChange={setUpdateData}
                              placeholder={_('comment_placeholder')}>
                    </textarea>
                </div>
            </div>
        </div>
    )
};

ActualValueDescription.propTypes = {
    formData: PropTypes.object,
    setUpdateData: PropTypes.func.isRequired
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


const UpdateFormButtons = ({callbacks, newUpdate}) => {
    return (
        <div className="menuAction">
        {!newUpdate ?
            <div role="presentation" className="removeUpdate">
                <a onClick={callbacks.deleteUpdate} className="btn btn-default btn-xs">{_('delete')}</a>
            </div>
        : ''}
            <ul className="nav-pills bottomRow navbar-right">
                <li role="presentation" className="cancelUpdate">
                    <a onClick={callbacks.formToggle} className="btn btn-link btn-xs">{_('cancel')}</a>
                </li>
                <li role="presentation" className="saveUpdate">
                    <a onClick={callbacks.saveUpdate} className="btn btn-default btn-xs">{_('save')}</a>
                </li>
                <li role="presentation" className="approveUpdate">
                    <a className="btn btn-default btn-xs">{_('approve')}</a>
                </li>
                <span></span>
            </ul>
        </div>
    )
};

UpdateFormButtons.propTypes = {
    callbacks: PropTypes.object.isRequired,
    newUpdate: PropTypes.bool.isRequired
};

// From rsr.models.indicator.IndicatorPeriodData
const STATUS_NEW_CODE = 'N',
      STATUS_DRAFT_CODE = 'D',
      STATUS_PENDING_CODE = 'P',
      STATUS_REVISION_CODE = 'R',
      STATUS_APPROVED_CODE = 'A';

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
        this.deleteUpdate = this.deleteUpdate.bind(this);
    }

    setUpdateData(e) {
        // Update the form field widgets
        const field = e.target.id;
        this.setState({[field]: e.target.value});
    }

    saveUpdate(approve=false) {
        //NOTE: period_actual_value is needed for server side calculations to be correct
        const update = {
            'period': this.state.period,
            'period_actual_value': this.previousActualValue(),
            'user': 1,
            'text': this.state.text.trim(),
            'data': this.state.data.trim()
        };
        if (approve) {
            update.push({'status': STATUS_APPROVED_CODE});
        } else {
            update.push({'status': STATUS_DRAFT_CODE});
        }
        let success = function(data) {
            this.props.formToggle();
            this.props.callbacks.updateModel("updates", data);
        };
        if (this.state.new) {
            APICall('POST', endpoints.updates_and_comments(), update, success.bind(this));
        } else {
            update.push({'status': STATUS_DRAFT_CODE});
            APICall('PATCH', endpoints.update_and_comments(this.props.update.id),
                    update, success.bind(this));
        }
    }

    deleteUpdate() {
        const data = {id: this.props.update.id};
        let success = function() {
            this.props.formToggle();
            this.props.callbacks.updateModel("updates", data, true);
        };

        APICall('DELETE', endpoints.update_and_comments(data.id), null, success.bind(this));
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
        const updateValue = parseFloat(this.state.data ? this.state.data : 0);
        const updatedActualValue = displayNumber(this.previousActualValue() + updateValue);
        return (
            <div className="update-container">
                <div className="row update-entry-container edit-in-progress">
                    <Header/>
                    <ActualValueInput
                        setUpdateData={this.setUpdateData.bind(this)}
                        formData={this.state}
                        updatedActualValue={updatedActualValue}/>
                    <ActualValueDescription
                        setUpdateData={this.setUpdateData.bind(this)}
                        formData={this.state}/>
                    <Attachments/>
                    <UpdateFormButtons
                        newUpdate={this.state.new}
                        callbacks={
                            {
                                formToggle: this.props.formToggle,
                                saveUpdate: this.saveUpdate,
                                deleteUpdate: this.deleteUpdate
                            }
                        }/>
                </div>
            </div>
        )
    }
}

UpdateForm.propTypes = {
    callbacks: PropTypes.object.isRequired,
    formToggle: PropTypes.func.isRequired,
    // TODO: one of period and update has to be supplied. This is a clunky way of indicating a new
    // or exisitng udpdate. A better way should be found.
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
                        {_('new_update')}
                    </a>
                </div>
                {form}
            </div>
        )
    }
}

NewUpdateForm.propTypes = {
    callbacks: PropTypes.object.isRequired,
    period: PropTypes.object
};
