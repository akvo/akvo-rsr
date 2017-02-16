/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var csrftoken,
    initialData,
    endpoints,
    months,
    i18n;

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

/* Capitalize the first character of a string */
function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* General API call function, retries 5 times by default and will retrieve all pages */
function apiCall(method, url, data, followPages, successCallback, retries) {
    var xmlHttp = new XMLHttpRequest();
    var maxRetries = 5;

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            var response;
            try {
                response = xmlHttp.responseText !== '' ? JSON.parse(xmlHttp.responseText) : '';
            }
            catch (e) {
                response = {"error": xmlHttp.statusText}
            }
            if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
                if (method === 'GET' && response.next !== undefined) {
                    if (response.next !== null && followPages) {
                        var success = function(newResponse) {
                            var oldResults = response.results;
                            response.results = oldResults.concat(newResponse.results);
                            if (successCallback !== undefined) {
                                return successCallback(response);
                            } else {
                                return false;
                            }
                        };
                        apiCall(method, response.next, data, followPages, success);
                    } else {
                        if (successCallback !== undefined) {
                            return successCallback(response);
                        } else {
                            return false;
                        }
                    }
                } else {
                    if (successCallback !== undefined) {
                        return successCallback(response);
                    } else {
                        return false;
                    }
                }
            } else {
                // TODO: Use a translated string
                var message = 'general error: ';
                for (var key in response) {
                    if (response.hasOwnProperty(key)) {
                         message += response[key] + '. ';
                    }
                }
                // TODO: Proper error logging
                // showGeneralError(message);
                console.log(message);
                return false;
            }
        }
    };

    xmlHttp.onerror = function () {
        if (retries === undefined) {
            return apiCall(method, url, data, followPages, successCallback, 2);
        } else if (retries <= maxRetries) {
            return apiCall(method, url, data, followPages, successCallback, retries + 1);
        } else {
            // TODO: Proper error logging
            // showGeneralError(i18nResults.connection_error);
            console.log('Connection error');
            return false;
        }
    };

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(data);
}

function loadAsync(url, callback, retryCount, retryLimit) {
    var xmlHttp;

    xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            if(xmlHttp.status == 200){
                callback(xmlHttp.responseText);
                return false;
            } else {
                if (retryCount >= retryLimit) {
                    // TODO: Proper error logging
                    console.log('Could not retrieve data from ' + url);
                    return false;
                } else {
                    retryCount = retryCount + 1;
                    loadAsync(url, retryCount, retryLimit);
                }
            }
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
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
        var date = new Date(dateString.split(".")[0].replace("/", /-/g));
        var day = date.getUTCDate();
        var month = getDateDescription(date.getUTCMonth());
        var year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return i18n.unknown_date;
}

function loadComponents() {
    var ProjectRow = React.createClass({
        getInitialState: function() {
            return {
                openChecks: false
            };
        },

        switchAction: function() {
            this.props.switchProject(this.props.project.id);
        },

        inLastExport: function() {
            if (this.props.lastExport.length > 0) {
                var lastExportProjects = this.props.lastExport[0].projects;
                if (lastExportProjects.indexOf(this.props.project.id) > -1) {
                    return true;
                }
            }
            return false;
        },

        statusLabel: function() {
            switch (this.props.project.iati_status) {
                case '1':
                    return cap(i18n.needs_funding);
                case '2':
                    return cap(i18n.active);
                case '3':
                    return cap(i18n.completed);
                case '4':
                    return cap(i18n.post_completion);
                case '5':
                    return cap(i18n.cancelled);
                case '6':
                    return cap(i18n.archived);
                default:
                    return cap(i18n.no_status);
            }
        },

        publishedAndPublicLabel: function() {
            var published = this.props.project.publishing_status === 'published' ? cap(i18n.published) : cap(i18n.unpublished);
            var publicProject = this.props.project.is_public ? i18n.public : i18n.private;
            return published + ' ' + i18n.and + ' ' + publicProject;
        },

        renderInput: function() {
            if (!this.props.exporting) {
                return (
                    <input type="checkbox" onClick={this.switchAction} checked={this.props.selected} />
                );
            } else {
                return (
                    <input type="checkbox" checked={this.props.selected} disabled />
                );
            }
        },

        openChecks: function () {
            this.setState({openChecks: true});
        },

        hideChecks: function () {
            this.setState({openChecks: false});
        },

        renderChecks: function() {
            if (this.props.project.checks_errors.length === 0 && this.props.project.checks_warnings.length === 0) {
                return (
                    <span>{cap(i18n.checks_success)}</span>
                );
            } else {
                var errorLength = this.props.project.checks_errors.length,
                    warningLength = this.props.project.checks_warnings.length,
                    checksText = '',
                    allErrors = '',
                    allWarnings = '';

                if (errorLength > 0) {
                    var errorText = errorLength === 1 ? i18n.error : i18n.errors;
                    checksText += errorLength + ' ' + errorText;
                    allErrors = this.props.project.checks_errors.map(function(check) {
                        return (
                            <span>- {cap(i18n.error)}: {cap(check)}<br/></span>
                        );
                    });
                }
                if (warningLength > 0) {
                    var warningText = warningLength === 1 ? i18n.warning : i18n.warnings;
                    if (errorLength > 0) {
                        checksText += ' ' + i18n.and + ' ';
                    }
                    checksText += warningLength + ' ' + warningText;
                    allWarnings = this.props.project.checks_warnings.map(function(check) {
                        return (
                            <span>- {cap(i18n.warning)}: {cap(check)}<br/></span>
                        );
                    });
                }

                if (this.state.openChecks) {
                    return (
                        <span>
                            {checksText} <a onClick={this.hideChecks}>- {cap(i18n.hide_all)}</a><br/>
                            {allErrors}
                            {allWarnings}
                        </span>
                    );
                } else {
                    return (
                        <span>
                            {checksText} <a onClick={this.openChecks}>+ {cap(i18n.show_all)}</a>
                        </span>
                    );
                }
            }
        },

        render: function() {
            return (
                <tr>
                    <td>{this.renderInput()}</td>
                    <td>{this.props.project.id}</td>
                    <td>
                        {this.props.project.title || '\<' + cap(i18n.untitled) + ' ' + i18n.project + '\>'}<br/>
                        <span className="small">{this.publishedAndPublicLabel()}</span>
                    </td>
                    <td>{this.statusLabel()}</td>
                    <td>{this.inLastExport() ? cap(i18n.yes) : cap(i18n.no)}</td>
                    <td>{this.renderChecks()}</td>
                </tr>
            );
        }
    });

    var ProjectsTable = React.createClass({
        sortedProjects: function() {
            // Sort the projects by ID
            function compare(u1, u2) {
                if (u1.id < u2.id) {
                    return -1;
                } else if (u1.id > u2.id) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return this.props.projects.sort(compare);
        },

        render: function() {
            var thisTable = this,
                projects,
                checked,
                onclickAll;

            if (this.props.projects.length > 0) {
                // In case there are projects, show a table overview of the projects.
                checked = this.props.projects.length === this.props.selectedProjects.length;
                onclickAll = checked ? this.props.deselectAll : this.props.selectAll;
                projects = this.sortedProjects().map(function(project) {
                    var selected = thisTable.props.selectedProjects.indexOf(project.id) > -1;
                    return React.createElement(ProjectRow, {
                        key: project.id,
                        project: project,
                        selected: selected,
                        switchProject: thisTable.props.switchProject,
                        lastExport: thisTable.props.lastExport,
                        exporting: thisTable.props.exporting
                    });
                });
            } else {
                // In case there are no projects, show a message.
                var language = window.location.pathname.substring(0, 3);
                checked = false;
                onclickAll = function() {return false;};
                projects = <tr>
                    <td colSpan="5" className="text-center">
                        <p className="noItem">
                            {i18n.no_projects_1 + ' ' + i18n.no_projects_2 + ' ' + i18n.no_projects_3}
                            <a href={language + "/myrsr/projects/"}>{i18n.here}</a>.
                        </p>
                    </td>
                </tr>;
            }

            return (
                <table className="table table-striped table-responsive myProjectList topMargin">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onClick={onclickAll} checked={checked} /></th>
                            <th>{i18n.id}</th>
                            <th>{cap(i18n.title)}</th>
                            <th>{cap(i18n.status)}</th>
                            <th>{cap(i18n.included_export)}</th>
                            <th>{i18n.iati_checks}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects}
                    </tbody>
                </table>
            );
        }
    });

    var NewExportOverview = React.createClass({
        getInitialState: function() {
            return {
                initializing: true,
                allProjects: null,
                selectedProjects: [],
                lastExport: null,
                publishedFilter: false,
                exporting: false,
                noErrorsChecked: false,
                previousChecked: false,
                publishedChecked: false
            };
        },

        componentDidMount: function() {
            var reportingUrl = endpoints.reporting_projects,
                lastExportUrl = endpoints.iati_exports + '&ordering=-id&limit=1',
                thisApp = this;

            function projectsLoaded(results) {
                if (thisApp.state.lastExport !== null) {
                    thisApp.setState({
                        initializing: false,
                        allProjects: results
                    });
                } else {
                    thisApp.setState({allProjects: results});
                }
            }

            function lastExportLoaded(response) {
                if (thisApp.state.allProjects !== null) {
                    thisApp.setState({
                        initializing: false,
                        lastExport: response.results
                    });
                } else {
                    thisApp.setState({lastExport: response.results});
                }
            }

            apiCall('GET', reportingUrl, {}, true, projectsLoaded);
            apiCall('GET', lastExportUrl, {}, false, lastExportLoaded);
        },

        switchProject: function(projectId) {
            // Add projectId to the selectedProjects state, if it is not present.
            // Else remove it from the state.
            var newSelection = this.state.selectedProjects,
                projectIndex = newSelection.indexOf(projectId);

            if (projectIndex > -1) {
                newSelection.splice(projectIndex, 1);
                this.checkUnchecked();
            } else {
                newSelection.push(projectId);
            }

            this.setState({selectedProjects: newSelection});
        },

        createExport: function() {
            var url = endpoints.new_iati_export,
                data = JSON.stringify({
                    'reporting_organisation': initialData.selected_org_id,
                    'user': initialData.user_id,
                    'projects': this.state.selectedProjects
                });

            function exportAdded(response) {
                // Redirect user back to overview
                window.location = window.location.href.replace('&new=true', '').replace('?new=true', '');
            }

            this.setState({exporting: true});
            apiCall('POST', url, data, true, exportAdded);
        },

        checkUnchecked: function() {
            // A check whether the filters should be unchecked (after deselecting a project,
            // for instance).
            var selection = this.state.selectedProjects,
                allProjects = this.state.allProjects.results,
                lastProjects = this.state.lastExport[0].projects;

            for (var i = 0; i < allProjects.length; i++) {
                var project = allProjects[i];
                if (project.checks_errors.length === 0 && selection.indexOf(project.id) < 0) {
                    this.setState({noErrorsChecked: false});
                }
                if (lastProjects.indexOf(project.id) > -1 && selection.indexOf(project.id) < 0) {
                    this.setState({previousChecked: false});
                }
                if (project.publishing_status === 'published' && selection.indexOf(project.id) < 0) {
                    this.setState({publishedChecked: false});
                }
            }
        },

        selectNoErrors: function(select) {
            var newSelection = this.state.selectedProjects;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var project = this.state.allProjects.results[i],
                    newSelectionIndex = newSelection.indexOf(project.id);
                if (select && newSelectionIndex < 0 && project.checks_errors.length === 0) {
                    newSelection.push(project.id);
                } else if (!select && newSelectionIndex > -1 && project.checks_errors.length === 0) {
                    newSelection.splice(newSelectionIndex, 1);
                }
            }

            this.setState({selectedProjects: newSelection});
        },

        checkNoErrors: function() {
            var noErrorsCount = 0;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var project = this.state.allProjects.results[i];
                if (project.checks_errors.length === 0) {
                    noErrorsCount++;
                }
            }

            return noErrorsCount;
        },

        clickNoErrorsProjects: function() {
            var previousState = this.state.noErrorsChecked;
            this.setState({noErrorsChecked: !previousState});
            if (previousState) {
                this.selectNoErrors(false);
            } else {
                this.selectNoErrors(true);
            }
        },

        renderNoErrorsButton: function() {
            if (this.state.allProjects === null || this.state.allProjects.results.length === 0 || this.checkNoErrors() === 0) {
                return (
                    <span />
                );
            } else {
                var buttonClass = "btn btn-default btn-sm";

                if (this.state.exporting) {
                    buttonClass += " disabled";
                }

                return (
                    <button className={buttonClass} onClick={this.clickNoErrorsProjects}>
                        <input type="checkbox" checked={this.state.noErrorsChecked} /> {cap(i18n.without_errors)}
                    </button>
                );
            }
        },

        selectPublished: function(select) {
            var newSelection = this.state.selectedProjects;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var project = this.state.allProjects.results[i],
                    newSelectionIndex = newSelection.indexOf(project.id);
                if (select && newSelectionIndex < 0 && project.publishing_status === 'published') {
                    newSelection.push(project.id);
                } else if (!select && newSelectionIndex > -1 && project.publishing_status === 'published') {
                    newSelection.splice(newSelectionIndex, 1);
                }
            }

            this.setState({selectedProjects: newSelection});
        },

        checkPublished: function() {
            var noErrorsCount = 0;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var project = this.state.allProjects.results[i];
                if (project.publishing_status === 'published') {
                    return true;
                }
            }

            return false;
        },

        clickPublishedProjects: function() {
            var previousState = this.state.publishedChecked;
            this.setState({publishedChecked: !previousState});
            if (previousState) {
                this.selectPublished(false);
            } else {
                this.selectPublished(true);
            }
        },

        renderPublishedButton: function() {
            if (this.state.allProjects === null || this.state.allProjects.results.length === 0 || !this.checkPublished()) {
                return (
                    <span />
                );
            } else {
                var buttonClass = "btn btn-default btn-sm";

                if (this.state.exporting) {
                    buttonClass += " disabled";
                }

                return (
                    <button className={buttonClass} onClick={this.clickPublishedProjects}>
                        <input type="checkbox" checked={this.state.publishedChecked} /> {cap(i18n.published)}
                    </button>
                );
            }
        },

        selectPrevious: function(select) {
            var lastProjects = this.state.lastExport[0].projects,
                newSelection = this.state.selectedProjects;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var projectId = this.state.allProjects.results[i].id,
                    newSelectionIndex = newSelection.indexOf(projectId);
                if (select && lastProjects.indexOf(projectId) > -1 && newSelectionIndex < 0) {
                    newSelection.push(projectId);
                } else if (!select && lastProjects.indexOf(projectId) > -1 && newSelectionIndex > -1) {
                    newSelection.splice(newSelectionIndex, 1);
                }
            }

            this.setState({selectedProjects: newSelection});
        },

        checkPrevious: function() {
            var lastProjects = this.state.lastExport[0].projects,
                countLastProjects = 0;

            for (var i = 0; i < lastProjects.length; i++) {
                var lastProject = lastProjects[i];
                if (this.state.selectedProjects.indexOf(lastProject) > -1) {
                    countLastProjects++;
                }
            }

            return countLastProjects === lastProjects.length;
        },

        clickPreviousProjects: function() {
            var previousState = this.state.previousChecked;
            this.setState({previousChecked: !previousState});
            if (previousState) {
                this.selectPrevious(false);
            } else {
                this.selectPrevious(true);
            }
        },

        renderSelectPreviousButton: function() {
            if (this.state.initializing || this.state.allProjects.results.length === 0 ||
                    this.state.lastExport.length === 0 || this.state.lastExport[0].projects.length === 0) {
                return (
                    <span />
                );
            } else {
                var buttonClass = "btn btn-default btn-sm";

                if (this.state.exporting) {
                    buttonClass += " disabled";
                }

                return (
                    <button className={buttonClass} onClick={this.clickPreviousProjects}>
                        <input type="checkbox" checked={this.state.previousChecked} /> {cap(i18n.included_export)}
                    </button>
                );
            }
        },

        selectAll: function(select) {
            // Select or deselect all projects. The 'select' parameter determines whether all
            // projects should be selected (true) or deselected (false).

            // Remove existing selection
            var newSelection = [];
            this.setState({selectedProjects: newSelection});

            if (select) {
                // Select all projects from allProjects state
                for (var i = 0; i < this.state.allProjects.results.length; i++) {
                    var project = this.state.allProjects.results[i];
                    newSelection.push(project.id);
                }

                // Select all projects in state
                this.setState({selectedProjects: newSelection});
            }
        },

        selectAllProjects: function() {
            this.selectAll(true);
        },

        deselectAllProjects: function() {
            this.selectAll(false);
        },

        selectProjects: function(select, key, value) {
            var newSelection = this.state.selectedProjects;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var project = this.state.allProjects.results[i],
                    newSelectionIndex = newSelection.indexOf(project.id);
                if (select && project[key] === value && newSelectionIndex < 0) {
                    newSelection.push(project.id);
                } else if (!select && project[key] === value && newSelectionIndex > -1) {
                    newSelection.splice(newSelectionIndex, 1);
                }
            }
            this.setState({selectedProjects: newSelection});
        },

        checkProjects: function(key, value, any) {
            var count = 0,
                countSelected = 0;

            for (var i = 0; i < this.state.allProjects.results.length; i++) {
                var project = this.state.allProjects.results[i];
                if (project[key] === value) {
                    if (any) {
                        return true;
                    } else {
                        count++;
                        if (this.state.selectedProjects.indexOf(project.id) > -1) {
                            countSelected++;
                        }
                    }
                }
            }

            return any ? false : count === countSelected;
        },

        renderFilters: function() {
            return (
                <div className="row iatiFilters">
                    <div className="col-sm-8 filterGroup">
                        <h5>{cap(i18n.project_selection)}</h5>
                        {this.renderNoErrorsButton()}
                        {this.renderSelectPreviousButton()}
                        {this.renderPublishedButton()}
                    </div>
                    <div className="col-sm-4 newIatiExport text-center">
                        <p>{this.state.selectedProjects.length} {i18n.projects_selected}</p>
                        {this.renderCreateButton()}
                    </div>
                </div>
            );
        },

        renderCreateButton: function() {
            if (!this.state.exporting) {
                if (this.state.selectedProjects.length > 0) {
                    return (
                        <button className="btn btn-default btn-sm" onClick={this.createExport}>
                            <i className="fa fa-file-text-o" /> {cap(i18n.create_new)} {i18n.iati_export}
                        </button>
                    );
                } else {
                    return (
                        <button className="btn btn-default btn-sm disabled">
                            <i className="fa fa-file-text-o" /> {cap(i18n.create_new)} {i18n.iati_export}
                        </button>
                    );
                }
            } else {
                return (
                    <button className="btn btn-default btn-sm disabled">
                        <i className="fa fa-spin fa-spinner" /> {cap(i18n.create_new)} {i18n.iati_export}
                    </button>
                );
            }
        },

        render: function() {
            if (this.state.initializing) {
                // Only show a message that data is being loading when initializing
                return (
                    <span className="small">
                        <i className="fa fa-spin fa-spinner"/> {cap(i18n.loading)} {i18n.projects}...
                    </span>
                );
            } else {
                // Show a table of projects when the data has been loaded
                return (
                    <div>
                        {this.renderFilters()}
                        {React.createElement(ProjectsTable, {
                            projects: this.state.allProjects.results,
                            selectedProjects: this.state.selectedProjects,
                            switchProject: this.switchProject,
                            lastExport: this.state.lastExport,
                            exporting: this.state.exporting,
                            selectAll: this.selectAllProjects,
                            deselectAll: this.deselectAllProjects
                        })}
                    </div>
                );
            }


        }
    });

    var ExportRow = React.createClass({
        openPublicFile: function() {
            window.open(i18n.last_exports_url, '_blank');
        },

        openFile: function() {
            window.open(this.props.exp.iati_file, '_blank');
        },

        setPublic: function() {
            this.props.setPublic(this.props.exp.id);
        },

        renderActions: function() {
            if (this.props.publicFile) {
                return (
                    <button className="btn btn-success btn-sm" onClick={this.openPublicFile}>
                        <i className="fa fa-globe" /> {cap(i18n.view_latest_file)}
                    </button>
                );
            } else if (this.props.exp.iati_file) {
                if (!this.props.actionInProgress) {
                    return (
                        <div>
                            <button className="btn btn-default btn-sm" onClick={this.openFile}>
                                <i className="fa fa-code" /> {cap(i18n.view_file)}
                            </button>
                            <button className="btn btn-default btn-sm" onClick={this.setPublic}>
                                <i className="fa fa-globe" /> {cap(i18n.set_latest)}
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <button className="btn btn-default btn-sm" onClick={this.openFile}>
                                <i className="fa fa-code" /> {cap(i18n.view_file)}
                            </button>
                            <button className="btn btn-default btn-sm disabled">
                                <i className="fa fa-globe" /> {cap(i18n.set_latest)}
                            </button>
                        </div>
                    );
                }
            } else {
                return (
                    <button className="btn btn-default btn-sm disabled">
                        <i className="fa fa-globe" /> {cap(i18n.no_iati_file)}
                    </button>
                );
            }
        },

        renderRowClass: function() {
            if (this.props.publicFile) {
                return 'success';
            } else if (this.props.exp.status === 1 || this.props.exp.status === 2) {
                return 'warning';
            } else if (this.props.exp.status === 4 || this.props.exp.iati_file === '') {
                return 'error';
            } else {
                return '';
            }
        },

        renderNumberOfProjects: function() {
            if (this.props.exp.status !== 2) {
                return this.props.exp.projects.length;
            } else {
                return this.props.exp.projects.length + ' (' +  this.props.exp.processed_projects + ' ' + i18n.processed + ')';
            }
        },

        render: function() {
            return (
                <tr className={this.renderRowClass()}>
                    <td>{this.props.exp.status_label}</td>
                    <td>{this.renderNumberOfProjects()}</td>
                    <td>{this.props.exp.user_name}</td>
                    <td>{displayDate(this.props.exp.created_at)}</td>
                    <td>{'v' + this.props.exp.version}</td>
                    <td className="text-right">{this.renderActions()}</td>
                </tr>
            );
        }
    });

    var ExportsTable = React.createClass({
        render: function() {
            var thisTable = this,
                exports;

            if (this.props.exports.length > 0) {
                // In case there are existing IATI exports, show a table overview of the exports.
                exports = this.props.exports.map(function(exp) {
                    var publicFile = thisTable.props.publicFile === exp.id;

                    return React.createElement(ExportRow, {
                        key: exp.id,
                        exp: exp,
                        publicFile: publicFile,
                        setPublic: thisTable.props.setPublic,
                        actionInProgress: thisTable.props.actionInProgress
                    });
                });
            } else {
                // In case there are no existing IATI exports yet, show a message.
                exports = <tr>
                    <td colSpan="6" className="text-center">
                        <p className="noItem">
                            {cap(i18n.no_exports)}
                        </p>
                    </td>
                </tr>;
            }

            return (
                <table className="table table-striped table-responsive myProjectList topMargin">
                    <thead>
                        <tr>
                            <th>{cap(i18n.status)}</th>
                            <th>{i18n.number_of_projects}</th>
                            <th>{cap(i18n.created_by)}</th>
                            <th>{cap(i18n.created_at)}</th>
                            <th>{i18n.iati_version}</th>
                            <th className="text-right">{cap(i18n.actions)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exports}
                    </tbody>
                </table>
            );
        }
    });

    var ExportsOverview = React.createClass({
        getInitialState: function() {
            return {
                exports: null,
                initializing: true,
                refreshing: false,
                refreshingIn: 0,
                actionInProgress: false
            };
        },

        componentDidMount: function() {
            this.loadExports(true);
        },

        loadExports: function(first_time) {
            var thisApp = this,
                url = endpoints.base_url + endpoints.iati_exports;


            function firstTimeSuccess(response) {
                thisApp.setState({
                    initializing: false,
                    exports: response
                });
                if (thisApp.pendingOrInProgress()) {
                    thisApp.startCountDown();
                }
            }

            function refreshingSuccess(response) {
                thisApp.setState({
                    refreshing: false,
                    actionInProgress: false,
                    exports: response
                });
                if (thisApp.pendingOrInProgress()) {
                    thisApp.startCountDown();
                }
            }

            if (!first_time) {
                this.setState({refreshing: true});
                apiCall('GET', url, {}, true, refreshingSuccess);
            } else {
                apiCall('GET', url, {}, true, firstTimeSuccess);
            }
        },

        sortedExports: function() {
            // Sort the IATI exports by created at
            function compare(u1, u2) {
                if (u1.id > u2.id) {
                    return -1;
                } else if (u1.id < u2.id) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return this.state.exports.results.sort(compare);
        },

        startCountDown: function() {
            // Set the countdown for refreshing the table to start at 10 seconds
            this.setState({refreshingIn: 10});

            // Start ticking down
            var thisApp = this,
                intervalId = setInterval(tick, 1000);

            function tick() {
                var newRefreshing = thisApp.state.refreshingIn - 1;
                thisApp.setState({refreshingIn: newRefreshing});
                if (newRefreshing === 0) {
                    // Once done, reload the exports
                    clearInterval(intervalId);
                    thisApp.loadExports(false);
                }
            }
        },

        publicFile: function() {
            if (this.state.exports === null) {
                return null;
            } else {
                var sortedExports = this.sortedExports();
                for (var i = 0; i < sortedExports.length; i++) {
                    var exp = sortedExports[i];
                    if (exp.iati_file !== '' && exp.is_public) {
                        return exp.id;
                    }
                }
                return null;
            }
        },

        findExport: function(exportId) {
            for (var i = 0; i < this.state.exports.results.length; i++) {
                var exp = this.state.exports.results[i];
                if (exp.id === exportId) {
                    return exp;
                }
            }
            return null;
        },

        pendingOrInProgress: function() {
            // Check to see whether there is at least one export pending or in progress.
            if (!this.state.initializing) {
                for (var i = 0; i < this.state.exports.results.length; i++) {
                    var exp = this.state.exports.results[i];
                    if (exp.status < 3) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        },

        setPublic: function(exportId) {
            // Basically what we do is to set this export to public first, and then set all
            // newer exports to private. This automatically makes this export the public export.
            var thisApp = this,
                exportUrl = endpoints.base_url + endpoints.iati_export,
                thisExport = this.findExport(exportId),
                newerExports = [],
                newerExportsUpdated = 0,
                publicData = JSON.stringify({'is_public': true}),
                privateData = JSON.stringify({'is_public': false});

            function allExportsUpdated() {
                thisApp.loadExports(false);
            }

            function newerExportUpdated(response) {
                newerExportsUpdated++;
                if (newerExportsUpdated === newerExports.length) {
                    allExportsUpdated();
                }
            }

            function exportUpdated(response) {
                // Find the newer IATI exports
                for (var i = 0; i < thisApp.state.exports.results.length; i++) {
                    var newerExp = thisApp.state.exports.results[i];
                    if (newerExp.id !== exportId && newerExp.id > thisExport.id) {
                        newerExports.push(newerExp);
                    }
                }

                // Update the newer IATI exports
                if (newerExports.length > 0) {
                    for (var j = 0; j < newerExports.length; j++) {
                        var exp = newerExports[j];
                        apiCall('PATCH', exportUrl.replace('{iati_export}', exp.id), privateData, true, newerExportUpdated);
                    }
                } else {
                    allExportsUpdated();
                }
            }

            // Set current IATI export to public
            this.setState({actionInProgress: true});
            apiCall('PATCH', exportUrl.replace('{iati_export}', exportId), publicData, true, exportUpdated);
        },

        renderRefreshing: function() {
            if (this.state.refreshing) {
                return (
                    <span className="small">
                        <i className="fa fa-spin fa-spinner" /> {cap(i18n.refreshing) + ' ' + i18n.iati_exports + '...'}
                    </span>
                );
            } else if (this.pendingOrInProgress()) {
                return (
                    <span className="small">
                        <i className="fa fa-spin fa-spinner" /> {cap(i18n.pending_or_progress) + '. ' + cap(i18n.refreshing) + ' ' + i18n.in + ' ' + this.state.refreshingIn + ' ' + i18n.seconds + '...'}
                    </span>
                );
            } else {
                return (
                    <span />
                );
            }
        },

        render: function() {
            var initOrTable,
                exportCount,
                exportCountString;

            exportCount = !this.state.initializing ? this.state.exports.count : null;
            exportCountString = (exportCount !== null && exportCount > 0) ? ' ' + this.state.exports.count + ' ' : ' ';

            if (this.state.initializing) {
                // Only show a message that data is being loading when initializing
                initOrTable = <span className="small"><i className="fa fa-spin fa-spinner"/>{' ' + cap(i18n.loading) + ' ' + i18n.last + ' ' + i18n.iati_exports + '...'}</span>;
            } else {
                // Show a table of existing imports when the data has been loaded
                initOrTable = React.createElement(ExportsTable, {
                    exports: this.sortedExports(),
                    refreshing: this.state.refreshing,
                    publicFile: this.publicFile(),
                    setPublic: this.setPublic,
                    actionInProgress: this.state.actionInProgress
                });
            }

            return (
                <div>
                    <h4 className="topMargin">{cap(i18n.last) + exportCountString + i18n.iati_exports}</h4>
                    {this.renderRefreshing()}
                    {initOrTable}
                </div>
            );
        }
    });

    if (document.getElementById('exportsOverview')) {
        // Render 'My IATI' overview of existing exports
        ReactDOM.render(
            React.createElement(ExportsOverview),
            document.getElementById('exportsOverview')
        );
    } else if (document.getElementById('newIATIExport')) {
        // Render 'My IATI' overview of existing exports
        ReactDOM.render(
            React.createElement(NewExportOverview),
            document.getElementById('newIATIExport')
        );
    }
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
    function initReact() {
        loadComponents();
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, initReact, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

function setFileOnOrganisationPage() {
    var checkbox = document.getElementById('fileOnOrganisationPage');
    if (checkbox) {
        checkbox.onchange = function() {
            var data = JSON.stringify({'public_iati_file': checkbox.checked ? true : false});
            apiCall('PATCH', endpoints.organisation, data, true, function(){});
        };
    }
}

function setCreateFileOnClick() {
    var button = document.getElementById('createIATIExport');
    if (button) {
        button.onclick = function() {
            // Add new=true parameter to URL and redirect to new URL
            var linkSign = window.location.href.indexOf('org=') < 0 ? '?' : '&';
            window.location = window.location.href + linkSign + 'new=true';
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    endpoints = JSON.parse(document.getElementById("endpoints").innerHTML);
    months = JSON.parse(document.getElementById("months").innerHTML);
    i18n = JSON.parse(document.getElementById("translations").innerHTML);
    initialData = JSON.parse(document.getElementById("data").innerHTML);

    setCreateFileOnClick();
    setFileOnOrganisationPage();

    if (document.getElementById('exportsOverview') || document.getElementById('newIATIExport')) {
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            loadComponents();
        } else {
            loadAndRenderReact();
        }
    }
});
