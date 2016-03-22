/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var endpointsReport,
    i18nReport,
    projectIdReport,
    loadedAPIsReport = 0;

var relatedObjectsReport = [
    'related_project',
    'project_contact',
    'partnership',
    'budget_item',
    'country_budget_item',
    'transaction',
    'transaction_sector',
    'planned_disbursement',
    'project_location',
    'administrative_location',
    'recipient_country',
    'recipient_region',
    'result',
    'indicator',
    'indicator_reference',
    'indicator_period',
    'indicator_period_actual_dimension',
    'indicator_period_target_dimension',
    'indicator_period_actual_location',
    'indicator_period_target_location',
    'sector',
    'policy_marker',
    'humanitarian_scope',
    'project_condition',
    'project_document',
    'project_document_category',
    'link',
    'crs_add',
    'crs_add_other_flag',
    'fss',
    'fss_forecast',
    'legacy_data'
];

var differentRelations = [
    ['project_location', 'location_target'],
    ['indicator', 'result__project'],
    ['indicator_reference', 'indicator__result__project'],
    ['indicator_period', 'indicator__result__project'],
    ['indicator_period_actual_dimension', 'period__indicator__result__project'],
    ['indicator_period_target_dimension', 'period__indicator__result__project'],
    ['indicator_period_actual_location', 'period__indicator__result__project'],
    ['indicator_period_target_location', 'period__indicator__result__project'],
    ['transaction_sector', 'transaction__project'],
    ['administrative_location', 'location__location_target'],
    ['project_document_category', 'document__project'],
    ['crs_add_other_flag', 'crs__project'],
    ['fss_forecast', 'fss__project']
];


var excludeFieldsReport = [
    'related_project.project',
    'related_project.relation',
    'project_contact.project',
    'project_contact.type',
    'partnership.project',
    'partnership.iati_organisation_role',
    'partnership.partner_type',
    'partnership.partner_type_extra',
    'partnership.internal_id',
    'partnership.iati_url',
    'partnership.related_activity_id',
    'budget_item.project',
    'budget_item.label',
    'budget_item.type',
    'budget_item.currency',
    'budget_item.status',
    'country_budget_item.project',
    'country_budget_item.code',
    'transaction.project',
    'transaction.transaction_type',
    'transaction.aid_type',
    'transaction.disbursement_channel',
    'transaction.finance_type',
    'transaction.flow_type',
    'transaction.tied_status',
    'transaction.recipient_country',
    'transaction.recipient_region',
    'transaction.recipient_region_vocabulary',
    'transaction.currency',
    'transaction_sector.code',
    'transaction_sector.vocabulary',
    'planned_disbursement.project',
    'planned_disbursement.type',
    'planned_disbursement.currency',
    'project_location.location_target',
    'project_location.vocabulary',
    'project_location.exactness',
    'project_location.location_reach',
    'project_location.location_class',
    'project_location.feature_designation',
    'administrative_location.vocabulary',
    'recipient_country.project',
    'recipient_country.country',
    'recipient_region.project',
    'recipient_region.region',
    'recipient_region.region_vocabulary',
    'result.project',
    'result.project_title',
    'result.parent_result',
    'result.type',
    'indicator.parent_indicator',
    'indicator.measure',
    'indicator_period.percent_accomplishment',
    'indicator_period.locked',
    'indicator_period.parent_period',
    'sector.project',
    'sector.sector_code',
    'sector.vocabulary',
    'policy_marker.project',
    'policy_marker.policy_marker',
    'policy_marker.vocabulary',
    'policy_marker.significance',
    'humanitarian_scope.project',
    'humanitarian_scope.type',
    'humanitarian_scope.vocabulary',
    'project_condition.project',
    'project_condition.type',
    'project_document.project',
    'project_document.language',
    'project_document.title_language',
    'project_document.format',
    'project_document_category.category',
    'link.project',
    'link.kind',
    'crs_add.project',
    'crs_add.repayment_type',
    'crs_add.repayment_plan',
    'crs_add.currency',
    'crs_add.channel_code',
    'crs_add_other_flag.crs',
    'crs_add_other_flag.code',
    'fss.project',
    'fss_forecast.currency',
    'fss_forecast.fss',
    'legacy_data.project'
];

/* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrftoken = getCookie('csrftoken');

function renderReportTab() {
    var LargeTable = React.createClass({displayName: 'LargeTable',
        headerName: function(header) {
            var newHeaderName = header.replace('iati', 'IATI').replace('url', 'URL').replace('uri', 'URI');
            newHeaderName = newHeaderName.charAt(0).toUpperCase() + newHeaderName.slice(1);
            return newHeaderName.replace(/_/g, ' ').replace(' label', '');
        },

        renderHeader: function(fieldsList) {
            var thisTable = this;

            var headers = fieldsList.map(function(field) {
                return (
                    React.DOM.th(null, 
                        thisTable.headerName(field)
                    )
                );
            });

            return (
                React.DOM.thead(null, 
                    React.DOM.tr(null, 
                        headers
                    )
                )
            );
        },

        renderContent: function(fieldsList, relatedObject) {
            var cells = [];

            for (var i = 0; i < fieldsList.length; i++) {
                var value = relatedObject[fieldsList[i]];
                if (value === true) {
                    value = 'True';
                } else if (value === false) {
                    value = 'False';
                }
                cells.push(React.DOM.td(null, value));
            }

            return (
                React.DOM.tbody(null, 
                    React.DOM.tr(null, 
                        cells
                    )
                )
            );
        },

        render: function() {
            var thisTable = this;

            var tables = this.props.tableInfo.map(function(relatedObject) {
                var relatedObjectId = relatedObject.id !== undefined ? relatedObject.id : '';

                return (
                    React.DOM.div( {className:thisTable.props.tableName}, 
                        React.DOM.h4(null, thisTable.headerName(thisTable.props.tableName) + ' ' + relatedObjectId),
                        React.DOM.div( {className:"table-responsive"}, 
                            React.DOM.table( {className:"table table-bordered table-hover"}, 
                                thisTable.renderHeader(thisTable.props.fields[0]),
                                thisTable.renderContent(thisTable.props.fields[0], relatedObject),
                                thisTable.renderHeader(thisTable.props.fields[1]),
                                thisTable.renderContent(thisTable.props.fields[1], relatedObject)
                            )
                        )
                    )
                );
            });

            return (
                React.DOM.div( {className:this.props.tableName + "Container"}, 
                    tables
                )
            );
        }
    });

    var SmallTable = React.createClass({displayName: 'SmallTable',
        headerName: function(header) {
            var newHeaderName = header.replace('iati', 'IATI').replace('url', 'URL').replace('uri', 'URI');
            newHeaderName = newHeaderName.charAt(0).toUpperCase() + newHeaderName.slice(1);
            return newHeaderName.replace(/_/g, ' ').replace(' label', '');
        },

        renderHeader: function() {
            var thisTable = this;

            var headers = this.props.fields[0].map(function(field) {
                return (
                    React.DOM.th(null, 
                        thisTable.headerName(field)
                    )
                );
            });

            return (
                React.DOM.thead(null, 
                    React.DOM.tr(null, 
                        headers
                    )
                )
            );
        },

        renderContent: function() {
            var thisTable = this;
            var fieldsList = this.props.fields[0];

            var rows = this.props.tableInfo.map(function(relatedObject) {
                var cells = [];

                for (var i = 0; i < fieldsList.length; i++) {
                    var value = relatedObject[fieldsList[i]];
                    if (value === true) {
                        value = 'True';
                    } else if (value === false) {
                        value = 'False';
                    }
                    cells.push(React.DOM.td(null, value));
                }

                return (
                    React.DOM.tr(null, cells)
                );
            });

            return (
                React.DOM.tbody(null, 
                    rows
                )
            );
        },

        render: function() {
            return (
                React.DOM.div( {className:this.props.tableName + "Container"}, 
                    React.DOM.h4(null, this.headerName(this.props.tableName)),
                    React.DOM.div( {className:"table-responsive"}, 
                        React.DOM.table( {className:"table table-bordered table-hover"}, 
                            this.renderHeader(),
                            this.renderContent()
                        )
                    )
                )
            );
        }
    });

    var RelatedObjectTable = React.createClass({displayName: 'RelatedObjectTable',
        fields: function() {
            var fields = [];
            for (var field in this.props.tableInfo[0]) {
                if (this.props.tableInfo[0].hasOwnProperty(field)) {
                    if (this.hasData(field) && excludeFieldsReport.indexOf(this.props.tableName + '.' + field) < 0) {
                        if (field === 'id') {
                            fields.splice(0, 0, field);
                        } else {
                            fields.push(field);
                        }
                    }
                }
            }

            if (fields.length < 11) {
                return [fields];
            } else {
                var numberOfFields = Math.round(fields.length / 2) + 1,
                    row1 = [],
                    row2 = [];

                for (var i = 0; i < numberOfFields - 1; i++) {
                    row1.push(fields[i]);
                }
                for (var j = numberOfFields - 1; j < fields.length - 1; j++) {
                    row2.push(fields[j]);
                }
                if (this.props.tableName !== 'crs-add') {
                    row2.splice(0, 0, 'id');
                }
                return [row1, row2];
            }
        },

        hasData: function(field) {
            for (var i = 0; i < this.props.tableInfo.length; i++) {
                var objectEntry = this.props.tableInfo[i];
                if (!(objectEntry[field] === null || objectEntry[field] === '')) {
                    return true;
                }
            }
            return false;
        },

        renderHeader: function(fieldList) {
            var thisTable = this;

            var headers = fieldList.map(function(field) {
                return (
                    React.DOM.th(null, 
                        thisTable.headerName(field)
                    )
                );
            });

            return (
                React.DOM.thead(null, 
                    React.DOM.tr(null, 
                        headers
                    )
                )
            );
        },

        renderContent: function(fieldList) {
            var rows = this.props.tableInfo.map(function(relatedObject) {
                var cells = [];

                for (var i = 0; i < fieldList.length; i++) {
                    var value = relatedObject[fieldList[i]];
                    if (value === true) {
                        value = 'True';
                    } else if (value === false) {
                        value = 'False';
                    }
                    cells.push(React.DOM.td(null, value));
                }

                return (
                    React.DOM.tr(null, cells)
                );
            });

            return (
                React.DOM.tbody(null, 
                    rows
                )
            );
        },

        render: function() {
            if (this.props.tableInfo.length > 0) {
                var fields = this.fields();
                var table = SmallTable;

                if (fields.length > 1) {
                    table = LargeTable;
                }

                return (
                    React.createElement(table, {
                        fields: fields,
                        tableInfo: this.props.tableInfo,
                        tableName: this.props.tableName
                    })
                );
            } else {
                return (
                    React.DOM.span(null )
                );
            }
        }
    });

    var ProjectTables = React.createClass({displayName: 'ProjectTables',
        identifiersAndDates: function(proj) {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-sm-6"}, 
                        React.DOM.h4(null, "Identifiers"),
                        React.DOM.div( {className:"table-responsive"}, 
                            React.DOM.table( {className:"table table-bordered table-hover"}, 
                                React.DOM.tbody(null, 
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "IATI Activity ID"),
                                        React.DOM.td(null, proj.iati_activity_id)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "RSR ID"),
                                        React.DOM.td(null, projectIdReport)
                                    )
                                )
                            )
                        )
                    ),
                    React.DOM.div( {className:"col-sm-6"}, 
                        React.DOM.h4(null, "Activity dates and status"),
                        React.DOM.div( {className:"table-responsive"}, 
                            React.DOM.table( {className:"table table-bordered table-hover"}, 
                                React.DOM.tbody(null, 
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Status"),
                                        React.DOM.td(null, proj.status_label)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Planned Start Date"),
                                        React.DOM.td(null, proj.date_start_planned)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Planned End Date"),
                                        React.DOM.td(null, proj.date_end_planned)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Actual Start Date"),
                                        React.DOM.td(null, proj.date_start_actual)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Actual End Date"),
                                        React.DOM.td(null, proj.date_end_actual)
                                    )
                                )
                            )
                        )
                    )
                )
            );
        },

        descriptions: function(proj) {
            return (
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-sm-12"}, 
                        React.DOM.h4(null, "Descriptions"),
                        React.DOM.div( {className:"table-responsive"}, 
                            React.DOM.table( {className:"table table-bordered table-hover"}, 
                                React.DOM.tbody(null, 
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Project Plan"),
                                        React.DOM.td(null, proj.project_plan)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Goals Overview"),
                                        React.DOM.td(null, proj.goals_overview)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Target Group"),
                                        React.DOM.td(null, proj.target_group)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Summary of Project Plan"),
                                        React.DOM.td(null, proj.project_plan_summary)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Background"),
                                        React.DOM.td(null, proj.background)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Situation at start of project"),
                                        React.DOM.td(null, proj.current_status)
                                    ),
                                    React.DOM.tr(null, 
                                        React.DOM.th( {scope:"row"}, "Sustainability"),
                                        React.DOM.td(null, proj.sustainability)
                                    )
                                )
                            )
                        )
                    )
                )
            );
        },

        render: function() {
            var proj = this.props.projectInfo[0];

            return (
                React.DOM.div(null, 
                    this.identifiersAndDates(proj),
                    this.descriptions(proj)
                )
            );
        }
    });

    var ReportApp = React.createClass({displayName: 'ReportApp',
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
                    thisApp.getData(relatedObjectsReport[i]);
                }
            }, 2000);
        },

        getProjectData: function() {
            var xmlHttp = new XMLHttpRequest();
            var url = endpointsReport.base_url + "/rest/v1/project/" + projectIdReport + "/?format=json";
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
            var relation = 'project';

            for (var i = 0; i < differentRelations.length; i++) {
                if (differentRelations[i][0] === relatedObject) {
                    relation = differentRelations[i][1];
                }
            }

            var url = endpointsReport.base_url + "/rest/v1/" + relatedObject + "/?format=json&" + relation + "=" + projectIdReport;
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
                    React.DOM.div( {className:"text-center"}, 
                        React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " Loading data.."
                    )
                );
            } else {
                return (
                    React.DOM.span(null )
                );
            }
        },

        render: function() {
            var relatedObjectsArray = [];
            var relatedObjectsOrder = [];

            for (var relatedObject in this.state.relatedObjects) {
                if (this.state.relatedObjects.hasOwnProperty(relatedObject) && relatedObject !== 'project') {
                    var index = 0;
                    for (var i = 0; i < relatedObjectsOrder.length; i++) {
                        if (relatedObjectsReport.indexOf(relatedObjectsOrder[i]) < relatedObjectsReport.indexOf(relatedObject)) {
                            index++;
                        }
                    }
                    relatedObjectsArray.splice(index, 0,
                        React.createElement(RelatedObjectTable, {
                            tableName: relatedObject,
                            tableInfo: this.state.relatedObjects[relatedObject]
                        })
                    );
                    relatedObjectsOrder.splice(index, 0, relatedObject);
                }
            }

            if ('project' in this.state.relatedObjects) {
                relatedObjectsArray.splice(0, 0,
                    React.createElement(ProjectTables, {
                        projectInfo: this.state.relatedObjects.project
                    })
                );
            }

            if (relatedObjectsArray.length === 0) {
                return (
                    React.DOM.div( {className:"container"}, 
                        React.DOM.div( {className:"row"}, 
                            React.DOM.div( {className:"col-sm-6"}, 
                                React.DOM.h4(null, "Identifiers"),
                                React.DOM.div( {className:"table-responsive"}, 
                                    React.DOM.table( {className:"table table-bordered table-hover"}, 
                                        React.DOM.tbody(null, 
                                            React.DOM.tr(null, 
                                                React.DOM.th( {scope:"row"}, "IATI Activity ID"),
                                                React.DOM.td(null, React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " Loading data..")
                                            ),
                                            React.DOM.tr(null, 
                                                React.DOM.th( {scope:"row"}, "RSR ID"),
                                                React.DOM.td(null, projectIdReport)
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            } else {
                return (
                    React.DOM.div( {className:"container"}, 
                        relatedObjectsArray,
                        this.renderLoading()
                    )
                );
            }
        }
    });

    // Initialise 'Report' tab
    var reportContainer = document.querySelector('article.projectReport');
    ReactDOM.render(
        React.createElement(ReportApp),
        reportContainer
    );
}

var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, renderReportTab, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    endpointsReport = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18nReport = JSON.parse(document.getElementById('report-translations').innerHTML);
    projectIdReport = JSON.parse(document.getElementById('default-values').innerHTML).project_id;

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        // Render React components
        renderReportTab();
    } else {
        loadAndRenderReact();
    }
});