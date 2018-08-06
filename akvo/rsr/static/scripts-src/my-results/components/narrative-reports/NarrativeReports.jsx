/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { _, collapseId, displayDate, distinct } from "../../utils";
import * as c from "../../const";
import { collapseChange } from "../../actions/collapse-actions";
import Collapse, { Panel } from "rc-collapse";
import { datePairs, reportFormToggle } from "../../actions/ui-actions";
import "react-select/dist/react-select.css";

// Markdown
import { Markdown } from "react-showdown";

// Alerts
import AlertFactory from "../alertContainer";
import ReportForm from "./ReportForm";

const ReportingPeriodHeader = ({ period_start, period_end, count, onCreate }) => {
    return (
        <div>
            <span>
                {_("narrative_summaries")}:{" "}
                <span className="narrativePeriod">{`${displayDate(period_start)} - ${displayDate(
                    period_end
                )}`}</span>
            </span>
            <span className="narrativeCount">{`(${count})`}</span>
            {onCreate == undefined ? (
                undefined
            ) : (
                <button className="btn btn-sm btn-default createSummaryBtn" onClick={onCreate}>
                    {_("create_narrative_summary")}
                </button>
            )}
        </div>
    );
};

const ReportHeader = ({ categories, report, onClick }) => {
    const category_style = { marginRight: "10px" };
    const status_style = { float: "right", marginRight: "20px" };
    const clickHandler = e => {
        e.stopPropagation();
        return onClick(report);
    };
    return (
        <div>
            <span style={category_style}>{categories.objects[report.category].label}</span>
            <button className="btn btn-sm btn-default" onClick={clickHandler}>
                {_("edit")}
            </button>
            <span style={status_style} className="narrativeStatus">
                {report.published ? _("approved") : _("draft")}
            </span>
        </div>
    );
};

const Report = ({ report }) => {
    return <Markdown markup={report.text} />;
};

const filterReports = (narrative_reports, period_start, period_end) => {
    const ids =
        narrative_reports &&
        narrative_reports.ids.filter(id => {
            const report = narrative_reports.objects[id];
            return report.period_start === period_start && report.period_end === period_end;
        });
    return ids.map(id => {
        return narrative_reports.objects[id];
    });
};

const ReportAlert = ({ message, close }) => (
    <div className="reports-alert">
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>
            X
        </button>
    </div>
);
ReportAlert.propTypes = {
    message: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
};

class NarrativeReports extends React.Component {
    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        const alertName = "ReportAlert";
        this.state = {
            ReportAlert: AlertFactory({ alertName })(ReportAlert),
            collapseId: collapseId(c.OBJECTS_NARRATIVE_REPORTS, c.OBJECTS_NARRATIVE_REPORTS)
        };
        this.createSummary = this.createSummary.bind(this);
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    renderReports(narrative_reports, categories) {
        return narrative_reports.map(report => {
            const header = (
                <ReportHeader categories={categories} report={report} onClick={this.editSummary} />
            );
            return (
                <Collapse key={report.id}>
                    <Panel header={header}>
                        <Report report={report} />
                    </Panel>
                </Collapse>
            );
        });
    }

    editSummary(report) {
        const { period_start, period_end } = report;
        // Show report editing form
        reportFormToggle(report.id);
    }

    createSummary(e, period_start, period_end) {
        e.stopPropagation();
        console.log(period_start, period_end);
        const id = "new";
        const text = "";
        const { narrative_reports, project } = this.props;
        const report = { id, period_start, period_end, project: project.id, text };
        narrative_reports.objects[report.id] = report;
        this.editSummary(report);
    }

    renderPanels(ids) {
        const { categories, narrative_reports } = this.props;
        const pairs = distinct(datePairs(ids, c.OBJECTS_PERIODS));
        return pairs.map(pair => {
            const [period_start, period_end] = pair.split(":");
            const period_reports = filterReports(narrative_reports, period_start, period_end);
            const onCreate =
                pair === this.activeKey()
                    ? e => {
                          return this.createSummary(e, period_start, period_end);
                      }
                    : undefined;
            const header = (
                <ReportingPeriodHeader
                    period_start={period_start}
                    period_end={period_end}
                    count={period_reports.length}
                    onCreate={onCreate}
                />
            );
            return (
                <Panel header={header} key={pair}>
                    {this.renderReports(period_reports, categories)}
                </Panel>
            );
        });
    }

    render() {
        // Special case, always get all Results
        const { categories, narrative_reports, periods, reportFormDisplay } = this.props;
        const periodIds = periods.ids;

        const reportsDisplay = (
            <Collapse accordion={true} activeKey={this.activeKey()} onChange={this.collapseChange}>
                {this.renderPanels(periodIds)}
            </Collapse>
        );
        const noPeriods = <p>No reporting periods</p>;
        const reportForm = reportFormDisplay => {
            const report = narrative_reports.objects[reportFormDisplay];
            const period_reports = filterReports(
                narrative_reports,
                report.period_start,
                report.period_end
            );
            return (
                <ReportForm
                    report={report}
                    narrative_reports={period_reports}
                    categories={categories}
                />
            );
        };
        if (!narrative_reports.fetched || !periods.fetched) {
            return (
                <p className="loading">
                    Loading <i className="fa fa-spin fa-spinner" />
                </p>
            );
        } else {
            return (
                <div className={c.OBJECTS_NARRATIVE_REPORTS}>
                    {<this.state.ReportAlert />}
                    {reportFormDisplay
                        ? reportForm(reportFormDisplay)
                        : periodIds.length > 0
                            ? reportsDisplay
                            : noPeriods}
                </div>
            );
        }
    }
}

const mapStateToProps = store => {
    return {
        keys: store.keys,
        categories: store.models.categories,
        narrative_reports: store.models.narrative_reports,
        periods: store.models.periods,
        project: store.page.project,
        reportFormDisplay: store.ui[c.REPORT_FORM_DISPLAY]
    };
};

export default connect(mapStateToProps)(NarrativeReports);
