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
    distinct
} from "../utils";
import * as c from "../const";
import {collapseChange} from "../actions/collapse-actions";
import Collapse, { Panel } from 'rc-collapse';
import {datePairs,selectablePeriods} from "../actions/ui-actions";
import Select from "react-select";
import "react-select/dist/react-select.css";


@connect((store) => {
    return {
        periods: store.models.periods,
    }
})
class ReportsBar extends React.Component {
    constructor(props) {
        super(props);
        this.selectChange = this.selectChange.bind(this);
        this.state = {selectedOption: undefined,}
    }

    selectChange(e) {
        this.setState({selectedOption: e});
        e.value();
    }

    render() {
        const {periods} = this.props;
        const selectOptions = selectablePeriods(periods && periods.ids, this.selectChange, false);

        return (
            <header role="banner" className="periodMenuBar">
                <Select options={selectOptions}
                        value={this.state.selectedOption}
                        multi={false}
                        placeholder={_("select_periods")}
                        searchable={false}
                        clearable={false}
                        onChange={this.selectChange}/>
            </header>
        )
    }
}

const ReportingPeriodHeader = ({period_start, period_end}) => {
    return (
        <div>
            <span>{"Narrative summary for " + period_start + " - " + period_end}</span>
        </div>
    )
}

const ReportHeader = ({categories, report}) => {
    const style = {marginRight: '10px'};
    return (
        <div>
            <span style={style}>{categories.objects[report.category].label}</span>
        </div>
    )
};

const Report = ({report}) => {
    return <Markdown markup={report.text}/>
};

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
            return (
                <Collapse key={report.id}>
                    <Panel header={<ReportHeader categories={categories} report={report}/>}>
                        <Report report={report}/>
                    </Panel>
                </Collapse>
            );
        });
    }

    renderPanels(ids) {
        const {categories, reports} = this.props;
        const pairs = distinct(datePairs(ids, c.OBJECTS_REPORTS));
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
        const {reports} = this.props;
        const reportIds = reports.ids;

        if (!reports.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else if (reportIds.length > 0) {
            return (
                <div className={c.OBJECTS_REPORTS}>
                    <ReportsBar/>
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(reportIds)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <div className="emptyData">
                     <p>No narrative summaries</p>
                </div>
            );
        }
    }

}
