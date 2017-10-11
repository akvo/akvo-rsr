/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import {connect} from "react-redux";

import keyBy from 'lodash/keyBy';
import update from 'immutability-helper';

// TODO: look at refactoring the actions, moving the dispatch calls out of them. Not entirely trivial...
import {
    deleteFromModel,
    fetchModel,
    fetchUser,
    testFetchModel,
    updateModel,
} from "../actions/model-actions";

import {setPageData} from "../actions/page-actions";

import {
    activateFilterCSS,
    activateToggleAll,
    filterActive,
    selectPeriodByDates,
    filterPeriods,
    updateFormClose,
} from "../actions/ui-actions";

import * as c from "../const"

import {
    getApprovedPeriods,
    getMEManagerDefaultKeys,
    getNeedReportingPeriods,
    getPendingApprovalPeriods,
    getUpdatesDisaggregationObjects,
    getIndicatorsDimensionIds,
    getPublicViewDefaultKeys,
} from "../selectors";

import {
    _,
    collapseId,
    identicalArrays,
    isNewUpdate,
    openNodes,
    setHash,
    userIsMEManager,
} from "../utils"

import FilterBar from "./FilterBar";
import Results from "./Results";
import { collapseChange } from "../actions/collapse-actions";
import UpdateForm from "./updates/UpdateForm";


// The collapseID for the top collapse is always the same
const resultsCollapseID = 'results-results';


const dataFromElement = (elementName) => {
    return JSON.parse(document.getElementById(elementName).innerHTML);
};


const modifyUser = (isMEManager) => {
    return (data) => {
        // maintain compatibility with existing updates JSON
        data.approved_organisations = [data.organisation];
        data.isMEManager = isMEManager;
        // transform to common JSON data shape so normalize works in modelsReducer
        return {results: data};
    };
};

@connect((store) => {
    return {
        page: store.page,
        indicators: store.models.indicators,
        periods: store.models.periods,
        updates: store.models.updates,
        disaggregations: getUpdatesDisaggregationObjects(store),
        dimension_ids: getIndicatorsDimensionIds(store),
        dimensions: store.models.dimensions,
        user: store.models.user,
        ui: store.ui,
        needReportingPeriods: getNeedReportingPeriods(store),
        pendingApprovalPeriods: getPendingApprovalPeriods(store),
        approvedPeriods: getApprovedPeriods(store),
        MEManagerDefaultKeys: getMEManagerDefaultKeys(store),
        publicViewDefaultKeys: getPublicViewDefaultKeys(store),
    }
})
export default class App extends React.Component {
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
            originalUpdate: undefined,
        }
    }

    componentDidMount() {
        const project = dataFromElement('project');
        const mode = dataFromElement('mode');
        const strings = dataFromElement('translation-texts');
        this.props.dispatch(setPageData({project, mode, strings}));

        const userId = dataFromElement('endpoint-data').userID;
        if (userId) {
            const isMEManager = dataFromElement('endpoint-data').isMEManager;
            fetchModel('user', userId, activateToggleAll, modifyUser(isMEManager));
        } else {
            this.props.dispatch({
                type: c.FETCH_MODEL_FULFILLED,
                payload: {
                    model: 'user', data: {results: {
                        id: 0,
                        first_name: "Anonymous",
                        last_name: "User",
                        isMEManager: false}}}});
        }

        const projectId = project.id;
        fetchModel('results', projectId, activateToggleAll);
        fetchModel('indicators', projectId, activateToggleAll);
        fetchModel('dimensions', projectId, activateToggleAll);
        fetchModel('periods', projectId, activateToggleAll);
        fetchModel('updates', projectId, activateToggleAll);
        fetchModel('disaggregations', projectId, activateToggleAll);
        fetchModel('comments', projectId, activateToggleAll);
    }

    componentWillReceiveProps(nextProps) {

        const checkUrlFilter = () => {
            // Check if a filter should be applied based on URL fragment
            if (this.state.hash && nextProps.ui.allFetched) {
                const hash = this.state.hash;
                switch(hash) {
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
                    const [_, periodStart, periodEnd] = hash.split(':');
                    selectPeriodByDates(periodStart, periodEnd);
                }
                this.setState({hash: undefined});
            }
        };

        const setInitialView = () => {
            // set the initial state of the Results panels to open if the user is an M&E manager or
            // this is the public view
            if (nextProps.ui.allFetched && !this.state.initialViewSet) {
                if (nextProps.page.mode && nextProps.page.mode.public) {
                    openNodes(c.OBJECTS_INDICATORS, this.props.publicViewDefaultKeys);
                    this.setState({initialViewSet: true});
                }
                if (userIsMEManager(this.props.user)) {
                    collapseChange(resultsCollapseID, this.props.MEManagerDefaultKeys);
                    this.setState({initialViewSet: true});
                }
            }
        };

        const prepareUpdateForm = () => {
            // set state for if update form is visible, and if so store the original update
            const {updates, ui} = nextProps;
            const updateFormDisplay = ui && ui[c.UPDATE_FORM_DISPLAY] && updates && updates.ids.find(
                id => id === ui[c.UPDATE_FORM_DISPLAY]
            );
            this.setState({updateFormDisplay});
            let originalUpdate;
            if (updateFormDisplay && updateFormDisplay !== this.state.updateFormDisplay) {
                originalUpdate = {...updates.objects[updateFormDisplay]};
                this.setState({originalUpdate});
                const {disaggregations, periods, indicators} = nextProps;
                const update = updates.objects[updateFormDisplay];
                const period = periods.objects[update.period];
                const indicator = indicators.objects[period.indicator];
                const dimensions = this.props.dimension_ids[indicator.id].map(
                    (id) => {return this.props.dimensions.objects[id]}
                );
                this.createNewDisaggregations(
                    updateFormDisplay, dimensions, disaggregations[updateFormDisplay]
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
                this.props.ui.updateFormDisplay !== nextProps.ui.updateFormDisplay &&
                               nextProps.ui.updateFormDisplay === false ||
                               this.props.ui.activeFilter !== nextProps.ui.activeFilter ||
                               !identicalArrays(this.props.needReportingPeriods, nextProps.needReportingPeriods) ||
                               !identicalArrays(this.props.pendingApprovalPeriods,
                                                nextProps.pendingApprovalPeriods) ||
                               !identicalArrays(this.props.approvedPeriods, nextProps.approvedPeriods);

            if (redraw()) {
                switch(nextProps.ui.activeFilter) {
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
                if (this.state.updateFormDisplay &&

                    (this.props.ui.activeFilter !== nextProps.ui.activeFilter ||
                     !nextProps.ui.activeFilter))
                    {
                        this.onClose();
                    }
            }
        };

        checkUrlFilter();
        setInitialView();
        prepareUpdateForm();
        checkRedraw();
    };

    manageButtonsAndHash(element) {
        /*
           Set state for the button to highlight, set the URL # value, set selectedOption to undefined
           so it doesn't show a date period
         */
        activateFilterCSS(element);
        setHash(element);
        updateFormClose();
        this.setState({selectedOption: undefined});
    }

    showPending() {
        this.manageButtonsAndHash(c.FILTER_SHOW_PENDING);
    }

    showApproved(set=true) {
        this.manageButtonsAndHash(c.FILTER_SHOW_APPROVED);
    }

    needReporting() {
        this.manageButtonsAndHash(c.FILTER_NEED_REPORTING);
    }

    onClose() {
        updateFormClose();
        const originalUpdate = this.state.originalUpdate;
        if (isNewUpdate(originalUpdate)) {
            deleteFromModel(c.OBJECTS_UPDATES, originalUpdate, this.props.collapseId);
        } else {
            updateModel(c.OBJECTS_UPDATES, originalUpdate);
        }
    }

    createNewDisaggregations(update_id, dimensions, disaggregations){
        const dimension_disaggregations = keyBy(disaggregations, 'dimension');
        let changedDisaggregations = disaggregations;
        dimensions.forEach((dimension) => {
            if (dimension_disaggregations[dimension.id] === undefined) {
                const disaggregation = {
                    'update': update_id,
                    'dimension': dimension.id,
                    'id': 'new-'+dimension.id,
                    'value': '',
                    'numerator': '',
                    'denominator': '',
                    'narrative': '',
                };
                changedDisaggregations = update(changedDisaggregations, {$push: [disaggregation]});
                /* disaggregations.push(disaggregation)*/
                updateModel('disaggregations', disaggregation);
            }
        });
        return changedDisaggregations;
    }

    render() {
        const callbacks = {
            needReporting: this.needReporting,
            showPending: this.showPending,
            showApproved: this.showApproved,
        };

        const results = this.props.ui.allFetched ?
            <Results parentId="results"/>
        :
            <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>;

        const {page, disaggregations, updates, periods, indicators} = this.props;
        // HACK: when an update is created this.props.ui[c.UPDATE_FORM_DISPLAY] still has the value
        // of new update ("new-1" or such) while the updates are changed to holding the new-1 to the
        // "real" one with an ID from the backend. Thus we need to check not only that
        // ui.updateFormDisplay has a value, but also that that value is among the current list of
        // updates
        const {updateFormDisplay} = this.state;
        let updateForm = undefined;
        if (updateFormDisplay) {
            const update = updates.objects[updateFormDisplay];
            const period = periods.objects[update.period];
            const indicator = indicators.objects[period.indicator];
            const dimensions = this.props.dimension_ids[indicator.id].map(
                (id) => {return this.props.dimensions.objects[id]}
            );
            updateForm = (
                <UpdateForm indicator={indicator}
                            period={period}
                            update={update}
                            disaggregations={disaggregations[updateFormDisplay]}
                            dimensions={dimensions}
                            onClose={this.onClose}
                            originalUpdate={this.state.originalUpdate}
                            collapseId={collapseId(
                                             c.OBJECTS_UPDATES, update[c.PARENT_FIELD[c.OBJECTS_UPDATES]]
                                        )}/>
            )
        }

        return (
            <section className="results liveView">
                <FilterBar callbacks={callbacks}/>
                <main role="main" className={page.mode && page.mode.public ? 'project-page' : 'results-page'}>
                    <article className={updateForm ? 'shared' : 'full'}>
                        {results}
                    </article>
                    <aside className={updateForm ? 'open' : 'closed'}>
                        {updateForm}
                    </aside>
                </main>
            </section>
        );
    }
}
