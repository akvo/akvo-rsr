/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import {connect} from "react-redux";
import {Markdown} from 'react-showdown';
import {
    _,
    collapseId,
    displayDate,
    distinct,
    endpoints,
} from "../utils";
import * as c from "../const";
import {collapseChange} from "../actions/collapse-actions";
import {updateModelToBackend, saveModelToBackend} from "../actions/model-actions";
import Collapse, { Panel } from 'rc-collapse';
import {
    datePairs,
    reportFormToggle,
} from "../actions/ui-actions";
import Select from "react-select";
import "react-select/dist/react-select.css";


const ReportingPeriodHeader = ({period_start, period_end}) => {
    return (
        <div>
            <span>{"Narrative summary for " + period_start + " - " + period_end}</span>
        </div>
    )
}

const ReportHeader = ({categories, report, onClick}) => {
    const category_style = {marginRight: '10px'};
    const status_style = {float: 'right', marginRight: '20px'};
    const clickHandler = (e) => {
        e.stopPropagation();
        return onClick(report);
    };
    return (
        <div>
            <span style={category_style}>{categories.objects[report.category].label}</span>
            <button className="btn btn-sm btn-default" onClick={clickHandler}>{_("edit")}</button>
            <span style={status_style}>{report.published?_("approved"):_("draft")}</span>
        </div>
    )
};

const Report = ({report}) => {
    return <Markdown markup={report.text}/>
};

export class ReportForm extends React.Component {
    constructor(props) {
        super(props);
        const {report} = this.props;
        const {text, category} = report;
        this.state = {text, category};
        this.saveSummary = this.saveSummary.bind(this);
        this.approveSummary = this.approveSummary.bind(this);
        this.createSummary = this.createSummary.bind(this);
        this.summaryToBackend = this.summaryToBackend.bind(this);
    }

    closeForm() {
        reportFormToggle();
    }

    saveSummary() {
        this.summaryToBackend();
    }

    approveSummary() {
        this.summaryToBackend(true);
    }

    createSummary(published) {
        const {text, category} = this.state;
        const summary = Object.assign({}, this.props.report);
        Object.assign(summary, {text, category});
        if (published) {summary.published = published};
        return summary;
    }

    summaryToBackend(published){
        const callbacks = {
            [c.UPDATE_MODEL_FULFILLED]: this.closeForm,
            /* FIXME: Handle failure, correctly!*/
            /* [c.UPDATE_MODEL_REJECTED]: createAlert.bind(
             *     this, commentAlertName, _("comment_not_saved")
             * )*/
        };
        const summary = this.createSummary(published);
        if (summary.id) {
            updateModelToBackend(
                c.OBJECTS_REPORTS, endpoints.update_report(summary.id), summary, null, callbacks
            );
        } else {
            saveModelToBackend(
                c.OBJECTS_REPORTS, endpoints.save_report(), summary, null, callbacks
            );
        }
    }

    render() {
        const {categories} = this.props;
        const setText = (e) => {
            const text = e.target.value;
            this.setState({text});
        };
        const setCategory = (category) => {
            this.setState({category: category.id});
            // FIXME: Need some kind of redraw here?
        };
        const categoryOptions = categories.ids.map((id) => {return this.props.categories.objects[id]});
        const reportCategory = categories.objects[this.state.category];
        return (
            <div>
                <button className="btn btn-sm btn-default" onClick={this.closeForm}>{"x"}</button>
                <Select options={categoryOptions}
                        value={reportCategory}
                        onChange={setCategory}
                        multi={false}
                        placeholder={_("select_category")}
                        searchable={false}
                        clearable={false}/>
                {/* FIXME: Change to a markdown area */}
                <textarea defaultValue={this.state.text} onChange={setText}/>
                <div>
                    <button className="btn btn-sm btn-default" onClick={this.saveSummary}>{_("save")}</button>
                    <button className="btn btn-sm btn-default" onClick={this.approveSummary}>{_("approve")}</button>
                </div>
            </div>
        );
    }
}

const filterReports = (reports, period_start, period_end) => {
    const ids = reports.ids.filter((id) => {
        const report = reports.objects[id];
        return report.period_start === period_start && report.period_end === period_end;
    });
    return ids.map((id) => {return reports.objects[id];});
};

@connect((store) => {
    return {
        keys: store.keys,
        categories: store.models.categories,
        reports: store.models.reports,
        periods: store.models.periods,
        reportFormDisplay: store.ui[c.REPORT_FORM_DISPLAY],
    }
})
export default class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.state = {collapseId: collapseId(c.OBJECTS_REPORTS, c.OBJECTS_REPORTS)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    renderReports(reports, categories) {
        return reports.map((report) => {
            const header = (<ReportHeader categories={categories} report={report} onClick={this.editSummary}/>);
            return (
                <Collapse key={report.id}>
                    <Panel header={header}>
                        <Report report={report}/>
                    </Panel>
                </Collapse>
            );
        });
    }

    editSummary(report) {
        reportFormToggle(report.id);
    }

    renderPanels(ids) {
        const {categories, reports} = this.props;
        const pairs = distinct(datePairs(ids, c.OBJECTS_PERIODS));
        return (pairs.map(
            (pair) => {
                const [period_start, period_end] = pair.split(':');
                const period_reports = filterReports(reports, period_start, period_end);
                return (
                    <Panel header={<ReportingPeriodHeader period_start={period_start} period_end={period_end}/>}
                           key={pair}>
                        {this.renderReports(period_reports, categories)}
                    </Panel>
                )
            }
        ))
    }

    render() {
        // Special case, always get all Results
        const {categories, reports, periods, reportFormDisplay} = this.props;
        const periodIds = periods.ids;

        const reportsDisplay = (
            <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                {this.renderPanels(periodIds)}
            </Collapse>
        );
        const noPeriods = (<p>No reporting periods</p>);
        const reportForm = (
            <ReportForm report={reports.objects[reportFormDisplay]}
                        categories={categories}/>
        );

        if (!reports.fetched || !periods.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else {
            return (
                <div className={c.OBJECTS_REPORTS}>
                    {reportFormDisplay?reportForm:(periodIds.length > 0? reportsDisplay: noPeriods)}
                </div>
            );
        }
    }
}
