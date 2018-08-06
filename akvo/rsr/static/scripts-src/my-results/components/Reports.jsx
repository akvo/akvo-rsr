/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import { connect } from "react-redux";
import "react-select/dist/react-select.css";
import { _ } from "../utils";

// DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var sortReportIds = function(reports) {
    if (!reports || !reports.ids) {
        return;
    }
    var sorter = function(id1, id2) {
        const a = reports.objects[id1].organisations.length,
            b = reports.objects[id2].organisations.length;

        if (a < b) {
            return -1;
        } else if (b < a) {
            return 1;
        }
        return 0;
    };
    reports.ids.sort(sorter);
};

class Reports extends React.Component {
    render() {
        const { project, reports } = this.props;
        const report_count = (reports && reports.ids && reports.ids.length) || 0;
        const row_count = Math.round(Math.ceil(report_count / 3)),
            row_indexes = Array.from(Array(row_count).keys()),
            col_indexes = Array.from(Array(3).keys());
        // Order reports so that organisation specific reports are listed at the end
        sortReportIds(reports);
        return (
            <div className="rsrReports">
                {row_indexes.map(row => {
                    return (
                        <div className="row" key={row}>
                            {col_indexes.map(col => {
                                const index = row * 3 + col,
                                    id = reports.ids[index];
                                if (id === undefined) {
                                    return;
                                }
                                return (
                                    <Report
                                        project={project}
                                        report={reports.objects[id]}
                                        key={id}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

class Report extends React.Component {
    constructor(props) {
        super(props);
        const { report } = props;
        this.state = {
            show_description: true,
            date_selection:
                report.url.indexOf("{start_date}") > -1 || report.url.indexOf("{end_date}") > -1,
            start_date: undefined,
            end_date: undefined
        };
        this.downloadReport = this.downloadReport.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
    }

    downloadReport(format) {
        const {
            report: { url },
            project
        } = this.props;
        let { start_date, end_date } = this.state;
        let download_url;
        download_url = url
            .replace("{format}", format)
            .replace("{project}", project.id)
            .replace("{language_code}", project.currentLanguage);
        if (this.state.date_selection) {
            if (end_date && start_date && start_date > end_date) {
                // Swap start and end dates if end date is before start date
                start_date = end_date;
                end_date = this.state.start_date;
            }
            download_url = start_date
                ? download_url.replace("{start_date}", start_date.toISOString())
                : download_url.replace("p_StartDate={start_date}", "");
            download_url = end_date
                ? download_url.replace("{end_date}", end_date.toISOString())
                : download_url.replace("p_EndDate={end_date}", "");
            download_url = download_url.replace(/&+/g, "&").replace(/&$/, "");
        }
        console.log("Downloading report from", download_url);
        this.toggleDescription();
        window.location.assign(download_url);
    }

    toggleDescription() {
        this.setState({ show_description: !this.state.show_description });
    }

    setStartDate(start_date) {
        this.setState({ start_date });
    }

    setEndDate(end_date) {
        this.setState({ end_date });
    }

    render() {
        const { report } = this.props;
        const { show_description, date_selection, start_date, end_date } = this.state;
        const formats = report.formats.map(format => {
            const { icon, name, display_name } = format;
            return (
                <ReportFormatButton
                    download={this.downloadReport}
                    icon={icon}
                    format_name={name}
                    display_name={display_name}
                    url={report.url}
                    key={format.name}
                />
            );
        });
        const date_selectors = (
            <div className="reportDate">
                <div className="startDate">
                    <div>{_("start_date")}</div>
                    <DatePicker onChange={this.setStartDate} selected={start_date} />
                </div>
                <div className="endDate">
                    <div>{_("end_date")}</div>
                    <DatePicker onChange={this.setEndDate} selected={end_date} />
                </div>
            </div>
        );
        return (
            <div className="rsrReport col-sm-6 col-md-4 col-xs-12">
                <div className="reportContainer">
                    <div className="">
                        <h3 className="">{report.title}</h3>
                    </div>
                    <div className="reportDscr">{report.description}</div>
                    <div className="options">
                        {date_selection ? date_selectors : undefined}
                        {formats}
                    </div>
                </div>
            </div>
        );
    }
}
class ReportFormatButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        e.stopPropagation();
        console.log(e);
        this.props.download(this.props.format_name);
    }

    render() {
        const { icon, display_name } = this.props;
        const icon_class = `fa fa-${icon}`,
            text = `${_("download")} ${display_name}`;
        return (
            <button className="btn btn-default reportDown" onClick={this.onClick}>
                <i className={icon_class} />
                <span>&nbsp;&nbsp;</span>
                <span>{text}</span>
            </button>
        );
    }
}

const mapStateToProps = store => {
    return {
        reports: store.models.reports,
        project: store.page.project
    };
};

export default connect(mapStateToProps)(Reports);
