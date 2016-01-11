/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18n, formats, organisations, projects, reports, user;

var DownloadButton = React.createClass({
    getInitialState: function() {
        return {
            downloading: false
        };
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
                <button type="button" className="btn btn-primary" onClick={this.handleDownload}>
                    <i className="fa fa-download" /> {i18n.download_report}
                </button>
            );
        } else {
            return (
                <button type="button" className="btn btn-primary" disabled>
                    <i className="fa fa-download" /> {i18n.download_report}
                </button>
            );
        }
    }
});

var DownloadNotice = React.createClass({
    render: function() {
        if (this.props.visible) {
            return (
                <div className="alert alert-success" role="alert">
                    <i className="fa fa-spinner fa-spin"> </i> <strong>{i18n.generating_report}</strong> {i18n.available_shortly}
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    }
});

var FormatsList = React.createClass({
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
                    <div className="col-sm-4" id={formatId} key={format.key}>
                        <div className="input-group" onClick={handleClick}>
                        <span className="input-group-addon">
                            <input className="format-radio" type="radio" aria-label="label1"/>
                        </span>
                            <div className="form-control">
                                <i className={formatIcon}/>&nbsp;&nbsp;
                                <strong>{format.displayName}</strong>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <span key={format.key} />
                );
            }
        });

        return (
            <div className="row">
                {formats_data}
            </div>
        );
    }
});

var SelectFormat = React.createClass({
    render: function() {
        if (this.props.report !== null) {
            return (
                <div id="choose-format">
                    <h5>{i18n.report_format}</h5>
                    {React.createElement(FormatsList, {report: this.props.report,
                                                       setFormat: this.props.setFormat})}
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    }
});

var ProjectOption = React.createClass({
    handleClick: function() {
        this.props.selectProject(this.props.project);
    },

    render: function() {
        return (
            <a href="#" onClick={this.handleClick}>
                {this.props.project.name}
            </a>
        );
    }
});

var ProjectsDropdown = React.createClass({
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
                <li key={project.id}>
                    {React.createElement(ProjectOption, {project: project, selectProject: thisProjectsDropdown.selectProject})}
                </li>
            );
        });
        var buttonDisplay = this.state.buttonText === i18n.select_a_project ? this.state.buttonText : <strong>{this.state.buttonText}</strong>;

        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="select-project" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    {buttonDisplay}&nbsp;&nbsp;<span className="caret" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="select-project">
                    {projects_data}
                </ul>
            </div>
        );
    }
});

var SelectProject = React.createClass({
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
                <div id="choose-project">
                    <h5>{i18n.project}</h5>
                    {React.createElement(ProjectsDropdown, {setProject: this.props.setProject})}
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    }
});

var OrganisationOption = React.createClass({
    handleClick: function() {
        this.props.selectOrg(this.props.org);
    },

    render: function() {
        return (
            <a href="#" onClick={this.handleClick}>
                {this.props.org.name}
            </a>
        );
    }
});

var OrganisationsDropdown = React.createClass({
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
                <li key={org.id}>
                    {React.createElement(OrganisationOption, {org: org, selectOrg: thisOrganisationsDropdown.selectOrg})}
                </li>
            );
        });
        var buttonDisplay = this.state.buttonText === i18n.select_an_organisation ? this.state.buttonText : <strong>{this.state.buttonText}</strong>;

        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="select-organisation" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    {buttonDisplay}&nbsp;&nbsp;<span className="caret" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="select-organisation">
                    {organisations_data}
                </ul>
            </div>
        );
    }
});

var SelectOrganisation = React.createClass({
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
                <div id="choose-organisation">
                    <h5>{i18n.organisation}</h5>
                    {React.createElement(OrganisationsDropdown, {setOrganisation: this.props.setOrganisation})}
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    }
});

var ReportOption = React.createClass({
    handleClick: function() {
        this.props.selectReport(this.props.report);
    },

    render: function() {
        return (
            <a href="#" onClick={this.handleClick}>
                <div className="report-title">
                    {this.props.report.title}
                </div>
                <div className="report-description">
                    {this.props.report.description}
                </div>
            </a>
        );
    }
});

var ReportsDropdown = React.createClass({
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
                <li key={report.key}>
                    {React.createElement(ReportOption, {report: report, selectReport: thisReportsDropdown.selectReport})}
                </li>
            );
        });
        var buttonDisplay = this.state.buttonText === i18n.select_a_report_type ? this.state.buttonText : <strong>{this.state.buttonText}</strong>;

        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="select-report-type" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    {buttonDisplay}&nbsp;&nbsp;<span className="caret" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="select-report-type">
                    {reports_data}
                </ul>
            </div>
        );
    }
});

var SelectReport = React.createClass({
    render: function() {
        return (
            <div id="choose-report-template">
                <h5>{i18n.report_type}</h5>
                {React.createElement(ReportsDropdown, {setReport: this.props.setReport})}
            </div>
        );
    }
});

var MyReportsApp  = React.createClass({
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
            <div id="my-reports">
                <h3>{i18n.download_new_report}</h3>
                {React.createElement(SelectReport, {
                    setReport: this.setReport
                })}
                {React.createElement(SelectOrganisation, {
                    report: this.state.report,
                    setOrganisation: this.setOrganisation
                })}
                {React.createElement(SelectProject, {
                    report: this.state.report,
                    setProject: this.setProject
                })}
                {React.createElement(SelectFormat, {
                    report: this.state.report,
                    setFormat: this.setFormat
                })}
                {React.createElement(DownloadNotice, {
                    visible: this.state.noticeVisible
                })}
                {React.createElement(DownloadButton, {
                    report: this.state.report,
                    organisation: this.state.organisation,
                    project: this.state.project,
                    format: this.state.format,
                    showNotice: this.showNotice
                })}
            </div>
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
