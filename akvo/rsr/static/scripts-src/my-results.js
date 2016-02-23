/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var csrftoken, endpoints, i18n, isAdmin, months, permissions, projectIds, user;

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
            var response = xmlHttp.responseText !== '' ? JSON.parse(xmlHttp.responseText) : '';
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
                var message = i18n.general_error + ': ';
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
            showGeneralError(i18n.connection_error);
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
    return i18n.unknown_date;
}

var CommentEntry = React.createClass({displayName: 'CommentEntry',
    render: function() {
        var comment = this.props.comment;
        var user = comment.user_details;
        return (
            React.DOM.div( {className:"row"}, 
                React.DOM.div( {className:"col-xs-12 comment-header"}, 
                    user.first_name, " ", user.last_name, " ", displayDate(comment.created_at)
                ),
                React.DOM.div( {className:"col-xs-12 comment-text"}, 
                    comment.comment
                )
            )
        );
    }
});

var UpdateEntry = React.createClass({displayName: 'UpdateEntry',
    getInitialState: function() {
        var updateData = this.props.update.data === '0' ? '' : this.props.update.data;

        return {
            data: updateData,
            description: this.props.update.text,
            isRelative: this.props.update.relative_data,
            comment: '',
            askRemove: false
        };
    },

    editing: function() {
        return this.props.editingData.indexOf(this.props.update.id) > -1;
    },

    baseSave: function(data, keepEditing, reloadPeriod) {
        var url = endpoints.base_url + endpoints.update_and_comments.replace('{update}', this.props.update.id);
        var thisApp = this;
        var success = function(response) {
            var update = response;
            var periodId = thisApp.props.selectedPeriod.id;
            thisApp.props.saveUpdateToPeriod(update, periodId);
            if (!keepEditing) {
                thisApp.props.removeEditingData(update.id);
            }
            if (reloadPeriod) {
                thisApp.props.reloadPeriod('self', periodId);
            }
        };
        apiCall('PATCH', url, JSON.stringify(data), success);
    },

    saveUpdate: function() {
        var status = this.props.update.status !== 'N' ? this.props.update.status : 'D';
        this.baseSave({
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': status
        }, false, false);
    },

    askForApproval: function() {
        this.baseSave({
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': 'P'
        }, false, false);
    },

    approve: function() {
        this.baseSave({
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': 'A'
        }, false, true);
    },

    returnForRevision: function() {
        this.baseSave({
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': 'R'
        }, false, false);
    },

    removePhoto: function() {
        this.baseSave({'photo': ''}, true, false);
    },

    removeFile: function() {
        this.baseSave({'file': ''}, true, false);
    },

    baseUpload: function(file, type) {
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
            }
        };
        xmlHttp.send(formData);
    },

    uploadImage: function(e) {
        var file = e.target.files[0];
        this.baseUpload(file, 'photo');
    },

    uploadFile: function(e) {
        var file = e.target.files[0];
        this.baseUpload(file, 'file');
    },

    addComment: function() {
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
            thisApp.setState({comment: ''});
        };
        apiCall('POST', url, data, success);
    },

    removeUpdate: function() {
        this.props.removeUpdate(this.props.update.id);
    },

    switchAskRemove: function() {
        this.setState({askRemove: !this.state.askRemove});
    },

    switchEdit: function() {
        var addEdit = this.props.addEditingData;
        var removeEdit = this.props.removeEditingData;
        var updateId = this.props.update.id;

        if (this.editing()) {
            if (this.props.update.status === 'N') {
                this.removeUpdate();
            } else {
                removeEdit(updateId);
            }
        } else {
            addEdit(updateId);
        }
    },

    handleDataChange: function(e) {
        this.setState({data: e.target.value});
    },

    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    handleRelativeChange: function(e) {
        if (this.state.isRelative) {
            this.setState({isRelative: false});
        } else {
            this.setState({isRelative: true});
        }
    },

    renderUpdateClass: function() {
        var updateClass = "row update-entry-container";
        if (this.editing()) {
            updateClass += " edit-in-progress";
        }
        return updateClass;
    },

    renderHeader: function() {
        var headerLeft;

        if (this.editing()) {
            headerLeft = React.DOM.div( {className:"col-xs-9"}, 
                React.DOM.span( {className:"edit-update"}, i18n.edit_update)
            );
        } else {
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
                    organisations_display = ' | ' + approved_organisations[0].long_name + ' ' + i18n.and + ' ' + (approved_organisations.length - 1).toString() + ' ' + i18n.others;
                    break;
            }
            headerLeft = React.DOM.div( {className:"col-xs-9"}, 
                React.DOM.span( {className:"update-user"}, this.props.update.user_details.first_name, " ", this.props.update.user_details.last_name),
                React.DOM.span( {className:"update-user-organisation"}, organisations_display),
                React.DOM.span( {className:"update-created-at"}, displayDate(this.props.update.created_at))
            );
        }

        return (
            React.DOM.div( {className:"row update-entry-container-header"}, 
                headerLeft,
                React.DOM.div( {className:"col-xs-3 text-right"}, 
                    React.DOM.span( {className:"update-status"},  " ", this.props.update.status_display)
                )
            )
        );
    },

    renderActualRelative: function(label) {
        var periodActualValue = parseFloat(this.props.update.period_actual_value);
        var originalData = parseFloat(this.state.data);
        var updateData = this.state.isRelative ? periodActualValue + originalData : originalData;
        var relativeData = this.state.isRelative ? originalData : updateData - periodActualValue;

        if (isNaN(updateData) || isNaN(relativeData)) {
            return (
                React.DOM.div( {className:"upActualValue"}, 
                    React.DOM.span( {className:"update-actual-value-text"}, label,": " ),
                    React.DOM.span( {className:"update-actual-value-data"}, this.state.data),React.DOM.br(null)
                )
            );
        } else {
            var relativeDataText = relativeData >= 0 ? periodActualValue.toString() + '+' + relativeData.toString() : periodActualValue.toString() + relativeData.toString();
            return (
                React.DOM.div( {className:"upActualValue"}, 
                    React.DOM.span( {className:"update-actual-value-text"}, label,": " ),
                    React.DOM.span( {className:"update-actual-value-data"}, updateData, " " ),
                    React.DOM.span( {className:"update-relative-value"}, "(",relativeDataText,")")
                )
            );
        }
    },

    renderActual: function() {
        var inputId = "actual-input-" + this.props.update.id;
        //var checkboxId = "relative-checkbox-" + this.props.update.id;
        //var checkbox;
        //if (this.state.isRelative) {
        //    checkbox = <label><input type="checkbox" id={checkboxId} onChange={this.handleRelativeChange} checked /> {i18n.relative_data}</label>;
        //} else {
        //    checkbox = <label><input type="checkbox" id={checkboxId} onChange={this.handleRelativeChange} /> {i18n.relative_data}</label>;
        //}

        if (this.editing()) {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-6"}, 
                        React.DOM.label( {htmlFor:inputId}, i18n.add_to_actual_value),
                        React.DOM.input( {className:"form-control", id:inputId, defaultValue:this.state.data, onChange:this.handleDataChange, placeholder:i18n.input_placeholder} )
                    ),
                    React.DOM.div( {className:"col-xs-6"}, 
                        this.renderActualRelative(i18n.new_total_value)
                    )
                )
            );
        } else {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-12"}, 
                        this.renderActualRelative(i18n.total_value_after_update)
                    )
                )
            );
        }
    },

    renderDescription: function() {
        var inputId = "description-input-" + this.props.update.id;
        var photoPart, descriptionPart, descriptionClass;

        if (this.props.update.photo_url === "") {
            photoPart = React.DOM.span(null );
            descriptionClass = "update-description";
        } else {
            if (this.editing()) {
                photoPart = React.DOM.div( {className:"col-xs-3 update-photo"}, 
                    React.DOM.img( {src:endpoints.base_url + this.props.update.photo_url, onClick:this.removePhoto} )
                );
            } else {
                photoPart = React.DOM.div( {className:"col-xs-3 update-photo"}, 
                    React.DOM.img( {src:endpoints.base_url + this.props.update.photo_url})
                );
            }
            descriptionClass = "col-xs-7 update-description";
        }

        if (this.editing()) {
            descriptionPart = React.DOM.div( {className:descriptionClass}, 
                React.DOM.label( {htmlFor:inputId}, i18n.actual_value_comment),
                React.DOM.textarea( {className:"form-control", id:inputId, defaultValue:this.props.update.text, onChange:this.handleDescriptionChange, placeholder:i18n.comment_placeholder} )
            );
        } else {
            descriptionPart = React.DOM.div( {className:descriptionClass}, 
                this.props.update.text
            );
        }

        return (
            React.DOM.div( {className:""}, 
                photoPart,
                descriptionPart
            )
        );
    },

    fileNameDisplay: function() {
        if (this.props.update.file_url !== '') {
            return decodeURIComponent(this.props.update.file_url.split('/').pop());
        } else {
            return '';
        }
    },

    renderFileUpload: function() {
        if (this.editing()) {
            var fileUpload;
            var labelText = this.props.update.photo_url === "" ? i18n.add_image : i18n.change_image;

            if (this.props.update.file_url !== '') {
                fileUpload = React.DOM.div( {className:"col-xs-6"}, 
                    React.DOM.i( {className:"fa fa-paperclip"}), " ", React.DOM.a( {href:this.props.update.file_url, target:"_blank"}, this.fileNameDisplay()),
                    React.DOM.a( {onClick:this.removeFile},  " Remove")
                );
            } else {
                fileUpload = React.DOM.div( {className:"col-xs-3"}, 
                    React.DOM.label( {className:"fileUpload"}, 
                        React.DOM.input( {type:"file", onChange:this.uploadFile} ),
                        React.DOM.a(null, React.DOM.i( {className:"fa fa-paperclip"}), " ", i18n.attach_file)
                    )
                );
            }

            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-3"}, 
                        React.DOM.label( {className:"imageUpload"}, 
                            React.DOM.input( {type:"file", accept:"image/*", onChange:this.uploadImage} ),
                            React.DOM.a(null, React.DOM.i( {className:"fa fa-camera"}), " ", labelText)
                        )
                    ),
                    fileUpload
                )
            );
        } else if (this.props.update.file_url !== '') {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-6"}, 
                        React.DOM.i( {className:"fa fa-paperclip"}), " ", React.DOM.a( {href:this.props.update.file_url, target:"_blank"}, this.fileNameDisplay())
                    )
                )
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    renderComments: function() {
        var comments;

        if (this.props.update.comments !== undefined) {
            comments = this.props.update.comments.map(function(comment) {
                return (
                    React.DOM.div( {className:"comment", key:comment.id}, 
                        React.createElement(CommentEntry, {
                            comment: comment
                        })
                    )
                );
            });
        } else {
            comments = React.DOM.div( {className:"comment"}, 
                React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.loading, " ", i18n.comments
            );
        }

        var inputId = "new-comment-" + this.props.update.id;
        var addComments = this.props.update.status !== 'A';
        var addCommentInput;

        if (addComments) {
            addCommentInput = React.DOM.div(null, 
                React.DOM.div( {className:"input-group"}, 
                    React.DOM.input( {className:"form-control", value:this.state.comment, id:inputId, placeholder:i18n.add_comment_placeholder, onChange:this.handleCommentChange} ),
                    React.DOM.span( {className:"input-group-btn"},          
                        React.DOM.button( {onClick:this.addComment, type:"submit", className:"btn btn-default"}, i18n.add_comment)
                    ) 
                )
            );
        } else {
            addCommentInput = React.DOM.span(null );
        }

        return (
            React.DOM.div( {className:"comments"}, 
                comments,
                addCommentInput
            )
        );
    },

    renderFooter: function() {
        if (this.props.selectedPeriod.locked) {
            return (
                React.DOM.span(null )
            );
        } else if (this.state.askRemove) {
            return (
                React.DOM.div( {className:"menuAction"}, 
                    React.DOM.ul( {className:"nav-pills bottomRow navbar-right"}, 
                        React.DOM.li( {role:"presentation", className:"cancelUpdate"}, 
                            i18n.delete_confirmation
                        ),
                        React.DOM.li( {role:"presentation", className:"removeUpdateConfirm"}, 
                            React.DOM.a( {onClick:this.removeUpdate, className:"btn btn-default btn-xs"}, i18n.yes)
                        ),
                        React.DOM.li( {role:"presentation", className:"removeUpdateCancel"}, 
                            React.DOM.a( {onClick:this.switchAskRemove, className:"btn btn-default btn-xs"}, i18n.no)
                        )
                    )
                )
            );
        } else if (this.editing()) {
            switch(this.props.update.status) {
                case 'P':
                    return (
                        React.DOM.div( {className:"menuAction"}, 
                            React.DOM.div( {role:"presentation", className:"removeUpdate"}, 
                                React.DOM.a( {onClick:this.switchAskRemove, className:"btn btn-default btn-xs"}, i18n.delete)
                            ),
                            React.DOM.ul( {className:"nav-pills bottomRow navbar-right"}, 
                                React.DOM.li( {role:"presentation", className:"cancelUpdate"}, 
                                    React.DOM.a( {onClick:this.switchEdit, className:"btn btn-link btn-xs"}, i18n.cancel)
                                ),
                                React.DOM.li( {role:"presentation", className:"saveUpdate"}, 
                                    React.DOM.a( {onClick:this.saveUpdate, className:"btn btn-default btn-xs"}, i18n.save)
                                ),
                                React.DOM.li( {role:"presentation", className:"approveUpdate"}, 
                                    React.DOM.a( {onClick:this.approve, className:"btn btn-default btn-xs"}, i18n.approve)
                                )
                            )
                        )
                    );
                default:
                    return (
                        React.DOM.div( {className:"menuAction"}, 
                            React.DOM.div( {role:"presentation", className:"removeUpdate"}, 
                                React.DOM.a( {onClick:this.switchAskRemove, className:"btn btn-default btn-xs"}, i18n.delete)
                            ),
                            React.DOM.ul( {className:"nav-pills bottomRow navbar-right"}, 
                                React.DOM.li( {role:"presentation", className:"cancelUpdate"}, 
                                    React.DOM.a( {onClick:this.switchEdit, className:"btn btn-link btn-xs"}, i18n.cancel)
                                ),
                                React.DOM.li( {role:"presentation", className:"saveUpdate"}, 
                                    React.DOM.a( {onClick:this.saveUpdate, className:"btn btn-default btn-xs"}, i18n.save)
                                ),
                                React.DOM.li( {role:"presentation", className:"submitUpdate"}, 
                                    React.DOM.a( {onClick:this.askForApproval, className:"btn btn-default btn-xs"}, i18n.submit_for_approval)
                                )
                            )                        
                        )
                    );
            }
        } else {
            switch(this.props.update.status) {
                case 'P':
                    if (isAdmin) {
                        return (
                            React.DOM.div( {className:"menuAction"}, 
                                React.DOM.ul( {className:"nav-pills bottomRow navbar-right"}, 
                                    React.DOM.li( {role:"presentation", className:"returnUpdate"}, 
                                        React.DOM.a( {onClick:this.returnForRevision, className:"btn btn-default btn-xs"}, i18n.return_for_revision)
                                    ),
                                    React.DOM.li( {role:"presentation", className:"editUpdate"}, 
                                        React.DOM.a( {onClick:this.switchEdit, className:"btn btn-default btn-xs"}, i18n.edit_update)
                                    ),
                                    React.DOM.li( {role:"presentation", className:"approveUpdate"}, 
                                        React.DOM.a( {onClick:this.approve, className:"btn btn-default btn-xs"}, i18n.approve)
                                    )
                                )
                            )
                        );
                    } else {
                        return (
                            React.DOM.span(null )
                        );
                    }
                    break;
                case 'A':
                    return (
                        React.DOM.span(null )
                    );
                default:
                    if (this.props.update.user === user.id || isAdmin) {
                        return (
                            React.DOM.div( {className:"menuAction"}, 
                                React.DOM.ul( {className:"nav-pills bottomRow navbar-right"}, 
                                    React.DOM.li( {role:"presentation", className:"editUpdate"}, 
                                        React.DOM.a( {onClick:this.switchEdit, className:"btn btn-default btn-xs"}, i18n.edit_update)
                                    )
                                )
                            )
                        );
                    } else {
                        return (
                            React.DOM.span(null )
                        );
                    }
            }
        }
    },

    render: function() {
        return (
            React.DOM.div( {className:this.renderUpdateClass()}, 
                React.DOM.div( {className:"col-xs-12"}, 
                    this.renderHeader(),
                    this.renderActual(),
                    this.renderDescription(),
                    this.renderFileUpload(),
                    this.renderComments(),
                    this.renderFooter()
                )
            )
        );
    }
});

var UpdatesList = React.createClass({displayName: 'UpdatesList',
    sortedUpdates: function() {
        function compare(u1, u2) {
            if (u1.created_at > u2.created_at) {
                return -1;
            } else if (u1.created_at < u2.created_at) {
                return 1;
            } else {
                return 0;
            }
        }
        return this.props.selectedPeriod.data.sort(compare);
    },

    render: function() {
        var thisList = this,
            updates;

        if (this.props.selectedPeriod.data !== undefined) {
            updates = this.sortedUpdates().map(function (update) {
                return (
                    React.DOM.div( {className:"update-container", key:update.id}, 
                        React.createElement(UpdateEntry, {
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
                        })
                    )
                );
            });
        } else {
            updates = React.DOM.div(null, 
                React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.loading, " ", i18n.updates
            );
        }

        var updatesHeader;
        if (this.props.selectedPeriod.data === undefined || this.props.selectedPeriod.data.length > 0) {
            updatesHeader = React.DOM.h5(null, i18n.updates);
        } else {
            updatesHeader = React.DOM.h5(null, i18n.no_updates_yet);
        }

        return (
            React.DOM.div( {className:"updates-container"}, 
                updatesHeader,
                updates
            )
        );
    }
});

var IndicatorPeriodMain = React.createClass({displayName: 'IndicatorPeriodMain',
    getInitialState: function() {
        return {
            actualValueHover: false
        };
    },

    handleMouseOver: function() {
        this.setState({actualValueHover: true});
    },

    handleMouseOut: function() {
        this.setState({actualValueHover: false});
    },

    addNewUpdate: function() {
        this.props.addNewUpdate(this.props.selectedPeriod.id);
    },

    unlockPeriod: function() {
        this.props.unlockPeriod('self', this.props.selectedPeriod.id);
    },

    renderNewUpdate: function() {
        if (this.props.addingNewUpdate) {
            return (
                React.DOM.div( {className:"new-update"}, 
                    React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.adding_update
                )
            );
        } else if (!this.props.selectedPeriod.locked) {
            if (this.props.selectedPeriod.data !== undefined) {
                return (
                    React.DOM.div( {className:"new-update"}, 
                        React.DOM.a( {onClick:this.addNewUpdate, className:"btn btn-sm btn-default"}, React.DOM.i( {className:"fa fa-plus"} ), " ", i18n.new_update)
                    )
                );
            } else {
                return (
                    React.DOM.div( {className:"new-update"})
                );
            }
        } else if (isAdmin) {
            return (
                React.DOM.div( {className:"new-update"}, 
                    React.DOM.a( {onClick:this.unlockPeriod, className:"btn btn-sm btn-default"}, React.DOM.i( {className:"fa fa-unlock-alt"} ), " ", i18n.unlock_period)
                )
            );
        } else {
            return (
                React.DOM.div( {className:"new-update"})
            );
        }

    },

    renderTargetComment: function() {
        if (this.props.selectedPeriod.target_comment !== '') {
            return (
                React.DOM.div( {className:"period-target-comment"}, 
                    i18n.target_comment,
                    React.DOM.span(null, this.props.selectedPeriod.target_comment)
                )
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    renderTargetValue: function() {
        var targetValue = this.props.selectedPeriod.target_value;
        if (this.props.selectedIndicator.measure === '2' && targetValue !== '') {
            targetValue += '%';
        }
        return targetValue;
    },

    renderActualValue: function() {
        var actualValue = this.props.selectedPeriod.actual_value;
        if (this.props.selectedIndicator.measure === '2' && actualValue !== '') {
            actualValue += '%';
        }
        return actualValue;
    },

    renderPercentageComplete: function() {
        if (this.props.selectedPeriod.percent_accomplishment !== null && this.props.selectedIndicator.measure !== '2') {
            return (
                React.DOM.span( {className:"percentage-complete"},  " (",this.props.selectedPeriod.percent_accomplishment,"%)")
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    render: function() {
        var hover = this.state.actualValueHover ? React.DOM.div( {className:"result-tooltip fade top in", role:"tooltip"}, React.DOM.div( {className:"tooltip-arrow"}),React.DOM.div( {className:"tooltip-inner"}, i18n.actual_value_info)) : React.DOM.span(null );

        return (
            React.DOM.div( {className:"indicator-period opacity-transition"}, 
                React.DOM.div( {className:"indicTitle"}, 
                        React.DOM.h4( {className:"indicator-title"}, 
                            i18n.indicator_period,": ", displayDate(this.props.selectedPeriod.period_start), " - ", displayDate(this.props.selectedPeriod.period_end)
                        ),
                    this.renderNewUpdate()
                ),
                React.DOM.div( {className:"period-target-actual"}, 
                    React.DOM.div( {className:"periodValues"}, 
                        React.DOM.div( {className:"period-target"}, 
                            i18n.target_value,
                            React.DOM.span(null, this.renderTargetValue())
                        ),
                        React.DOM.div( {className:"period-actual"}, 
                            i18n.actual_value,React.DOM.div( {className:"badge", onMouseOver:this.handleMouseOver, onMouseOut:this.handleMouseOut}, "i"),
                            React.DOM.span( {className:"actualValueSpan"}, 
                                React.DOM.span(null, this.renderActualValue()),
                                this.renderPercentageComplete()
                            ),
                             hover
                        ),
                        this.renderTargetComment()
                    ),
                    React.createElement(UpdatesList, {
                        addEditingData: this.props.addEditingData,
                        removeEditingData: this.props.removeEditingData,
                        editingData: this.props.editingData,
                        saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                        saveFileInUpdate: this.props.saveFileInUpdate,
                        saveCommentInUpdate: this.props.saveCommentInUpdate,
                        removeUpdate: this.props.removeUpdate,
                        selectedPeriod: this.props.selectedPeriod,
                        selectPeriod: this.props.selectPeriod,
                        reloadPeriod: this.props.reloadPeriod
                    })
                )
            )
        );
    }
});

var IndicatorPeriodEntry = React.createClass({displayName: 'IndicatorPeriodEntry',
    getInitialState: function() {
        return {
            hover: false
        };
    },

    selected: function() {
        if (this.props.selectedPeriod !== null) {
            return this.props.selectedPeriod.id === this.props.period.id;
        } else {
            return false;
        }
    },

    relation: function() {
        if (this.props.parent) {
            return 'parent';
        } else if (this.props.child) {
            return 'children';
        } else {
            return 'self';
        }
    },

    numberOfPendingUpdates: function() {
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
        this.setState({hover: true});
    },

    handleMouseOut: function() {
        this.setState({hover: false});
    },

    lockPeriod: function() {
        this.props.lockPeriod(this.relation(), this.props.period.id);
    },

    unlockPeriod: function() {
        this.props.unlockPeriod(this.relation(), this.props.period.id);
    },

    switchPeriod: function() {
        var periodId = this.selected() ? null : this.props.period.id;
        this.props.selectPeriod(periodId);
    },

    renderPeriodDisplay: function() {
        var periodDisplay = displayDate(this.props.period.period_start) + ' - ' + displayDate(this.props.period.period_end);
        var nrPendingUpdates = this.numberOfPendingUpdates();
        var pendingUpdates = nrPendingUpdates > 0 ? React.DOM.span( {className:"badge", onMouseOver:this.handleMouseOver, onMouseOut:this.handleMouseOut}, nrPendingUpdates) : React.DOM.span(null );
        var hover = this.state.hover ? React.DOM.div( {className:"result-tooltip fade top in", role:"tooltip"}, React.DOM.div( {className:"tooltip-arrow"}),React.DOM.div( {className:"tooltip-inner"}, i18n.number_of_pending_updates)) : React.DOM.span(null );

        if (this.props.period.data === undefined) {
            return (
                React.DOM.td( {className:"period-td"}, 
                    periodDisplay, " ", React.DOM.i( {className:"fa fa-spin fa-spinner"} )
                )
            );
        } else if (this.props.period.data.length === 0) {
            return (
                React.DOM.td( {className:"period-td"}, 
                    periodDisplay
                )
            );
        } else {
            if (this.props.parent || this.props.child) {
                var projectId = this.props.findProjectOfResult(this.relation(), this.props.selectedIndicator.result);
                return (
                    React.DOM.td( {className:"period-td"}, 
                        React.DOM.a( {href:"/myrsr/results/" + projectId + "/#" + this.props.selectedIndicator.result + "," + this.props.selectedIndicator.id + "," + this.props.period.id }, 
                            periodDisplay
                        ), " ", pendingUpdates, " ", hover
                    )
                );
            } else {
                return (
                    React.DOM.td( {className:"period-td"}, 
                        React.DOM.a( {onClick:this.switchPeriod}, 
                            periodDisplay
                        ), " ", pendingUpdates, " ", hover
                    )
                );
            }
        }
    },

    renderActions: function() {
        var projectId;

        if (isAdmin) {
            switch(this.props.period.locked) {
                case false:
                    if (this.props.parent || this.props.child) {
                        projectId = this.props.findProjectOfResult(this.relation(), this.props.selectedIndicator.result);
                        return (
                            React.DOM.td( {className:"actions-td"}, 
                                React.DOM.a( {href:"/myrsr/results/" + projectId + "/#" + this.props.selectedIndicator.result + "," + this.props.selectedIndicator.id + "," + this.props.period.id }, i18n.update), " | ", React.DOM.a( {onClick:this.lockPeriod}, i18n.lock_period)
                            )
                        );
                    } else {
                        return (
                            React.DOM.td( {className:"actions-td"}, 
                                React.DOM.a( {onClick:this.switchPeriod}, i18n.update), " | ", React.DOM.a( {onClick:this.lockPeriod}, i18n.lock_period)
                            )
                        );
                    }
                    break;
                default:
                    return (
                        React.DOM.td( {className:"actions-td"}, 
                            React.DOM.a( {onClick:this.unlockPeriod}, i18n.unlock_period)
                        )
                    );
            }
        } else {
            switch(this.props.period.locked) {
                case false:
                    if (this.props.parent || this.props.child) {
                        projectId = this.props.findProjectOfResult(this.relation(), this.props.selectedIndicator.result);
                        return (
                            React.DOM.td( {className:"actions-td"}, 
                                React.DOM.a( {href:"/myrsr/results/" + projectId + "/#" + this.props.selectedIndicator.result + "," + this.props.selectedIndicator.id + "," + this.props.period.id }, i18n.update)
                            )
                        );
                    } else {
                        return (
                            React.DOM.td( {className:"actions-td"}, 
                                React.DOM.a( {onClick:this.switchPeriod}, i18n.update)
                            )
                        );
                    }
                    break;
                default:
                    return (
                        React.DOM.td( {className:"actions-td"}, 
                            React.DOM.i( {className:"fa fa-lock"} ), " ", i18n.period_locked
                        )
                    );
            }
        }
    },

    renderTargetValue: function() {
        var targetValue = this.props.period.target_value;
        if (this.props.selectedIndicator.measure === '2' && targetValue !== '') {
            targetValue += '%';
        }
        return targetValue;
    },

    renderActualValue: function() {
        var actualValue = this.props.period.actual_value;
        if (this.props.selectedIndicator.measure === '2' && actualValue !== '') {
            actualValue += '%';
        }
        return actualValue;
    },

    renderPercentageComplete: function() {
        if (this.props.period.percent_accomplishment !== null && this.props.selectedIndicator.measure !== '2') {
            return (
                React.DOM.span( {className:"percentage-complete"},  " (",this.props.period.percent_accomplishment,"%)")
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    render: function() {
        return (
            React.DOM.tr(null, 
                this.renderPeriodDisplay(),
                React.DOM.td( {className:"target-td"}, 
                    this.renderTargetValue()
                ),
                React.DOM.td( {className:"actual-td"}, 
                    this.renderActualValue(),
                    this.renderPercentageComplete()
                ),
                this.renderActions()
            )
        );
    }
});

var IndicatorPeriodList = React.createClass({displayName: 'IndicatorPeriodList',
    sortedPeriods: function() {
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
        var baselineYear = this.props.selectedIndicator.baseline_year,
            baselineValue = this.props.selectedIndicator.baseline_value;

        if (!(baselineYear === null && baselineValue === '')) {
            if (this.props.selectedIndicator.measure === '2') {
                baselineValue += '%';
            }

            return (
                React.DOM.div( {className:"baseline"}, 
                    React.DOM.div( {className:"baseline-year"}, 
                        i18n.baseline_year,
                        React.DOM.span(null, baselineYear)
                    ),
                    React.DOM.div( {className:"baseline-value"}, 
                        i18n.baseline_value,
                        React.DOM.span(null, baselineValue)
                    )
                )
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    render: function() {
        var thisList = this,
            periods;

        if (this.props.selectedIndicator.periods !== undefined) {
            periods = this.sortedPeriods().map(function (period) {
                return (
                    React.DOM.tbody( {className:"indicator-period bg-transition", key:period.id}, 
                        React.createElement(IndicatorPeriodEntry, {
                            period: period,
                            selectedIndicator: thisList.props.selectedIndicator,
                            selectedPeriod: thisList.props.selectedPeriod,
                            selectPeriod: thisList.props.selectPeriod,
                            addNewUpdate: thisList.props.addNewUpdate,
                            savePeriodToIndicator: thisList.props.savePeriodToIndicator,
                            lockPeriod: thisList.props.lockPeriod,
                            unlockPeriod: thisList.props.unlockPeriod,
                            parent: thisList.props.parent,
                            child: thisList.props.child,
                            findProjectOfResult: thisList.props.findProjectOfResult
                        })
                    )
                );
            });
        } else {
            periods = React.DOM.tbody( {className:"indicator-period bg-transition"}, 
                React.DOM.tr(null, 
                    React.DOM.td(null, 
                        React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.loading, " ", i18n.indicator_periods
                    ),
                    React.DOM.td(null ),React.DOM.td(null ),React.DOM.td(null )
                )
            );
        }

        var relatedClass = "indicator-period-list ",
            relatedIndication,
            relatedProjectId,
            relatedProjectTitle,
            relatedProjectUrl,
            relatedProjectLink;

        if (this.props.parent) {
            relatedProjectId = this.props.findProjectOfResult('parent', this.props.selectedIndicator.result);
            relatedProjectTitle = this.props.findProjectOfResult('parent', this.props.selectedIndicator.result, 'title');
            relatedProjectUrl = "/myrsr/results/" + relatedProjectId + "/#" + this.props.selectedIndicator.result + "," + this.props.selectedIndicator.id;
            relatedIndication = i18n.parent_project + ': ';
            relatedProjectLink = React.DOM.a( {href:relatedProjectUrl}, relatedProjectTitle);
            relatedClass += "parentProject";
            return (
                React.DOM.div( {className:relatedClass}, 
                    React.DOM.span( {className:"relatedInfo"}, relatedIndication,relatedProjectLink)
                )
            );
        } else if (this.props.child) {
            relatedProjectId = this.props.findProjectOfResult('children', this.props.selectedIndicator.result);
            relatedProjectTitle = this.props.findProjectOfResult('children', this.props.selectedIndicator.result, 'title');
            relatedProjectUrl = "/myrsr/results/" + relatedProjectId + "/#" + this.props.selectedIndicator.result + "," + this.props.selectedIndicator.id;
            relatedIndication = i18n.child_project + ': ';
            relatedProjectLink = React.DOM.a( {href:relatedProjectUrl}, relatedProjectTitle);
            relatedClass += "childProject";

            return (
                React.DOM.div( {className:relatedClass}, 
                    React.DOM.span( {className:"relatedInfo"}, relatedIndication,relatedProjectLink)
                )
            );
        } else {
            relatedIndication = '';
            relatedClass += "selfProject";

            return (
                React.DOM.div( {className:relatedClass}, 
                    React.DOM.span( {className:"relatedInfo"}, relatedIndication),
                    React.DOM.h4( {className:"indicator-periods-title"}, i18n.indicator_periods),
                    this.renderBaseline(),
                    React.DOM.table( {className:"table table-responsive"}, 
                        React.DOM.thead(null, 
                        React.DOM.tr(null, 
                            React.DOM.td( {className:"th-period"}, i18n.period),
                            React.DOM.td( {className:"th-target"}, i18n.target_value),
                            React.DOM.td( {className:"th-actual"}, i18n.actual_value),
                            React.DOM.td( {className:"th-actions"})
                        )
                        ),
                        periods
                    )
                )
            );
        }
    }
});

var MainContent = React.createClass({displayName: 'MainContent',
    getInitialState: function() {
        return {
            addingNewUpdate: false
        };
    },

    addNewUpdate: function(periodId) {
        this.setState({addingNewUpdate: true});
        var thisApp = this;
        var url = endpoints.base_url + endpoints.updates_and_comments;
        var actualValue = this.props.selectedPeriod.actual_value === '' ? '0' : this.props.selectedPeriod.actual_value;
        var data = JSON.stringify({
            'period': periodId,
            'user': user.id,
            'data': '0',
            'period_actual_value': actualValue
        });
        var success = function(response) {
            thisApp.props.saveUpdateToPeriod(response, periodId);
            thisApp.setState({addingNewUpdate: false});
        };
        apiCall('POST', url, data, success);
    },

    basePeriodSave: function(relation, periodId, data) {
        var url = endpoints.base_url + endpoints.period_framework.replace('{period}', periodId);
        var thisApp = this;
        var success = function(response) {
            var period = response;
            var indicatorId = period.indicator;
            thisApp.props.savePeriodToIndicator(relation, period, indicatorId);
        };
        apiCall('PATCH', url, JSON.stringify(data), success);
    },

    lockPeriod: function(relation, periodId) {
        this.basePeriodSave(relation, periodId, {locked: true});
    },

    unlockPeriod: function(relation, periodId) {
        this.basePeriodSave(relation, periodId, {locked: false});
    },

    showMeasure: function() {
        switch(this.props.selectedIndicator.measure) {
            case "1":
                return ' (' + i18n.unit + ')';
            case "2":
                return ' (' + i18n.percentage + ')';
            default:
                return "";
        }
    },

    renderParentIndicator: function() {
        if (this.props.selectedIndicatorParent !== null) {
            return (
                React.DOM.div(null, 
                    React.createElement(IndicatorPeriodList, {
                        selectedIndicator: this.props.selectedIndicatorParent,
                        selectedPeriod: this.props.selectedPeriod,
                        selectPeriod: this.props.selectPeriod,
                        addNewUpdate: this.addNewUpdate,
                        savePeriodToIndicator: this.props.savePeriodToIndicator,
                        lockPeriod: this.lockPeriod,
                        unlockPeriod: this.unlockPeriod,
                        parent: true,
                        child: false,
                        findProjectOfResult: this.props.findProjectOfResult
                    })
                )
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    renderChildIndicators: function() {
        var thisList = this;
        var indicatorEntries = this.props.selectedIndicatorChildren.map(function (indicator) {
            return (
                React.DOM.div( {key:indicator.id}, 
                    React.createElement(IndicatorPeriodList, {
                        selectedIndicator: indicator,
                        selectedPeriod: thisList.props.selectedPeriod,
                        selectPeriod: thisList.props.selectPeriod,
                        addNewUpdate: thisList.addNewUpdate,
                        savePeriodToIndicator: thisList.props.savePeriodToIndicator,
                        lockPeriod: thisList.lockPeriod,
                        unlockPeriod: thisList.unlockPeriod,
                        parent: false,
                        child: true,
                        findProjectOfResult: thisList.props.findProjectOfResult
                    })
                )
            );
        });
        return (
            React.DOM.div(null, indicatorEntries)
        );
    },

    render: function() {
        if (this.props.selectedPeriod !== null) {
            return (
                React.DOM.div( {className:"indicator-period-container"}, 
                    React.createElement(IndicatorPeriodMain, {
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
                        reloadPeriod: this.props.reloadPeriod,
                        lockPeriod: this.lockPeriod,
                        unlockPeriod: this.unlockPeriod
                    })
                )
            );
        } else if (this.props.selectedIndicator !== null) {
            return (
                React.DOM.div( {className:"indicator opacity-transition"}, 
                    React.DOM.h4( {className:"indicator-title"}, 
                        this.props.selectedIndicator.title,this.showMeasure()
                    ),
                    React.DOM.div( {className:"indicator-description"}, 
                        this.props.selectedIndicator.description
                    ),
                    React.createElement(IndicatorPeriodList, {
                        selectedIndicator: this.props.selectedIndicator,
                        selectedPeriod: this.props.selectedPeriod,
                        selectPeriod: this.props.selectPeriod,
                        addNewUpdate: this.addNewUpdate,
                        savePeriodToIndicator: this.props.savePeriodToIndicator,
                        lockPeriod: this.lockPeriod,
                        unlockPeriod: this.unlockPeriod,
                        parent: false,
                        child: false,
                        findProjectOfResult: this.props.findProjectOfResult
                    }),
                    this.renderParentIndicator(),
                    this.renderChildIndicators()
                )
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    }
});

var IndicatorEntry = React.createClass({displayName: 'IndicatorEntry',
    selected: function() {
        if (this.props.selectedIndicator !== null) {
            return this.props.selectedIndicator.id === this.props.indicator.id;
        } else {
            return false;
        }
    },

    switchIndicator: function() {
        this.props.selectIndicator(this.props.indicator.id);
        this.props.selectPeriod(null);
    },

    render: function() {
        var indicatorClass = "indicator-nav clickable bg-border-transition";
        if (this.selected()) {
            indicatorClass += " active";
        }

        return (
            React.DOM.div( {className:indicatorClass, onClick:this.switchIndicator}, 
                React.DOM.a(null, 
                    React.DOM.h4(null, this.props.indicator.title)
                )
            )
        );
    }
});

var ResultEntry = React.createClass({displayName: 'ResultEntry',
    expanded: function() {
        if (this.props.selectedResult !== null) {
            return this.props.selectedResult.id === this.props.result.id;
        } else {
            return false;
        }
    },

    switchResult: function() {
        var resultId = this.expanded() ? null : this.props.result.id;
        this.props.selectResult(resultId);
    },

    indicatorText: function() {
        if (this.props.result.indicators !== undefined) {
            return this.props.result.indicators.length === 1 ? i18n.indicator : i18n.indicators;
        } else {
            return i18n.indicators;
        }
    },

    renderIndicatorEntries: function() {
        if (this.expanded()) {
            var thisResult = this;
            if (this.props.result.indicators !== undefined) {
                var indicatorEntries = this.props.result.indicators.map(function (indicator) {
                    return (
                        React.DOM.div( {key:indicator.id}, 
                            React.createElement(IndicatorEntry, {
                                indicator: indicator,
                                selectedIndicator: thisResult.props.selectedIndicator,
                                selectIndicator: thisResult.props.selectIndicator,
                                selectPeriod: thisResult.props.selectPeriod
                            })
                        )
                    );
                });
                return (
                    React.DOM.div( {className:"result-nav-full clickable"}, indicatorEntries)
                );
            } else {
                return (
                    React.DOM.div( {className:"result-nav-full clickable"}, 
                        React.DOM.div( {className:"indicator-nav bg-border-transition"}, 
                            React.DOM.a(null, 
                                React.DOM.h4(null, React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.loading, " ", i18n.indicators)
                            )
                        )
                    )
                );
            }
        } else {
            return (
                React.DOM.span(null )
            );
        }
    },

    renderIndicatorCount: function() {
        var indicatorLength;

        if (this.props.result.indicators === undefined) {
            indicatorLength = React.DOM.i( {className:"fa fa-spin fa-spinner"} );
        } else {
            indicatorLength = this.props.result.indicators.length;
        }

        if (this.expanded()) {
            return (
                React.DOM.span( {className:"result-indicator-count"}, 
                    React.DOM.i( {className:"fa fa-tachometer"} ),
                    React.DOM.span( {className:"indicator-count inlined"}, indicatorLength),
                    React.DOM.p(null, this.indicatorText(),":")
                )
            );
        } else {
            return (
                React.DOM.span( {className:"result-indicator-count"}, 
                    React.DOM.i( {className:"fa fa-tachometer"} ),
                    React.DOM.span( {className:"indicator-count inlined"}, indicatorLength),
                    React.DOM.p(null, this.indicatorText().toLowerCase())
                )
            );
        }
    },
    
    render: function() {
        var resultNavClass = "result-nav bg-transition";
        resultNavClass += this.expanded() ? " expanded" : "";

        return (
            React.DOM.div( {className:resultNavClass, key:this.props.result.id}, 
                React.DOM.div( {className:"result-nav-summary clickable", onClick:this.switchResult}, 
                    React.DOM.h3( {className:"result-title"}, 
                        React.DOM.i( {className:"fa fa-chevron-circle-down"} ),
                        React.DOM.i( {className:"fa fa-chevron-circle-up"} ),
                        React.DOM.span(null, this.props.result.title)
                    ),
                    this.renderIndicatorCount()
                ),
                this.renderIndicatorEntries()
            )
        );
    }
});

var SideBar = React.createClass({displayName: 'SideBar',
    render: function() {
        var thisList = this;
        var resultEntries = this.props.results.map(function (result) {
            return (
                React.DOM.div( {key:result.id}, 
                    React.createElement(ResultEntry, {
                        result: result,
                        selectedResult: thisList.props.selectedResult,
                        selectedIndicator: thisList.props.selectedIndicator,
                        selectResult: thisList.props.selectResult,
                        selectIndicator: thisList.props.selectIndicator,
                        selectPeriod: thisList.props.selectPeriod
                    })
                )
            );
        });

        if (!this.props.loadingResults) {
            return (
                React.DOM.div( {className:"results-list"}, 
                    resultEntries
                )
            );
        } else {
            return (
                React.DOM.div( {className:"results-list"}, 
                    React.DOM.div( {className:"result-nav bg-transition"}, 
                        React.DOM.div( {className:"result-nav-summary"}, 
                            React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.loading, " ", i18n.results
                        )
                    )
                )
            );
        }
    }
});

var ResultsApp = React.createClass({displayName: 'ResultsApp',
    getInitialState: function() {
        var hash = window.location.hash,
            defaultResult = null,
            defaultIndicator = null,
            defaultPeriod = null;

        if (hash !== '') {
            hash = hash.substring(1);
            var hashArray = hash.split(',');
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
            results: [],
            parentResults: [],
            childResults: []
        };
    },

    componentDidMount: function() {
        this.loadResults('self', projectIds.project_id);
        for (var i = 0; i < projectIds.parent_projects_ids.length; i++) {
            this.loadResults('parent', projectIds.parent_projects_ids[i]);
        }
        for (var j = 0; j < projectIds.child_projects_ids.length; j++) {
            this.loadResults('children', projectIds.child_projects_ids[j]);
        }
    },

    loadResults: function(relation, projectId) {
        var thisApp = this;
        var success = function(response) {
            switch (relation) {
                case 'self':
                    thisApp.setState({
                        'results': thisApp.state.results.concat(response.results),
                        'loadingResults': false
                    });
                    break;
                case 'parent':
                    thisApp.setState({
                        'parentResults': thisApp.state.parentResults.concat(response.results)
                    });
                    break;
                case 'children':
                    thisApp.setState({
                        'childResults': thisApp.state.childResults.concat(response.results)
                    });
                    break;
            }
            thisApp.loadIndicators(relation, projectId);
        };
        apiCall('GET', endpoints.base_url + endpoints.results_of_project.replace('{project}', projectId), '', success);
    },

    loadIndicators: function(relation, projectId) {
        var thisApp = this;
        var success = function(response) {
            var indicators = response.results;
            for (var i = 0; i < indicators.length; i++) {
                var indicator = indicators[i];
                var result = thisApp.findResult(relation, indicator.result);
                if (result.indicators === undefined) {
                    result.indicators = [indicator];
                } else {
                    result.indicators.push(indicator);
                }
            }
            var results = thisApp.resultsBasedOnRelation(relation);
            for (var j = 0; j < results.length; j++) {
                var stateResult = results[j];
                if (stateResult.indicators === undefined) {
                    stateResult.indicators = [];
                }
            }
            thisApp.forceUpdate();
            thisApp.loadPeriods(relation, projectId);
        };
        apiCall('GET', endpoints.base_url + endpoints.indicators_of_project.replace('{project}', projectId), '', success);
    },

    loadPeriods: function(relation, projectId) {
        var thisApp = this;
        var success = function(response) {
            var periods = response.results;
            for (var i = 0; i < periods.length; i++) {
                var period = periods[i];
                var indicator = thisApp.findIndicator(relation, period.indicator);
                if (indicator.periods === undefined) {
                    indicator.periods = [period];
                } else {
                    indicator.periods.push(period);
                }
            }
            var results = thisApp.resultsBasedOnRelation(relation);
            for (var j = 0; j < results.length; j++) {
                var stateResult = results[j];
                for (var k = 0; k < stateResult.indicators.length; k++) {
                    var stateIndicator = stateResult.indicators[k];
                    if (stateIndicator.periods === undefined) {
                        stateIndicator.periods = [];
                    }
                }
            }
            thisApp.forceUpdate();
            thisApp.loadDataUpdatesAndComments(relation, projectId);
        };
        apiCall('GET', endpoints.base_url + endpoints.periods_of_project.replace('{project}', projectId), '', success);
    },

    loadDataUpdatesAndComments: function(relation, projectId) {
        var thisApp = this;
        var success = function(response) {
            var updates = response.results;
            for (var i = 0; i < updates.length; i++) {
                var update = updates[i];
                var period = thisApp.findPeriod(relation, update.period);
                if (period.data === undefined) {
                    period.data = [update];
                } else {
                    period.data.push(update);
                }
            }
            var results = thisApp.resultsBasedOnRelation(relation);
            for (var j = 0; j < results.length; j++) {
                var stateResult = results[j];
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
            thisApp.forceUpdate();
        };
        apiCall('GET', endpoints.base_url + endpoints.updates_and_comments_of_project.replace('{project}', projectId), '', success);
    },

    resultsBasedOnRelation: function(relation) {
        switch (relation) {
            case 'self':
                return this.state.results;
            case 'parent':
                return this.state.parentResults;
            case 'children':
                return this.state.childResults;
        }
    },

    findProjectOfResult: function(relation, resultId, type) {
        var result = this.findResult(relation, resultId);
        return type === 'title' ? result.project_title : result.project;
    },

    findResult: function(relation, resultId) {
        var results = this.resultsBasedOnRelation(relation);
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            if (result.id == resultId) {
                return result;
            }
        }
        return null;
    },

    findIndicator: function(relation, indicatorId) {
        var results = this.resultsBasedOnRelation(relation);
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
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

    findPeriod: function(relation, periodId) {
        var results = this.resultsBasedOnRelation(relation);
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
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

    findUpdate: function(relation, updateId) {
        var results = this.resultsBasedOnRelation(relation);
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
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

    savePeriodToIndicator: function(relation, period, indicatorId) {
        var indicator = this.findIndicator(relation, indicatorId);

        if (indicator !== null) {
            var dataFound = null;
            for (var l = 0; l < indicator.periods.length; l++) {
                var oldPeriod = indicator.periods[l];
                if (oldPeriod.id == period.id) {
                    dataFound = oldPeriod;
                    break;
                }
            }

            if (dataFound !== null) {
                // Remove old period and insert updated period if update exists
                var periodsList = indicator.periods;
                periodsList.splice(periodsList.indexOf(dataFound), 1);
                periodsList.push(period);
                this.forceUpdate();
            }
        }
    },

    saveUpdateToPeriod: function(update, periodId) {
        var period = this.findPeriod('self', periodId);

        if (period !== null) {
            var dataFound = null;
            for (var l = 0; l < period.data.length; l++) {
                var dataUpdate = period.data[l];
                if (dataUpdate.id == update.id) {
                    dataFound = dataUpdate;
                    break;
                }
            }

            if (dataFound === null) {
                // Insert new update if not
                period.data.push(update);
                this.forceUpdate();
                this.addEditingData(update.id);
            } else {
                // Remove old update and insert updated update if update exists
                var periodDataList = period.data;
                periodDataList.splice(periodDataList.indexOf(dataFound), 1);
                periodDataList.push(update);
                this.forceUpdate();
            }
        }
    },

    saveFileInUpdate: function(file, updateId, fileType) {
        var update = this.findUpdate('self', updateId);

        if (update !== null) {
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
        var update = this.findUpdate('self', updateId);

        if (update !== null) {
            update.comments.push(comment);
            this.forceUpdate();
        }
    },

    removeUpdate: function(updateId) {
        var update = this.findUpdate('self', updateId);
        var periodId = update.period;
        var url = endpoints.base_url + endpoints.update_and_comments.replace('{update}', updateId);
        var thisApp = this;
        var success = function() {
            thisApp.reloadPeriod('self', periodId);
        };
        apiCall('DELETE', url, '', success);
    },

    reloadPeriod: function(relation, periodId) {
        var url = endpoints.base_url + endpoints.period_framework.replace('{period}', periodId);
        var thisApp = this;
        var success = function(response) {
            var period = response;
            var indicatorId = period.indicator;
            thisApp.savePeriodToIndicator(relation, period, indicatorId);
            if (relation === 'self' && period.parent_period !== null) {
                thisApp.reloadPeriod('parent', period.parent_period);
            }
        };
        apiCall('GET', url, '', success);
    },

    selectResult: function(resultId) {
        this.setState({selectedResultId: resultId});
    },

    selectIndicator: function(indicatorId) {
        this.setState({selectedIndicatorId: indicatorId});
        if (indicatorId !== null) {
            var resultId = this.state.selectedResultId;
            window.location.hash = resultId + ',' + indicatorId;
        }
    },

    selectPeriod: function(periodId) {
        this.setState({selectedPeriodId: periodId});
        if (periodId !== null) {
            var resultId = this.state.selectedResultId;
            var indicatorId = this.state.selectedIndicatorId;
            window.location.hash = resultId + ',' + indicatorId + ',' + periodId;
        }
    },

    selectedResult: function(relation) {
        var selected;
        switch (relation) {
            case 'self':
                return this.findResult(relation, this.state.selectedResultId);
            case 'parent':
                selected = this.selectedResult('self');
                if (selected !== null && selected.parent_result !== null) {
                    return this.findResult(relation, selected.parent_result);
                }
                return null;
            case 'children':
                // Returns a list instead
                var childResults = [];
                selected = this.selectedResult('self');
                if (selected !== null) {
                    for (var i = 0; i < this.state.childResults.length; i++) {
                        var childResult = this.state.childResults[i];
                        if (childResult.parent_result === selected.id) {
                            childResults.push(childResult);
                        }
                    }
                }
                return childResults;
        }
    },

    selectedIndicator: function(relation) {
        var selected, selectedResult;
        switch (relation) {
            case 'self':
                return this.findIndicator('self', this.state.selectedIndicatorId);
            case 'parent':
                selected = this.selectedIndicator('self');
                if (selected !== null) {
                    selectedResult = this.findResult('self', selected.result);
                    if (selectedResult.parent_result !== null) {
                        var selectedResultParent = this.findResult(relation, selectedResult.parent_result);
                        if (selectedResultParent !== null && selectedResultParent.indicators !== undefined) {
                            for (var i = 0; i < selectedResultParent.indicators.length; i++) {
                                var selectedIndicatorParent = selectedResultParent.indicators[i];
                                if (selectedIndicatorParent.title === selected.title) {
                                    return selectedIndicatorParent;
                                }
                            }
                        }
                    }
                }
                return null;
            case 'children':
                // Returns a list instead
                var childIndicators = [];
                selected = this.selectedIndicator('self');
                if (selected !== null) {
                    selectedResult = this.findResult('self', selected.result);
                    for (var j = 0; j < this.state.childResults.length; j++) {
                        var childResult = this.state.childResults[j];
                        if (childResult.parent_result === selectedResult.id && childResult.indicators !== undefined) {
                            for (var k = 0; k < childResult.indicators.length; k++){
                                var childIndicator = childResult.indicators[k];
                                if (childIndicator.title === selected.title) {
                                    childIndicators.push(childIndicator);
                                }
                            }
                        }
                    }
                }
                return childIndicators;
        }
    },

    selectedPeriod: function() {
        return this.findPeriod('self', this.state.selectedPeriodId);
    },

    addEditingData: function(updateId) {
        var editingDataList = this.state.editingData;
        editingDataList.push(updateId);
        this.setState({editingData: editingDataList});
    },

    removeEditingData: function(updateId) {
        var editingDataList = this.state.editingData;
        editingDataList.splice(editingDataList.indexOf(updateId), 1);
        this.setState({editingData: editingDataList});
    },

    render: function() {
        return (
            React.DOM.div( {className:"results"}, 
                React.DOM.article(null, 
                    React.DOM.div( {className:"results-container"}, 
                        React.DOM.div( {className:"sidebar"}, 
                            React.DOM.div( {className:"result-nav-header"}, 
                                React.DOM.h3(null, i18n.results)
                            ),
                            React.createElement(
                                SideBar, {
                                    results: this.state.results,
                                    loadingResults: this.state.loadingResults,
                                    selectedResult: this.selectedResult('self'),
                                    selectedIndicator: this.selectedIndicator('self'),
                                    selectResult: this.selectResult,
                                    selectIndicator: this.selectIndicator,
                                    selectPeriod: this.selectPeriod
                                }
                            )
                        ),
                        React.DOM.div( {className:"indicator-container"}, 
                            React.createElement(
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
                                    selectedIndicator: this.selectedIndicator('self'),
                                    selectedIndicatorParent: this.selectedIndicator('parent'),
                                    selectedIndicatorChildren: this.selectedIndicator('children'),
                                    selectedPeriod: this.selectedPeriod(),
                                    selectPeriod: this.selectPeriod,
                                    findProjectOfResult: this.findProjectOfResult
                                }
                            )
                        )
                    )
                )
            )  
        );
    }
});

function setPermissions() {
    // Set the specific permissions for the results framework
    permissions = {
        addUpdate: true,
        editUpdate: true,
        deleteUpdate: false,
        unlockPeriod: isAdmin,
        addComment: true,
        editComment: false,
        deleteComment: false,
        returnForRevision: isAdmin,
        approve: isAdmin
    };
}

function userIsAdmin() {
    // Check if the user is an M&E manager, resulting in different actions than other users.
    isAdmin = false;

    var adminOrgIds = [],
        partnerships;

    if (user.is_admin || user.is_superuser) {
        isAdmin = true;
        return;
    }

    for (var i = 0; i < user.approved_employments.length; i++) {
        var employment = user.approved_employments[i];
        if (employment.group_name === 'M&E Managers') {
            adminOrgIds.push(employment.organisation);
        }
    }

    var success = function(response) {
        partnerships = response.results;
        for (var j = 0; j < partnerships.length; j++) {
            var partnership = partnerships[j];
            if (adminOrgIds.indexOf(partnership.organisation) > -1) {
                isAdmin = true;
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

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints, translations and project IDs
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);
    months = JSON.parse(document.getElementById('months').innerHTML);
    projectIds = JSON.parse(document.getElementById('project-ids').innerHTML);

    getUserData();
    setPermissions();

    // Initialize the 'My reports' app
    ReactDOM.render(
        React.createElement(ResultsApp),
        document.getElementById('results-framework')
    );
});