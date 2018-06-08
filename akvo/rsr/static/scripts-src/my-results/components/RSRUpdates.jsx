/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import { connect } from "react-redux";
import { _, getCookie } from "../utils";
import { MarkdownEditor } from "./common";

export default class RSRUpdates extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <RSRUpdateList project={this.props.project} />
                    <RSRUpdateForm project={this.props.project} />
                </div>
            </div>
        );
    }
}

const RSRUpdate = ({ update }) => {
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
    }
    componentDidMount() {
        const api_endpoint = ({ project }) => {
            return `/rest/v1/project_update/?project=${project}&format=json`;
        };
        const self = this;
        fetch(api_endpoint(this.props))
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
    render() {
        let updates;
        if (this.state.loading) {
            updates = "Loading...";
        } else if (this.state.updates.length == 0) {
            updates = "No updates";
        } else {
            updates = this.state.updates.map(function(update) {
                console.log(update);
                return <RSRUpdate key={update.id} update={update} />;
            });
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
            description: "",
            oversize_image: false,
            photo_help_text: _("photo_help_text"),
            photo_image_size_text: _("photo_image_size_text")
        };
        this.warnImageSize = this.warnImageSize.bind(this);
        this.setText = this.setText.bind(this);
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
        this.setState({ description });
    }
    render() {
        const { project } = this.props;
        const { oversize_image, photo_help_text, photo_image_size_text, description } = this.state;
        const url = `../../../project/${project}/add_update/`;
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
                <h3 className="">Add an update</h3>
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
                        />
                    </div>

                    <div className="form-group">
                        <MarkdownEditor
                            text={description}
                            textAreaProps={textAreaProps}
                            onChange={this.setText}
                        />
                        <textarea name="text" value={this.state.description} hidden />
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
                        />
                    </div>

                    <div className={photoClass}>
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
                            Add update
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
