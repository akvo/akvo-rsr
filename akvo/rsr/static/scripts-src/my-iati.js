/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var csrftoken,
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
                            if (successCallback !== undefined) {
                                return successCallback(response);
                            } else {
                                return false;
                            }
                        };
                        apiCall(method, response.next, data, success);
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
            return apiCall(method, url, data, successCallback, 2);
        } else if (retries <= maxRetries) {
            return apiCall(method, url, data, successCallback, retries + 1);
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
    var IatiChecks = React.createClass({displayName: 'IatiChecks',
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
                        React.DOM.p(null, 
                            React.DOM.button( {onClick:this.handleClick, className:"btn btn-primary"}, 
                                i18n.perform_checks
                            )
                        )
                    );
                case 'loading':
                    return (
                        React.DOM.p(null, 
                            React.DOM.button( {onClick:this.handleClick, className:"btn btn-primary", disabled:true}, 
                                React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18n.performing_checks
                            )
                        )
                    );
                default:
                    return (
                        React.DOM.span(null )
                    );
            }
        }
    });

    var ExportRow = React.createClass({displayName: 'ExportRow',
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
                    React.DOM.button( {className:"btn btn-success btn-sm", onClick:this.openPublicFile}, 
                        React.DOM.i( {className:"fa fa-globe"} ), " ", cap(i18n.view_public_file)
                    )
                );
            } else if (this.props.exp.iati_file) {
                return (
                    React.DOM.div(null, 
                        React.DOM.button( {className:"btn btn-default btn-sm", onClick:this.openFile}, 
                            React.DOM.i( {className:"fa fa-code"} ), " ", cap(i18n.view_file)
                        ),
                        React.DOM.button( {className:"btn btn-default btn-sm", onClick:this.setPublic}, 
                            React.DOM.i( {className:"fa fa-globe"} ), " ", cap(i18n.set_public)
                        )
                    )
                );
            } else {
                return (
                    React.DOM.button( {className:"btn btn-default btn-sm disabled"}, 
                        React.DOM.i( {className:"fa fa-globe"} ), " ", cap(i18n.no_iati_file)
                    )
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

        render: function() {
            return (
                React.DOM.tr( {className:this.renderRowClass()}, 
                    React.DOM.td(null, this.props.exp.status_label),
                    React.DOM.td(null, this.props.exp.projects.length),
                    React.DOM.td(null, this.props.exp.user_name),
                    React.DOM.td(null, displayDate(this.props.exp.created_at)),
                    React.DOM.td(null, 'v' + this.props.exp.version),
                    React.DOM.td( {className:"text-right"}, this.renderActions())
                )
            );
        }
    });

    var ExportsTable = React.createClass({displayName: 'ExportsTable',
        render: function() {
            var thisTable = this;

            var exports = this.props.exports.results.map(function(exp) {
                var publicFile = thisTable.props.publicFile === exp.id;

                return React.createElement(ExportRow, {
                    key: exp.id,
                    exp: exp,
                    publicFile: publicFile,
                    setPublic: thisTable.props.setPublic
                });
            });


            return (
                React.DOM.table( {className:"table table-striped table-responsive myProjectList topMargin"}, 
                    React.DOM.thead(null, 
                        React.DOM.tr(null, 
                            React.DOM.th(null, cap(i18n.status)),
                            React.DOM.th(null, i18n.number_of_projects),
                            React.DOM.th(null, cap(i18n.created_by)),
                            React.DOM.th(null, cap(i18n.created_at)),
                            React.DOM.th(null, i18n.iati_version),
                            React.DOM.th( {className:"text-right"}, cap(i18n.actions))
                        )
                    ),
                    React.DOM.tbody(null, 
                        exports
                    )
                )
            );
        }
    });
    
    var MyIATI = React.createClass({displayName: 'MyIATI',
        getInitialState: function() {
            return {
                exports: null,
                initializing: true,
                refreshing: false,
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
            }

            function refreshingSuccess(response) {
                thisApp.setState({
                    refreshing: false,
                    exports: response
                });
            }

            if (!first_time) {
                this.setState({refreshing: true});
                apiCall('GET', url, {}, refreshingSuccess);
            } else {
                apiCall('GET', url, {}, firstTimeSuccess);
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
                thisApp.setState({actionInProgress: false});
            }

            function exportUpdated(response) {
                newerExportsUpdated++;
                if (newerExportsUpdated === newerExports.length) {
                    allExportsUpdated();
                }
            }

            // Set current IATI export to public
            this.setState({actionInProgress: true});
            apiCall('PATCH', exportUrl.replace('{iati_export}', exportId), publicData);

            // Find the newer IATI exports
            for (var i = 0; i < this.state.exports.results.length; i++) {
                var newerExp = this.state.exports.results[i];
                if (newerExp.id !== exportId && newerExp.created_at > thisExport.created_at) {
                    newerExports.push(newerExp);
                }
            }

            // Update the newer IATI exports
            if (newerExports.length > 0) {
                for (var j = 0; j < newerExports.length; j++) {
                    var exp = newerExports[j];
                    apiCall('PATCH', exportUrl.replace('{iati_export}', exp.id), privateData, exportUpdated);
                }
            } else {
                allExportsUpdated();
            }
        },

        render: function() {
            var initOrTable,
                refreshing,
                exportCount,
                exportCountString,
                lastExportDescription;

            refreshing = this.state.refreshing ? React.DOM.span( {className:"small"}, React.DOM.i( {className:"fa fa-spin fa-spinner"} ),' ' + cap(i18n.refreshing) + ' ' + i18n.iati_exports + '...') : React.DOM.span(null );
            exportCount = !this.state.initializing ? this.state.exports.count : null;
            exportCountString = (exportCount !== null && exportCount > 0) ? ' ' + this.state.exports.count + ' ' : ' ';

            if (this.state.initializing) {
                // Only show a message that data is being loading when initializing
                initOrTable = React.DOM.span( {className:"small"}, React.DOM.i( {className:"fa fa-spin fa-spinner"}),' ' + cap(i18n.loading) + ' ' + i18n.last + ' ' + i18n.iati_exports + '...');
            } else if (exportCount > 0) {
                // Show a table of exiting imports (max 10) when the data has been loaded and exports exist
                initOrTable = React.createElement(ExportsTable, {
                    exports: this.state.exports,
                    refreshing: this.state.refreshing,
                    publicFile: this.publicFile(),
                    setPublic: this.setPublic
                });
            } else {
                // Do not show the 'Last exports' part when no exports exist yet
                return (
                    React.DOM.div(null, 
                        React.DOM.h4( {className:"topMargin"}, cap(i18n.new) + ' ' + i18n.iati_export)
                    )
                );
            }

            lastExportDescription = React.DOM.div( {className:"lastExportDescription"}, 
                React.DOM.span(null, cap(i18n.last_exports_1)),
                React.DOM.a( {href:i18n.last_exports_url, target:"_blank"}, i18n.last_exports_url),
                React.DOM.span(null, '. ' + cap(i18n.last_exports_2) + ' ' + cap(i18n.last_exports_3)),
                React.DOM.a( {href:"http://iatiregistry.org", target:"_blank"}, i18n.iati_registry),
                React.DOM.span(null, i18n.last_exports_4)
            );

            return (
                React.DOM.div(null, 
                    React.DOM.h4( {className:"topMargin"}, cap(i18n.last) + exportCountString + i18n.iati_exports),
                    lastExportDescription,
                    refreshing,
                    initOrTable,
                    React.DOM.h4( {className:"topMargin"}, cap(i18n.new) + ' ' + i18n.iati_export)
                )
            );
        }
    });
    
    // Render 'My IATI' overview of existing exports and creating a new IATI export
    ReactDOM.render(
        React.createElement(MyIATI),
        document.getElementById('myIATIContainer')
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

document.addEventListener('DOMContentLoaded', function() {
    endpoints = JSON.parse(document.getElementById("endpoints").innerHTML);
    months = JSON.parse(document.getElementById("months").innerHTML);
    i18n = JSON.parse(document.getElementById("translations").innerHTML);

    if (document.getElementById('myIATIContainer')) {
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            loadComponents();
        } else {
            loadAndRenderReact();
        }
    }
});
