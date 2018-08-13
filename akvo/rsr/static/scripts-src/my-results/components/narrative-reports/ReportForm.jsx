/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import { connect } from "react-redux";
import "react-select/dist/react-select.css";
import Select from "react-select";

import { _, collapseId, displayDate, endpoints, setHash } from "../../utils";
import * as c from "../../const";
import { collapseChange } from "../../actions/collapse-actions";
import {
    updateModelToBackend,
    saveModelToBackend,
    deleteModelFromBackend
} from "../../actions/model-actions";
import {
    reportFormToggle,
    selectPeriodByDates,
    periodSelectReset,
    noHide
} from "../../actions/ui-actions";

import * as alertActions from "../../actions/alert-actions";

import Results from "../Results";

// Markdown
import { MarkdownEditor } from "../common";

class ReportForm extends React.Component {
    constructor(props) {
        super(props);
        const { report } = this.props;
        const { text, category } = report;
        const alertName = "ReportAlert";
        this.state = {
            text,
            alertName,
            category
        };
        this.closeForm = this.closeForm.bind(this);
        this.saveSummary = this.saveSummary.bind(this);
        this.approveSummary = this.approveSummary.bind(this);
        this.createSummary = this.createSummary.bind(this);
        this.deleteSummary = this.deleteSummary.bind(this);
        this.summaryToBackend = this.summaryToBackend.bind(this);
    }

    componentDidMount() {
        // filter periods;
        const { period_start, period_end } = this.props.report;
        selectPeriodByDates(period_start, period_end);
        periodSelectReset();
        setHash();
    }

    componentWillUnmount() {
        noHide();
    }

    closeForm() {
        reportFormToggle();
        // HACK: Displaying the results in the edit view resets the keys! We
        // manually expand the correct period, again.
        const { period_start, period_end } = this.props.report;
        const activeKey = `${period_start}:${period_end}`;
        collapseChange(
            collapseId(c.OBJECTS_NARRATIVE_REPORTS, c.OBJECTS_NARRATIVE_REPORTS),
            activeKey
        );
    }

    saveSummary() {
        this.summaryToBackend();
    }

    approveSummary() {
        this.summaryToBackend(true);
    }

    createSummary(published) {
        const { text, category } = this.state;
        const summary = Object.assign({}, this.props.report);
        Object.assign(summary, { text, category });
        if (published) {
            summary.published = published;
        }
        if (summary.id === "new") {
            delete summary.id;
        }
        return summary;
    }

    deleteSummary() {
        const { report } = this.props;
        const { alertName } = this.state;
        const callbacks = {
            [c.UPDATE_MODEL_REJECTED]: this.props.createAlert.bind(
                this,
                alertName,
                _("summary_not_deleted")
            )
        };
        this.closeForm();
        deleteModelFromBackend(
            c.OBJECTS_NARRATIVE_REPORTS,
            endpoints.update_narrative_report(report.id),
            report,
            null,
            callbacks
        );
    }

    summaryToBackend(published) {
        const { alertName } = this.state;
        const callbacks = {
            [c.UPDATE_MODEL_FULFILLED]: this.closeForm,
            [c.UPDATE_MODEL_REJECTED]: this.props.createAlert.bind(
                this,
                alertName,
                _("summary_not_saved")
            )
        };
        const summary = this.createSummary(published);
        if (summary.id) {
            updateModelToBackend(
                c.OBJECTS_NARRATIVE_REPORTS,
                endpoints.update_narrative_report(summary.id),
                summary,
                null,
                callbacks
            );
        } else {
            saveModelToBackend(
                c.OBJECTS_NARRATIVE_REPORTS,
                endpoints.save_narrative_report(),
                summary,
                null,
                callbacks
            );
        }
    }

    render() {
        const { categories, narrative_reports, report } = this.props;
        const setText = text => {
            this.setState({ text });
        };
        const setCategory = category => {
            this.setState({ category: category.id });
        };
        const reportedCategories = new Set(
            narrative_reports.map(report => {
                return report.category;
            })
        );
        const categoryOptions = categories.ids
            .map(id => {
                return this.props.categories.objects[id];
            })
            .filter(category => {
                return !reportedCategories.has(category.id) || category.id === report.category;
            });
        const reportCategory = categories.objects[this.state.category];
        const disableDelete = report.id === "new";
        const disableSave = reportCategory === undefined || !this.state.text;
        return (
            <div>
                <h2>
                    {displayDate(report.period_start)} - {displayDate(report.period_end)}
                </h2>
                <article className="shared">
                    <button className="btn btn-xs btn-default closingBtn" onClick={this.closeForm}>
                        {"x"}
                    </button>
                    <h3>Narrative summary</h3>
                    <Select
                        options={categoryOptions}
                        value={reportCategory}
                        onChange={setCategory}
                        multi={false}
                        placeholder={_("select_category")}
                        searchable={false}
                        clearable={false}
                    />
                    <MarkdownEditor text={this.state.text} onChange={setText} />
                    <div className="menuAction">
                        <button
                            className="btn btn-xs btn-delete deleteBtn"
                            onClick={this.deleteSummary}
                            disabled={disableDelete}
                        >
                            {_("delete")}
                        </button>

                        <button
                            className="btn btn-xs btn-default"
                            onClick={this.approveSummary}
                            disabled={disableSave}
                        >
                            {_("approve")}
                        </button>
                        <button
                            className="btn btn-xs btn-default"
                            onClick={this.saveSummary}
                            disabled={disableSave}
                        >
                            {_("save")}
                        </button>
                    </div>
                </article>
                <aside className="open">
                    <Results parentId="results" />
                </aside>
            </div>
        );
    }
}

export default connect(
    () => {},
    alertActions
)(ReportForm);
