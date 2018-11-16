/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { _, getCookie } from "../utils";
import { MarkdownEditor } from "./common";

const emptyUpdate = {
    title: "",
    text: "",
    event_date: "",
    language: "",
    photo_caption: "",
    photo_credit: "",
    video_caption: "",
    video_credit: ""
};

export default class RSRUpdates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingUpdate: emptyUpdate
        };
        this.editUpdate = this.editUpdate.bind(this);
        this.clearUpdate = this.clearUpdate.bind(this);
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <RSRUpdateList project={this.props.project} editUpdate={this.editUpdate} />
                    <RSRUpdateForm
                        project={this.props.project}
                        update={this.state.editingUpdate}
                        onClear={this.clearUpdate}
                    />
                </div>
            </div>
        );
    }
    editUpdate(update) {
        this.setState({ editingUpdate: update });
    }
    clearUpdate(update) {
        console.log("clear update", update);
        this.setState({ editingUpdate: emptyUpdate });
    }
}

class RSRUpdate extends React.Component {
    // = ({ update, deleting, onEdit, onDelete }) => {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmation: false,
            showSpinner: false
        };
    }
    render() {
        const { onEdit, onDelete, update } = this.props;
        const { showSpinner, showConfirmation } = this.state;
        const editUpdate = () => {
            return onEdit(update);
        };
        const deleteUpdate = () => {
            this.setState({ showSpinner: true });
            return onDelete(update);
        };
        const confirmDelete = () => {
            return this.setState({ showConfirmation: true });
        };
        const cancelDelete = () => {
            return this.setState({ showConfirmation: false });
        };
        const editButton = update.editable ? (
            <a onClick={editUpdate} href="#">
                {_("edit")}
            </a>
        ) : (
            undefined
        );
        const confirmDeleteButton = update.deletable ? (
            <a onClick={confirmDelete} href="#">
                {_("delete")}
            </a>
        ) : (
            undefined
        );
        const deleteButton = update.deletable ? (
            <span>
                <strong>{_("delete_confirmation")}</strong>
                <p>
                    <a onClick={deleteUpdate} href="#">
                        {_("yes")}
                    </a>
                    <a onClick={cancelDelete} href="#">
                        {_("no")}
                    </a>
                </p>
            </span>
        ) : (
            undefined
        );
        return (
            <div className="row">
                <div className="col-md-4 updateImg">
                    <a href={update.absolute_url}>
                        <img src={update.photo} />
                    </a>
                </div>
                <div className="col-md-8">
                    <div className="row">
                        {update.edited ? (
                            <span className="text-muted">
                                <i className="fa fa-pencil pull-right" />
                            </span>
                        ) : (
                            undefined
                        )}
                        <a href={update.absolute_url}>
                            <h5>{update.title} </h5>
                        </a>
                    </div>
                    <ul className="menuUpdate">
                        <li>{editButton}</li>
                        {!showConfirmation ? <li>{confirmDeleteButton}</li> : undefined}
                        {showSpinner ? (
                            <li>
                                <i className="fa fa-spin fa-spinner" />
                            </li>
                        ) : (
                            undefined
                        )}
                    </ul>
                    {showConfirmation & !showSpinner ? (
                        <ul className="menuUpdate">
                            <li>{deleteButton}</li>
                        </ul>
                    ) : (
                        undefined
                    )}
                </div>
            </div>
        );
    }
}

class RSRUpdateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updates: [],
            loading: true
        };
        this.deleteUpdate = this.deleteUpdate.bind(this);
        this.fetchUpdates = this.fetchUpdates.bind(this);
    }
    componentDidMount() {
        this.fetchUpdates();
    }
    fetchUpdates() {
        const self = this,
            api_endpoint = ({ project }) => {
                return `/rest/v1/project_update/?project=${project}&format=json`;
            };
        fetch(api_endpoint(this.props), { credentials: "same-origin" })
            .then(function(response) {
                self.setState({ loading: false });
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then(function(data) {
                if (data === undefined) {
                    return;
                }
                self.setState({ updates: data.results });
            });
    }
    deleteUpdate(update) {
        const url = `/rest/v1/project_update/${update.id}/?format=json`,
            self = this;
        fetch(url, {
            method: "DELETE",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            credentials: "same-origin"
        })
            .then(function(response) {
                if (response.status == 204) {
                    return true;
                }
            })
            .then(function(deleted) {
                if (deleted) {
                    console.log("fetching updates...");
                    self.fetchUpdates();
                }
            });
    }
    render() {
        let updates;
        if (this.state.loading) {
            updates = _("loading") + "...";
        } else if (this.state.updates.length == 0) {
            updates = _("no_project_updates");
        } else {
            updates = this.state.updates.map(function(update) {
                return (
                    <RSRUpdate
                        key={update.id}
                        update={update}
                        onEdit={this.props.editUpdate}
                        onDelete={this.deleteUpdate}
                    />
                );
            }, this);
        }
        return (
            <div className="col-md-5 hidden-sm-down updateList">
                <h3>{_("previous_updates")}</h3>
                {updates}
            </div>
        );
    }
}

class RSRUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update: this.props.update,
            oversize_image: false,
            photo_help_text: _("photo_help_text"),
            photo_image_size_text: _("photo_image_size_text")
        };
        this.warnImageSize = this.warnImageSize.bind(this);
        this.setText = this.setText.bind(this);
        this.editUpdate = this.editUpdate.bind(this);
        this.clearUpdate = this.clearUpdate.bind(this);
        this.editUpdateDate = this.editUpdateDate.bind(this);
    }
    componentDidMount() {
        const storePosition = ({ coords }) => {
            console.log(coords);
            this.setState({ latitude: coords.latitude, longitude: coords.longitude });
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(storePosition);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.update.id !== this.props.update.id) {
            // Update property has changed, update state
            this.setState({ update: this.props.update });
        }
    }
    warnImageSize(e) {
        var files = e.target.files,
            size = (files.length > 0 && files[0].size) || 0;
        const megabyte = 1048576,
            max_size = 2;

        // Disable/Enable submit, add/remove error class
        if (size > max_size * megabyte) {
            this.setState({
                oversize_image: true,
                image_size: Math.round(size / megabyte * 1000) / 1000
            });
        } else {
            this.setState({ oversize_image: false, image_size: 0 });
        }
    }
    setText(description) {
        const update = Object.assign({}, this.state.update, { text: description });
        this.setState({ update });
    }
    editUpdateDate(value) {
        var update = this.state.update;
        update["event_date"] = value.format("YYYY-MM-DD");
        this.setState({ update });
    }
    editUpdate(event) {
        const value = event.target.value;
        var update = this.state.update;
        update[event.target.name] = value;
        this.setState({ update });
    }
    clearUpdate() {
        this.setState({ update: emptyUpdate });
        this.props.onClear();
    }
    render() {
        const { project, onClose } = this.props;
        const { oversize_image, photo_help_text, photo_image_size_text, update } = this.state;
        const url = update.id
            ? `../../../project/${project}/update/${update.id}/edit/`
            : `../../../project/${project}/add_update/`;
        const formPhoto =
            update.id && update.photo ? (
                <div className="col-md-3 pull-right">
                    <img src={update.photo} />
                </div>
            ) : (
                undefined
            );
        const photoClass = oversize_image ? "form-group has-error" : "form-group";
        const helpText = oversize_image
            ? `${photo_help_text} ${photo_image_size_text}: ${this.state.image_size} MB`
            : photo_help_text;
        const textAreaProps = {
            id: "id_text",
            className: "form-control textarea",
            placeholder: _("description"),
            cols: 40,
            rows: 10
        };
        const eventDate = update.event_date ? moment(update.event_date) : moment();
        const closeButton = update.id ? (
            <button className="btn btn-sm btn-default pull-right" onClick={this.clearUpdate}>
                X
            </button>
        ) : (
            undefined
        );
        return (
            <div className="col-md-7 col-xs-12 projectUpdateForm" id="update">
                {closeButton}
                <h3 className="">{update.id ? _("edit_update") : _("add_update")}</h3>
                <form method="post" action={url} id="updateForm" encType="multipart/form-data">
                    <input
                        name="csrfmiddlewaretoken"
                        value={getCookie("csrftoken")}
                        type="hidden"
                    />

                    <div className="form-group">
                        <input
                            className="form-control input"
                            id="id_title"
                            maxLength="80"
                            name="title"
                            placeholder={_("title")}
                            required="required"
                            size="42"
                            title=""
                            type="text"
                            value={update.title}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <div className="form-group">
                        <MarkdownEditor
                            text={update.text}
                            textAreaProps={textAreaProps}
                            onChange={this.setText}
                        />
                        {/* Hidden field to submit description when submitting the form */}
                        <textarea name="text" value={update.text} hidden />
                    </div>

                    <div className="form-group">
                        <label className="control-label" htmlFor="id_language">
                            {_("language")}
                        </label>
                        <select
                            className="form-control"
                            id="id_language"
                            name="language"
                            required="required"
                            title=""
                            defaultValue="en"
                            value={update.language}
                            onChange={this.editUpdate}
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="control-label" htmlFor="id_event_date">
                            {_("event_date")}
                        </label>
                        <DatePicker
                            className="form-control"
                            dateFormat="YYYY-MM-DD"
                            name="event_date"
                            id="id_event_date"
                            title=""
                            required="required"
                            placeholder={_("event_date")}
                            selected={eventDate}
                            onChange={this.editUpdateDate}
                        />
                    </div>

                    <div className={photoClass}>
                        {formPhoto}
                        <label className="control-label" htmlFor="id_photo">
                            {_("photo")}
                        </label>
                        <input
                            className="input"
                            id="id_photo"
                            name="photo"
                            size="15"
                            type="file"
                            onChange={this.warnImageSize}
                        />
                        <span className="help-block">{helpText}</span>
                    </div>

                    <div className="form-group">
                        <input
                            className="form-control input"
                            id="id_photo_caption"
                            maxLength="75"
                            name="photo_caption"
                            placeholder={_("photo_caption")}
                            size="25"
                            title=""
                            type="text"
                            value={update.photo_caption}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            className="form-control input"
                            id="id_photo_credit"
                            maxLength="75"
                            name="photo_credit"
                            placeholder={_("photo_credit")}
                            size="25"
                            title=""
                            type="text"
                            value={update.photo_credit}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <div className="form-group">
                        <label className="control-label" htmlFor="id_video">
                            {_("video")}
                        </label>
                        <input
                            className="form-control input"
                            id="id_video"
                            maxLength="255"
                            name="video"
                            placeholder="Video link"
                            size="42"
                            title=""
                            type="text"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            className="form-control input"
                            id="id_video_caption"
                            maxLength="75"
                            name="video_caption"
                            placeholder={_("video_caption")}
                            size="25"
                            title=""
                            type="text"
                            value={update.video_caption}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            className="form-control input"
                            id="id_video_credit"
                            maxLength="75"
                            name="video_credit"
                            placeholder={_("video_credit")}
                            size="25"
                            title=""
                            type="text"
                            value={update.video_credit}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <input
                        id="id_latitude"
                        name="latitude"
                        value={this.state.latitude || 0}
                        type="hidden"
                    />

                    <input
                        id="id_longitude"
                        name="longitude"
                        value={this.state.longitude || 0}
                        type="hidden"
                    />
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" disabled={oversize_image}>
                            {update.id ? _("edit_update") : _("add_update")}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
