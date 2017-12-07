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
    displayDate
} from "../utils";
import * as c from "../const";
import {collapseChange} from "../actions/collapse-actions";
import Collapse, { Panel } from 'rc-collapse';
import {selectablePeriods} from "../actions/ui-actions";
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
        const selectOptions = selectablePeriods(periods && periods.ids, false);

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


const ReportHeader = ({categories, report}) => {
    const style = {marginRight: '10px'};
    return (
        <div>
            <span style={style}>{categories.objects[report.category].label}</span>
            <span>
                {displayDate(report.period_start)} - {displayDate(report.period_end)}
            </span>
        </div>
    )
};


const Report = ({report}) => {
    return <Markdown markup={report.text}/>
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

    renderPanels(ids) {
        const {categories, reports} = this.props;
        return (ids.map(
            (id) => {
                const report = reports.objects[id];
                return (
                    <Panel header={<ReportHeader categories={categories} report={report}/>}
                           key={id}>
                        <Report report={report}/>
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