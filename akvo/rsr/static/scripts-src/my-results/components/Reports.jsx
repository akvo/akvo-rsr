/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import PropTypes from "prop-types";
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
import {
    updateModelToBackend,
    saveModelToBackend,
    deleteModelFromBackend
} from "../actions/model-actions";
import Collapse, { Panel } from 'rc-collapse';
import {
    datePairs,
    reportFormToggle,
    selectPeriodByDates,
    periodSelectReset,
} from "../actions/ui-actions";
import Select from "react-select";
import "react-select/dist/react-select.css";
import ReactMde, { ReactMdeCommands } from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import Results from "./Results";

// Alerts
import AlertFactory from "./alertContainer"
import * as alertActions from "../actions/alert-actions"


const ReportingPeriodHeader = ({period_start, period_end, count, onCreate}) => {
    return (
        <div>
            <span>{`${_("narrative_summary_for")} ${displayDate(period_start)} - ${displayDate(period_end)}`}</span>
            <span>{`(${count})`}</span>
            {
                onCreate == undefined ?
                undefined
                :
                <button className="btn btn-sm btn-default"
                        onClick={onCreate}>
                    {_("create_narrative_summary")}
                </button>
            }
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


@connect((store) => {return {}}, alertActions)
export class ReportForm extends React.Component {
    constructor(props) {
        super(props);
        const {report} = this.props;
        const {text, category} = report;
        const alertName = 'ReportAlert';
        this.state = {
            reactMde: {text, selection: null},
            show_editor: true,
            alertName,
            category,
        };
        this.saveSummary = this.saveSummary.bind(this);
        this.approveSummary = this.approveSummary.bind(this);
        this.createSummary = this.createSummary.bind(this);
        this.deleteSummary = this.deleteSummary.bind(this);
        this.summaryToBackend = this.summaryToBackend.bind(this);
        this.toggleEditorPreview = this.toggleEditorPreview.bind(this);
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
        const {reactMde: {text}, category} = this.state;
        const summary = Object.assign({}, this.props.report);
        Object.assign(summary, {text, category});
        if (published) {summary.published = published};
        if (summary.id == 'new') {delete summary.id};
        return summary;
    }

    deleteSummary(){
        const {report} = this.props;
        const {alertName} = this.state;
        const callbacks = {
            [c.UPDATE_MODEL_REJECTED]: this.props.createAlert.bind(
                this, alertName, _("summary_not_deleted")
            )
        };
        this.closeForm();
        deleteModelFromBackend(
            c.OBJECTS_REPORTS, endpoints.update_report(report.id), report, null, callbacks
        );
    }

    summaryToBackend(published){
        const {alertName} = this.state;
        const callbacks = {
            [c.UPDATE_MODEL_FULFILLED]: this.closeForm,
            [c.UPDATE_MODEL_REJECTED]: this.props.createAlert.bind(
                this, alertName, _("summary_not_saved")
            )
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

    toggleEditorPreview(){ this.setState({show_editor: !this.state.show_editor}); }

    render() {
        const {categories, reports, report} = this.props;
        const setText = (reactMde) => {this.setState({reactMde})};
        const setCategory = (category) => {this.setState({category: category.id})};
        const reportedCategories = new Set(reports.map((report)=>{return report.category}));
        const categoryOptions = categories
            .ids
            .map((id) => {return this.props.categories.objects[id]})
            .filter((category)=>{return !reportedCategories.has(category.id) || category.id == report.category});
        const reportCategory = categories.objects[this.state.category];
        const disableDelete = report.id === 'new';
        const disableSave = (reportCategory === undefined || !this.state.reactMde.text);
        const previewButtonText = this.state.show_editor ? _("preview") : _("edit");
        return (
            <div>
                <h2>{displayDate(report.period_start)} - {displayDate(report.period_end)}</h2>
                <article className="shared">
                    <button className="btn btn-sm btn-default" onClick={this.closeForm}>{"x"}</button>
                    <Select options={categoryOptions}
                            value={reportCategory}
                            onChange={setCategory}
                            multi={false}
                            placeholder={_("select_category")}
                            searchable={false}
                            clearable={false}/>
                    <ReactMde value={this.state.reactMde}
                              visibility={{
                                  textarea: this.state.show_editor,
                                  toolbar: this.state.show_editor,
                                  preview: !this.state.show_editor,
                              }}
                              onChange={setText}
                              commands={ReactMdeCommands.getDefaultCommands()}/>
                    <div>
                        <button className="btn btn-sm btn-default" onClick={this.toggleEditorPreview}>
                            {previewButtonText}
                        </button>
                        <button className="btn btn-sm btn-default" onClick={this.deleteSummary} disabled={disableDelete}>
                            {_("delete")}
                        </button>
                        <button className="btn btn-sm btn-default" onClick={this.saveSummary} disabled={disableSave}>
                            {_("save")}
                        </button>
                        <button className="btn btn-sm btn-default" onClick={this.approveSummary} disabled={disableSave}>
                            {_("approve")}
                        </button>
                    </div>
                </article>
                <aside className="open">
                    <Results parentId="results"/>
                </aside>
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

const ReportAlert = ({message, close}) => (
    <div className='reports-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);
ReportAlert.propTypes = {
    message: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

@connect((store) => {
    return {
        keys: store.keys,
        categories: store.models.categories,
        reports: store.models.reports,
        periods: store.models.periods,
        project: store.page.project.id,
        reportFormDisplay: store.ui[c.REPORT_FORM_DISPLAY],
    }
})
export default class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        const alertName = 'ReportAlert';
        this.state = {
                  ReportAlert: AlertFactory({alertName})(ReportAlert),
                  collapseId: collapseId(c.OBJECTS_REPORTS, c.OBJECTS_REPORTS)
        };
        this.createSummary = this.createSummary.bind(this);
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
        const {period_start, period_end} = report;
        // filter periods;
        selectPeriodByDates(period_start, period_end);
        periodSelectReset();
        // Show report editing form
        reportFormToggle(report.id);
    }

    createSummary(e, period_start, period_end){
        e.stopPropagation();
        console.log(period_start, period_end);
        const id = 'new';
        const {reports, project} = this.props;
        const report = {id, period_start, period_end, project};
        reports.objects[report.id] = report
        this.editSummary(report);
    }

    renderPanels(ids) {
        const {categories, reports} = this.props;
        const pairs = distinct(datePairs(ids, c.OBJECTS_PERIODS));
        return (pairs.map(
            (pair) => {
                const [period_start, period_end] = pair.split(':');
                const period_reports = filterReports(reports, period_start, period_end);
                const onCreate = pair === this.activeKey() ?
                                 ((e) => {return this.createSummary(e, period_start, period_end)}) :
                                 undefined;
                const header = (
                    <ReportingPeriodHeader period_start={period_start}
                                           period_end={period_end}
                                           count={period_reports.length}
                                           onCreate={onCreate}/>
                )
                return (
                    <Panel header={header} key={pair}>
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
            <Collapse accordion={true} activeKey={this.activeKey()} onChange={this.collapseChange}>
                {this.renderPanels(periodIds)}
            </Collapse>
        );
        const noPeriods = (<p>No reporting periods</p>);
        const reportForm = (reportFormDisplay) => {
            const report = reports.objects[reportFormDisplay];
            const period_reports = filterReports(reports, report.period_start, report.period_end);
            return (<ReportForm report={report} reports={period_reports} categories={categories}/>);
        }
        if (!reports.fetched || !periods.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else {
            return (
                <div className={c.OBJECTS_REPORTS}>
                    {<this.state.ReportAlert/>}
                    {reportFormDisplay?
                     reportForm(reportFormDisplay):
                     (periodIds.length > 0? reportsDisplay: noPeriods)}
                </div>
            );
        }
    }
}
