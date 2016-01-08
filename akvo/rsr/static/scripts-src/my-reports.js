/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18n, formats, organisations, projects, reports, user;

var DownloadButton = React.createClass({displayName: 'DownloadButton',
    getInitialState: function() {
        return {
            downloading: false
        };
    },

    generateReport: function() {
        var url = this.props.report.url;
        url = url.replace('<format>', this.props.format);
        url = url.replace('<project>', this.props.project);
        window.location.assign(url);
    },

    handleDownload: function() {
        this.setState({
            downloading: true
        });
        this.props.showNotice();
        this.generateReport();
    },

    checkAllFilled: function() {
        return this.props.report !== null && (this.props.organisation !== null || this.props.project !== null) && this.props.format !== null;
    },

    render: function() {
        if (this.checkAllFilled() && !this.state.downloading) {
            return (
                React.DOM.button( {type:"button", className:"btn btn-primary", onClick:this.handleDownload}, 
                    React.DOM.i( {className:"fa fa-download"} ), " ", i18n.download_report
                )
            );
        } else {
            return (
                React.DOM.button( {type:"button", className:"btn btn-primary", disabled:true}, 
                    React.DOM.i( {className:"fa fa-download"} ), " ", i18n.download_report
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

            if (formatNeeded()) {
                var formatId = 'format-' + format.key;
                var formatIcon = 'fa fa-' + format.icon;
                return (
                    React.DOM.div( {className:"col-sm-4", id:formatId, key:format.key}, 
                        React.DOM.div( {className:"input-group", onClick:handleClick}, 
                        React.DOM.span( {className:"input-group-addon"}, 
                            React.DOM.input( {className:"format-radio", type:"radio", 'aria-label':"label1"})
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
                    React.createElement(FormatsList, {report: this.props.report,
                                                       setFormat: this.props.setFormat})
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
        var thisProjectsDropdown = this;
        var projects_data = projects.map(function(project) {
            return (
                React.DOM.li( {key:project.id}, 
                    React.createElement(ProjectOption, {project: project, selectProject: thisProjectsDropdown.selectProject})
                )
            );
        });
        var buttonDisplay = this.state.buttonText === i18n.select_a_project ? this.state.buttonText : React.DOM.strong(null, this.state.buttonText);

        return (
            React.DOM.div( {className:"dropdown"}, 
                React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-project", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true"}, 
                    buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                ),
                React.DOM.ul( {className:"dropdown-menu", 'aria-labelledby':"select-project"}, 
                    projects_data
                )
            )
        );
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
                    React.createElement(ProjectsDropdown, {setProject: this.props.setProject})
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
        var thisOrganisationsDropdown = this;
        var organisations_data = organisations.map(function(org) {
            return (
                React.DOM.li( {key:org.id}, 
                    React.createElement(OrganisationOption, {org: org, selectOrg: thisOrganisationsDropdown.selectOrg})
                )
            );
        });
        var buttonDisplay = this.state.buttonText === i18n.select_an_organisation ? this.state.buttonText : React.DOM.strong(null, this.state.buttonText);

        return (
            React.DOM.div( {className:"dropdown"}, 
                React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-organisation", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true"}, 
                    buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                ),
                React.DOM.ul( {className:"dropdown-menu", 'aria-labelledby':"select-organisation"}, 
                    organisations_data
                )
            )
        );
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
                    React.createElement(OrganisationsDropdown, {setOrganisation: this.props.setOrganisation})
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
                React.DOM.strong(null, this.props.report.title),React.DOM.br(null),
                this.props.report.description
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

        return (
            React.DOM.div( {className:"dropdown"}, 
                React.DOM.button( {className:"btn btn-default dropdown-toggle", type:"button", id:"select-report-type", 'data-toggle':"dropdown", 'aria-haspopup':"true", 'aria-expanded':"true"}, 
                    buttonDisplay,"  ",React.DOM.span( {className:"caret"} )
                ),
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
                React.createElement(ReportsDropdown, {setReport: this.props.setReport})
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
            noticeVisible: false
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

    showNotice: function() {
        this.setState({
            noticeVisible: true
        });
    },

    hideNotice: function() {
        this.setState({
            noticeVisible: false
        });
    },

    render: function() {
        return (
            React.DOM.div( {id:"my-reports"}, 
                React.DOM.h3(null, i18n.download_new_report),
                React.createElement(SelectReport, {setReport: this.setReport}),
                React.createElement(SelectOrganisation, {report: this.state.report,
                                                          setOrganisation: this.setOrganisation}),
                React.createElement(SelectProject, {report: this.state.report,
                                                     setProject: this.setProject}),
                React.createElement(SelectFormat, {report: this.state.report,
                                                    setFormat: this.setFormat}),
                React.createElement(DownloadNotice, {visible: this.state.noticeVisible}),
                React.createElement(DownloadButton, {report: this.state.report,
                                                      organisation: this.state.organisation,
                                                      project: this.state.project,
                                                      format: this.state.format,
                                                      showNotice: this.showNotice})
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

/* Retrieve report information and translation strings */
function getInitialData() {
    reports = JSON.parse(document.getElementById('reports-data').innerHTML);
    organisations = JSON.parse(document.getElementById('organisations-data').innerHTML);
    projects = JSON.parse(document.getElementById('projects-data').innerHTML);
    formats = JSON.parse(document.getElementById('formats-data').innerHTML);
    user = JSON.parse(document.getElementById('user-data').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);
}

document.addEventListener('DOMContentLoaded', function() {
    getInitialData();
    initializeApp();
});
