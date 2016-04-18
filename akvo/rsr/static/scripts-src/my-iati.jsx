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
            var response = xmlHttp.responseText !== '' ? JSON.parse(xmlHttp.responseText) : '';
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
                // var message = i18nResults.general_error + ': ';
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

function processResponse(label, response) {
    var label_content, checks, all_checks_passed, span, checks_response;

    label_content = label.innerHTML.replace("noCheck", "");
    checks = JSON.parse(response);

    all_checks_passed = checks.all_checks_passed;
    checks_response = checks.checks;

    if (all_checks_passed === "True") {
        span = document.createElement("span");
        span.className = "success";

        for (var i = 0; i < checks_response.length; i++) {
            if (checks_response[i][0] === "warning") {
                label_content += "<br/><span class='warning'>- " + i18n.warning + ": " + capitalizeFirstLetter(checks_response[i][1]) + "</span>";
            }
        }
        span.innerHTML = label_content;

        label.innerHTML = '';
        label.appendChild(span);

    } else {
        span = document.createElement("span");
        span.className = "error";
        for (var j = 0; j < checks_response.length; j++) {
            if (checks_response[j][0] === "error") {
                label_content += "<br/><span class='error'>- " + capitalizeFirstLetter(checks_response[j][1]) + "</span>";
            } else if (checks_response[j][0] === "warning") {
                label_content += "<br/><span class='warning'>- " + i18n.warning + ": " + capitalizeFirstLetter(checks_response[j][1]) + "</span>";
            }
        }
        span.innerHTML = label_content;

        label.innerHTML = '';
        label.appendChild(span);
    }
}

function getProjectLabels() {
    var labels;

    labels = document.getElementById('id_projects').getElementsByTagName('label');

    for (var i = 0; i < labels.length; i++) {
        var project_id;

        project_id = labels[i].getElementsByTagName('input')[0].value;
        loadAsync('/rest/v1/project_iati_check/' + project_id + '/?format=json', 0, 3, labels[i]);
    }
}

function loadComponents() {
    var IatiChecks = React.createClass({
        getInitialState: function() {
            return {
                button_state: 'active'
            };
        },

        handleClick: function() {
            this.setState({
                button_state: 'loading'
            });

            getProjectLabels();

            var thisContainer = this;
            setTimeout(function() {
                thisContainer.setState({
                    button_state: false
                });
            }, 10000);
        },

        render: function() {
            switch (this.state.button_state) {
                case 'active':
                    return (
                        <p>
                            <button onClick={this.handleClick} className='btn btn-primary'>
                                {i18n.perform_checks}
                            </button>
                        </p>
                    );
                case 'loading':
                    return (
                        <p>
                            <button onClick={this.handleClick} className='btn btn-primary' disabled>
                                <i className="fa fa-spin fa-spinner" /> {i18n.performing_checks}
                            </button>
                        </p>
                    );
                default:
                    return (
                        <span />
                    );
            }
        }
    });

    var ProjectRow = React.createClass({
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

        render: function() {
            var publicStatus = this.props.project.is_public ? i18n.public : i18n.private;

            return (
                <tr>
                    <td><input type="checkbox" onClick={this.switchAction} checked={this.props.selected} /></td>
                    <td>{this.props.project.id}</td>
                    <td>
                        {this.props.project.title || '\<' + cap(i18n.untitled) + ' ' + i18n.project + '\>'}<br/>
                        <span className="small">{cap(this.props.project.publishing_status) + ' ' + i18n.and + ' ' + publicStatus}</span>
                    </td>
                    <td>{this.props.project.status_label || i18n.no_status}</td>
                    <td>{this.inLastExport() ? cap(i18n.yes) : cap(i18n.no)}</td>
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
                projects;

            if (this.props.projects.length > 0) {
                // In case there are projets, show a table overview of the projects.
                projects = this.sortedProjects().map(function(project) {
                    var selected = thisTable.props.selectedProjects.indexOf(project.id) > -1;
                    return React.createElement(ProjectRow, {
                        key: project.id,
                        project: project,
                        selected: selected,
                        switchProject: thisTable.props.switchProject,
                        lastExport: thisTable.props.lastExport
                    });
                });
            } else {
                // In case there are no projects, show a message.
                var language = window.location.pathname.substring(0, 3);
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
                            <th />
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
                lastExport: null
            };
        },

        componentDidMount: function() {
            var reportingUrl = endpoints.reporting_projects,
                lastExportUrl = endpoints.iati_exports + '&limit=1',
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
                window.location = window.location.href.replace('&new=true', '');
            }

            apiCall('POST', url, data, true, exportAdded);
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

        renderSelectAllButton: function() {
            if (this.state.allProjects === null) {
                return (
                    <span />
                );
            } else if (this.state.allProjects.results.length === this.state.selectedProjects.length) {
                return (
                    <div className="col-sm-3">
                        <button className="btn btn-primary" onClick={this.deselectAllProjects}>Deselect all projects</button>
                    </div>
                );
            } else {
                return (
                    <div className="col-sm-3">
                        <button className="btn btn-primary" onClick={this.selectAllProjects}>Select all projects</button>
                    </div>
                );
            }
        },

        render: function() {
            var initOrTable;

            if (this.state.initializing) {
                // Only show a message that data is being loading when initializing
                initOrTable = <span className="small"><i className="fa fa-spin fa-spinner"/>{' ' + cap(i18n.loading) + ' ' + i18n.projects + '...'}</span>;
            } else {
                // Show a table of projects when the data has been loaded
                initOrTable = React.createElement(ProjectsTable, {
                    projects: this.state.allProjects.results,
                    selectedProjects: this.state.selectedProjects,
                    switchProject: this.switchProject,
                    lastExport: this.state.lastExport
                });
            }

            return (
                <div>
                    <h4 className="topMargin">{cap(i18n.new) + ' ' + i18n.iati_export}</h4>
                    <div className="performChecksDescription">
                        <span>{i18n.perform_checks_description_1 + ' ' + i18n.perform_checks_description_2}</span>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <button className="btn btn-success" onClick={this.createExport}>Create IATI file</button>
                        </div>
                        {this.renderSelectAllButton()}
                    </div>
                    {initOrTable}
                </div>
            );
        }
    });

    var ExportRow = React.createClass({
        openPublicFile: function() {
            window.open(i18n.last_exports_url, '_blank');
        },

        openFile: function() {
            window.open(endpoints.base_url + '/media/' + this.props.exp.iati_file, '_blank');
        },

        setPublic: function() {
            this.props.setPublic(this.props.exp.id);
        },

        renderActions: function() {
            if (this.props.publicFile) {
                return (
                    <button className="btn btn-success btn-sm" onClick={this.openPublicFile}>
                        <i className="fa fa-globe" /> {cap(i18n.view_public_file)}
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
                                <i className="fa fa-globe" /> {cap(i18n.set_public)}
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
                                <i className="fa fa-globe" /> {cap(i18n.set_public)}
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
                return 'publicFile';
            } else if (this.props.exp.status === 2) {
                return 'inProgress';
            } else if (this.props.exp.status === 4 || this.props.exp.iati_file === '') {
                return 'cancelled';
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
        sortedExports: function() {
            // Sort the IATI exports by created at
            function compare(u1, u2) {
                if (u1.created_at > u2.created_at) {
                    return -1;
                } else if (u1.created_at < u2.created_at) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return this.props.exports.results.sort(compare);
        },

        render: function() {
            var thisTable = this,
                exports;

            if (this.props.exports.results.length > 0) {
                // In case there are existing IATI exports, show a table overview of the exports.
                exports = this.sortedExports().map(function(exp) {
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
                for (var i = 0; i < this.state.exports.results.length; i++) {
                    var exp = this.state.exports.results[i];
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
                    if (newerExp.id !== exportId && newerExp.created_at > thisExport.created_at) {
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
                exportCountString,
                lastExportDescription;

            exportCount = !this.state.initializing ? this.state.exports.count : null;
            exportCountString = (exportCount !== null && exportCount > 0) ? ' ' + this.state.exports.count + ' ' : ' ';

            if (this.state.initializing) {
                // Only show a message that data is being loading when initializing
                initOrTable = <span className="small"><i className="fa fa-spin fa-spinner"/>{' ' + cap(i18n.loading) + ' ' + i18n.last + ' ' + i18n.iati_exports + '...'}</span>;
            } else {
                // Show a table of existing imports when the data has been loaded
                initOrTable = React.createElement(ExportsTable, {
                    exports: this.state.exports,
                    refreshing: this.state.refreshing,
                    publicFile: this.publicFile(),
                    setPublic: this.setPublic,
                    actionInProgress: this.state.actionInProgress
                });
            }

            lastExportDescription = <div className="lastExportDescription">
                <span>{cap(i18n.last_exports_1)}</span>
                <a href={i18n.last_exports_url} target="_blank">{i18n.last_exports_url}</a>
                <span>{'. ' + cap(i18n.last_exports_2) + ' ' + cap(i18n.last_exports_3)}</span>
                <a href="http://iatiregistry.org" target="_blank">{i18n.iati_registry}</a>
                <span>{i18n.last_exports_4}</span>
            </div>;

            return (
                <div>
                    <h4 className="topMargin">{cap(i18n.last) + exportCountString + i18n.iati_exports}</h4>
                    {lastExportDescription}
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

function setCreateFileOnClick() {
    var button = document.getElementById('createIATIExport');
    if (button) {
        button.onclick = function() {
            window.location = window.location.href + '&new=true';
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    endpoints = JSON.parse(document.getElementById("endpoints").innerHTML);
    months = JSON.parse(document.getElementById("months").innerHTML);
    i18n = JSON.parse(document.getElementById("translations").innerHTML);
    initialData = JSON.parse(document.getElementById("data").innerHTML);

    setCreateFileOnClick();

    if (document.getElementById('exportsOverview') || document.getElementById('newIATIExport')) {
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            loadComponents();
        } else {
            loadAndRenderReact();
        }
    }
});
