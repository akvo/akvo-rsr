/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import { connect } from "react-redux";

// NOTE: the css for react-tabs is imported in main.scss as I couldn't get the MiniCssExtractPlugin
// loader to work correctly for react-tabs/style/react-tabs.css
// This is true for all style sheets provided by packages
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// TODO: look at refactoring the actions, moving the dispatch calls out of them. Not entirely trivial...
import { deleteFromModel, fetchModel, updateModel } from "../actions/model-actions";

import { setPageData } from "../actions/page-actions";

import {
    activateFilterCSS,
    activateToggleAll,
    selectPeriodByDates,
    filterPeriods,
    updateFormClose
} from "../actions/ui-actions";

import * as c from "../const";

import {
    getApprovedPeriods,
    getResultsDefaultKeys,
    getNeedReportingPeriods,
    getPendingApprovalPeriods,
    getUpdatesDisaggregationObjects,
    getDimensionNameValueIds,
    getUpdatesDisaggregationIds,
} from "../selectors";

import {
    _,
    collapseId,
    createNewDisaggregations,
    identicalArrays,
    isNewUpdate,
    modifyPeriods,
    setHash
} from "../utils";

import FilterBar from "./FilterBar";
import NarrativeReports from "./narrative-reports/NarrativeReports";
import Results from "./Results";
import { collapseChange } from "../actions/collapse-actions";
import UpdateForm from "./updates/UpdateForm";

// The collapseID for the top collapse is always the same
const resultsCollapseID = "results-results";

const dataFromElement = elementName => {
    return JSON.parse(document.getElementById(elementName).innerHTML);
};

const modifyUser = isMEManager => {
    return data => {
        // maintain compatibility with existing updates JSON
        data.approved_organisations = data.organisations;
        data.isMEManager = isMEManager;
        // transform to common JSON data shape so normalize works in modelsReducer
        return { results: data };
    };
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.showPending = this.showPending.bind(this);
        this.showApproved = this.showApproved.bind(this);
        this.needReporting = this.needReporting.bind(this);
        this.onClose = this.onClose.bind(this);
        this.state = {
            // filter state
            selectedOption: undefined,
            // URL hash indicating filter
            hash: window.location.hash && window.location.hash.substring(1),
            // display accordion with results open or closed
            initialViewSet: false,
            // is the update form open?
            updateFormDisplay: false,
            // if it is, keep track of the original update, used when cancelling edits
            originalUpdate: undefined
        };
    }

    componentDidMount() {
        const project = dataFromElement("project");
        const mode = dataFromElement("mode");
        const strings = dataFromElement("translation-texts");
        this.props.dispatch(setPageData({ project, mode, strings }));

        const userId = dataFromElement("endpoint-data").userID;
        if (userId) {
            const isMEManager = dataFromElement("endpoint-data").isMEManager;
            fetchModel("user", userId, activateToggleAll, modifyUser(isMEManager));
        } else {
            this.props.dispatch({
                type: c.FETCH_MODEL_FULFILLED,
                payload: {
                    model: "user",
                    data: {
                        results: {
                            id: 0,
                            first_name: "Anonymous",
                            last_name: "User",
                            isMEManager: false
                        }
                    }
                }
            });
        }

        const projectId = project.id;
        const projectPartners = project.partners;
        const singlePeriodProject = project.hierarchy_name ? true : false;
        fetchModel("results", projectId, activateToggleAll);
        fetchModel("indicators", projectId, activateToggleAll);
        fetchModel('dimension_names', projectId, activateToggleAll);
        fetchModel('dimension_values', projectId, activateToggleAll);
        // TODO: check if we need to run modifyPeriods() after changing the locking status of periods
        fetchModel("periods", projectId, activateToggleAll, modifyPeriods(singlePeriodProject));
        fetchModel("updates", projectId, activateToggleAll);
        fetchModel("disaggregations", projectId, activateToggleAll);
        fetchModel("comments", projectId, activateToggleAll);
        if (!mode.public) {
            fetchModel("narrative_reports", projectId, activateToggleAll);
            fetchModel("categories", projectPartners, activateToggleAll);
            fetchModel("reports", projectId, activateToggleAll);
        }
        console.log(project)
      fetch(`/rest/v1/project/${project.id}/?format=json`)
        .then(response => {
          response.json().then(d => {
            console.log(d)
            if (d.program && d.program.id === 8759){
              this.setState({is2scale: true})
            }
          })
        })
    }

    componentWillReceiveProps(nextProps) {
        const checkUrlFilter = () => {
            // Check if a filter should be applied based on URL fragment
            if (this.state.hash && nextProps.ui.allFetched) {
                const hash = this.state.hash;
                switch (hash) {
                    case c.FILTER_NEED_REPORTING: {
                        this.needReporting();
                        break;
                    }
                    case c.FILTER_SHOW_PENDING: {
                        this.showPending();
                        break;
                    }
                    case c.FILTER_SHOW_APPROVED: {
                        this.showApproved();
                        break;
                    }
                }
                if (hash.startsWith(c.SELECTED_PERIODS)) {
                    const [_, periodStart, periodEnd] = hash.split(":");
                    selectPeriodByDates(periodStart, periodEnd);
                }
                this.setState({ hash: undefined });
            }
        };

        const setInitialView = () => {
            collapseChange(resultsCollapseID, this.props.ResultsDefaultKeys);
            this.setState({ initialViewSet: true });
        };

        const prepareUpdateForm = () => {
            // set state for if update form is visible, and if so store the original update
            const { updates, ui } = nextProps;
            const updateFormDisplay =
                ui &&
                ui[c.UPDATE_FORM_DISPLAY] &&
                updates &&
                updates.ids.find(id => id === ui[c.UPDATE_FORM_DISPLAY]);
            this.setState({ updateFormDisplay });
            let originalUpdate;
            if (updateFormDisplay && updateFormDisplay !== this.state.updateFormDisplay) {
                originalUpdate = { ...updates.objects[updateFormDisplay] };
                this.setState({ originalUpdate });
                const {
                    disaggregationObjects, periods, indicators, dimensionNameValueIds
                } = nextProps;
                const update = updates.objects[updateFormDisplay];
                const period = periods.objects[update.period];
                const indicator = indicators.objects[period.indicator];
                const dimensionsNameAndValueIds = indicator.dimension_names.reduce(
                    (acc, dimensionNameId) => {
                        // NOTE: acc.push() _has_ to be made separately from return acc, if you do
                        // both at the same time an int (1) is returned instead!
                        acc.push({
                            dimensionNameId,
                            dimensionValueIds: dimensionNameValueIds[dimensionNameId]
                        });
                        return acc;
                    }, []
                );
                createNewDisaggregations(
                    updateFormDisplay,
                    dimensionsNameAndValueIds,
                    disaggregationObjects[updateFormDisplay]
                );
            }
        };

        const checkRedraw = () => {
            // "redraw", i.e. call filterPeriods with the correct data when activeFilter or the
            // selectors for the filters data changes
            const redraw = () =>
                // when ui.updateFormDisplay changes to false, the form is closing and we need to
                // redraw the accordion since it is closed except for the current update when the
                // form is opened
                (this.props.ui.updateFormDisplay !== nextProps.ui.updateFormDisplay &&
                    nextProps.ui.updateFormDisplay === false) ||
                this.props.ui.activeFilter !== nextProps.ui.activeFilter ||
                !identicalArrays(this.props.needReportingPeriods, nextProps.needReportingPeriods) ||
                !identicalArrays(
                    this.props.pendingApprovalPeriods,
                    nextProps.pendingApprovalPeriods
                ) ||
                !identicalArrays(this.props.approvedPeriods, nextProps.approvedPeriods);

            if (redraw()) {
                switch (nextProps.ui.activeFilter) {
                    case c.FILTER_NEED_REPORTING: {
                        filterPeriods(nextProps.needReportingPeriods);
                        break;
                    }
                    case c.FILTER_SHOW_PENDING: {
                        filterPeriods(nextProps.pendingApprovalPeriods);
                        break;
                    }
                    case c.FILTER_SHOW_APPROVED: {
                        filterPeriods(nextProps.approvedPeriods);
                        break;
                    }
                }
                if (
                    this.state.updateFormDisplay &&
                    (this.props.ui.activeFilter !== nextProps.ui.activeFilter ||
                        !nextProps.ui.activeFilter)
                ) {
                    this.onClose(false);
                }
            }
        };

        checkUrlFilter();
        setInitialView();
        prepareUpdateForm();
        checkRedraw();
    }

    manageButtonsAndHash(element) {
        /*
           Set state for the button to highlight, set the URL # value, set selectedOption to undefined
           so it doesn't show a date period
         */
        activateFilterCSS(element);
        setHash(element);
        updateFormClose();
        this.setState({ selectedOption: undefined });
    }

    showPending() {
        this.manageButtonsAndHash(c.FILTER_SHOW_PENDING);
    }

    showApproved(set = true) {
        this.manageButtonsAndHash(c.FILTER_SHOW_APPROVED);
    }

    needReporting() {
        this.manageButtonsAndHash(c.FILTER_NEED_REPORTING);
    }

    onClose(update = true) {
        updateFormClose();
        if (update) {
            const originalUpdate = this.state.originalUpdate;
            if (isNewUpdate(originalUpdate)) {
                deleteFromModel(c.OBJECTS_UPDATES, originalUpdate, this.props.collapseId);
            } else {
                updateModel(c.OBJECTS_UPDATES, originalUpdate);
            }
        }
    }

    render() {
        const callbacks = {
            needReporting: this.needReporting,
            showPending: this.showPending,
            showApproved: this.showApproved
        };

        const results = this.props.ui.allFetched ? (
            <Results parentId="results" is2scale={this.state.is2scale} />
        ) : (
            <p className="loading">
                Loading <i className="fa fa-spin fa-spinner" />
            </p>
        );

        const {
            page, dimensionNames, dimensionValues, disaggregations, updateDisaggregationIds,
            updates, periods, indicators, user,
        } = this.props;
        // HACK: when an update is created this.props.ui[c.UPDATE_FORM_DISPLAY] still has the value
        // of new update ("new-1" or such) while the updates are changed to holding the new-1 to the
        // "real" one with an ID from the backend. Thus we need to check not only that
        // ui.updateFormDisplay has a value, but also that that value is among the current list of
        // updates
        const { updateFormDisplay } = this.state;
        let updateForm = undefined;
        if (updateFormDisplay) {
            const update = updates.objects[updateFormDisplay];
            const period = periods.objects[update.period];
            const indicator = indicators.objects[period.indicator];

            /*  dimensionsAndDisaggs =
                [
                    {
                        id: 45, name: "Gender", project: 5577,
                        dimensionValues: [
                            {id: 80, value: "Male", name: 45},
                            {id: 81, value: "Female", name: 45}
                        ],
                        disaggregations: [
                            {update: "new-1", dimension_value: 80, id: "new-80", value: "", �},
                            {update: "new-1", dimension_value: 81, id: "new-81", value: "", �}
                        ]
                    },
                    �,
                ]
            */
            let dimensionsAndDisaggs = [];
            if (updateDisaggregationIds[update.id].length > 0) {
                dimensionsAndDisaggs = indicator.dimension_names.map(
                    dimensionNameId => ({
                        ...dimensionNames.objects[dimensionNameId],
                        // NOTE: we're only populating dimensionValues with dimension values that
                        // actually have a disaggregation, not all existing dimension values
                        dimensionValues: updateDisaggregationIds[update.id].filter(
                            disaggId => disaggregations.objects[disaggId].dimension_name === dimensionNameId
                        ).map(
                            disaggId => ({
                                ...dimensionValues.objects[
                                    disaggregations.objects[disaggId].dimension_value
                                ]
                            })
                        ),
                        disaggregations: updateDisaggregationIds[update.id].filter(
                            disaggId => disaggregations.objects[disaggId].dimension_name === dimensionNameId
                        ).map(
                            disaggId => ({...disaggregations.objects[disaggId]})
                        ),
                    })
                );
            }

            updateForm = (
                <UpdateForm
                    indicator={indicator}
                    period={period}
                    update={update}
                    dimensionsAndDisaggs={dimensionsAndDisaggs}
                    onClose={this.onClose}
                    originalUpdate={this.state.originalUpdate}
                    collapseId={collapseId(
                        c.OBJECTS_UPDATES,
                        update[c.PARENT_FIELD[c.OBJECTS_UPDATES]]
                    )}
                />
            );
        }
        const showReports = page.mode && page.mode.show_narrative_reports;
        const showResults = page.mode && page.mode.show_results;
        const projectId = dataFromElement("project").id;
        const hasResults = dataFromElement("project").has_results;
        const approvedOrgs = user.objects && Object.keys(user.objects).length > 0 && user.objects[user.ids[0]].approved_organisations;
        const akvoUser = approvedOrgs && approvedOrgs.findIndex(x => x.id == '42') !== -1;
        const showResultsBeta = showResults && hasResults && akvoUser;
        const resultsTab = (
            <div>
                <FilterBar callbacks={callbacks} />
                <main
                    role="main"
                    className={page.mode && page.mode.public ? "project-page" : "results-page"}
                >
                    <article className={updateForm ? "shared" : "full"}>{results}</article>
                    <aside className={updateForm ? "open" : "closed"}>{updateForm}</aside>
                </main>
            </div>
        );

        return page.mode && page.mode.public ? (
            resultsTab
        ) : (
            <section className="results">
                {page.mode && page.mode.can_edit_project ? (
                    <a className="pull-right editBtn" href={`../../project_editor/${projectId}/`}>
                        {_("Editor")}
                    </a>
                ) : (
                    undefined
                )}
                <Tabs onSelect={this.onSelectTab}>
                    <TabList>
                        {showResults && hasResults ? <Tab>{_("results")}</Tab> : null}
                        {showResultsBeta ? (
                            <li className="react-tabs__tab external">
                                <a href={`/my-rsr/projects/${projectId}/results`}>
                                    {_("results")} (new view - beta)
                                </a>
                            </li>
                        ) : null}
                        {showReports ? <Tab>{_("narrative_summaries")}</Tab> : null}
                        <li className="react-tabs__tab external"><a href={`/my-rsr/projects/${projectId}/updates`}>{_('Updates')}</a></li>
                        <li className="react-tabs__tab external"><a href={`/my-rsr/projects/${projectId}/reports`}>{_('Reports')}</a></li>
                    </TabList>
                    {showResults && hasResults ? <TabPanel>{resultsTab}</TabPanel> : null}
                    {showReports ? (
                        <TabPanel>
                            <NarrativeReports />
                        </TabPanel>
                    ) : (
                        undefined
                    )}
                </Tabs>
            </section>
        );
    }
}

const mapStateToProps = store => {
    return {
        page: store.page,
        indicators: store.models.indicators,
        periods: store.models.periods,
        updates: store.models.updates,
        reports: store.models.reports,
        disaggregationObjects: getUpdatesDisaggregationObjects(store),
        dimensionNames: store.models.dimension_names,
        dimensionValues: store.models.dimension_values,
        dimensionNameValueIds: getDimensionNameValueIds(store),
        disaggregations: store.models.disaggregations,
        updateDisaggregationIds: getUpdatesDisaggregationIds(store),
        user: store.models.user,
        ui: store.ui,
        needReportingPeriods: getNeedReportingPeriods(store),
        pendingApprovalPeriods: getPendingApprovalPeriods(store),
        approvedPeriods: getApprovedPeriods(store),
        ResultsDefaultKeys: getResultsDefaultKeys(store)
    };
};

export default connect(mapStateToProps)(App);
