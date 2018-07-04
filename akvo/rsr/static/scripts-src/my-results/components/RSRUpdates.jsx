/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import { _, getCookie } from "../utils";
import { MarkdownEditor } from "./common";

export default class RSRUpdates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingUpdate: {
                title: "",
                text: "",
                event_date: "",
                language: "",
                photo_caption: "",
                photo_credit: "",
                video_caption: "",
                video_credit: ""
            }
        };
        this.editUpdate = this.editUpdate.bind(this);
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <RSRUpdateList project={this.props.project} editUpdate={this.editUpdate} />
                    <RSRUpdateForm project={this.props.project} update={this.state.editingUpdate} />
                </div>
            </div>
        );
    }
    editUpdate(update) {
        this.setState({ editingUpdate: update });
    }
}

const RSRUpdate = ({ update, onEdit, onDelete }) => {
    const editUpdate = () => {
        return onEdit(update);
    };
    const deleteUpdate = () => {
        return onDelete(update);
    };
    const edit_button = update.editable ? (
            <a onClick={editUpdate} href="#">
                Edit
            </a>
    ) : (
        undefined
    );
    const delete_button = update.deletable ? (
            <a onClick={deleteUpdate} href="#">
                Delete
            </a>
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
                <a href={update.absolute_url}>
                    <h5>{update.title}</h5>
                </a>
                <ul className="menuUpdate">
                    <li>{edit_button}</li>
                    <li>{delete_button}</li>
                </ul>
            </div>
        </div>
    );
};

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
            updates = "Loading...";
        } else if (this.state.updates.length == 0) {
            updates = "No updates";
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
                <h3>Previous updates</h3>
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
    editUpdate(event) {
        const value = event.target.value;
        var update = this.state.update;
        update[event.target.name] = value;
        this.setState({ update });
    }
    render() {
        const { project } = this.props;
        const { oversize_image, photo_help_text, photo_image_size_text, update } = this.state;
        const url = update.id
            ? `../../../project/${project}/update/${update.id}/edit/`
            : `../../../project/${project}/add_update/`;
        const formPhoto = update.id ? (
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
            placeholder: "Description",
            cols: 40,
            rows: 10
        };
        return (
            <div className="col-md-7 col-xs-12 projectUpdateForm" id="update">
                <h3 className="">{update.id ? "Edit update" : "Add an update"}</h3>
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
                            placeholder="Title"
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
                            Language
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
                            Event date
                        </label>
                        {/* FIXME: Add a default value for the date */}
                        <input
                            className="form-control"
                            id="id_event_date"
                            name="event_date"
                            placeholder="Event date"
                            required="required"
                            title=""
                            type="date"
                            value={update.event_date}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <div className={photoClass}>
                        {formPhoto}
                        <label className="control-label" htmlFor="id_photo">
                            Photo
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
                            placeholder="Photo caption"
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
                            placeholder="Photo credit"
                            size="25"
                            title=""
                            type="text"
                            value={update.photo_credit}
                            onChange={this.editUpdate}
                        />
                    </div>

                    <div className="form-group">
                        <label className="control-label" htmlFor="id_video">
                            Video
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
                            placeholder="Video caption"
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
                            placeholder="Video credit"
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
                            {update.id ? "Edit update" : "Add update"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
