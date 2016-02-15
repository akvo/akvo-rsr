/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var csrftoken, endpoints, i18n, isAdmin, permissions, user;

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
                         message += key + '; ' + response[key] + '. ';
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

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (dateString !== undefined && dateString !== null) {
        var locale = "en-gb";
        var date = new Date(dateString.split(".")[0].replace("/", /-/g));
        var day = date.getUTCDate();
        var month = date.toLocaleString(locale, { month: "short" });
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
                    user.first_name, " ", user.last_name, " | ", displayDate(comment.created_at)
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
        return {
            data: this.props.update.data,
            description: this.props.update.text,
            isRelative: this.props.update.relative_data,
            comment: ''
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
                thisApp.props.reloadPeriod(periodId);
            }
        };
        apiCall('PATCH', url, JSON.stringify(data), success);
    },

    saveUpdate: function() {
        var status = this.props.update.status !== 'N' ? this.props.update.status : 'D';
        this.baseSave({
            'user': user.id,
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': status
        }, false, false);
    },

    askForApproval: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': 'P'
        }, false, false);
    },

    approve: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative,
            'status': 'A'
        }, false, true);
    },

    returnForRevision: function() {
        this.baseSave({
            'user': user.id,
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

    switchEdit: function() {
        var addEdit = this.props.addEditingData;
        var removeEdit = this.props.removeEditingData;
        var updateId = this.props.update.id;

        if (this.editing()) {
            if (this.props.update.status === 'N') {
                this.props.removeUpdate(updateId);
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
            headerLeft = React.DOM.div( {className:"col-xs-9"}, 
                React.DOM.span( {className:"update-user"}, this.props.update.user_details.first_name, " ", this.props.update.user_details.last_name),
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

    renderActualRelative: function() {
        var periodActualValue = parseFloat(this.props.update.period_actual_value);
        var originalData = parseFloat(this.state.data);
        var updateData = this.state.isRelative ? periodActualValue + originalData : originalData;
        var relativeData = this.state.isRelative ? originalData : updateData - periodActualValue;

        if (isNaN(updateData) || isNaN(relativeData) || relativeData === 0) {
            return (
                React.DOM.div( {className:"upActualValue"}, 
                    React.DOM.span( {className:"update-actual-value-text"}, i18n.actual_value,": " ),
                    React.DOM.span( {className:"update-actual-value-data"}, this.state.data),React.DOM.br(null)
                )
            );
        } else {
            relativeData = relativeData > 0 ? '+' + relativeData.toString() : relativeData.toString();
            return (
                React.DOM.div( {className:"upActualValue"}, 
                    React.DOM.span( {className:"update-actual-value-text"}, i18n.actual_value,": " ),
                    React.DOM.span( {className:"update-actual-value-data"}, updateData, " " ),
                    React.DOM.span( {className:"update-relative-value"}, "(",relativeData,")")
                )
            );
        }
    },

    renderActual: function() {
        var inputId = "actual-input-" + this.props.update.id;
        var checkboxId = "relative-checkbox-" + this.props.update.id;
        var checkbox;
        if (this.state.isRelative) {
            checkbox = React.DOM.label(null, React.DOM.input( {type:"checkbox", id:checkboxId, onChange:this.handleRelativeChange, checked:true} ), " ", i18n.relative_data);
        } else {
            checkbox = React.DOM.label(null, React.DOM.input( {type:"checkbox", id:checkboxId, onChange:this.handleRelativeChange} ), " ", i18n.relative_data);
        }

        if (this.editing()) {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-6"}, 
                        React.DOM.label( {htmlFor:inputId}, i18n.new_actual_value),
                        React.DOM.input( {className:"form-control", id:inputId, defaultValue:this.props.update.data, onChange:this.handleDataChange} ),
                        checkbox
                    ),
                    React.DOM.div( {className:"col-xs-6"}, 
                        this.renderActualRelative()
                    )
                )
            );
        } else {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-12"}, 
                        this.renderActualRelative()
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
                React.DOM.label( {htmlFor:inputId}, i18n.note),
                React.DOM.textarea( {className:"form-control", id:inputId, defaultValue:this.props.update.text, onChange:this.handleDescriptionChange} )
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
        } else if (this.editing()) {
            switch(this.props.update.status) {
                case 'P':
                    return (
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
                    );
                default:
                    return (
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
                    );
            }
        } else {
            switch(this.props.update.status) {
                case 'P':
                    if (isAdmin) {
                        return (
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
                            React.DOM.ul( {className:"nav-pills bottomRow navbar-right"}, 
                                React.DOM.li( {role:"presentation", className:"editUpdate"}, 
                                    React.DOM.a( {onClick:this.switchEdit, className:"btn btn-default btn-xs"}, i18n.edit_update)
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
            updates = React.DOM.div( {className:"update-container"}, 
                React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.loading, " ", i18n.updates
            );
        }


        return (
            React.DOM.div( {className:"updates-container"}, 
                React.DOM.h5(null, i18n.updates),
                updates
            )
        );
    }
});

var IndicatorPeriodMain = React.createClass({displayName: 'IndicatorPeriodMain',
    addNewUpdate: function() {
        this.props.addNewUpdate(this.props.selectedPeriod.id);
    },

    unlockPeriod: function() {
        this.props.unlockPeriod(this.props.selectedPeriod.id);
    },

    renderNewUpdate: function() {
        if (this.props.addingNewUpdate) {
            return (
                React.DOM.div( {className:"col-xs-3 new-update"}, 
                    React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.adding_update
                )
            );
        } else if (!this.props.selectedPeriod.locked) {
            return (
                React.DOM.div( {className:"new-update"}, 
                    React.DOM.a( {onClick:this.addNewUpdate, className:"btn btn-xs btn-default"}, React.DOM.i( {className:"fa fa-plus"}), " ", i18n.new_update)
                )
            );
        } else if (isAdmin) {
            return (
                React.DOM.div( {className:"col-xs-3 unlock-period"}, 
                    React.DOM.a( {onClick:this.unlockPeriod}, i18n.unlock_period)
                )
            );
        } else {
            return (
                React.DOM.div( {className:"col-xs-3 new-update"}, 
                    i18n.new_update
                )
            );
        }

    },

    renderPercentageComplete: function() {
        if (this.props.selectedPeriod.percent_accomplishment !== null) {
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
                            React.DOM.span(null, this.props.selectedPeriod.target_value)
                        ),
                        React.DOM.div( {className:"period-actual"}, 
                            i18n.actual_value,
                            React.DOM.span(null, 
                                this.props.selectedPeriod.actual_value,
                                this.renderPercentageComplete()
                            )
                        )
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
    selected: function() {
        if (this.props.selectedPeriod !== null) {
            return this.props.selectedPeriod.id === this.props.period.id;
        } else {
            return false;
        }
    },

    lockPeriod: function() {
        this.props.lockPeriod(this.props.period.id);
    },

    unlockPeriod: function() {
        this.props.unlockPeriod(this.props.period.id);
    },

    switchPeriod: function() {
        var periodId = this.selected() ? null : this.props.period.id;
        this.props.selectPeriod(periodId);
    },

    switchPeriodAndUpdate: function() {
        this.props.addNewUpdate(this.props.selectedPeriod.id);
        this.switchPeriod();
    },

    renderPeriodDisplay: function() {
        var periodDisplay = displayDate(this.props.period.period_start) + ' - ' + displayDate(this.props.period.period_end);

        if (this.props.period.data === undefined || this.props.period.data.length === 0) {
            return (
                React.DOM.td( {className:"period-td"}, 
                    periodDisplay
                )
            );
        } else {
            return (
                React.DOM.td( {className:"period-td"}, 
                    React.DOM.a( {onClick:this.switchPeriod}, 
                        periodDisplay
                    )
                )
            );
        }
    },

    renderActions: function() {
        if (isAdmin) {
            switch(this.props.period.locked) {
                case false:
                    return (
                        React.DOM.td( {className:"actions-td"}, 
                            React.DOM.a( {onClick:this.switchPeriod}, i18n.update), " | ", React.DOM.a( {onClick:this.lockPeriod}, i18n.lock_period)
                        )
                    );
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
                    return (
                        React.DOM.td( {className:"actions-td"}, 
                            React.DOM.a( {onClick:this.switchPeriod}, i18n.update)
                        )
                    );
                default:
                    return (
                        React.DOM.td( {className:"actions-td"}, 
                            React.DOM.i( {className:"fa fa-lock"} ), " ", i18n.period_locked
                        )
                    );
            }
        }
    },

    renderPercentageComplete: function() {
        if (this.props.period.percent_accomplishment !== null) {
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
                React.DOM.td( {className:"target-td"}, this.props.period.target_value),
                React.DOM.td( {className:"actual-td"}, 
                    this.props.period.actual_value,
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

    render: function() {
        var thisList = this,
            periods;

        if (this.props.selectedIndicator.periods !== undefined) {
            periods = this.sortedPeriods().map(function (period) {
                return (
                    React.DOM.tbody( {className:"indicator-period bg-transition", key:period.id}, 
                        React.createElement(IndicatorPeriodEntry, {
                            period: period,
                            selectedPeriod: thisList.props.selectedPeriod,
                            selectPeriod: thisList.props.selectPeriod,
                            addNewUpdate: thisList.props.addNewUpdate,
                            savePeriodToIndicator: thisList.props.savePeriodToIndicator,
                            lockPeriod: thisList.props.lockPeriod,
                            unlockPeriod: thisList.props.unlockPeriod
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

        return (
            React.DOM.div( {className:"indicator-period-list"}, 
                React.DOM.h4( {className:"indicator-periods-title"}, i18n.indicator_periods),
                React.DOM.table( {className:"table table-responsive"}, 
                    React.DOM.thead(null, 
                        React.DOM.tr(null, 
                            React.DOM.td( {className:"th-period"}, i18n.period),
                            React.DOM.td( {className:"th-target"}, i18n.target_value),
                            React.DOM.td( {className:"th-actual"}, i18n.actual_value),
                            React.DOM.td( {className:"th-actions"} )
                        )
                    ),
                    periods
                )
            )
        );
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
            'data': actualValue,
            'period_actual_value': actualValue
        });
        var success = function(response) {
            thisApp.props.saveUpdateToPeriod(response, periodId);
            thisApp.setState({addingNewUpdate: false});
        };
        apiCall('POST', url, data, success);
    },

    basePeriodSave: function(periodId, data) {
        var url = endpoints.base_url + endpoints.period_framework.replace('{period}', periodId);
        var thisApp = this;
        var success = function(response) {
            var period = response;
            var indicatorId = period.indicator;
            thisApp.props.savePeriodToIndicator(period, indicatorId);
        };
        apiCall('PATCH', url, JSON.stringify(data), success);
    },

    lockPeriod: function(periodId) {
        this.basePeriodSave(periodId, {locked: true});
    },

    unlockPeriod: function(periodId) {
        this.basePeriodSave(periodId, {locked: false});
    },

    showMeasure: function() {
        switch(this.props.selectedIndicator.measure) {
            case "1":
                return i18n.unit;
            case "2":
                return i18n.percentage;
            default:
                return "";
        }
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
                        this.props.selectedIndicator.title,
                        "(",this.showMeasure(),")"
                    ),
                    React.DOM.div( {className:"indicator-description"}, 
                        this.props.selectedIndicator.description
                    ),
                    React.DOM.div( {className:"baseline"}, 
                        React.DOM.div( {className:"baseline-year"}, 
                            i18n.baseline_year,
                            React.DOM.span(null, this.props.selectedIndicator.baseline_year)
                        ), 
                        React.DOM.div( {className:"baseline-value"}, 
                            i18n.baseline_value,
                            React.DOM.span(null, this.props.selectedIndicator.baseline_value)
                        )
                    ),
                    React.createElement(IndicatorPeriodList, {
                        selectedIndicator: this.props.selectedIndicator,
                        selectedPeriod: this.props.selectedPeriod,
                        selectPeriod: this.props.selectPeriod,
                        addNewUpdate: this.addNewUpdate,
                        savePeriodToIndicator: this.props.savePeriodToIndicator,
                        lockPeriod: this.lockPeriod,
                        unlockPeriod: this.unlockPeriod
                    })
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
            results: []
        };
    },

    componentDidMount: function() {
        this.loadResults();
    },

    loadResults: function() {
        var thisApp = this;
        var success = function(response) {
            thisApp.setState({
                'results': response.results,
                'loadingResults': false
            });
            thisApp.loadIndicators();
        };
        apiCall('GET', endpoints.base_url + endpoints.results_of_project, '', success);
    },

    loadIndicators: function() {
        var thisApp = this;
        var success = function(response) {
            var indicators = response.results;
            for (var i = 0; i < indicators.length; i++) {
                var indicator = indicators[i];
                var result = thisApp.findResult(indicator.result);
                if (result.indicators === undefined) {
                    result.indicators = [indicator];
                } else {
                    result.indicators.push(indicator);
                }
            }
            for (var j = 0; j < thisApp.state.results.length; j++) {
                var stateResult = thisApp.state.results[j];
                if (stateResult.indicators === undefined) {
                    stateResult.indicators = [];
                }
            }
            thisApp.forceUpdate();
            thisApp.loadPeriods();
        };
        apiCall('GET', endpoints.base_url + endpoints.indicators_of_project, '', success);
    },

    loadPeriods: function() {
        var thisApp = this;
        var success = function(response) {
            var periods = response.results;
            for (var i = 0; i < periods.length; i++) {
                var period = periods[i];
                var indicator = thisApp.findIndicator(period.indicator);
                if (indicator.periods === undefined) {
                    indicator.periods = [period];
                } else {
                    indicator.periods.push(period);
                }
            }
            for (var j = 0; j < thisApp.state.results.length; j++) {
                var stateResult = thisApp.state.results[j];
                for (var k = 0; k < stateResult.indicators.length; k++) {
                    var stateIndicator = stateResult.indicators[k];
                    if (stateIndicator.periods === undefined) {
                        stateIndicator.periods = [];
                    }
                }
            }
            thisApp.forceUpdate();
            thisApp.loadDataUpdatesAndComments();
        };
        apiCall('GET', endpoints.base_url + endpoints.periods_of_project, '', success);
    },

    loadDataUpdatesAndComments: function() {
        var thisApp = this;
        var success = function(response) {
            var updates = response.results;
            for (var i = 0; i < updates.length; i++) {
                var update = updates[i];
                var period = thisApp.findPeriod(update.period);
                if (period.data === undefined) {
                    period.data = [update];
                } else {
                    period.data.push(update);
                }
            }
            for (var j = 0; j < thisApp.state.results.length; j++) {
                var stateResult = thisApp.state.results[j];
                for (var k = 0; k < stateResult.indicators.length; k++) {
                    var stateIndicator = stateResult.indicators[k];
                    for (var l = 0; l < stateIndicator.periods.length; l++) {
                        var statePeriod = stateIndicator.periods[l];
                        if (statePeriod.data === undefined) {
                            console.log(statePeriod.id);
                            statePeriod.data = [];
                        }
                    }
                }
            }
            thisApp.forceUpdate();
        };
        apiCall('GET', endpoints.base_url + endpoints.updates_and_comments_of_project, '', success);
    },

    findResult: function(resultId) {
        for (var i = 0; i < this.state.results.length; i++) {
            var result = this.state.results[i];
            if (result.id == resultId) {
                return result;
            }
        }
        return null;
    },

    findIndicator: function(indicatorId) {
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
        var indicator = this.findIndicator(indicatorId);

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
        var period = this.findPeriod(periodId);

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
        var update = this.findUpdate(updateId);

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
        var update = this.findUpdate(updateId);

        if (update !== null) {
            update.comments.push(comment);
            this.forceUpdate();
        }
    },

    removeUpdate: function(updateId) {
        var update = this.findUpdate(updateId);
        var periodId = update.period;
        var url = endpoints.base_url + endpoints.update_and_comments.replace('{update}', updateId);
        var thisApp = this;
        var success = function() {
            thisApp.reloadPeriod(periodId);
        };
        apiCall('DELETE', url, '', success);
    },

    reloadPeriod: function(periodId) {
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

    selectedResult: function() {
        return this.findResult(this.state.selectedResultId);
    },

    selectedIndicator: function() {
        return this.findIndicator(this.state.selectedIndicatorId);
    },

    selectedPeriod: function() {
        return this.findPeriod(this.state.selectedPeriodId);
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
                                    selectedResult: this.selectedResult(),
                                    selectedIndicator: this.selectedIndicator(),
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
                                    selectedIndicator: this.selectedIndicator(),
                                    selectedPeriod: this.selectedPeriod(),
                                    selectPeriod: this.selectPeriod
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
    // Retrieve data endpoints and translations
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);

    getUserData();
    setPermissions();

    // Initialize the 'My reports' app
    ReactDOM.render(
        React.createElement(ResultsApp),
        document.getElementById('results-framework')
    );
});