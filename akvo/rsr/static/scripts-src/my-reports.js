/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18n, formats, organisations, projects, reports, isAdmin;
var Typeahead = ReactTypeahead.Typeahead;
var orgsAPIUrl = '/rest/v1/typeaheads/organisations?format=json';
var projectsAPIUrl = '/rest/v1/typeaheads/projects?format=json';

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

var DownloadButton = React.createClass({displayName: 'DownloadButton',
    getInitialState: function() {
        return { helpText: null};
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
        return this.props.report !== null && (this.props.organisation !== null || this.props.project !== null) && this.props.format !== null;
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
                React.DOM.button( {type:"button", className:"btn btn-primary", onClick:this.handleDownload}, 
                    React.DOM.i( {className:"fa fa-download"} ), " ", i18n.download_report
                )
            );
        } else {
            return (
                React.DOM.span(null, 
                    React.DOM.button( {type:"button", className:"btn btn-primary disabled pointerEvents", onClick:this.updateHelpText}, 
                        React.DOM.i( {className:"fa fa-download"} ), " ", i18n.download_report
                    ),
                    this.state.helpText &&
                        React.DOM.div( {className:"help-block-error my-reports-download-error"}, 
                            this.state.helpText
                        )
                    
                    
                )
            );
        }
    }
});

var DownloadNotice = React.createClass({displayName: 'DownloadNotice',
    render: function() {
        if (this.props.visible) {
            return (
                React.DOM.div( {className:"alert alert-success", role:"alert"}, 
                    React.DOM.i( {className:"fa fa-spinner fa-spin"},  " " ), " ", React.DOM.strong(null, i18n.generating_report), " ", i18n.available_shortly
                )
            );
        } else {
            return (
                React.DOM.span(null )
            );
        }
    }
});

var FormatsList = React.createClass({displayName: 'FormatsList',
    handleClick: function(format) {
        this.props.setFormat(format);
    },

    render: function() {
        var thisFormatsList = this;
        var formats_data = formats.map(function(format) {
            function handleClick() {
                // Uncheck all radio buttons
                var formatInputs = document.querySelectorAll('.format-radio');
                for (var i = 0; i < formatInputs.length; i++) {
                    formatInputs[i].checked = false;
                }

                // Check selected radio button
                var formatContainer = document.querySelector('#format-' + format.key);
                var formatInput = formatContainer.querySelector('.format-radio');
                formatInput.checked = true;

                // Set format
                thisFormatsList.handleClick(format.key);
            }

            function formatNeeded() {
                var report = thisFormatsList.props.report;
                for (var i = 0; i < report.formats.length; i++) {
                    if (report.formats[i] === format.key) {
                        return true;
                    }
                }
                return false;
            }

            var radioInput;
            if (!thisFormatsList.props.downloading) {
                radioInput = React.DOM.input( {className:"format-radio", type:"radio", 'aria-label':"label1"});
            } else {
                radioInput = React.DOM.input( {className:"format-radio", type:"radio", 'aria-label':"label1", disabled:true});
            }

            if (formatNeeded()) {
                var formatId = 'format-' + format.key;
                var formatIcon = 'fa fa-' + format.icon;
                return (
                    React.DOM.div( {className:"col-sm-4", id:formatId, key:format.key}, 
                        React.DOM.div( {className:"input-group", onClick:handleClick}, 
                        React.DOM.span( {className:"input-group-addon"}, 
                            radioInput
                        ),
                            React.DOM.div( {className:"form-control"}, 
                                React.DOM.i( {className:formatIcon}),"  ",
                                React.DOM.strong(null, format.displayName)
                            )
                        )
                    )
                );
            } else {
                return (
                    React.DOM.span( {key:format.key} )
                );
            }
        });

        return (
            React.DOM.div( {className:"row"}, 
                formats_data
            )
        );
    }
});

var SelectFormat = React.createClass({displayName: 'SelectFormat',
    render: function() {
        if (this.props.report !== null) {
            return (
                React.DOM.div( {id:"choose-format"}, 
                    React.DOM.h5(null, i18n.report_format),
                    React.createElement(FormatsList, {
                        report: this.props.report,
                        setFormat: this.props.setFormat,
                        downloading: this.props.downloading
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

var ProjectOption = React.createClass({displayName: 'ProjectOption',
    handleClick: function() {
        this.props.selectProject(this.props.project);
    },

    render: function() {
        return (
            React.DOM.a( {href:"#", onClick:this.handleClick}, 
                this.props.project.name
            )
        );
    }
});

var ProjectTypeahead = React.createClass({displayName: 'ProjectTypeahead',
    selectProject: function(project) {
        this.props.setProject(project.id);
    },

    render: function() {
        return (
            React.DOM.div( {className:"form-group"}, 
                React.createElement(Typeahead, {
                    placeholder: i18n.select_a_project,
                    maxVisible: 10,
                    options: projects,
                    onOptionSelected: this.selectProject,
                    displayOption: 'displayOption',
                    filterOption: 'filterOption',
                    inputProps: {disabled: this.props.downloading},
                    customClasses: {input: 'form-control'}
                })
            )
        );
    }
});

var ProjectsDropdown = React.createClass({displayName: 'ProjectsDropdown',
    getInitialState: function() {
        return {
            buttonText: i18n.select_a_project
        };
    },

    selectProject: function(project) {
        this.props.setProject(project.id);
        this.setState({
            buttonText: project.name
        });
    },

    render: function() {
        if (!isAdmin) {
            var thisProjectsDropdown = this;
            var projects_data = projects.map(function(project) {
                return (
                    React.DOM.li( {key:project.id}, 
                        React.createElement(ProjectOption, {
                            project: project,
                            selectProject: thisProjectsDropdown.selectProject
                        })
                    )
                );
            });
            var buttonDisplay = this.state.buttonText === i18n.select_a_project ? this.state.buttonText : React.DOM.strong(null, this.state.buttonText);
            var button;
            if (!this.props.downloading) {
                button = React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-project", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true"}, 
                            buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                        );
            } else {
                button = React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-project", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true", disabled:true}, 
                            buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                        );
            }

            return (
                React.DOM.div( {className:"dropdown"}, 
                    button,
                    React.DOM.ul( {className:"dropdown-menu", 'aria-labelledby':"select-project"}, 
                        projects_data
                    )
                )
            );
        } else {
            return (
                React.DOM.div( {className:"project-typeahead"}, 
                    React.createElement(ProjectTypeahead, {
                        setProject: this.props.setProject,
                        downloading: this.props.downloading
                    })
                )
            );
        }
    }
});

var SelectProject = React.createClass({displayName: 'SelectProject',
    parameterNeeded: function(report) {
        for (var i = 0; i < report.parameters.length; i++) {
            if (report.parameters[i] === 'project') {
                return true;
            }
        }
        return false;
    },

    render: function() {
        if (this.props.report !== null && this.parameterNeeded(this.props.report)) {
            return (
                React.DOM.div( {id:"choose-project"}, 
                    React.DOM.h5(null, i18n.project),
                    React.createElement(ProjectsDropdown, {
                        setProject: this.props.setProject,
                        downloading: this.props.downloading
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

var OrganisationOption = React.createClass({displayName: 'OrganisationOption',
    handleClick: function() {
        this.props.selectOrg(this.props.org);
    },

    render: function() {
        return (
            React.DOM.a( {href:"#", onClick:this.handleClick}, 
                this.props.org.name
            )
        );
    }
});

var OrganisationTypeahead = React.createClass({displayName: 'OrganisationTypeahead',
    selectOrg: function(org) {
        this.props.setOrganisation(org.id);
    },

    render: function() {
        return (
            React.DOM.div( {className:"form-group"}, 
                React.createElement(Typeahead, {
                    placeholder: i18n.select_an_organisation,
                    maxVisible: 10,
                    options: organisations,
                    onOptionSelected: this.selectOrg,
                    displayOption: 'displayOption',
                    filterOption: 'filterOption',
                    inputProps: {disabled: this.props.downloading},
                    customClasses: {input: 'form-control'}
                })
            )
        );
    }
});

var OrganisationsDropdown = React.createClass({displayName: 'OrganisationsDropdown',
    getInitialState: function() {
        return {
            buttonText: i18n.select_an_organisation
        };
    },

    selectOrg: function(org) {
        this.props.setOrganisation(org.id);
        this.setState({
            buttonText: org.name
        });
    },

    render: function() {
        if (!isAdmin) {
            var thisOrganisationsDropdown = this;
            var organisations_data = organisations.map(function(org) {
                return (
                    React.DOM.li( {key:org.id}, 
                        React.createElement(OrganisationOption, {
                            org: org,
                            selectOrg: thisOrganisationsDropdown.selectOrg
                        })
                    )
                );
            });
            var buttonDisplay = this.state.buttonText === i18n.select_an_organisation ? this.state.buttonText : React.DOM.strong(null, this.state.buttonText);
            var button;
            if (!this.props.downloading) {
                button = React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-organisation", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true"}, 
                            buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                        );
            } else {
                button = React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-organisation", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true", disabled:true}, 
                            buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                        );
            }

            return (
                React.DOM.div( {className:"dropdown"}, 
                    button,
                    React.DOM.ul( {className:"dropdown-menu", 'aria-labelledby':"select-organisation"}, 
                        organisations_data
                    )
                )
            );
        } else {
            return (
                React.DOM.div( {className:"org-typeahead"}, 
                    React.createElement(OrganisationTypeahead, {
                        setOrganisation: this.props.setOrganisation,
                        downloading: this.props.downloading
                    })
                )
            );
        }

    }
});

var SelectOrganisation = React.createClass({displayName: 'SelectOrganisation',
    parameterNeeded: function(report) {
        for (var i = 0; i < report.parameters.length; i++) {
            if (report.parameters[i] === 'organisation') {
                return true;
            }
        }
        return false;
    },

    render: function() {
        if (this.props.report !== null && this.parameterNeeded(this.props.report)) {
            return (
                React.DOM.div( {id:"choose-organisation"}, 
                    React.DOM.h5(null, i18n.organisation),
                    React.createElement(OrganisationsDropdown, {
                        setOrganisation: this.props.setOrganisation,
                        downloading: this.props.downloading
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

var ReportOption = React.createClass({displayName: 'ReportOption',
    handleClick: function() {
        this.props.selectReport(this.props.report);
    },

    render: function() {
        return (
            React.DOM.a( {href:"#", onClick:this.handleClick}, 
                React.DOM.div( {className:"report-title"}, 
                    this.props.report.title
                ),
                React.DOM.div( {className:"report-description"}, 
                    this.props.report.description
                )
            )
        );
    }
});

var ReportsDropdown = React.createClass({displayName: 'ReportsDropdown',
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
        var thisReportsDropdown = this;
        var reports_data = reports.map(function(report) {
            return (
                React.DOM.li( {key:report.key}, 
                    React.createElement(ReportOption, {report: report, selectReport: thisReportsDropdown.selectReport})
                )
            );
        });
        var buttonDisplay = this.state.buttonText === i18n.select_a_report_type ? this.state.buttonText : React.DOM.strong(null, this.state.buttonText);
        var button;
        if (!this.props.downloading) {
            button = React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-report-type", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true"}, 
                        buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                    );
        } else {
            button = React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-report-type", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true", disabled:true}, 
                        buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                    );
        }

        return (
            React.DOM.div( {className:"dropdown"}, 
                button,
                React.DOM.ul( {className:"dropdown-menu", 'aria-labelledby':"select-report-type"}, 
                    reports_data
                )
            )
        );
    }
});

var SelectReport = React.createClass({displayName: 'SelectReport',
    render: function() {
        return (
            React.DOM.div( {id:"choose-report-template"}, 
                React.DOM.h5(null, i18n.report_type),
                React.createElement(ReportsDropdown, {
                    setReport: this.props.setReport,
                    downloading: this.props.downloading
                })
            )
        );
    }
});

var MyReportsApp  = React.createClass({displayName: 'MyReportsApp',
    getInitialState: function() {
        return {
            report: null,
            organisation: null,
            project: null,
            format: null,
            downloading: false
        };
    },

    setReport: function(report) {
        this.setState({
            report: report,
            organisation: null,
            project: null,
            format: null
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
            React.DOM.div( {id:"my-reports"}, 
                React.DOM.h3(null, i18n.download_new_report),
                React.createElement(SelectReport, {
                    setReport: this.setReport,
                    downloading: this.state.downloading
                }),
                React.createElement(SelectOrganisation, {
                    report: this.state.report,
                    setOrganisation: this.setOrganisation,
                    downloading: this.state.downloading
                }),
                React.createElement(SelectProject, {
                    report: this.state.report,
                    setProject: this.setProject,
                    downloading: this.state.downloading
                }),
                React.createElement(SelectFormat, {
                    report: this.state.report,
                    setFormat: this.setFormat,
                    downloading: this.state.downloading
                }),
                React.createElement(DownloadNotice, {
                    visible: this.state.downloading
                }),
                React.createElement(DownloadButton, {
                    report: this.state.report,
                    organisation: this.state.organisation,
                    project: this.state.project,
                    format: this.state.format,
                    downloading: this.state.downloading,
                    setDownload: this.setDownload
                })
            )
        );
    }
});

/* Initialize the 'My Reports' app */
function initializeApp() {
    ReactDOM.render(
        React.createElement(MyReportsApp),
        document.getElementById('container')
    );
}

/* Process projects results */
function processProjects(projectResults) {
    projectResults.forEach(function (p) {
        p.filterOption = p.title + ' ' + p.id;
        p.displayOption = p.title + ' (id: ' + p.id + ')';
    });
    return projectResults;
}

/* Process organisations results */
function processOrgs(orgResults) {
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
}

/* Retrieve all projects for the project typeahead */
function getAllProjects() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            var projectResults = JSON.parse(xmlHttp.responseText);
            projects = processProjects(projectResults.results);
        }
    };
    xmlHttp.open("GET", projectsAPIUrl, true);
    xmlHttp.send();
}

/* Retrieve all organisations for the organisation typeahead */
function getAllOrganisations() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            var orgResults = JSON.parse(xmlHttp.responseText);
            organisations = processOrgs(orgResults.results);
        }
    };
    xmlHttp.open("GET", orgsAPIUrl, true);
    xmlHttp.send();
}

/* Retrieve report information and translation strings */
function getInitialData() {
    // Retrieve report information
    reports = JSON.parse(document.getElementById('reports-data').innerHTML);

    // Check if user is an admin (Superuser or RSR admin)
    isAdmin = JSON.parse(document.getElementById('user-data').innerHTML).is_admin;
    if (!isAdmin) {
        // If the user isn't an admin, retrieve the projects and organisations that the user is
        // linked to
        organisations = JSON.parse(document.getElementById('organisations-data').innerHTML);
        projects = JSON.parse(document.getElementById('projects-data').innerHTML);
    } else {
        // If the user is an admin, get ALL organisations and projects from the Typeahead APIs
        getAllOrganisations();
        getAllProjects();
    }

    // Retrieve the available formats (e.g. PDF, Excel, Word, HTML, etc)
    formats = JSON.parse(document.getElementById('formats-data').innerHTML);

    // Retrieve translations
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);
}

document.addEventListener('DOMContentLoaded', function() {
    getInitialData();
    initializeApp();
});
