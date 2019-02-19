// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var endpointsReport,
    i18nReport,
    projectIdReport,
    loadedAPIsReport = 0;

var relatedObjectsReport = [
    ["related_project", ["relation_label", "related_iati_id", "related_project_show_link"]],
    [
        "project_contact",
        [
            "type_label",
            "email",
            "job_title",
            "organisation",
            "telephone",
            "mailing_address",
            "state",
            "department",
            "website"
        ]
    ],
    [
        "partnership",
        [
            "organisation_show_link",
            "organisation_role_label",
            "is_secondary_reporter",
            "funding_amount_label",
            "iati_activity_id"
        ]
    ],
    [
        "budget_item",
        [
            "currency_label",
            "amount",
            "label_label",
            "other_extra",
            "type_label",
            "status_label",
            "period_start",
            "period_end",
            "value_date"
        ]
    ],
    ["country_budget_item", ["code_label", "description", "percentage"]],
    [
        "transaction",
        [
            "currency_label",
            "value",
            "value_date",
            "reference",
            "description",
            "provider_organisation_show_link",
            "provider_organisation_activity",
            "receiver_organisation_show_link",
            "receiver_organisation_activity",
            "transaction_type_label",
            "aid_type_label",
            "disbursement_channel_label",
            "finance_type_label",
            "flow_type_label",
            "tied_status_label",
            "recipient_country_label",
            "recipient_region_label",
            "recipient_region_vocabulary_label",
            "humanitarian"
        ]
    ],
    [
        "transaction_sector",
        ["transaction_unicode", "code_label", "text", "vocabulary_label", "vocabulary_uri"]
    ],
    [
        "planned_disbursement",
        [
            "currency_label",
            "value",
            "value_date",
            "type_label",
            "period_start",
            "period_end",
            "provider_organisation_show_link",
            "provider_organisation_activity",
            "receiver_organisation_show_link",
            "receiver_organisation_activity"
        ]
    ],
    [
        "project_location",
        [
            "longitude",
            "latitude",
            "city",
            "state",
            "address_1",
            "address_2",
            "postcode",
            "reference",
            "location_code",
            "vocabulary_label",
            "name",
            "description",
            "activity_description",
            "exactness_label",
            "reach_label",
            "class_label",
            "feature_designation_label"
        ]
    ],
    ["administrative_location", ["location_unicode", "code", "vocabulary_label"]],
    ["recipient_country", ["country_label", "text", "percentage"]],
    [
        "recipient_region",
        ["region_label", "text", "percentage", "vocabulary_label", "vocabulary_uri"]
    ],
    ["result", ["title", "type_label", "description", "aggregation_status"]],
    [
        "indicator",
        [
            "result_unicode",
            "title",
            "description",
            "measure_label",
            "ascending",
            "baseline_year",
            "baseline_value",
            "baseline_comment"
        ]
    ],
    [
        "indicator_reference",
        ["indicator_unicode", "reference", "vocabulary_label", "vocabulary_uri"]
    ],
    [
        "indicator_period",
        [
            "indicator_unicode",
            "period_start",
            "period_end",
            "target_value",
            "target_comment",
            "actual_value",
            "actual_comment"
        ]
    ],
    ["indicator_period_actual_dimension", ["period_unicode", "name", "value"]],
    ["indicator_period_target_dimension", ["period_unicode", "name", "value"]],
    ["indicator_period_actual_location", ["period_unicode", "location"]],
    ["indicator_period_target_location", ["period_unicode", "location"]],
    ["sector", ["code_label", "text", "vocabulary_label", "vocabulary_uri", "percentage"]],
    [
        "policy_marker",
        [
            "policy_marker_label",
            "description",
            "significance_label",
            "vocabulary_label",
            "vocabulary_uri"
        ]
    ],
    ["humanitarian_scope", ["code", "text", "type_label", "vocabulary_label", "vocabulary_uri"]],
    ["project_condition", ["type_label", "text"]],
    [
        "project_document",
        [
            "title",
            "title_language_label",
            "url",
            "document_show_link",
            "language_label",
            "format_label"
        ]
    ],
    ["project_document_category", ["document_unicode", "category_label"]],
    ["link", ["url", "caption"]],
    [
        "crs_add",
        [
            "repayment_type_label",
            "repayment_plan_label",
            "loan_terms_rate1",
            "loan_terms_rate2",
            "commitment_date",
            "repayment_first_date",
            "repayment_final_date",
            "loan_status_year",
            "currency_label",
            "loan_status_value_date",
            "interest_received",
            "principal_outstanding",
            "principal_arrears",
            "interest_arrears",
            "channel_code_label"
        ]
    ],
    ["crs_add_other_flag", ["code_label", "significance"]],
    ["fss", ["extraction_date", "priority", "phaseout_year"]],
    ["fss_forecast", ["currency_label", "value", "year", "value_date"]],
    ["legacy_data", ["name", "value", "iati_equivalent"]]
];

var differentRelations = [
    ["project_location", "location_target"],
    ["indicator", "result__project"],
    ["indicator_reference", "indicator__result__project"],
    ["indicator_period", "indicator__result__project"],
    ["indicator_period_actual_dimension", "period__indicator__result__project"],
    ["indicator_period_target_dimension", "period__indicator__result__project"],
    ["indicator_period_actual_location", "period__indicator__result__project"],
    ["indicator_period_target_location", "period__indicator__result__project"],
    ["transaction_sector", "transaction__project"],
    ["administrative_location", "location__location_target"],
    ["project_document_category", "document__project"],
    ["crs_add_other_flag", "crs__project"],
    ["fss_forecast", "fss__project"]
];

/* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrftoken = getCookie("csrftoken");

function renderReportTab() {
    var LargeTable = React.createClass({
        lookUpTableName: function() {
            return i18nReport[this.props.tableName];
        },

        headerName: function(header) {
            var newHeaderName = header
                .replace("iati", "IATI")
                .replace("url", "URL")
                .replace("uri", "URI");
            newHeaderName = newHeaderName.charAt(0).toUpperCase() + newHeaderName.slice(1);
            return newHeaderName
                .replace(/_/g, " ")
                .replace(" label", "")
                .replace(" unicode", "")
                .replace(" show link", "");
        },

        renderHeader: function(fieldsList) {
            var thisTable = this;

            var headers = fieldsList.map(function(field) {
                return <th>{thisTable.headerName(field)}</th>;
            });

            return (
                <thead>
                    <tr>{headers}</tr>
                </thead>
            );
        },

        renderContent: function(fieldsList, relatedObject) {
            var cells = [];

            for (var i = 0; i < fieldsList.length; i++) {
                var value = relatedObject[fieldsList[i]];

                if (typeof value === "string" && value.indexOf("<a href") > -1) {
                    cells.push(
                        React.createElement("td", { dangerouslySetInnerHTML: { __html: value } })
                    );
                } else {
                    if (value === true) {
                        value = "True";
                    } else if (value === false) {
                        value = "False";
                    }
                    cells.push(<td>{value}</td>);
                }
            }

            return (
                <tbody>
                    <tr>{cells}</tr>
                </tbody>
            );
        },

        render: function() {
            var thisTable = this;

            var tables = this.props.tableInfo.map(function(relatedObject) {
                var relatedObjectId =
                    relatedObject.id !== undefined
                        ? " (" + i18nReport.id + ": " + relatedObject.id + ")"
                        : "";

                return (
                    <div className={thisTable.props.tableName}>
                        <h4>{thisTable.lookUpTableName() + relatedObjectId}</h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                {thisTable.renderHeader(thisTable.props.fields[0])}
                                {thisTable.renderContent(thisTable.props.fields[0], relatedObject)}
                                {thisTable.renderHeader(thisTable.props.fields[1])}
                                {thisTable.renderContent(thisTable.props.fields[1], relatedObject)}
                            </table>
                        </div>
                    </div>
                );
            });

            return <div className={this.props.tableName + "Container"}>{tables}</div>;
        }
    });

    var SmallTable = React.createClass({
        lookUpTableName: function() {
            return i18nReport[this.props.tableName];
        },

        headerName: function(header) {
            var newHeaderName = header
                .replace("iati", "IATI")
                .replace("url", "URL")
                .replace("uri", "URI");
            newHeaderName = newHeaderName.charAt(0).toUpperCase() + newHeaderName.slice(1);
            return newHeaderName
                .replace(/_/g, " ")
                .replace(" label", "")
                .replace(" unicode", "")
                .replace(" show link", "");
        },

        renderHeader: function() {
            var thisTable = this;

            var headers = this.props.fields[0].map(function(field) {
                return <th>{thisTable.headerName(field)}</th>;
            });

            return (
                <thead>
                    <tr>{headers}</tr>
                </thead>
            );
        },

        renderContent: function() {
            var thisTable = this;
            var fieldsList = this.props.fields[0];

            var rows = this.props.tableInfo.map(function(relatedObject) {
                var cells = [];

                for (var i = 0; i < fieldsList.length; i++) {
                    var value = relatedObject[fieldsList[i]];

                    if (typeof value === "string" && value.indexOf("<a href") > -1) {
                        cells.push(
                            React.createElement("td", {
                                dangerouslySetInnerHTML: { __html: value }
                            })
                        );
                    } else {
                        if (value === true) {
                            value = "True";
                        } else if (value === false) {
                            value = "False";
                        }
                        cells.push(<td>{value}</td>);
                    }
                }

                return <tr>{cells}</tr>;
            });

            return <tbody>{rows}</tbody>;
        },

        render: function() {
            return (
                <div className={this.props.tableName + "Container"}>
                    <h4>{this.lookUpTableName()}</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            {this.renderHeader()}
                            {this.renderContent()}
                        </table>
                    </div>
                </div>
            );
        }
    });

    var RelatedObjectTable = React.createClass({
        getFields: function() {
            for (var i = 0; i < relatedObjectsReport.length; i++) {
                if (relatedObjectsReport[i][0] === this.props.tableName) {
                    return relatedObjectsReport[i][1];
                }
            }
            return [];
        },

        hasData: function(field) {
            for (var i = 0; i < this.props.tableInfo.length; i++) {
                var objectEntry = this.props.tableInfo[i];
                if (!(objectEntry[field] === null || objectEntry[field] === "")) {
                    return true;
                }
            }
            return false;
        },

        fields: function() {
            var fieldsList = this.getFields(),
                fields = [];

            for (var i = 0; i < fieldsList.length; i++) {
                if (this.hasData(fieldsList[i])) {
                    fields.push(fieldsList[i]);
                }
            }

            if (fields.length < 11) {
                return [fields];
            } else {
                var numberOfFields = Math.round(fields.length / 2) + 1,
                    row1 = [],
                    row2 = [];

                for (var j = 0; j < numberOfFields - 1; j++) {
                    row1.push(fields[j]);
                }
                for (var k = numberOfFields - 1; k < fields.length - 1; k++) {
                    row2.push(fields[k]);
                }
                return [row1, row2];
            }
        },

        render: function() {
            if (this.props.tableInfo.length > 0) {
                var fields = this.fields();
                var table = SmallTable;

                if (fields.length > 1) {
                    table = LargeTable;
                }

                return React.createElement(table, {
                    fields: fields,
                    tableInfo: this.props.tableInfo,
                    tableName: this.props.tableName
                });
            } else {
                return <span />;
            }
        }
    });

    var ProjectTables = React.createClass({
        identifiersAndDates: function(proj) {
            return (
                <div className="row">
                    <div className="col-sm-6">
                        <h4>{i18nReport.identifiers}</h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th scope="row">RSR {i18nReport.id}</th>
                                        <td>{projectIdReport}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {i18nReport.iati_activity} {i18nReport.id}
                                        </th>
                                        <td>{proj.iati_activity_id}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h4>{i18nReport.activity_dates_status}</h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th scope="row">{i18nReport.status}</th>
                                        <td>{proj.status_label}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {i18nReport.planned} {i18nReport.start}{" "}
                                            {i18nReport.date}
                                        </th>
                                        <td>{proj.date_start_planned}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {i18nReport.planned} {i18nReport.end} {i18nReport.date}
                                        </th>
                                        <td>{proj.date_end_planned}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {i18nReport.actual} {i18nReport.start} {i18nReport.date}
                                        </th>
                                        <td>{proj.date_start_actual}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            {i18nReport.actual} {i18nReport.end} {i18nReport.date}
                                        </th>
                                        <td>{proj.date_end_actual}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        },

        descriptions: function(proj) {
            var projectPlanText = { __html: micromarkdown.parse(proj.project_plan) };
            var goalsOverviewText = { __html: micromarkdown.parse(proj.goals_overview) };
            var targetGroupText = { __html: micromarkdown.parse(proj.target_group) };
            var projectPlanSummaryText = { __html: micromarkdown.parse(proj.project_plan_summary) };
            var backgroundText = { __html: micromarkdown.parse(proj.background) };
            var currentStatusText = { __html: micromarkdown.parse(proj.current_status) };
            var sustainabilityText = { __html: micromarkdown.parse(proj.sustainability) };

            return (
                <div className="row">
                    <div className="col-sm-12">
                        <h4>{i18nReport.descriptions}</h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th scope="row">{i18nReport.project_plan}</th>
                                        <td dangerouslySetInnerHTML={projectPlanText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.goals_overview}</th>
                                        <td dangerouslySetInnerHTML={goalsOverviewText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.target_group}</th>
                                        <td dangerouslySetInnerHTML={targetGroupText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.project_plan_summary}</th>
                                        <td dangerouslySetInnerHTML={projectPlanSummaryText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.background}</th>
                                        <td dangerouslySetInnerHTML={backgroundText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.current_status}</th>
                                        <td dangerouslySetInnerHTML={currentStatusText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.sustainability}</th>
                                        <td dangerouslySetInnerHTML={sustainabilityText} />
                                    </tr>
                                    <tr>
                                        <th scope="row">{i18nReport.keywords}</th>
                                        <td>{proj.keyword_labels.join(", ")}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        },

        render: function() {
            var proj = this.props.projectInfo[0];

            return (
                <div>
                    {this.identifiersAndDates(proj)}
                    {this.descriptions(proj)}
                </div>
            );
        }
    });

    var ReportApp = React.createClass({
        getInitialState: function() {
            return {
                relatedObjects: {}
            };
        },

        componentDidMount: function() {
            this.getProjectData();

            // Introduce a slight delay, to show the top (project) information first
            var thisApp = this;
            setTimeout(function() {
                for (var i = 0; i < relatedObjectsReport.length; i++) {
                    thisApp.getData(relatedObjectsReport[i][0]);
                }
            }, 2000);
        },

        getProjectData: function() {
            var xmlHttp = new XMLHttpRequest();
            var url =
                endpointsReport.base_url + "/rest/v1/project/" + projectIdReport + "/?format=json";
            var thisApp = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                    var currentRelatedObjects = thisApp.state.relatedObjects;
                    currentRelatedObjects.project = [JSON.parse(xmlHttp.responseText)];
                    thisApp.setState({
                        relatedObjects: currentRelatedObjects
                    });
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        },

        getData: function(relatedObject) {
            var xmlHttp = new XMLHttpRequest();
            var relation = "project";

            for (var i = 0; i < differentRelations.length; i++) {
                if (differentRelations[i][0] === relatedObject) {
                    relation = differentRelations[i][1];
                }
            }

            var url =
                endpointsReport.base_url +
                "/rest/v1/" +
                relatedObject +
                "/?format=json&" +
                relation +
                "=" +
                projectIdReport;
            var thisApp = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                    var currentRelatedObjects = thisApp.state.relatedObjects;
                    currentRelatedObjects[relatedObject] = JSON.parse(xmlHttp.responseText).results;
                    thisApp.setState({
                        relatedObjects: currentRelatedObjects
                    });
                    loadedAPIsReport++;
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        },

        renderLoading: function() {
            if (loadedAPIsReport < relatedObjectsReport.length - 1) {
                return (
                    <div className="text-center">
                        <i className="fa fa-spin fa-spinner" /> {i18nReport.loading}
                        ..
                    </div>
                );
            } else {
                return <span />;
            }
        },

        indexOfObject: function(relatedObject) {
            for (var i = 0; i < relatedObjectsReport.length; i++) {
                if (relatedObjectsReport[i][0] === relatedObject) {
                    return i;
                }
            }
            return false;
        },

        render: function() {
            var relatedObjectsArray = [];
            var relatedObjectsOrder = [];

            for (var relatedObject in this.state.relatedObjects) {
                if (
                    this.state.relatedObjects.hasOwnProperty(relatedObject) &&
                    relatedObject !== "project"
                ) {
                    var index = 0;
                    for (var i = 0; i < relatedObjectsOrder.length; i++) {
                        if (
                            this.indexOfObject(relatedObjectsOrder[i]) <
                            this.indexOfObject(relatedObject)
                        ) {
                            index++;
                        }
                    }
                    relatedObjectsArray.splice(
                        index,
                        0,
                        React.createElement(RelatedObjectTable, {
                            tableName: relatedObject,
                            tableInfo: this.state.relatedObjects[relatedObject]
                        })
                    );
                    relatedObjectsOrder.splice(index, 0, relatedObject);
                }
            }

            if ("project" in this.state.relatedObjects) {
                relatedObjectsArray.splice(
                    0,
                    0,
                    React.createElement(ProjectTables, {
                        projectInfo: this.state.relatedObjects.project
                    })
                );
            }

            if (relatedObjectsArray.length === 0) {
                return (
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6">
                                <h4>{i18nReport.identifiers}</h4>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <th scope="row">RSR {i18nReport.id}</th>
                                                <td>{projectIdReport}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    {i18nReport.iati_activity} {i18nReport.id}
                                                </th>
                                                <td>
                                                    <i className="fa fa-spin fa-spinner" />{" "}
                                                    {i18nReport.loading}
                                                    ..
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="container">
                        {relatedObjectsArray}
                        {this.renderLoading()}
                    </div>
                );
            }
        }
    });

    // Initialise 'Report' tab
    var reportContainer = document.querySelector("article.projectReport");
    ReactDOM.render(React.createElement(ReportApp), reportContainer);
}

var loadJS = function(url, implementationCode, location) {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement("script");
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadMarkdown() {
        var markdownSrc = document.getElementById("markdown").src;
        loadJS(markdownSrc, renderReportTab, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById("react-dom").src;
        loadJS(reactDOMSrc, loadMarkdown, document.body);
    }

    console.log("No React, load again.");
    var reactSrc = document.getElementById("react").src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise page */
document.addEventListener("DOMContentLoaded", function() {
    // Load initial data
    endpointsReport = JSON.parse(document.getElementById("data-endpoints").innerHTML);
    i18nReport = JSON.parse(document.getElementById("report-translations").innerHTML);
    projectIdReport = JSON.parse(document.getElementById("default-values").innerHTML).project_id;

    // Check if React is loaded
    if (
        typeof React !== "undefined" &&
        typeof ReactDOM !== "undefined" &&
        micromarkdown !== "undefined"
    ) {
        // Render React components
        renderReportTab();
    } else {
        loadAndRenderReact();
    }
});
