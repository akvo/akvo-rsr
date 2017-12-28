/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var endpoints,
    i18n,
    Typeahead;

// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');


var parameter_needed = function(report, parameter) {
    if (report == null) {
        return false;
    }
    for (var i = 0; i < report.parameters.length; i++) {
        if (report.parameters[i] === parameter) {
            return true;
        }
    }
    return false;
}

var get_display_value = function(id, options) {
    if (id == null) {
        return null;
    }
    var values = options.filter(function(option){return option.id == id});
    return values.length > 0 ? values[0].displayOption : null;
}

function initReact() {
    // Load globals
    Typeahead = ReactTypeahead.Typeahead;

    var DownloadButton = React.createClass({displayName: "DownloadButton",
        getInitialState: function() {
            return {helpText: null};
        },

        generateReport: function() {
            var url = this.props.report.url;
            url = url.replace('{format}', this.props.format);
            if (this.props.project !== null) {
                url = url.replace('{project}', this.props.project);
            }
            if (this.props.organisation !== null) {
                url = url.replace('{organisation}', this.props.organisation);
            }
            window.location.assign(url);
        },

        handleDownload: function() {
            var thisDownloadButton = this;
            this.setState({helpText: null});
            this.props.setDownload(true);
            this.generateReport();
            setTimeout(function() {
                thisDownloadButton.props.setDownload(false);
            }, 5000);
        },

        checkAllFilled: function() {
            return (
                this.props.report !== null &&
                // Ensure org/project is selected if it's a required parameter
                (!parameter_needed(this.props.report, 'organisation') || this.props.organisation !== null) &&
                (!parameter_needed(this.props.report, 'project') || this.props.project !== null) &&
                // Ensure valid format for the report is selected
                this.props.report.formats.map(function(x){return x.name}).indexOf(this.props.format) > -1
            );
        },

        updateHelpText: function() {
            var helpString = i18n.error;

            if (this.props.report === null) {
                helpString += ' ';
                helpString += i18n.no_report;
            }
            if (this.props.organisation === null && this.props.project === null) {
                helpString += ' ';
                helpString += i18n.no_organisation;
            }
            if (this.props.format === null) {
                helpString += ' ';
                helpString += i18n.no_format;
            }
            this.setState({helpText: helpString});
        },

        render: function() {
            if (this.checkAllFilled() && !this.props.downloading) {
                return (
                    React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleDownload}, 
                        React.createElement("i", {className: "fa fa-download"}), " ", i18n.download_report
                    )
                );
            } else {
                return (
                    React.createElement("span", null, 
                        React.createElement("button", {type: "button", className: "btn btn-primary disabled pointerEvents", onClick: this.updateHelpText}, 
                            React.createElement("i", {className: "fa fa-download"}), " ", i18n.download_report
                        ), 
                        this.state.helpText &&
                            React.createElement("div", {className: "help-block-error my-reports-download-error"}, 
                                this.state.helpText
                            )
                        

                    )
                );
            }
        }
    });

    var DownloadNotice = React.createClass({displayName: "DownloadNotice",
        render: function() {
            if (this.props.visible) {
                return (
                    React.createElement("div", {className: "alert alert-success", role: "alert"}, 
                        React.createElement("i", {className: "fa fa-spinner fa-spin"}, " "), " ", React.createElement("strong", null, i18n.generating_report), " ", i18n.available_shortly
                    )
                );
            } else {
                return (
                    React.createElement("span", null)
                );
            }
        }
    });

    var FormatsList = React.createClass({displayName: "FormatsList",
        handleClick: function(format) {
            this.props.setFormat(format);
        },

        render: function() {
            var thisFormatsList = this;
            var formats_data = this.props.formatOptions.map(function(format) {
                function handleClick() {
                    // Uncheck all radio buttons
                    var formatInputs = document.querySelectorAll('.format-radio');
                    for (var i = 0; i < formatInputs.length; i++) {
                        formatInputs[i].checked = false;
                    }

                    // Check selected radio button
                    var formatContainer = document.querySelector('#format-' + format.name);
                    var formatInput = formatContainer.querySelector('.format-radio');
                    formatInput.checked = true;

                    // Set format
                    thisFormatsList.handleClick(format.name);
                }

                function formatNeeded() {
                    var report = thisFormatsList.props.report;
                    for (var i = 0; i < report.formats.length; i++) {
                        if (report.formats[i].name === format.name) {
                            return true;
                        }
                    }
                    return false;
                }

                var radioInput = function (format) {
                    return (
                        React.createElement("input", {className: "format-radio", 
                               type: "radio", 
                               "aria-label": "label1", 
                               checked: thisFormatsList.props.format == format.name, 
                               disabled: thisFormatsList.props.downloading})
                    );
                };

                if (formatNeeded()) {
                    var formatId = 'format-' + format.name;
                    var formatIcon = 'fa fa-' + format.icon;
                    return (
                        React.createElement("div", {className: "col-sm-4", id: formatId, key: format.name}, 
                            React.createElement("div", {className: "input-group", onClick: handleClick}, 
                            React.createElement("span", {className: "input-group-addon"}, 
                                radioInput(format)
                            ), 
                                React.createElement("div", {className: "form-control"}, 
                                    React.createElement("i", {className: formatIcon}), "  ", 
                                    React.createElement("strong", null, format.display_name)
                                )
                            )
                        )
                    );
                } else {
                    return (
                        React.createElement("span", {key: format.name})
                    );
                }
            });

            return (
                React.createElement("div", {className: "row"}, 
                    formats_data
                )
            );
        }
    });

    var SelectFormat = React.createClass({displayName: "SelectFormat",
        render: function() {
            if (this.props.report !== null) {
                return (
                    React.createElement("div", {id: "choose-format"}, 
                    React.createElement("label", null, i18n.report_format), 
                    React.createElement(FormatsList, {
                        report: this.props.report, 
                        formatOptions: this.props.formatOptions, 
                        format: this.props.format, 
                        setFormat: this.props.setFormat, 
                        downloading: this.props.downloading})
                    )
                );
            } else {
                return (
                    React.createElement("span", null)
                );
            }
        }
    });

    var ProjectTypeahead = React.createClass({displayName: "ProjectTypeahead",
        getInitialState: function() {
            return {
                disabled: this.props.downloading,
                placeholder: i18n.select_a_project
            };
        },

        componentDidMount: function() {
            if (this.props.projectOptions.length === 1) {
                this.selectProject(this.props.projectOptions[0]);
                this.setState({
                    disabled: true,
                    placeholder: this.props.projectOptions[0].displayOption
                });
            }
        },


        selectProject: function(project) {
            this.props.setProject(project.id);
        },

        render: function() {
            return (
                React.createElement("div", {className: "form-group"}, 
                    React.createElement(Typeahead, {
                         placeholder: this.state.placeholder,
                         maxVisible: 10,
                         value: get_display_value(this.props.projectId, this.props.projectOptions),
                         options: this.props.projectOptions,
                         onOptionSelected: this.selectProject,
                         displayOption: 'displayOption',
                         filterOption: 'filterOption',
                         inputProps: {disabled: this.state.disabled},
                         customClasses: {input: 'form-control'}
                    })
                )
            );
        }
    });

    var SelectProject = function(props) {
        return (
            React.createElement("div", {id: "choose-project"}, 
                React.createElement("label", null, i18n.project), 
                React.createElement("div", {className: "project-typeahead"}, 
                    React.createElement(ProjectTypeahead, {projectId: props.project, 
                                      projectOptions: props.projectOptions, 
                                      setProject: props.setProject, 
                                      downloading: props.downloading})
                )
            )
        );
    };

    var OrganisationTypeahead = React.createClass({displayName: "OrganisationTypeahead",
        getInitialState: function() {
            return {
                disabled: this.props.downloading,
                placeholder: i18n.select_an_organisation
            };
        },

        componentDidMount: function() {
            if (this.props.organisationOptions.length === 1) {
                this.selectOrg(this.props.organisationOptions[0]);
                this.setState({
                    disabled: true,
                    placeholder: this.props.organisationOptions[0].displayOption
                });
            }
        },

        selectOrg: function(org) {
            this.props.setOrganisation(org.id);
        },

        render: function() {
            return (
                React.createElement("div", {className: "form-group"}, 
                    React.createElement(Typeahead, {
                         placeholder: this.state.placeholder,
                         maxVisible: 10,
                         value: get_display_value(this.props.orgId, this.props.organisationOptions),
                         options: this.props.organisationOptions,
                         onOptionSelected: this.selectOrg,
                         displayOption: 'displayOption',
                         filterOption: 'filterOption',
                         inputProps: {disabled: this.state.disabled},
                         customClasses: {input: 'form-control'}
                    })
                )
            );
        }
    });

    var SelectOrganisation = function(props) {
        return (
            React.createElement("div", {id: "choose-organisation"}, 
                React.createElement("label", null, i18n.organisation), 
                React.createElement("div", {className: "org-typeahead"}, 
                    React.createElement(OrganisationTypeahead, {orgId: props.organisation, 
                                           organisationOptions: props.organisationOptions, 
                                           setOrganisation: props.setOrganisation, 
                                           downloading: props.downloading})
                )
            )
        );
    };

    var ReportOption = React.createClass({displayName: "ReportOption",
        handleClick: function() {
            this.props.selectReport(this.props.report);
        },

        render: function() {
            return (
                React.createElement("a", {href: "#", onClick: this.handleClick}, 
                    React.createElement("div", {className: "report-title"}, 
                        this.props.report.title
                    ), 
                    React.createElement("div", {className: "report-description"}, 
                        this.props.report.description
                    )
                )
            );
        }
    });

    var ReportsDropdown = React.createClass({displayName: "ReportsDropdown",
        getInitialState: function() {
            return {
                buttonText: i18n.select_a_report_type
            };
        },

        selectReport: function(report) {
            this.props.setReport(report);
            this.setState({
                buttonText: report.title
            });
        },

        render: function() {
            var reportsData,
                thisReportsDropdown = this;
            if (this.props.reportOptions.length > 0 && this.props.userOptions !== null) {
                reportsData = this.props.reportOptions.map(function (report) {
                    return (
                        React.createElement("li", {key: report.name}, 
                            React.createElement(ReportOption, {
                                 report: report,
                                 selectReport: thisReportsDropdown.selectReport
                            })
                        )
                    );
                });
            } else {
                reportsData = React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-spin fa-spinner"}), " Loading..."));
            }
            var buttonDisplay = this.state.buttonText === i18n.select_a_report_type ? React.createElement("span", {className: "not-selected"}, this.state.buttonText) : React.createElement("span", null, this.state.buttonText);
            var button;
            if (!this.props.downloading) {
                button = React.createElement("button", {className: "btn btn-default dropdown-toggle", type: "button", id: "select-report-type", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "true"}, 
                            buttonDisplay, 
                            React.createElement("div", {className: "caret-indicator"}, 
                                React.createElement("i", {className: "fa fa-sort"})
                            )
                        );
            } else {
                button = React.createElement("button", {className: "btn btn-default dropdown-toggle", type: "button", id: "select-report-type", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "true", disabled: true}, 
                            buttonDisplay, 
                            React.createElement("div", {className: "caret-indicator"}, 
                                React.createElement("i", {className: "fa fa-sort"})
                            )
                        );
            }

            return (
                React.createElement("div", {className: "dropdown"}, 
                    button, 
                    React.createElement("ul", {className: "dropdown-menu", "aria-labelledby": "select-report-type"}, 
                        reportsData
                    )
                )
            );
        }
    });

    var SelectReport = function(props) {
        return (
            React.createElement("div", {id: "choose-report-template"}, 
                React.createElement("label", null, i18n.report_type), 
                React.createElement(ReportsDropdown, {userOptions: props.userOptions, 
                                 reportOptions: props.reportOptions, 
                                 setReport: props.setReport, 
                                 downloading: props.downloading})
            )
        );
    };

    var MyReportsApp  = React.createClass({displayName: "MyReportsApp",
        getInitialState: function() {
            return {
                report: null,
                reportOptions: [],
                organisation: null,
                organisationOptions: [],
                project: null,
                projectOptions: [],
                format: null,
                formatOptions: [],
                downloading: false,
                userOptions: null
            };
        },

        componentDidMount: function() {
            this.getUserOptions(endpoints.user, 'userOptions');
            this.getOptions(endpoints.user_organisations, 'organisationOptions', this.processOrgs);
            this.getOptions(endpoints.user_projects, 'projectOptions', this.processProjects);
            this.getOptions(endpoints.reports, 'reportOptions');
            this.getOptions(endpoints.formats, 'formatOptions');
        },

        getOptions: function(endpoint, stateKey, processCallback) {
            var xmlHttp = new XMLHttpRequest();
            var url = endpoints.base_url + endpoint + '?format=json';
            var thisApp = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                    var newState = {};
                    if (processCallback === undefined) {
                        newState[stateKey] = JSON.parse(xmlHttp.responseText).results;
                    } else {
                        newState[stateKey] = processCallback(JSON.parse(xmlHttp.responseText).results);
                    }
                    thisApp.setState(newState);
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        },

        getUserOptions: function(endpoint, stateKey) {
            var xmlHttp = new XMLHttpRequest();
            var url = endpoints.base_url + endpoint + '?format=json';
            var thisApp = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                    var newState = {};
                    newState[stateKey] = JSON.parse(xmlHttp.responseText);
                    thisApp.setState(newState);
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        },

        processOrgs: function(orgResults) {
            function getDisplayOption(short, long) {
                if (short === long) {
                    return short;
                }
                if (!long) {
                    return short;
                }
                return short + ' (' + long + ')';
            }

            orgResults.forEach(function (o) {
                var newName = getDisplayOption(o.name, o.long_name);

                o.filterOption = o.name + ' ' + o.long_name;
                o.displayOption = newName;
            });

            return orgResults;
        },

        processProjects: function(projectResults) {
            projectResults.forEach(function (p) {
                p.filterOption = p.title + ' ' + p.id;
                p.displayOption = p.title + ' (id: ' + p.id + ')';
            });
            return projectResults;
        },

        setReport: function(report) {
            this.setState({
                report: report,
            });
        },

        setOrganisation: function(org) {
            this.setState({
                organisation: org
            });
        },

        setProject: function(project) {
            this.setState({
                project: project
            });
        },

        setFormat: function(format) {
            this.setState({
                format: format
            });
        },

        setDownload: function(boolean) {
            this.setState({
                downloading: boolean
            });
        },

        render: function() {
            return (
                React.createElement("div", {id: "my-reports"}, 
                    React.createElement("h3", null, i18n.my_reports), 
                    React.createElement(SelectReport, {reportOptions: this.state.reportOptions, 
                                  userOption: this.state.userOptions, 
                                  setReport: this.setReport, 
                                  downloading: this.state.downloading}), 
                    parameter_needed(this.state.report, 'organisation')
                     ? (React.createElement(SelectOrganisation, {organisationOptions: this.state.organisationOptions, 
                                            report: this.state.report, 
                                            organisation: this.state.organisation, 
                                            setOrganisation: this.setOrganisation, 
                                            downloading: this.state.downloading}))
                     : undefined, 
                    parameter_needed(this.state.report, 'project')
                     ? (React.createElement(SelectProject, {projectOptions: this.state.projectOptions, 
                                       project: this.state.project, 
                                       report: this.state.report, 
                                       setProject: this.setProject, 
                                       downloading: this.state.downloading}))
                     : undefined, 
                    React.createElement(SelectFormat, {formatOptions: this.state.formatOptions, 
                                  format: this.state.format, 
                                  report: this.state.report, 
                                  setFormat: this.setFormat, 
                                  downloading: this.state.downloading}), 
                    React.createElement(DownloadNotice, {visible: this.state.downloading}), 
                    React.createElement(DownloadButton, {report: this.state.report, 
                                    organisation: this.state.organisation, 
                                    project: this.state.project, 
                                    format: this.state.format, 
                                    downloading: this.state.downloading, 
                                    setDownload: this.setDownload})
                )
            );
        }
    });

    // Initialize the 'My reports' app
    ReactDOM.render(
        React.createElement(MyReportsApp),
        document.getElementById('container')
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
    function loadReactTypeahead() {
        var reactTypeaheadSrc = document.getElementById('react-typeahead').src;
        loadJS(reactTypeaheadSrc, initReact, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, loadReactTypeahead, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints and translations
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof ReactTypeahead !== 'undefined') {
        initReact();
    } else {
        loadAndRenderReact();
    }
});
