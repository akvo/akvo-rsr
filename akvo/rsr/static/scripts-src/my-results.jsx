/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var csrftoken,
    endpoints,
    i18nResults,
    isAdmin = false,
    isMEManager = false,
    isPublic,
    months,
    projectIds,
    user = {};

/* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrftoken = getCookie('csrftoken');

/** General helper functions **/

function showGeneralError(message) {
    var errorNode = document.createElement("div");
    errorNode.setAttribute('id', 'draft');
    errorNode.setAttribute('class', 'row');

    var textNode = document.createTextNode(message);
    errorNode.appendChild(textNode);

    var resultsFrameworkNode = document.getElementById('results-framework');
    var containerNode = resultsFrameworkNode.parentNode;
    containerNode.insertBefore(errorNode, resultsFrameworkNode);
}

function apiCall(method, url, data, successCallback, retries) {
    var xmlHttp = new XMLHttpRequest();
    var maxRetries = 5;

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            var response;
            try {
                response = xmlHttp.responseText !== '' ? JSON.parse(xmlHttp.responseText) : '';
            } catch (e) {
                response = {"error": xmlHttp.statusText || e};
            }

            if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
                if (method === 'GET' && response.next !== undefined) {
                    if (response.next !== null) {
                        var success = function(newResponse) {
                            var oldResults = response.results;
                            response.results = oldResults.concat(newResponse.results);
                            return successCallback(response);
                        };
                        apiCall(method, response.next, data, success);
                    } else {
                        return successCallback(response);
                    }
                } else {
                    return successCallback(response);
                }
            } else {
                var message = i18nResults.general_error + ': ';
                for (var key in response) {
                    if (response.hasOwnProperty(key)) {
                         message += response[key] + '. ';
                    }
                }
                showGeneralError(message);
                return false;
            }
        }
    };

    xmlHttp.onerror = function () {
        if (retries === undefined) {
            return apiCall(method, url, data, successCallback, 2);
        } else if (retries <= maxRetries) {
            return apiCall(method, url, data, successCallback, retries + 1);
        } else {
            showGeneralError(i18nResults.connection_error);
            return false;
        }
    };

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(data);
}

function getDateDescription(month) {
    switch (month) {
        case 0:
            return months.january;
        case 1:
            return months.february;
        case 2:
            return months.march;
        case 3:
            return months.april;
        case 4:
            return months.may;
        case 5:
            return months.june;
        case 6:
            return months.july;
        case 7:
            return months.august;
        case 8:
            return months.september;
        case 9:
            return months.october;
        case 10:
            return months.november;
        case 11:
            return months.december;
    }
}

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (dateString !== undefined && dateString !== null) {
        var locale = "en-gb";
        var date = new Date(dateString.split(".")[0].replace("/", /-/g));
        var day = date.getUTCDate();
        var month = getDateDescription(date.getUTCMonth());
        //var month = date.toLocaleString(locale, { month: "short" });
        var year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return i18nResults.unknown_date;
}

function displayNumber(numberString) {
    // Add commas to numbers of 1000 or higher.
    if (numberString !== undefined && numberString !== null) {
        var locale = "en-gb";
        var float = parseFloat(numberString);
        if (!isNaN(float)) {
            return float.toLocaleString(locale);
        }
    }
    return numberString;
}

function userIsAdmin() {
    // Check if the user is an M&E manager, resulting in different actions than other users.
    var adminOrgIds = [],
        partnerships;

    if (user.is_admin || user.is_superuser) {
        isAdmin = true;
    }

    for (var i = 0; i < user.approved_employments.length; i++) {
        var employment = user.approved_employments[i];
        if (employment.group_name === 'M&E Managers' || employment.group_name === 'Admins') {
            adminOrgIds.push(employment.organisation);
        }
    }

    var success = function(response) {
        partnerships = response.results;
        for (var j = 0; j < partnerships.length; j++) {
            var partnership = partnerships[j];
            if (adminOrgIds.indexOf(partnership.organisation) > -1) {
                isMEManager = true;
            }
        }
    };
    apiCall('GET', endpoints.base_url + endpoints.partnerships, '', success);
}

function getUserData() {
    // Get the user data from the API and stores it in the global user variable
    var success = function(response) {
        user = response;
        userIsAdmin();
    };
    apiCall('GET', endpoints.base_url + endpoints.user, '', success);
}

function initReact() {
    var CommentEntry = React.createClass({
        render: function() {
            // Render an internal comment entry.
            var comment = this.props.comment;
            var user = comment.user_details;
            return (
                <div className="row">
                    <div className="col-xs-12 comment-header">
                        {user.first_name} {user.last_name} {displayDate(comment.created_at)}
                    </div>
                    <div className="col-xs-12 comment-text">
                        {comment.comment}
                    </div>
                </div>
            );
        }
    });

    var UpdateEntry = React.createClass({
        getInitialState: function() {
            var updateData;

            // In case the update is new (status 'N') and the data is '0', do not display the data.
            if (this.props.update.data === '0' && this.props.update.status === 'N') {
                updateData = '';
            } else {
                updateData = this.props.update.data;
            }

            return {
                data: updateData,
                description: this.props.update.text,
                isRelative: this.props.update.relative_data,
                comment: '',
                askRemove: false,
                loading: false,
                loadingComment: false
            };
        },

        editing: function() {
            // Check if the user is currently editing this update.
            return this.props.editingData.indexOf(this.props.update.id) > -1;
        },

        baseSave: function(data, keepEditing, reloadPeriod) {
            // Base function for saving an update.
            var url = endpoints.base_url + endpoints.update_and_comments.replace('{update}', this.props.update.id);
            var thisApp = this;
            var success = function(response) {
                var update = response;
                var periodId = thisApp.props.selectedPeriod.id;
                thisApp.props.saveUpdateToPeriod(update, periodId, false);

                if (!keepEditing) {
                    // Remove the editing state in case the user wants to stop editing.
                    thisApp.props.removeEditingData(update.id);
                }

                if (reloadPeriod) {
                    // In some cases it is best to reload the whole period after an indicator
                    // update has been saved.
                    thisApp.props.reloadPeriod(periodId);
                }

                // Remove loading state
                thisApp.setState({loading: false});
            };

            // Set state to loading
            this.setState({loading: true});

            apiCall('PATCH', url, JSON.stringify(data), success);
        },

        saveUpdate: function() {
            // Set status to 'Draft' when a 'New' status is saved.
            var status = this.props.update.status !== 'N' ? this.props.update.status : 'D';

            // Save update and reload the whole period when an approved update is edited.
            this.baseSave({
                'text': this.state.description.trim(),
                'data': this.state.data.trim(),
                'relative_data': this.state.isRelative,
                'status': status
            }, false, this.props.update.status === 'A');
        },

        askForApproval: function() {
            // Save an indicator update and set the status to pending approval ('P').
            this.baseSave({
                'text': this.state.description.trim(),
                'data': this.state.data.trim(),
                'relative_data': this.state.isRelative,
                'status': 'P'
            }, false, false);
        },

        approve: function() {
            // Save and approve ('A') an indicator update and reload the whole period to see the
            // new updated actual value of the period.
            this.baseSave({
                'text': this.state.description.trim(),
                'data': this.state.data.trim(),
                'relative_data': this.state.isRelative,
                'status': 'A'
            }, false, true);
        },

        returnForRevision: function() {
            // Return the indicator update for revision ('R').
            this.baseSave({
                'text': this.state.description.trim(),
                'data': this.state.data.trim(),
                'relative_data': this.state.isRelative,
                'status': 'R'
            }, false, false);
        },

        deleteFile: function(type) {
            var updateId = this.props.update.id;
            var url = endpoints.file_upload.replace('{update}', updateId);
            var thisApp = this;
            var success = function(periodId) {
                thisApp.props.reloadPeriod(periodId);
                thisApp.setState({loading: false});
            };
            this.setState({loading: true});
            apiCall(
                'DELETE', url,
                JSON.stringify({type: type}),
                success.bind(null, this.props.update.period)
            );
        },


        removePhoto: function() {
            this.deleteFile('photo');
        },

        removeFile: function() {
            this.deleteFile('file');
        },

        baseUpload: function(file, type) {
            // Base function for uploading a photo or file to the indicator update.
            var thisApp = this;
            var updateId = this.props.update.id;
            var url = endpoints.file_upload.replace('{update}', updateId);

            var formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("POST", url);
            xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
            xmlHttp.onload = function() {
                if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
                    var newFile = JSON.parse(xmlHttp.responseText).file;
                    thisApp.props.saveFileInUpdate(newFile, updateId, type);

                    // Set state to not loading anymore
                    thisApp.setState({loading: false});
                }
            };

            // Set state to loading
            this.setState({loading: true});

            xmlHttp.send(formData);
        },

        uploadImage: function(e) {
            // Upload an image to the indicator update.
            var file = e.target.files[0];
            this.baseUpload(file, 'photo');
        },

        uploadFile: function(e) {
            // Upload a file to the indicator update.
            var file = e.target.files[0];
            this.baseUpload(file, 'file');
        },

        addComment: function() {
            // Add an internal comment to an indicator update.
            var url = endpoints.base_url + endpoints.comments;
            var data = JSON.stringify({
                'data': this.props.update.id,
                'user': user.id,
                'comment': this.state.comment
            });
            var thisApp = this;
            var success = function(response) {
                var comment = response;
                var updateId = thisApp.props.update.id;
                thisApp.props.saveCommentInUpdate(comment, updateId);

                // Remove state of current comment and disable loading of comments
                thisApp.setState({
                    comment: '',
                    loadingComment: false
                });
            };

            // Set loading of comments
            this.setState({loadingComment: true});

            apiCall('POST', url, data, success);
        },

        removeUpdate: function() {
            // Set state to loading
            this.setState({loading: true});

            // Remove an indicator update.
            this.props.removeUpdate(this.props.update.id);
        },

        switchAskRemove: function() {
            // After the 'Delete' button has been clicked, ask the user first if he/she is sure the
            // update should be deleted.
            this.setState({askRemove: !this.state.askRemove});
        },

        switchEdit: function() {
            // When the 'Edit' or 'Cancel' button of an indicator update is clicked, switch the
            // editing mode of the indicator update.
            var addEdit = this.props.addEditingData;
            var removeEdit = this.props.removeEditingData;
            var updateId = this.props.update.id;

            if (this.editing()) {
                if (this.props.update.status === 'N') {
                    // When the update is new (status 'N') and editing the update is canceled,
                    // remove the update.
                    this.removeUpdate();
                } else {
                    // Otherwise, just remove the editing state.
                    removeEdit(updateId);
                }
            } else {
                // Add the editing state in case the user was not editing the update yet.
                addEdit(updateId);
            }
        },

        handleDataChange: function(e) {
            // Keep track of the data in the 'Actual value' field of the update.
            this.setState({data: e.target.value});
        },

        handleDescriptionChange: function(e) {
            // Keep track of the data in the 'Description' field of the update.
            this.setState({description: e.target.value});
        },

        handleCommentChange: function(e) {
            // Keep track of the data in the 'Internal comment' field.
            this.setState({comment: e.target.value});
        },

        handleRelativeChange: function(e) {
            // Keep track of the checkbox that controls the relative or absolute change of the
            // update. Note: absolute changes (and this checkbox) are disabled for now, updates
            // are always relative.
            if (this.state.isRelative) {
                this.setState({isRelative: false});
            } else {
                this.setState({isRelative: true});
            }
        },

        renderUpdateClass: function() {
            // When an update is in editing mode, it should have the 'edit-in-progress' class.
            var updateClass = "row update-entry-container";
            if (this.editing()) {
                updateClass += " edit-in-progress";
            }
            return updateClass;
        },

        renderHeader: function() {
            // Render the update's header.
            var headerLeft,
                headerRight;

            if (this.editing()) {
                // In editing mode, only show "Edit update" in the left side of the header.
                headerLeft = <div className="col-xs-9">
                    <span className="edit-update">{i18nResults.edit_update}</span>
                </div>;
            } else {
                // When not editing, display the user information on the left side of the header.
                var approved_organisations = this.props.update.user_details.approved_organisations;
                var organisations_display;
                switch (approved_organisations.length) {
                    case 0:
                        organisations_display = '';
                        break;
                    case 1:
                        organisations_display = ' | ' + approved_organisations[0].long_name;
                        break;
                    case 2:
                        organisations_display = ' | ' + approved_organisations[0].long_name + ', ' + approved_organisations[1].long_name;
                        break;
                    default:
                        organisations_display = ' | ' + approved_organisations[0].long_name + ' ' + i18nResults.and + ' ' + (approved_organisations.length - 1).toString() + ' ' + i18nResults.others;
                        break;
                }
                headerLeft = <div className="col-xs-9">
                    <span className="update-user">{this.props.update.user_details.first_name} {this.props.update.user_details.last_name}</span>
                    <span className="update-user-organisation">{organisations_display}</span>
                    <span className="update-created-at">{displayDate(this.props.update.created_at)}</span>
                </div>;
            }

            if (isPublic) {
                // In the public view, do not display the status, since we only display approved
                // updates anyway.
                headerRight = <span />;
            } else {
                // In the 'MyRSR' view, show the status and add the status class that belongs to
                // the status.
                var statusClass = "update-status";

                switch (this.props.update.status) {
                    case 'P':
                        statusClass += " pending";
                        break;
                    case 'R':
                        statusClass += " revision";
                        break;
                    case 'A':
                        statusClass += " approved";
                        break;
                    default:
                        break;
                }

                headerRight = <div className="col-xs-3 text-right">
                    <span className={statusClass}> {this.props.update.status_display}</span>
                </div>;
            }

            return (
                <div className="row update-entry-container-header">
                    {headerLeft}
                    {headerRight}
                </div>
            );
        },

        renderActualRelative: function(label) {
            // Render the new actual value of the period, including a calculation based on the
            // previous actual value of the period.
            var periodActualValue = parseFloat(this.props.update.period_actual_value);
            var originalData = parseFloat(this.state.data);
            var updateData = this.state.isRelative ? periodActualValue + originalData : originalData;
            var relativeData = this.state.isRelative ? originalData : updateData - periodActualValue;

            if (isNaN(updateData) || isNaN(relativeData)) {
                // If the data cannot be calculated (e.g. non-numeric data), do not display a
                // calculation.
                return (
                    <div className="upActualValue">
                        <span className="update-actual-value-text">{label}: </span>
                        <span className="update-actual-value-data">{this.state.data}</span><br/>
                    </div>
                );
            } else {
                // Display a calculation.
                var relativeDataText = relativeData >= 0 ? displayNumber(periodActualValue.toString()) + '+' + displayNumber(relativeData.toString()) : displayNumber(periodActualValue.toString()) + displayNumber(relativeData.toString());
                return (
                    <div className="upActualValue">
                        <span className="update-actual-value-text">{label}: </span>
                        <span className="update-actual-value-data">{displayNumber(updateData)} </span>
                        <span className="update-relative-value">({relativeDataText})</span>
                    </div>
                );
            }
        },

        renderActual: function() {
            var inputId = "actual-input-" + this.props.update.id;

            //// The checkbox to make the update relative or absolute has been removed, to make ////
            //// things more clear for the users. ////
            //// ---- old code ------------------ ////
            //var checkboxId = "relative-checkbox-" + this.props.update.id;
            //var checkbox;
            //if (this.state.isRelative) {
            //    checkbox = <label><input type="checkbox" id={checkboxId} onChange={this.handleRelativeChange} checked /> {i18nResults.relative_data}</label>;
            //} else {
            //    checkbox = <label><input type="checkbox" id={checkboxId} onChange={this.handleRelativeChange} /> {i18nResults.relative_data}</label>;
            //}

            if (this.editing()) {
                // Show an input field to fill the new actual value when editing.
                return (
                    <div className="row">
                        <div className="col-xs-6">
                            <label htmlFor={inputId}>{i18nResults.add_to_actual_value}</label>
                            <input className="form-control" id={inputId} defaultValue={this.state.data} onChange={this.handleDataChange} placeholder={i18nResults.input_placeholder} />
                        </div>
                        <div className="col-xs-6">
                            {this.renderActualRelative(i18nResults.new_total_value)}
                        </div>
                    </div>
                );
            } else {
                // Show the value that has been filled in when not in editing mode.
                return (
                    <div className="row">
                        <div className="col-xs-12">
                            {this.renderActualRelative(i18nResults.total_value_after_update)}
                        </div>
                    </div>
                );
            }
        },

        renderDescription: function() {
            // Render the description part of the update.
            var inputId = "description-input-" + this.props.update.id;
            var photoPart, descriptionPart, descriptionClass;

            if (this.props.update.photo_url === "") {
                // If no photo has been uploaded, do not show the photo.
                photoPart = <span />;
                descriptionClass = "col-xs-9 update-description";
            } else {
                // Also display a photo.
                if (this.editing()) {
                    // When in edit mode and hovering over the photo, make it clear that clicking
                    // on the photo will remove it.
                    photoPart = <div className="col-xs-3 update-photo">
                        <div className="image-container">
                            <a onClick={this.removePhoto}>
                                <img src={endpoints.base_url + this.props.update.photo_url} />
                                <div className="image-overlay text-center">{i18nResults.remove_image}</div>
                            </a>
                        </div>
                    </div>;
                } else {
                    // Display the photo. Clicking on it will open the full size image in a new tab.
                    photoPart = <div className="col-xs-3 update-photo">
                        <a href={endpoints.base_url + this.props.update.photo_url} target="_blank">
                            <img src={endpoints.base_url + this.props.update.photo_url}/>
                        </a>
                    </div>;
                }
                descriptionClass = "col-xs-9 update-description";
            }

            if (this.editing()) {
                // Display a textarea for the description when in editing mode.
                descriptionPart = <div className={descriptionClass}>
                    <label htmlFor={inputId}>{i18nResults.actual_value_comment}</label>
                    <textarea className="form-control" id={inputId} defaultValue={this.props.update.text} onChange={this.handleDescriptionChange} placeholder={i18nResults.comment_placeholder} />
                </div>;
            } else {
                // Display the description when not in editing mode. A special function is included
                // to generate newlines (which are ignored by default).
                descriptionPart = <div className={descriptionClass}>
                    {this.props.update.text.split(/\r\n|\r|\n/g).map(function(line) {
                        return (
                            <span>
                                {line}
                                <br />
                            </span>
                        );
                    })}
                </div>;
            }

            return (
                <div className="row">
                    {photoPart}
                    {descriptionPart}
                </div>
            );
        },

        fileNameDisplay: function() {
            // Display the name of the uploaded file, if a file has been uploaded.
            if (this.props.update.file_url !== '') {
                return decodeURIComponent(this.props.update.file_url.split('/').pop());
            } else {
                return '';
            }
        },

        renderFileUpload: function() {
            // Render the image and file upload feature.
            if (this.editing()) {
                var fileUpload;
                var labelText = this.props.update.photo_url === "" ? i18nResults.add_image : i18nResults.change_image;

                if (this.props.update.file_url !== '') {
                    // Show the file name and a remove icon when a file has already been uploaded.
                    fileUpload = <div className="col-xs-6">
                        <i className="fa fa-paperclip"/> <a href={this.props.update.file_url} target="_blank">{this.fileNameDisplay()}</a>
                        <a onClick={this.removeFile}> Remove</a>
                    </div>;
                } else {
                    // Show an upload file text when no file has been uploaded yet.
                    fileUpload = <div className="col-xs-3">
                        <label className="fileUpload">
                            <input type="file" onChange={this.uploadFile} />
                            <a><i className="fa fa-paperclip"/> {i18nResults.attach_file}</a>
                        </label>
                    </div>;
                }

                return (
                    <div className="row">
                        <div className="col-xs-3">
                            <label className="imageUpload">
                                <input type="file" accept="image/*" onChange={this.uploadImage} />
                                <a><i className="fa fa-camera"/> {labelText}</a>
                            </label>
                        </div>
                        {fileUpload}
                    </div>
                );
            } else if (this.props.update.file_url !== '') {
                // Display a link to the file when a file has been uploaded and the update is not
                // in editing mode.
                return (
                    <div className="row">
                        <div className="col-xs-6">
                            <i className="fa fa-paperclip"/> <a href={this.props.update.file_url} target="_blank">{this.fileNameDisplay()}</a>
                        </div>
                    </div>
                );
            } else {
                // Do not display an image or file upload when not editing the indicator update.
                return (
                    <span />
                );
            }
        },

        renderComments: function() {
            // Render the internal comments of an indicator update.
            var comments;

            if (isPublic) {
                // In the public view, internal comments are not displayed.
                return (
                    <span />
                );
            }

            if (this.props.update.comments !== undefined) {
                // Render a 'CommentEntry' for each internal comment.
                comments = this.props.update.comments.map(function(comment) {
                    return (
                        <div className="comment" key={comment.id}>
                            {React.createElement(CommentEntry, {
                                comment: comment
                            })}
                        </div>
                    );
                });
            } else {
                // Show a loading icon when the comments are still loading.
                comments = <div className="comment">
                    <i className="fa fa-spin fa-spinner" /> {i18nResults.loading} {i18nResults.comments}
                </div>;
            }

            var inputId = "new-comment-" + this.props.update.id;
            var addCommentInput;

            if (this.state.loadingComment) {
                addCommentInput = <div>
                    <div className="input-group">
                        <input className="form-control" value={this.state.comment} id={inputId} placeholder={i18nResults.add_comment_placeholder} />
                        <span className="input-group-btn">
                            <button className="btn btn-default"><i className="fa fa-spin fa-spinner" />{i18nResults.loading}...</button>
                        </span>
                    </div>
                </div>;
            } else {
                addCommentInput = <div>
                    <div className="input-group">
                        <input className="form-control" value={this.state.comment} id={inputId} placeholder={i18nResults.add_comment_placeholder} onChange={this.handleCommentChange} />
                        <span className="input-group-btn">
                            <button onClick={this.addComment} type="submit" className="btn btn-default">{i18nResults.add_comment}</button>
                        </span>
                    </div>
                </div>;
            }

            return (
                <div className="comments">
                    {comments}
                    {addCommentInput}
                </div>
            );
        },

        renderFooter: function() {
            // Render the footer, containing action buttons, of an indicator update.
            if (this.props.selectedPeriod.locked || isPublic) {
                // Locked periods, or in the public view, do not have actions. Display nothing.
                return (
                    <span />
                );
            } else if (this.state.loading) {
                return (
                    <div className="menuAction">
                        <ul className="nav-pills bottomRow navbar-right">
                            <li role="presentation">
                                <i className="fa fa-spin fa-spinner" /> {i18nResults.loading}...
                            </li>
                        </ul>
                    </div>
                );
            } else if (this.state.askRemove) {
                // When the user has click on 'Delete', show a confirmation for deletion of the
                // update.
                return (
                    <div className="menuAction">
                        <ul className="nav-pills bottomRow navbar-right">
                            <li role="presentation" className="cancelUpdate">
                                {i18nResults.delete_confirmation}
                            </li>
                            <li role="presentation" className="removeUpdateConfirm">
                                <a onClick={this.removeUpdate} className="btn btn-default btn-xs">{i18nResults.yes}</a>
                            </li>
                            <li role="presentation" className="removeUpdateCancel">
                                <a onClick={this.switchAskRemove} className="btn btn-default btn-xs">{i18nResults.no}</a>
                            </li>
                        </ul>
                    </div>
                );
            } else if (this.editing()) {
                // When editing and in the 'MyRSR' view, the actions are dependant on the status
                // of the update.
                var approveButtonEdit = <span />,
                    askForApprovalButton = <span />;

                if (this.props.update.status !== 'A' && isMEManager) {
                    // Editing an non-approved update as an M&E Manager will show the 'Approve' button.
                    approveButtonEdit = <li role="presentation" className="approveUpdate">
                        <a onClick={this.approve} className="btn btn-default btn-xs">{i18nResults.approve}</a>
                    </li>;
                } else if (!isMEManager) {
                    // Editing an update as a non-M&E Manager will show the 'Ask for approval' button.
                    askForApprovalButton = <li role="presentation" className="submitUpdate">
                        <a onClick={this.askForApproval} className="btn btn-default btn-xs">{i18nResults.submit_for_approval}</a>
                    </li>;
                }

                return (
                    <div className="menuAction">
                        <div role="presentation" className="removeUpdate">
                            <a onClick={this.switchAskRemove} className="btn btn-default btn-xs">{i18nResults.delete}</a>
                        </div>
                        <ul className="nav-pills bottomRow navbar-right">
                            <li role="presentation" className="cancelUpdate">
                                <a onClick={this.switchEdit} className="btn btn-link btn-xs">{i18nResults.cancel}</a>
                            </li>
                            <li role="presentation" className="saveUpdate">
                                <a onClick={this.saveUpdate} className="btn btn-default btn-xs">{i18nResults.save}</a>
                            </li>
                            {approveButtonEdit}
                            {askForApprovalButton}
                        </ul>
                    </div>
                );
            } else {
                var returnForRevisionButton = <span />,
                    approveButton = <span />;

                if (!(this.props.update.user === user.id || isMEManager) ||
                    (['P', 'A'].indexOf(this.props.update.status) > -1 && !isMEManager)) {
                    // Show no actions for non-M&E Managers that have not placed the update or on a
                    // 'Pending approval' or 'Approved' update.
                    return (<span />);
                } else {
                    if (this.props.update.status === 'P' && isMEManager) {
                        // Show the 'Return for revision' button for M&E Managers on updates with the status 'Pending approval'.
                        returnForRevisionButton = <li role="presentation" className="returnUpdate">
                            <a onClick={this.returnForRevision} className="btn btn-default btn-xs">{i18nResults.return_for_revision}</a>
                        </li>;
                    }
                    if (this.props.update.status !== 'A' && isMEManager) {
                        // Show the 'Approve' button for M&E Managers on updates without the status 'Approval'.
                        approveButton = <li role="presentation" className="approveUpdate">
                            <a onClick={this.approve} className="btn btn-default btn-xs">{i18nResults.approve}</a>
                        </li>;
                    }
                }

                return (
                    <div className="menuAction">
                        <ul className="nav-pills bottomRow navbar-right">
                            {returnForRevisionButton}
                            <li role="presentation" className="editUpdate">
                                <a onClick={this.switchEdit} className="btn btn-default btn-xs">{i18nResults.edit_update}</a>
                            </li>
                            {approveButton}
                        </ul>
                    </div>
                );
            }
        },

        render: function() {
            // Render an indicator update entry.
            return (
                <div className={this.renderUpdateClass()}>
                    <div className="col-xs-12">
                        {this.renderHeader()}
                        {this.renderActual()}
                        {this.renderDescription()}
                        {this.renderFileUpload()}
                        {this.renderComments()}
                        {this.renderFooter()}
                    </div>
                </div>
            );
        }
    });

    var UpdatesList = React.createClass({
        sortedUpdates: function() {
            // Sort and filter the updates:
            // Sort the updates by the 'created at' field.
            // Filter the updates based on the public view or not. In the public view only the
            // approved are shown.
            function compare(u1, u2) {
                if (u1.created_at > u2.created_at) {
                    return -1;
                } else if (u1.created_at < u2.created_at) {
                    return 1;
                } else {
                    return 0;
                }
            }

            if (isPublic) {
                // Only show approved updates in the public view.
                var approvedUpdates = [];
                for (var i = 0; i < this.props.selectedPeriod.data.length; i++) {
                    var thisData = this.props.selectedPeriod.data[i];
                    if (thisData.status === 'A') {
                        approvedUpdates.push(thisData);
                    }
                }
                return approvedUpdates.sort(compare);
            }

            return this.props.selectedPeriod.data.sort(compare);
        },

        render: function() {
            // Render the list of indicator updates.
            var thisList = this,
                updates;

            if (this.props.selectedPeriod.data !== undefined) {
                // When the indicator updates are loaded, render an 'UpdateEntry' for every update.
                updates = this.sortedUpdates().map(function (update) {
                    return (
                        <div className="update-container" key={update.id}>
                            {React.createElement(UpdateEntry, {
                                addEditingData: thisList.props.addEditingData,
                                removeEditingData: thisList.props.removeEditingData,
                                editingData: thisList.props.editingData,
                                saveUpdateToPeriod: thisList.props.saveUpdateToPeriod,
                                saveFileInUpdate: thisList.props.saveFileInUpdate,
                                saveCommentInUpdate: thisList.props.saveCommentInUpdate,
                                removeUpdate: thisList.props.removeUpdate,
                                selectedPeriod: thisList.props.selectedPeriod,
                                selectPeriod: thisList.props.selectPeriod,
                                reloadPeriod: thisList.props.reloadPeriod,
                                update: update
                            })}
                        </div>
                    );
                });
            } else {
                // Show a loading icon when the indicator updates are loading.
                updates = <div>
                    <i className="fa fa-spin fa-spinner" /> {i18nResults.loading} {i18nResults.updates}
                </div>;
            }

            var updatesHeader;
            if (this.props.selectedIndicator.children_aggregate_percentage && !isPublic) {
                updatesHeader = <h5>{i18nResults.cant_place_updates}</h5>;
                updates = <span />;
            } else if (this.props.selectedPeriod.data === undefined || this.props.selectedPeriod.data.length > 0) {
                updatesHeader = <h5>{i18nResults.updates}</h5>;
            } else {
                updatesHeader = <h5>{i18nResults.no_updates_yet}</h5>;
            }

            return (
                <div className="updates-container">
                    {updatesHeader}
                    {updates}
                </div>
            );
        }
    });

    var IndicatorPeriodMain = React.createClass({
        getInitialState: function() {
            return {
                actualValueHover: false,
                unLocking: false
            };
        },

        goBack: function() {
            this.props.selectPeriod(null);
        },

        handleMouseOver: function() {
            // Update the state when the actual value info icon is hovered.
            this.setState({actualValueHover: true});
        },

        handleMouseOut: function() {
            // Update the state when the actual value info icon is not hovered anymore.
            this.setState({actualValueHover: false});
        },

        addNewUpdate: function() {
            // Add a new update to the period.
            this.props.addNewUpdate(this.props.selectedPeriod.id);
        },

        finishUnlocking: function() {
            this.setState({unLocking: false});
        },

        unlockPeriod: function() {
            // Unlock this period.
            this.setState({unLocking: true});
            this.props.unlockPeriod(this.props.selectedPeriod.id, this.finishUnlocking);
        },

        percentageWithChildren: function() {
            // Checks whether the indicator has percentages and linked children. In that case it is
            // not allowed to update the period.
            return this.props.selectedIndicator.measure === '2';
        },

        renderNewUpdate: function() {
            // Render the button for adding a new update.

            if (isPublic) {
                // In the public view, it is not possible to add a new update.
                return (
                    <div className="new-update"></div>
                );
            }

            if (this.props.addingNewUpdate) {
                // In case the new update is being added, show a loading icon.
                return (
                    <div className="new-update">
                        <i className="fa fa-spin fa-spinner" /> {i18nResults.adding_update}
                    </div>
                );
            } else if (!this.props.selectedPeriod.locked) {
                if (this.props.selectedPeriod.data === undefined) {
                    // Show nothing if the updates are still loading.
                    return (
                        <div className="new-update"></div>
                    );
                } else if (this.props.selectedIndicator.children_aggregate_percentage) {
                    // Show nothing if it the period has percentages and linked children.
                    return (
                        <div className="new-update"></div>
                    );
                } else {
                    // If the updates have been loaded and the period is not locked, show a button
                    // to add a new update.
                    return (
                        <div className="new-update">
                            <a onClick={this.addNewUpdate} className="btn btn-sm btn-default"><i className="fa fa-plus" /> {i18nResults.new_update}</a>
                        </div>
                    );
                }
                // if (this.props.selectedPeriod.data !== undefined) {
                //     // If the updates have been loaded and the period is not locked, show a button
                //     // to add a new update.
                //     return (
                //         <div className="new-update">
                //             <a onClick={this.addNewUpdate} className="btn btn-sm btn-default"><i className="fa fa-plus" /> {i18nResults.new_update}</a>
                //         </div>
                //     );
                // } else {
                //     // Show nothing if the updates are still loading.
                //     return (
                //         <div className="new-update"></div>
                //     );
                // }
            } else if (isMEManager) {
                // In case the period is locked, in the 'MyRSR' view, and the user is an admin,
                // then show a button to unlock the period.
                if (this.state.unLocking) {
                    return (
                        <div className="new-update">
                            <a className="btn btn-sm btn-default"><i className="fa fa-spin fa-spinner" /> {i18nResults.unlocking_period}...</a>
                        </div>
                    );
                } else {
                    return (
                        <div className="new-update">
                            <a onClick={this.unlockPeriod} className="btn btn-sm btn-default"><i className="fa fa-unlock-alt" /> {i18nResults.unlock_period}</a>
                        </div>
                    );
                }
            } else {
                // In all other cases, show nothing.
                return (
                    <div className="new-update"></div>
                );
            }

        },

        renderTargetComment: function() {
            // Render the target comment.
            if (this.props.selectedPeriod.target_comment === '') {
                return (
                    <div className="period-target-comment"></div>
                );
            } else {
                return (
                    <div className="period-target-comment">
                        {i18nResults.target_comment}
                        <span>{this.props.selectedPeriod.target_comment}</span>
                    </div>
                );
            }
        },

        renderActualComment: function() {
            // Render the actual comment.
            if (this.props.selectedPeriod.actual_comment === '') {
                return (
                    <div className="period-actual-comment"></div>
                );
            } else {
                return (
                    <div className="period-actual-comment">
                        {i18nResults.actual_comment}
                        <span>{this.props.selectedPeriod.actual_comment}</span>
                    </div>
                );
            }
        },

        renderTargetValue: function() {
            // Render the target value, including a % sign if the measure is set to percentage.
            var targetValue = displayNumber(this.props.selectedPeriod.target_value);
            if (this.props.selectedIndicator.measure === '2' && targetValue !== '') {
                targetValue += '%';
            }
            return targetValue;
        },

        renderActualValue: function() {
            // Render the actual value, including a % sign if the measure is set to percentage.
            var actualValue = displayNumber(this.props.selectedPeriod.actual_value);
            if (this.props.selectedIndicator.measure === '2' && actualValue !== '') {
                actualValue += '%';
            }
            return actualValue;
        },

        renderPercentageComplete: function() {
            // Render the percentage complete.
            if (this.props.selectedPeriod.percent_accomplishment !== null && this.props.selectedIndicator.measure !== '2') {
                return (
                    <span className="percentage-complete"> ({this.props.selectedPeriod.percent_accomplishment}%)</span>
                );
            } else {
                return (
                    <span />
                );
            }
        },

        renderHover: function() {
            // Render the hover of the info icon next to the actual value
            if (this.state.actualValueHover) {
                return (
                    <div className="result-tooltip fade top in" role="tooltip">
                        <div className="tooltip-arrow"></div>
                        <div className="tooltip-inner">{i18nResults.actual_value_info}</div>
                    </div>
                );
            } else {
                return (
                    <span />
                );
            }
        },

        render: function() {
            // Render the full period view.
            var hover = this.renderHover();

            return (
                <div className="indicator-period opacity-transition">
                    <div className="indicTitle">
                            <h4 className="indicator-title">
                                <a className="backButton" onClick={this.goBack}>&lt; {i18nResults.back}</a>
                                {i18nResults.indicator_period}: {displayDate(this.props.selectedPeriod.period_start)} - {displayDate(this.props.selectedPeriod.period_end)}
                            </h4>
                        {this.renderNewUpdate()}
                    </div>
                    <div className="period-target-actual">
                        <div className="periodValues">
                            <div className="period-target">
                                {i18nResults.target_value}
                                <span>{this.renderTargetValue()}</span>
                            </div>
                            <div className="period-actual">
                                {i18nResults.actual_value}<div className="badge" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>i</div>
                                <span className="actualValueSpan">
                                    <span>{this.renderActualValue()}</span>
                                    {this.renderPercentageComplete()}
                                </span>
                                 {hover}
                            </div>
                            {this.renderTargetComment()}
                            {this.renderActualComment()}
                        </div>
                        {React.createElement(UpdatesList, {
                            addEditingData: this.props.addEditingData,
                            removeEditingData: this.props.removeEditingData,
                            editingData: this.props.editingData,
                            saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                            saveFileInUpdate: this.props.saveFileInUpdate,
                            saveCommentInUpdate: this.props.saveCommentInUpdate,
                            removeUpdate: this.props.removeUpdate,
                            selectedIndicator: this.props.selectedIndicator,
                            selectedPeriod: this.props.selectedPeriod,
                            selectPeriod: this.props.selectPeriod,
                            reloadPeriod: this.props.reloadPeriod,
                            percentageWithChildren: this.percentageWithChildren()
                        })}
                    </div>
                </div>
            );
        }
    });

    var IndicatorPeriodEntry = React.createClass({
        getInitialState: function() {
            return {
                hover: false,
                lockingOrUnlocking: false
            };
        },

        selected: function() {
            // Check if this period is selected.
            if (this.props.selectedPeriod !== null) {
                return this.props.selectedPeriod.id === this.props.period.id;
            } else {
                return false;
            }
        },

        numberOfPendingUpdates: function() {
            // Count the number of indicator updates of this period that are 'Pending for approval'.
            var result = 0;
            if (this.props.period.data !== undefined) {
                for (var i = 0; i < this.props.period.data.length; i++) {
                    var update = this.props.period.data[i];
                    if (update.status === 'P') {
                        result += 1;
                    }
                }
            }
            return result;
        },

        handleMouseOver: function() {
            // Set hover state to True when hovering.
            this.setState({hover: true});
        },

        handleMouseOut: function() {
            // Set hover state to False when not hovering anymore.
            this.setState({hover: false});
        },

        finishLocking: function() {
            this.setState({lockingOrUnlocking: false});
        },

        lockPeriod: function() {
            // Lock this period.
            this.setState({lockingOrUnlocking: true});
            this.props.lockPeriod(this.props.period.id, this.finishLocking);
        },

        unlockPeriod: function() {
            // Unlock this period.
            this.setState({lockingOrUnlocking: true});
            this.props.unlockPeriod(this.props.period.id, this.finishLocking);
        },

        switchPeriod: function() {
            // Switch to this period.
            var periodId = this.selected() ? null : this.props.period.id;
            this.props.selectPeriod(periodId);
        },

        getPeriodData: function() {
            // Depending on the view, the indicator updates should be filtered or not.
            if (this.props.period.data === undefined) {
                return undefined;
            } else if (isPublic) {
                // In the public view, we only show approved updates.
                var approvedData = [];
                for (var i = 0; i < this.props.period.data.length; i++) {
                    var thisData = this.props.period.data[i];
                    if (thisData.status === 'A') {
                        approvedData.push(thisData);
                    }
                }
                return approvedData;
            } else {
                // In the 'MyRSR' view, we show all updates.
                return this.props.period.data;
            }

        },

        renderPeriodDisplay: function() {
            // Render the period itself.
            var periodDisplay = displayDate(this.props.period.period_start) + ' - ' + displayDate(this.props.period.period_end);
            var nrPendingUpdates = this.numberOfPendingUpdates();
            var pendingUpdates = nrPendingUpdates > 0 && !isPublic ? <span className="badge" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>{nrPendingUpdates}</span> : <span />;
            var hover = this.state.hover ? <div className="result-tooltip fade top in" role="tooltip"><div className="tooltip-arrow"></div><div className="tooltip-inner">{i18nResults.number_of_pending_updates}</div></div> : <span />;

            if (this.getPeriodData() === undefined) {
                // The period is still undefined, meaning that it is loading.
                return (
                    <td className="period-td">
                        {periodDisplay} <i className="fa fa-spin fa-spinner" />
                    </td>
                );
            } else if ((isPublic || this.props.period.locked) && this.getPeriodData().length === 0) {
                // The period is locked or in the public view and no indicator updates yet.
                // In these cases it is not possible to select the period.
                return (
                    <td className="period-td">
                        {periodDisplay}
                    </td>
                );
            } else {
                // The period is open or already has data, so make the period selectable.
                return (
                    <td className="period-td">
                        <a onClick={this.switchPeriod}>
                            {periodDisplay}
                        </a> {pendingUpdates} {hover}
                    </td>
                );
            }
        },

        renderActions: function() {
            // Render the actions for this period.
            if (isPublic) {
                // In the public view, display nothing.
                return (
                    <span />
                );
            } else if (!isMEManager) {
                // In the 'MyRSR' view as a non-admin, display whether the period is locked or not.
                switch(this.props.period.locked) {
                    case false:
                        return (
                            <td className="actions-td">
                                <i className="fa fa-unlock-alt" /> {i18nResults.period_unlocked}
                            </td>
                        );
                    default:
                        return (
                            <td className="actions-td">
                                <i className="fa fa-lock" /> {i18nResults.period_locked}
                            </td>
                        );
                }
            } else {
                // In the 'MyRSR' view as an admin, show the buttons to lock or unlock a period.
                if (this.state.lockingOrUnlocking) {
                    return (
                        <td className="actions-td">
                            <a className="btn btn-sm btn-default"><i className="fa fa-spin fa-spinner" /> {i18nResults.loading}</a>
                        </td>
                    );
                } else if (this.props.period.locked) {
                    return (
                        <td className="actions-td">
                            <a onClick={this.unlockPeriod} className="btn btn-sm btn-default"><i className="fa fa-unlock-alt" /> {i18nResults.unlock_period}</a>
                        </td>
                    );
                } else {
                    return (
                        <td className="actions-td">
                            <a onClick={this.lockPeriod} className="btn btn-sm btn-default"><i className="fa fa-lock" /> {i18nResults.lock_period}</a>
                        </td>
                    );
                }
            }
        },

        renderTargetValue: function() {
            // Render the target value, including a % sign when the measure is set to percentage.
            var targetValue = displayNumber(this.props.period.target_value);
            if (this.props.selectedIndicator.measure === '2' && targetValue !== '') {
                targetValue += '%';
            }
            return targetValue;
        },

        renderActualValue: function() {
            // Render the actual value, including a % sign when the measure is set to percentage.
            var actualValue = displayNumber(this.props.period.actual_value);
            if (this.props.selectedIndicator.measure === '2' && actualValue !== '') {
                actualValue += '%';
            }
            return actualValue;
        },

        renderPercentageComplete: function() {
            // Render the percentage completed.
            if (!(this.props.period.percent_accomplishment === null || this.props.selectedIndicator.measure === '2')) {
                return (
                    <span className="percentage-complete"> ({this.props.period.percent_accomplishment}%)</span>
                );
            } else {
                return (
                    <span />
                );
            }
        },

        render: function() {
            // Render the indicator period entry.
            return (
                <tr>
                    {this.renderPeriodDisplay()}
                    <td className="target-td">
                        {this.renderTargetValue()}
                    </td>
                    <td className="actual-td">
                        {this.renderActualValue()}
                        {this.renderPercentageComplete()}
                    </td>
                    {this.renderActions()}
                </tr>
            );
        }
    });

    var IndicatorPeriodList = React.createClass({
        sortedPeriods: function() {
            // Sort the periods by the 'period start' field.
            function compare(u1, u2) {
                if (u1.period_start < u2.period_start) {
                    return -1;
                } else if (u1.period_start > u2.period_start) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return this.props.selectedIndicator.periods.sort(compare);
        },

        renderBaseline: function() {
            // Render the baseline information.
            var baselineYear = this.props.selectedIndicator.baseline_year,
                baselineValue = displayNumber(this.props.selectedIndicator.baseline_value);

            if (!(baselineYear === null && baselineValue === '')) {
                // In case the measure type is 'Percentage', add a % sign.
                if (this.props.selectedIndicator.measure === '2') {
                    baselineValue += '%';
                }

                return (
                    <div className="baseline">
                        <div className="baseline-year">
                            {i18nResults.baseline_year}
                            <span>{baselineYear}</span>
                        </div>
                        <div className="baseline-value">
                            {i18nResults.baseline_value}
                            <span>{baselineValue}</span>
                        </div>
                    </div>
                );
            } else {
                // Render nothing when no baseline year or value is present.
                return (
                    <span />
                );
            }
        },

        renderParentsChildren: function() {
            // Render the parent and children projects for this result
            var result = this.props.findResult(this.props.selectedIndicator.result);
            var parentsAndChildren = [];
            var language = window.location.pathname.substring(0, 3);

            // Find and add the parent project.
            for (var parProjectId in result.parent_project) {
                if (result.parent_project.hasOwnProperty(parProjectId)) {
                    var parProjectTitle = result.parent_project[parProjectId];
                    var parNode;
                    if (isPublic) {
                        parNode = <div className="indicator-period-list parentProject">
                            <span className="relatedInfo">
                                {i18nResults.parent_project}: <a href={language + "/project/" + parProjectId + "/#results"}>{parProjectTitle}</a>
                            </span>
                        </div>;
                    } else {
                        parNode = <div className="indicator-period-list parentProject">
                            <span className="relatedInfo">
                                {i18nResults.parent_project}: <a href={language + "/myrsr/results/" + parProjectId + "/"}>{parProjectTitle}</a>
                            </span>
                        </div>;
                    }
                    parentsAndChildren.push(parNode);
                }
            }

            // Find and add the child project(s).
            for (var childProjectId in result.child_projects) {
                if (result.child_projects.hasOwnProperty(childProjectId)) {
                    var childProjectTitle = result.child_projects[childProjectId];
                    var childNode;
                    if (isPublic) {
                        childNode = <div className="indicator-period-list childProject">
                            <span className="relatedInfo">
                                {i18nResults.child_project}: <a href={language + "/project/" + childProjectId + "/#results"}>{childProjectTitle}</a>
                            </span>
                        </div>;
                    } else {
                        childNode = <div className="indicator-period-list childProject">
                            <span className="relatedInfo">
                                {i18nResults.child_project}: <a href={language + "/myrsr/results/" + childProjectId + "/"}>{childProjectTitle}</a>
                            </span>
                        </div>;
                    }
                    parentsAndChildren.push(childNode);
                }
            }

            return parentsAndChildren;
        },

        render: function() {
            // Render the list of periods.
            var thisList = this,
                periods;

            if (this.props.selectedIndicator.periods !== undefined) {
                // For every period, render a 'IndicatorPeriodEntry'.
                periods = this.sortedPeriods().map(function (period) {
                    return (
                        <tbody className="indicator-period bg-transition" key={period.id}>
                            {React.createElement(IndicatorPeriodEntry, {
                                period: period,
                                selectedIndicator: thisList.props.selectedIndicator,
                                selectedPeriod: thisList.props.selectedPeriod,
                                selectPeriod: thisList.props.selectPeriod,
                                addNewUpdate: thisList.props.addNewUpdate,
                                savePeriodToIndicator: thisList.props.savePeriodToIndicator,
                                lockPeriod: thisList.props.lockPeriod,
                                unlockPeriod: thisList.props.unlockPeriod,
                                findProjectOfResult: thisList.props.findProjectOfResult
                            })}
                        </tbody>
                    );
                });
            } else {
                // Show a loading icon when the periods have not been loaded yet.
                periods = <tbody className="indicator-period bg-transition">
                    <tr>
                        <td>
                            <i className="fa fa-spin fa-spinner" /> {i18nResults.loading} {i18nResults.indicator_periods}
                        </td>
                    </tr>
                </tbody>;
            }

            var actionCell = isPublic ? <span /> : <td className="th-actions" />;

            return (
                <div className="indicator-period-list selfProject">
                    <h4 className="indicator-periods-title">{i18nResults.indicator_periods}</h4>
                    {this.renderBaseline()}
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <td className="th-period">{i18nResults.period}</td>
                                <td className="th-target">{i18nResults.target_value}</td>
                                <td className="th-actual">{i18nResults.actual_value}</td>
                                {actionCell}
                            </tr>
                        </thead>
                        {periods}
                    </table>
                    {this.renderParentsChildren()}
                </div>
            );
        }
    });

    var MainContent = React.createClass({
        getInitialState: function() {
            return {
                addingNewUpdate: false
            };
        },

        goBack: function() {
            this.props.selectIndicator(null);
        },

        addNewUpdate: function(periodId) {
            // Add a new indicator update.

            // Update state, in order to indicate the loading icon of the button
            this.setState({addingNewUpdate: true});
            var thisApp = this;
            var url = endpoints.base_url + endpoints.updates_and_comments;
            var actualValue = this.props.selectedPeriod.actual_value === '' ? '0' : this.props.selectedPeriod.actual_value;

            // Default data of a new update. Note that we supply a default '0' data, since that
            // field is mandatory.
            var data = JSON.stringify({
                'period': periodId,
                'user': user.id,
                'data': '0',
                'period_actual_value': actualValue
            });

            var success = function(response) {
                // Update state with new indicator update and remove the loading from the button.
                thisApp.props.saveUpdateToPeriod(response, periodId, true);
                thisApp.setState({addingNewUpdate: false});
            };
            apiCall('POST', url, data, success);
        },

        basePeriodSave: function(periodId, data, callback) {
            // Base function for saving a period with a data Object.
            var url = endpoints.base_url + endpoints.period_framework.replace('{period}', periodId);
            var thisApp = this;
            var success = function(response) {
                var period = response;
                var indicatorId = period.indicator;
                thisApp.props.savePeriodToIndicator(period, indicatorId);

                // Call the callback, if not undefined.
                if (callback !== undefined) {
                    callback();
                }
            };
            apiCall('PATCH', url, JSON.stringify(data), success);
        },

        lockPeriod: function(periodId, callback) {
            // Lock a period.
            this.basePeriodSave(periodId, {locked: true}, callback);
        },

        unlockPeriod: function(periodId, callback) {
            // Unlock a period.
            this.basePeriodSave(periodId, {locked: false}, callback);
        },

        showMeasure: function() {
            // Show the measure (next to the result's title) or nothing if not supplied.
            switch(this.props.selectedIndicator.measure) {
                case "1":
                    return ' (' + i18nResults.unit + ')';
                case "2":
                    return ' (' + i18nResults.percentage + ')';
                default:
                    return "";
            }
        },

        render: function() {
            // Render the main content of the results framework.
            // This can be either a list of periods (when no period has been selected, but only an
            // indicator), or a list of indicator updates (when a period has been selected).

            if (this.props.selectedResult !== null && this.props.selectedResult.indicators !== undefined && this.props.selectedResult.indicators.length === 0) {
                var addIndicatorsLink;
                if (isAdmin || isMEManager) {
                    var language = window.location.pathname.substring(0, 3);
                    addIndicatorsLink =
                        <a href={language + "/myrsr/project_editor/" + projectIds.project_id + "/"}>{i18nResults.add_indicators}</a>;
                } else {
                    addIndicatorsLink = <span />;
                }

                return (
                    <div className="noIndicators">
                        {i18nResults.no_indicators} {addIndicatorsLink}
                        <a href="https://akvorsr.supporthero.io/article/show/design-a-results-framework" target="_blank">{i18nResults.more_info}</a>
                    </div>
                );
            } else if (this.props.selectedPeriod !== null) {
                // Show a list of indicator updates.
                return (
                    <div className="indicator-period-container">
                        {React.createElement(IndicatorPeriodMain, {
                            addNewUpdate: this.addNewUpdate,
                            addingNewUpdate: this.state.addingNewUpdate,
                            addEditingData: this.props.addEditingData,
                            removeEditingData: this.props.removeEditingData,
                            editingData: this.props.editingData,
                            saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                            saveFileInUpdate: this.props.saveFileInUpdate,
                            saveCommentInUpdate: this.props.saveCommentInUpdate,
                            removeUpdate: this.props.removeUpdate,
                            selectedIndicator: this.props.selectedIndicator,
                            selectedPeriod: this.props.selectedPeriod,
                            selectPeriod: this.props.selectPeriod,
                            reloadPeriod: this.props.reloadPeriod,
                            lockPeriod: this.lockPeriod,
                            unlockPeriod: this.unlockPeriod
                        })}
                    </div>
                );
            } else if (this.props.selectedIndicator !== null) {
                // Show a list of periods.
                return (
                    <div className="indicator opacity-transition">
                        <h4 className="indicator-title">
                            {this.props.selectedIndicator.title}{this.showMeasure()}
                        </h4>
                        <div className="indicator-description">
                            {this.props.selectedIndicator.description}
                        </div>
                        {React.createElement(IndicatorPeriodList, {
                            selectedIndicator: this.props.selectedIndicator,
                            selectedPeriod: this.props.selectedPeriod,
                            selectPeriod: this.props.selectPeriod,
                            addNewUpdate: this.addNewUpdate,
                            savePeriodToIndicator: this.props.savePeriodToIndicator,
                            lockPeriod: this.lockPeriod,
                            unlockPeriod: this.unlockPeriod,
                            findProjectOfResult: this.props.findProjectOfResult,
                            findResult: this.props.findResult
                        })}
                    </div>
                );
            } else {
                // Nothing selected, leave main content empty.
                return (
                    <span />
                );
            }
        }
    });

    var IndicatorEntry = React.createClass({
        selected: function() {
            // See if this indicator has been selected.
            if (this.props.selectedIndicator !== null) {
                return this.props.selectedIndicator.id === this.props.indicator.id;
            } else {
                return false;
            }
        },

        switchIndicator: function() {
            // When this indicator is clicked, it should be selected.
            this.props.selectIndicator(this.props.indicator.id);
            this.props.selectPeriod(null);
        },

        render: function() {
            // Render an indicator's entry in the sidebar.
            var indicatorClass = "indicator-nav clickable bg-border-transition";
            if (this.selected()) {
                indicatorClass += " active";
            }

            return (
                <div className={indicatorClass} onClick={this.switchIndicator}>
                    <a>
                        <h4>{this.props.indicator.title}</h4>
                    </a>
                </div>
            );
        }
    });

    var ResultEntry = React.createClass({
        expanded: function() {
            // See if this result has been selected. If so, the result should be expanded.
            if (this.props.selectedResult !== null) {
                return this.props.selectedResult.id === this.props.result.id;
            } else {
                return false;
            }
        },

        switchResult: function() {
            // If this result is clicked, it should be selected when it is not yet selected.
            // If it is already selected, then it should be de-selected.
            var thisResult = this.props.result;
            var wasExpanded = this.expanded();

            var resultId = wasExpanded ? null : thisResult.id;
            this.props.selectResult(resultId);

            // When there is an indicator and the result is expanded, select the first indicator.
            if (thisResult.indicators !== undefined && thisResult.indicators.length > 0 && !wasExpanded) {
                this.props.selectIndicator(thisResult.indicators[0].id);
            }
        },

        indicatorText: function() {
            // Depending whether the indicators have been loaded or not (undefined), show a
            // different text in the sidebar.
            if (this.props.result.indicators !== undefined) {
                return this.props.result.indicators.length === 1 ? i18nResults.indicator : i18nResults.indicators;
            } else {
                return i18nResults.indicators;
            }
        },

        renderIndicatorEntries: function() {
            // Every indicator should have separate entry in the sidebar, but they are only visible
            // when the result has been selected (expanded).
            if (this.expanded()) {
                var thisResult = this;

                // Check if the indicators have been loaded already and show an 'IndicatorEntry'
                // for every indicator if so.
                if (this.props.result.indicators !== undefined) {
                    var indicatorEntries = this.props.result.indicators.map(function (indicator) {
                        return (
                            <div key={indicator.id}>
                                {React.createElement(IndicatorEntry, {
                                    indicator: indicator,
                                    selectedIndicator: thisResult.props.selectedIndicator,
                                    selectIndicator: thisResult.props.selectIndicator,
                                    selectPeriod: thisResult.props.selectPeriod
                                })}
                            </div>
                        );
                    });
                    return (
                        <div className="result-nav-full clickable">{indicatorEntries}</div>
                    );
                } else {
                    // Show a loading icon if indicators have not been loaded yet.
                    return (
                        <div className="result-nav-full clickable">
                            <div className="indicator-nav bg-border-transition">
                                <a>
                                    <h4><i className="fa fa-spin fa-spinner" /> {i18nResults.loading} {i18nResults.indicators}</h4>
                                </a>
                            </div>
                        </div>
                    );
                }
            } else {
                // Do not show anything when result is not selected (expanded).
                return (
                    <span />
                );
            }
        },

        renderResultType: function() {
            // Show the result type, if available
            switch (this.props.result.type) {
                case '1':
                    return (
                        <div className="indicatorType">{i18nResults.output}</div>
                    );
                case '2':
                    return (
                        <div className="indicatorType">{i18nResults.outcome}</div>
                    );
                case '3':
                    return (
                        <div className="indicatorType">{i18nResults.impact}</div>
                    );
                case '9':
                    return (
                        <div className="indicatorType">{i18nResults.other}</div>
                    );
                default:
                    return (
                        <div />
                    );
            }
        },

        renderIndicatorCount: function() {
            // Show the number of indicators of a result, or a loading icon.
            var indicatorLength;

            if (this.props.result.indicators === undefined) {
                indicatorLength = <i className="fa fa-spin fa-spinner" />;
            } else {
                indicatorLength = this.props.result.indicators.length;
            }

            if (this.expanded()) {
                // Do not show a text when the result is selected (expanded).
                return (
                    <span />
                );
            } else {
                // Show the number of indicators
                return (
                    <span className="result-indicator-count">
                        <i className="fa fa-tachometer" />
                        <span className="indicator-count inlined">{indicatorLength}</span>
                        <p>{this.indicatorText().toLowerCase()}</p>
                    </span>
                );
            }
        },

        render: function() {
            // Render the result entry in the sidebar.
            var resultNavClass = "result-nav bg-transition";
            resultNavClass += this.expanded() ? " expanded" : "";

            return (
                <div className={resultNavClass} key={this.props.result.id}>
                    <div className="result-nav-summary clickable" onClick={this.switchResult}>
                        <h3 className="result-title">
                            <i className="fa fa-chevron-down" />
                            <i className="fa fa-chevron-up" />
                            <span>{this.props.result.title}</span>
                            {this.renderResultType()}
                        </h3>
                        {this.renderIndicatorCount()}
                    </div>
                    {this.renderIndicatorEntries()}
                </div>
            );
        }
    });

    var SideBar = React.createClass({
        render: function() {
            // Renders the left sidebar of the results framework
            var thisList = this;

            // For every result, a ResultEntry is created
            var resultEntries = this.props.results.map(function (result) {
                return (
                    <div key={result.id}>
                        {React.createElement(ResultEntry, {
                            result: result,
                            selectedResult: thisList.props.selectedResult,
                            selectedIndicator: thisList.props.selectedIndicator,
                            selectResult: thisList.props.selectResult,
                            selectIndicator: thisList.props.selectIndicator,
                            selectPeriod: thisList.props.selectPeriod
                        })}
                    </div>
                );
            });

            if (!this.props.loadingResults) {
                // Show the array of ResultEntry's when results have been loaded
                return (
                    <div className="results-list">
                        {resultEntries}
                    </div>
                );
            } else {
                // Show a loading icon when results are loading
                return (
                    <div className="results-list">
                        <div className="result-nav bg-transition">
                            <div className="result-nav-summary">
                                <i className="fa fa-spin fa-spinner" /> {i18nResults.loading} {i18nResults.results}
                            </div>
                        </div>
                    </div>
                );
            }
        }
    });

    var ResultsApp = React.createClass({
        getInitialState: function() {
            var hash = location.hash,
                defaultResult = null,
                defaultIndicator = null,
                defaultPeriod = null;

            // Retrieve the result / indicator / period that should be opened by default.
            // Specified like #results,12,345,6789 meaning #results,result_id,indicator_id,period_id
            if (hash !== '') {
                hash = hash.substring(1);
                var hashArray = hash.split(',');
                // Remove the 'results' part
                hashArray.splice(0, 1);
                for (var i = 0; i < hashArray.length; i++) {
                    switch(i) {
                        case 0:
                            defaultResult = hashArray[i];
                            break;
                        case 1:
                            defaultIndicator = hashArray[i];
                            break;
                        case 2:
                            defaultPeriod = hashArray[i];
                            break;
                    }
                }
            }

            return {
                loadingResults: true,
                selectedResultId: defaultResult,
                selectedIndicatorId: defaultIndicator,
                selectedPeriodId: defaultPeriod,
                editingData: [],
                results: []
            };
        },

        componentDidMount: function() {
            // Once the component is mounted, load the results through the API
            this.loadResults(projectIds.project_id);
        },

        loadResults: function(projectId) {
            // Load the results through the API, and update the state
            var thisApp = this;
            var success = function(response) {
                thisApp.setState({
                    'results': thisApp.state.results.concat(response.results),
                    'loadingResults': false
                });
                // Load the indicators after the results have been loaded
                thisApp.loadIndicators(projectId);
            };
            apiCall('GET', endpoints.base_url + endpoints.results_of_project.replace('{project}', projectId), '', success);
        },

        loadIndicators: function(projectId) {
            // Load the indicators through the API, and update the state
            var thisApp = this;
            var success = function(response) {
                var indicators = response.results;
                for (var i = 0; i < indicators.length; i++) {
                    var indicator = indicators[i];

                    // For every indicator, find the result it belongs to
                    var result = thisApp.findResult(indicator.result);
                    if (result.indicators === undefined) {
                        result.indicators = [indicator];
                    } else {
                        result.indicators.push(indicator);
                    }
                }

                // In case a result has no indicators, result.indicators will be undefined.
                // Set these to an empty array, so that it's clear that indicators have been loaded.
                // E.g. undefined means "not loaded yet", empty array means "loaded, but not existing"
                for (var j = 0; j < thisApp.state.results.length; j++) {
                    var stateResult = thisApp.state.results[j];
                    if (stateResult.indicators === undefined) {
                        stateResult.indicators = [];
                    }
                }

                // Force the state to update and load periods
                thisApp.forceUpdate();
                thisApp.loadPeriods(projectId);
            };
            apiCall('GET', endpoints.base_url + endpoints.indicators_of_project.replace('{project}', projectId), '', success);
        },

        loadPeriods: function(projectId) {
            // Load the periods through the API, and update the state
            var thisApp = this;
            var success = function(response) {
                var periods = response.results;
                for (var i = 0; i < periods.length; i++) {
                    var period = periods[i];

                    // For every period, find the indicator it belongs to
                    var indicator = thisApp.findIndicator(period.indicator);
                    if (indicator.periods === undefined) {
                        indicator.periods = [period];
                    } else {
                        indicator.periods.push(period);
                    }
                }

                // In case an indicators has no periods, indicator.periods will be undefined.
                // Set these to an empty array, so that it's clear that periods have been loaded.
                // E.g. undefined means "not loaded yet", empty array means "loaded, but not existing"
                for (var j = 0; j < thisApp.state.results.length; j++) {
                    var stateResult = thisApp.state.results[j];
                    for (var k = 0; k < stateResult.indicators.length; k++) {
                        var stateIndicator = stateResult.indicators[k];
                        if (stateIndicator.periods === undefined) {
                            stateIndicator.periods = [];
                        }
                    }
                }

                // Force the state to update and load indicator updates and comments
                thisApp.forceUpdate();
                thisApp.loadDataUpdatesAndComments(projectId);
            };
            apiCall('GET', endpoints.base_url + endpoints.periods_of_project.replace('{project}', projectId), '', success);
        },

        loadDataUpdatesAndComments: function(projectId) {
            // Load the indicator updates and comments through the API, and update the state
            var thisApp = this;
            var success = function(response) {
                var updates = response.results;
                for (var i = 0; i < updates.length; i++) {
                    var update = updates[i];

                    // For every indicator update, find the period it belongs to
                    var period = thisApp.findPeriod(update.period);
                    if (period.data === undefined) {
                        period.data = [update];
                    } else {
                        period.data.push(update);
                    }
                }

                // In case a period has no indicator updates, period.data will be undefined.
                // Set these to an empty array, so that it's clear that indicator updates have been loaded.
                // E.g. undefined means "not loaded yet", empty array means "loaded, but not existing"
                for (var j = 0; j < thisApp.state.results.length; j++) {
                    var stateResult = thisApp.state.results[j];
                    for (var k = 0; k < stateResult.indicators.length; k++) {
                        var stateIndicator = stateResult.indicators[k];
                        for (var l = 0; l < stateIndicator.periods.length; l++) {
                            var statePeriod = stateIndicator.periods[l];
                            if (statePeriod.data === undefined) {
                                statePeriod.data = [];
                            }
                        }
                    }
                }

                // Force the state to update, all data has now been loaded
                thisApp.forceUpdate();
            };
            apiCall('GET', endpoints.base_url + endpoints.updates_and_comments_of_project.replace('{project}', projectId), '', success);
        },

        findProjectOfResult: function(resultId, type) {
            // Find the project belonging to a result.
            // Either the ID or the project's title (depending on 'type').
            var result = this.findResult(resultId);
            return type === 'title' ? result.project_title : result.project;
        },

        findResult: function(resultId) {
            // Find and return the result in the state.
            // If not found, returns null.
            for (var i = 0; i < this.state.results.length; i++) {
                var result = this.state.results[i];
                if (result.id == resultId) {
                    return result;
                }
            }
            return null;
        },

        findIndicator: function(indicatorId) {
            // Find and return the indicator in the state.
            // If not found, returns null.
            for (var i = 0; i < this.state.results.length; i++) {
                var result = this.state.results[i];
                if (result.indicators !== undefined) {
                    for (var j = 0; j < result.indicators.length; j++) {
                        var indicator = result.indicators[j];
                        if (indicator.id == indicatorId) {
                            return indicator;
                        }
                    }
                }
            }
            return null;
        },

        findPeriod: function(periodId) {
            // Find and return the period in the state.
            // If not found, returns null.
            for (var i = 0; i < this.state.results.length; i++) {
                var result = this.state.results[i];
                if (result.indicators !== undefined) {
                    for (var j = 0; j < result.indicators.length; j++) {
                        var indicator = result.indicators[j];
                        if (indicator.periods !== undefined) {
                            for (var k = 0; k < indicator.periods.length; k++) {
                                var period = indicator.periods[k];
                                if (period.id == periodId) {
                                    return period;
                                }
                            }
                        }
                    }
                }
            }
            return null;
        },

        findUpdate: function(updateId) {
            // Find and return the indicator update in the state.
            // If not found, returns null.
            for (var i = 0; i < this.state.results.length; i++) {
                var result = this.state.results[i];
                if (result.indicators !== undefined) {
                    for (var j = 0; j < result.indicators.length; j++) {
                        var indicator = result.indicators[j];
                        if (indicator.periods !== undefined) {
                            for (var k = 0; k < indicator.periods.length; k++) {
                                var period = indicator.periods[k];
                                if (period.data !== undefined) {
                                    for (var l = 0; l < period.data.length; l++) {
                                        var update = period.data[l];
                                        if (update.id == updateId) {
                                            return update;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return null;
        },

        savePeriodToIndicator: function(period, indicatorId) {
            // Save a period to an indicator
            var indicator = this.findIndicator(indicatorId);

            if (indicator !== null) {
                var periodsList = indicator.periods;

                // See if indicator already has a period with same ID
                for (var l = 0; l < indicator.periods.length; l++) {
                    var oldPeriod = indicator.periods[l];
                    if (oldPeriod.id == period.id) {
                        // Remove old period in this case
                        periodsList.splice(l, 1);
                        break;
                    }
                }

                // Insert new period and force an update to the state
                periodsList.push(period);
                this.forceUpdate();
            }
        },

        saveUpdateToPeriod: function(update, periodId, newUpdate) {
            // Save an indicator update to a period
            var period = this.findPeriod(periodId);

            if (period !== null) {
                var periodDataList = period.data;

                // See if period already has an indicator update with same ID
                for (var l = 0; l < period.data.length; l++) {
                    var dataUpdate = period.data[l];
                    if (dataUpdate.id == update.id) {
                        // Remove old indicator update in this case
                        periodDataList.splice(l, 1);
                        break;
                    }
                }

                // In case of a new update, set it to editing mode
                if (newUpdate) {
                    this.addEditingData(update.id);
                }

                // Insert new indicator update and force an update to the state
                periodDataList.push(update);
                this.forceUpdate();
            }
        },

        saveFileInUpdate: function(file, updateId, fileType) {
            // Save a file in the update
            var update = this.findUpdate(updateId);

            if (update !== null) {
                // A file can be either a 'photo' or 'file'
                if (fileType === 'photo') {
                    update.photo_url = file;
                    this.forceUpdate();
                } else if (fileType === 'file') {
                    update.file_url = file;
                    this.forceUpdate();
                }
            }
        },

        saveCommentInUpdate: function(comment, updateId) {
            // Add a comment to an indicator update
            // Since it's not possible to edit or delete comments, only adding comments is enough
            var update = this.findUpdate(updateId);

            if (update !== null) {
                update.comments.push(comment);
                this.forceUpdate();
            }
        },

        removeUpdate: function(updateId) {
            // Delete an indicator update and reload the period
            var update = this.findUpdate(updateId);
            var periodId = update.period;
            var url = endpoints.base_url + endpoints.update_and_comments.replace('{update}', updateId);

            // Reload the period
            var thisApp = this;
            var success = function() {
                thisApp.reloadPeriod(periodId);
            };
            apiCall('DELETE', url, '', success);
        },

        reloadPeriod: function(periodId) {
            // Reload a period
            var url = endpoints.base_url + endpoints.period_framework.replace('{period}', periodId);
            var thisApp = this;
            var success = function(response) {
                var period = response;
                var indicatorId = period.indicator;
                thisApp.savePeriodToIndicator(period, indicatorId);
            };
            apiCall('GET', url, '', success);
        },

        selectResult: function(resultId) {
            // Keep track in the state which result has been selected
            this.setState({
                selectedResultId: resultId,
                selectedPeriodId: null
            });
        },

        selectIndicator: function(indicatorId) {
            // Keep track in the state which indicator has been selected
            this.setState({selectedIndicatorId: indicatorId});

            // Update the window's hash
            if (indicatorId !== null) {
                var indicator = this.findIndicator(indicatorId);
                var resultId = indicator.result;
                window.location.hash = 'results,' + resultId + ',' + indicatorId;

                // Wait 1s, then smoothly scroll to top
                window.setTimeout(function() {
                    if (document.getElementById('projectMenu')) {
                        // Project page
                        smoothScroll.animateScroll('#projectMenu');
                    } else if (document.getElementById('resultProjectTitle')) {
                        // MyRSR
                        smoothScroll.animateScroll('#resultProjectTitle');
                    }
                }, 1000);
            } else {
                window.location.hash = '';
            }
        },

        selectPeriod: function(periodId) {
            // Keep track in the state which period has been selected
            this.setState({selectedPeriodId: periodId});

            // Update the window's hash
            var windowHashArray = window.location.hash.split(',');
            if (periodId === null && windowHashArray.length === 4) {
                windowHashArray.pop();
                windowHashArray[0] = windowHashArray[0].substr(1);
                window.location.hash = windowHashArray.join(',');
            } else if (periodId !== null) {
                var resultId = this.state.selectedResultId;
                var indicatorId = this.state.selectedIndicatorId;
                window.location.hash = 'results,' + resultId + ',' + indicatorId + ',' + periodId;
            }
        },

        selectedResult: function() {
            // Find the selected result
            return this.findResult(this.state.selectedResultId);
        },

        selectedIndicator: function() {
            // Find the selected indicator
            return this.findIndicator(this.state.selectedIndicatorId);
        },

        selectedPeriod: function() {
            // Find the selected indicator
            return this.findPeriod(this.state.selectedPeriodId);
        },

        addEditingData: function(updateId) {
            // Update the state to add an indicator update which is in editing mode
            var editingDataList = this.state.editingData;
            editingDataList.push(updateId);
            this.setState({editingData: editingDataList});
        },

        removeEditingData: function(updateId) {
            // Update the state to remove an indicator update which is in editing mode
            var editingDataList = this.state.editingData;
            editingDataList.splice(editingDataList.indexOf(updateId), 1);
            this.setState({editingData: editingDataList});
        },

        render: function() {
            // Render the complete results framework, including a sidebar on the left and a main
            // panel in the rest of the screen
            return (
                <div className="results">
                    <article>
                        <div className="results-container">
                            <div className="sidebar">
                                <div className="result-nav-header">
                                    <h3>{i18nResults.results}</h3>
                                </div>
                                {React.createElement(
                                    SideBar, {
                                        results: this.state.results,
                                        loadingResults: this.state.loadingResults,
                                        selectedResult: this.selectedResult(),
                                        selectedIndicator: this.selectedIndicator(),
                                        selectResult: this.selectResult,
                                        selectIndicator: this.selectIndicator,
                                        selectPeriod: this.selectPeriod
                                    }
                                )}
                            </div>
                            <div className="indicator-container">
                                {React.createElement(
                                    MainContent, {
                                        addEditingData: this.addEditingData,
                                        removeEditingData: this.removeEditingData,
                                        editingData: this.state.editingData,
                                        saveUpdateToPeriod: this.saveUpdateToPeriod,
                                        savePeriodToIndicator: this.savePeriodToIndicator,
                                        saveFileInUpdate: this.saveFileInUpdate,
                                        saveCommentInUpdate: this.saveCommentInUpdate,
                                        removeUpdate: this.removeUpdate,
                                        reloadPeriod: this.reloadPeriod,
                                        selectedIndicator: this.selectedIndicator(),
                                        selectIndicator: this.selectIndicator,
                                        selectedPeriod: this.selectedPeriod(),
                                        selectPeriod: this.selectPeriod,
                                        findProjectOfResult: this.findProjectOfResult,
                                        findResult: this.findResult,
                                        selectedResult: this.selectedResult()
                                    }
                                )}
                            </div>
                        </div>
                    </article>
                </div>
            );
        }
    });

    // Initialize the 'My results' app
    ReactDOM.render(
        React.createElement(ResultsApp),
        document.getElementById('results-framework')
    );
}

var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function initSmoothScroll() {
        smoothScroll.init({updateURL: false});
        initReact();
    }

    function loadSmoothScroll() {
        var smoothScrollSrc = document.getElementById('smooth-scroll').src;
        loadJS(smoothScrollSrc, initSmoothScroll, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, loadSmoothScroll, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints, translations and project IDs
    isPublic = JSON.parse(document.getElementById('settings').innerHTML).public;
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18nResults = JSON.parse(document.getElementById('translation-texts').innerHTML);
    months = JSON.parse(document.getElementById('months').innerHTML);
    projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

    if (!isPublic) {
        getUserData();
    }

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof smoothScroll !== 'undefined') {
        smoothScroll.init({updateURL: false});
        initReact();
    } else {
        loadAndRenderReact();
    }
});
