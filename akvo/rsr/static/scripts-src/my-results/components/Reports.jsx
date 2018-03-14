/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { _, collapseId, displayDate, distinct, endpoints, setHash } from "../utils";
import * as c from "../const";
import { collapseChange } from "../actions/collapse-actions";
import {
    updateModelToBackend,
    saveModelToBackend,
    deleteModelFromBackend
} from "../actions/model-actions";
import Collapse, { Panel } from "rc-collapse";
import {
    datePairs,
    reportFormToggle,
    selectPeriodByDates,
    periodSelectReset,
    noHide
} from "../actions/ui-actions";
import Select from "react-select";
import "react-select/dist/react-select.css";
import Results from "./Results";

// Markdown
import { Markdown } from "react-showdown";
import { MarkdownEditor } from "./common";

// Alerts
import AlertFactory from "./alertContainer";
import * as alertActions from "../actions/alert-actions";

@connect(store => {
    return {
        reports: store.models.reports,
        project: store.page.project.id
    };
})
export default class Reports extends React.Component {
    render() {
        const { project, reports } = this.props;
        const row_count = Math.round(Math.ceil(reports.ids.length / 3)),
            row_indexes = Array.from(Array(row_count).keys()),
            col_indexes = Array.from(Array(3).keys());
        return (
            <div>
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
        this.state = {
            show_formats: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({ show_formats: !this.state.show_formats });
    }

    render() {
        const { project, report } = this.props;
        const { show_formats } = this.state;
        const formats = report.formats.map(format => {
            return (
                <ReportFormatButton
                    project={project}
                    format={format}
                    url={report.url}
                    key={format.name}
                />
            );
        });
        return (
            <div className="col-xs-4" onClick={this.onClick}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">{report.title}</h3>
                    </div>
                    <div className="panel-body">{show_formats ? formats : report.description}</div>
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
        const { url, format: { name }, project } = this.props;
        const download_url = url.replace("{format}", name).replace("{project}", project);
        window.location.assign(download_url);
    }

    render() {
        const { icon, name, display_name } = this.props.format;
        const icon_class = `fa fa-${icon}`,
            text = `Download ${display_name}`;
        return (
            <button className="btn btn-default" onClick={this.onClick}>
                <i className={icon_class} />
                <span>&nbsp;&nbsp;</span>
                <span>{text}</span>
            </button>
        );
    }
}
