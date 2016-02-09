/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var currentDate, csrftoken, endpoints, i18n, initialSettings, isAdmin, user;

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

function getTimeDifference(endDate) {
    // Time remaining to edit (needs to be in GMT)
    var remainingDate = endDate - new Date(currentDate);

    return {
        'days': Math.floor(remainingDate / (1000 * 60 * 60 * 24)),
        'hours': Math.floor((remainingDate / (1000 * 60 * 60)) % 24),
        'minutes': Math.floor((remainingDate / 1000 / 60) % 60)
    };
}

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (dateString !== undefined) {
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
        var url = endpoints.base_url + endpoints.update.replace('{update}', this.props.update.id);
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                var update = JSON.parse(xmlHttp.responseText);
                var periodId = thisApp.props.selectedPeriod.id;
                thisApp.props.saveUpdateToPeriod(update, periodId);
                if (!keepEditing) {
                    thisApp.props.removeEditingData(update.id);
                }
                if (reloadPeriod) {
                    thisApp.props.reloadPeriod(periodId);
                }
            }
        };
        xmlHttp.open("PATCH", url, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(data));
    },

    saveUpdate: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description.trim(),
            'data': this.state.data.trim(),
            'relative_data': this.state.isRelative
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
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 201) {
                var comment = JSON.parse(xmlHttp.responseText);
                var updateId = thisApp.props.update.id;
                thisApp.props.saveCommentInUpdate(comment, updateId);
                thisApp.setState({comment: ''});
            }
        };
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify({
            'data': this.props.update.id,
            'user': user.id,
            'comment': this.state.comment
        }));
    },

    switchEdit: function() {
        var addEdit = this.props.addEditingData;
        var removeEdit = this.props.removeEditingData;
        var updateId = this.props.update.id;

        if (this.editing()) {
            removeEdit(updateId);
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
            )
        } else {
            headerLeft = React.DOM.div( {className:"col-xs-9"}, 
                React.DOM.span( {className:"update-user"}, this.props.update.user_details.first_name, " ", this.props.update.user_details.last_name),
                React.DOM.span( {className:"update-created-at"},  " | ", displayDate(this.props.update.created_at))
            )
        }

        return (
            React.DOM.div( {className:"row update-entry-container-header"}, 
                headerLeft,
                React.DOM.div( {className:"col-xs-3"}, 
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
                React.DOM.div(null, 
                    React.DOM.span( {className:"update-actual-value-text"}, i18n.actual_value,": " ),
                    React.DOM.span( {className:"update-actual-value-data"}, this.state.data),React.DOM.br(null)
                )
            );
        } else {
            relativeData = relativeData > 0 ? '+' + relativeData.toString() : relativeData.toString();
            return (
                React.DOM.div(null, 
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

        if (this.editing()) {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-4"}, 
                        React.DOM.label( {htmlFor:inputId}, i18n.new_actual_value),
                        React.DOM.input( {className:"form-control", id:inputId, defaultValue:this.props.update.data, onChange:this.handleDataChange} ),
                        React.DOM.label(null, React.DOM.input( {type:"checkbox", id:checkboxId, onChange:this.handleRelativeChange} ), " Add relative data")
                    ),
                    React.DOM.div( {className:"col-xs-8"}, 
                        i18n.current,": ", this.props.selectedPeriod.actual_value,
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
            descriptionClass = "col-xs-10 update-description";
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
            React.DOM.div( {className:"row"}, 
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
                )
            } else {
                fileUpload = React.DOM.div( {className:"col-xs-3"}, 
                    React.DOM.label( {className:"fileUpload"}, 
                        React.DOM.input( {type:"file", onChange:this.uploadFile} ),
                        React.DOM.a(null, React.DOM.i( {className:"fa fa-paperclip"}), " ", i18n.attach_file)
                    )
                )
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
        var comments = this.props.update.comments.map(function(comment) {
            return (
                React.DOM.div( {className:"comment", key:comment.id}, 
                    React.createElement(CommentEntry, {
                        comment: comment
                    })
                )
            )
        });

        var inputId = "new-comment-" + this.props.update.id;
        var addComments = this.props.update.status !== 'A';
        var addCommentInput;

        if (addComments) {
            addCommentInput = React.DOM.div( {className:"row"}, 
                React.DOM.div( {className:"col-xs-8"}, 
                    React.DOM.label( {htmlFor:inputId}, i18n.comment),
                    React.DOM.input( {className:"form-control", value:this.state.comment, id:inputId, placeholder:i18n.add_comment_placeholder, onChange:this.handleCommentChange} )
                ),
                React.DOM.div( {className:"col-xs-3"}, 
                    React.DOM.a( {onClick:this.addComment}, i18n.add_comment)
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
        if (this.editing()) {
            switch(this.props.update.status) {
                case 'P':
                    return (
                        React.DOM.div( {className:"row"}, 
                            React.DOM.div( {className:"col-xs-9"}, 
                                React.DOM.a( {onClick:this.switchEdit}, i18n.cancel)
                            ),
                            React.DOM.div( {className:"col-xs-3"}, 
                                React.DOM.a( {onClick:this.approve}, i18n.approve)
                            )
                        )
                    );
                default:
                    return (
                        React.DOM.div( {className:"row"}, 
                            React.DOM.div( {className:"col-xs-7"}, 
                                React.DOM.a( {onClick:this.switchEdit}, i18n.cancel)
                            ),
                            React.DOM.div( {className:"col-xs-2"}, 
                                React.DOM.a( {onClick:this.saveUpdate}, i18n.save)
                            ),
                            React.DOM.div( {className:"col-xs-3"}, 
                                React.DOM.a( {onClick:this.askForApproval}, i18n.submit_for_approval)
                            )
                        )
                    );
            }
        } else {
            switch(this.props.update.status) {
                case 'P':
                    if (isAdmin) {
                        return (
                            React.DOM.div( {className:"row"}, 
                                React.DOM.div( {className:"col-xs-7"}, 
                                    React.DOM.a( {onClick:this.returnForRevision}, i18n.return_for_revision)
                                ),
                                React.DOM.div( {className:"col-xs-2"}, 
                                    React.DOM.a( {onClick:this.switchEdit}, i18n.edit_update)
                                ),
                                React.DOM.div( {className:"col-xs-3"}, 
                                    React.DOM.a( {onClick:this.approve}, i18n.approve)
                                )
                            )
                        );
                    } else {
                        return (
                            React.DOM.span(null )
                        );
                    }

                case 'A':
                    return (
                        React.DOM.span(null )
                    );
                default:
                    if (this.props.update.user.id === user.id || isAdmin) {
                        return (
                            React.DOM.div( {className:"row"}, 
                                React.DOM.div( {className:"col-xs-9"}),
                                React.DOM.div( {className:"col-xs-3"}, 
                                    React.DOM.a( {onClick:this.switchEdit}, i18n.edit_update)
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
        var thisList = this;
        var updates = this.sortedUpdates().map(function (update) {
            return (
                React.DOM.div( {className:"update-container", key:update.id}, 
                    React.createElement(UpdateEntry, {
                        addEditingData: thisList.props.addEditingData,
                        removeEditingData: thisList.props.removeEditingData,
                        editingData: thisList.props.editingData,
                        saveUpdateToPeriod: thisList.props.saveUpdateToPeriod,
                        saveFileInUpdate: thisList.props.saveFileInUpdate,
                        saveCommentInUpdate: thisList.props.saveCommentInUpdate,
                        selectedPeriod: thisList.props.selectedPeriod,
                        selectPeriod: thisList.props.selectPeriod,
                        reloadPeriod: thisList.props.reloadPeriod,
                        update: update
                    })
                )
            );
        });

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
        if (!this.props.selectedPeriod.locked) {
            return (
                React.DOM.div( {className:"col-xs-3 new-update"}, 
                    React.DOM.a( {onClick:this.addNewUpdate}, i18n.new_update)
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
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-xs-9"}, 
                        React.DOM.h4( {className:"indicator-title"}, 
                            i18n.indicator_period,": ", displayDate(this.props.selectedPeriod.period_start), " - ", displayDate(this.props.selectedPeriod.period_end)
                        )
                    ),
                    this.renderNewUpdate()
                ),
                React.DOM.dl( {className:"period-target-actual"}, 
                    React.DOM.div( {className:"period-target"}, 
                        React.DOM.dt(null, i18n.target_value),
                        React.DOM.dd(null, this.props.selectedPeriod.target_value)
                    ),
                    React.DOM.div( {className:"period-actual"}, 
                        React.DOM.dt(null, i18n.actual_value),
                        React.DOM.dd(null, 
                            this.props.selectedPeriod.actual_value,
                            this.renderPercentageComplete()
                        )
                    ),
                    React.createElement(UpdatesList, {
                        addEditingData: this.props.addEditingData,
                        removeEditingData: this.props.removeEditingData,
                        editingData: this.props.editingData,
                        saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                        saveFileInUpdate: this.props.saveFileInUpdate,
                        saveCommentInUpdate: this.props.saveCommentInUpdate,
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
        var selectPeriod = this.props.selectPeriod;
        this.selected() ? selectPeriod(null) : selectPeriod(this.props.period.id);
    },

    switchPeriodAndUpdate: function() {
        this.props.addNewUpdate(this.props.selectedPeriod.id);
        this.switchPeriod();
    },

    renderPeriodDisplay: function() {
        var periodDisplay = displayDate(this.props.period.period_start) + ' - ' + displayDate(this.props.period.period_end);

        switch(this.props.period.data.length) {
            case 0:
                return (
                    React.DOM.td( {className:"period-td"}, 
                        periodDisplay
                    )
                );
            default:
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
                    )
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
                    )
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
        var thisList = this;

        var periods = this.sortedPeriods().map(function (period) {
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
    addNewUpdate: function(periodId) {
        var xmlHttp = new XMLHttpRequest();
        var actualValue = this.props.selectedPeriod.actual_value === '' ? '0' : this.props.selectedPeriod.actual_value;
        var thisApp = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 201) {
                var update = JSON.parse(xmlHttp.responseText);
                thisApp.props.saveUpdateToPeriod(update, periodId);
            }
        };
        xmlHttp.open("POST", endpoints.base_url + endpoints.updates, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify({
            'period': periodId,
            'user': user.id,
            'data': actualValue,
            'period_actual_value': actualValue
        }));
    },

    basePeriodSave: function(periodId, data) {
        var url = endpoints.base_url + endpoints.period.replace('{period}', periodId);
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                var period = JSON.parse(xmlHttp.responseText);
                var indicatorId = period.indicator;
                thisApp.props.savePeriodToIndicator(period, indicatorId);
            }
        };
        xmlHttp.open("PATCH", url, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(data));
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
                        addEditingData: this.props.addEditingData,
                        removeEditingData: this.props.removeEditingData,
                        editingData: this.props.editingData,
                        saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                        saveFileInUpdate: this.props.saveFileInUpdate,
                        saveCommentInUpdate: this.props.saveCommentInUpdate,
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
                        React.DOM.i( {className:"fa fa-tachometer"} ),
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
            )
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
            indicatorClass += " active"
        }

        return (
            React.DOM.div( {className:indicatorClass, onClick:this.switchIndicator, key:this.props.indicator.id}, 
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
        var selectResult = this.props.selectResult;
        this.expanded() ? selectResult(null) : selectResult(this.props.result.id);
    },

    indicatorText: function() {
        return this.props.result.indicators.length === 1 ? i18n.indicator : i18n.indicators;
    },

    render: function() {
        var indicatorCount, indicatorEntries;

        if (this.expanded()) {
            indicatorCount = React.DOM.span( {className:"result-indicator-count"}, 
                React.DOM.i( {className:"fa fa-tachometer"} ),
                React.DOM.span( {className:"indicator-count inlined"}, this.props.result.indicators.length),
                React.DOM.p(null, "indicators:")
            );
        } else {
            indicatorCount = React.DOM.span( {className:"result-indicator-count"}, 
                React.DOM.i( {className:"fa fa-tachometer"} ),
                React.DOM.span( {className:"indicator-count inlined"}, this.props.result.indicators.length),
                React.DOM.p(null, this.indicatorText().toLowerCase())
            );
        }

        if (this.expanded()) {
            var thisResult = this;
            indicatorEntries = this.props.result.indicators.map(function (indicator) {
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
            indicatorEntries = React.DOM.div( {className:"result-nav-full clickable"}, indicatorEntries);
        } else {
            indicatorEntries = React.DOM.span(null );
        }

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
                    indicatorCount
                ),
                indicatorEntries
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

        return (
            React.DOM.div( {className:"results-list"}, 
                resultEntries
            )
        );
    }
});

var ResultsApp = React.createClass({displayName: 'ResultsApp',
    getInitialState: function() {
        return {
            selectedResultId: null,
            selectedIndicatorId: null,
            selectedPeriodId: null,
            editingData: [],
            results: []
        };
    },

    componentDidMount: function() {
        // Load results data
        var xmlHttp = new XMLHttpRequest();
        var thisApp = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                thisApp.setState({'results': JSON.parse(xmlHttp.responseText).results});
            }
        };
        xmlHttp.open("GET", endpoints.base_url + endpoints.results, true);
        xmlHttp.send();
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
            for (var j = 0; j < result.indicators.length; j++) {
                var indicator = result.indicators[j];
                if (indicator.id == indicatorId) {
                    return indicator;
                }
            }
        }
        return null;
    },

    findPeriod: function(periodId) {
        for (var i = 0; i < this.state.results.length; i++) {
            var result = this.state.results[i];
            for (var j = 0; j < result.indicators.length; j++) {
                var indicator = result.indicators[j];
                for (var k = 0; k < indicator.periods.length; k++) {
                    var period = indicator.periods[k];
                    if (period.id == periodId) {
                        return period;
                    }
                }
            }
        }
        return null;
    },

    findUpdate: function(updateId) {
        for (var i = 0; i < this.state.results.length; i++) {
            var result = this.state.results[i];
            for (var j = 0; j < result.indicators.length; j++) {
                var indicator = result.indicators[j];
                for (var k = 0; k < indicator.periods.length; k++) {
                    var period = indicator.periods[k];
                    for (var l = 0; l < period.data.length; l++) {
                        var update = period.data[l];
                        if (update.id == updateId) {
                            return update;
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

    reloadPeriod: function(periodId) {
        var url = endpoints.base_url + endpoints.period.replace('{period}', periodId);
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                var period = JSON.parse(xmlHttp.responseText);
                var indicatorId = period.indicator;
                thisApp.savePeriodToIndicator(period, indicatorId);
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    },

    selectResult: function(resultId) {
        this.setState({selectedResultId: resultId});
    },

    selectIndicator: function(indicatorId) {
        this.setState({selectedIndicatorId: indicatorId});
    },

    selectPeriod: function(periodId) {
        this.setState({selectedPeriodId: periodId});
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



function userIsAdmin() {
    // Check if the user is a PME mananager, resulting in different actions than a regular
    // PO officer.
    var adminOrgIds = [],
        partnerships;

    if (user.is_admin || user.is_superuser) {
        return true;
    }

    for (var i = 0; i < user.approved_employments.length; i++) {
        var employment = user.approved_employments[i];
        if (employment.group_name === 'Admins') {
            adminOrgIds.push(employment.organisation)
        }
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            partnerships = JSON.parse(xmlHttp.responseText).results;
            for (var j = 0; j < partnerships.length; j++) {
                var partnership = partnerships[j];
                if (adminOrgIds.indexOf(partnership.organisation) > -1) {
                    return true;
                }
            }
        }
    };
    xmlHttp.open("GET", endpoints.base_url + endpoints.partnerships, true);
    xmlHttp.send();

    return false;
}

function getUserData() {
    // Get the user data from the API and stores it in the global user variable
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            user = JSON.parse(xmlHttp.responseText);
            isAdmin = userIsAdmin();
        }
    };
    xmlHttp.open("GET", endpoints.base_url + endpoints.user, true);
    xmlHttp.send();
}

function setCurrentDate() {
    // Gets the current datetime from the initial settings and stores it in the global
    // currentDate variable
    currentDate = initialSettings.current_datetime;
    setInterval(function () {
        var localCurrentDate = new Date(currentDate);
        localCurrentDate.setSeconds(localCurrentDate.getSeconds() + 1);
        currentDate = localCurrentDate.toString();
    }, 1000);
}

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints, translations and page settings
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);
    initialSettings = JSON.parse(document.getElementById('initial-settings').innerHTML);

    setCurrentDate();
    getUserData();

    // Initialize the 'My reports' app
    ReactDOM.render(
        React.createElement(ResultsApp),
        document.getElementById('results-framework')
    );
});