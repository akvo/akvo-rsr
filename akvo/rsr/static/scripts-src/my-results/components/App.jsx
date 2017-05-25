/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import {connect} from "react-redux";

// TODO: look at refactoring the actions, moving the dispatch calls out of them. Not entirely trivial...
import {
    fetchModel,
    fetchUser,
    lockSelectedPeriods,
    testFetchModel,
    unlockSelectedPeriods,
} from "../actions/model-actions";

import {setPageData} from "../actions/page-actions";

import {
    activateFilterCSS,
    activateToggleAll,
    filterActive,
    noHide,
    selectablePeriods,
    selectPeriodByDates,
    selectPeriodsThatNeedReporting,
    showUpdates, updateFormReset,
} from "../actions/ui-actions";

import * as c from "../const"

import {
    getApprovedPeriods,
    getDraftUpdates,
    getMEManagerDefaultKeys,
    getNeedReportingPeriods,
    getUpdatesForApprovedPeriods,
} from "../selectors";

import {
    _,
    fieldValueOrSpinner,
    identicalArrays,
    setHash, toggleTree,
} from "../utils"

import {
    ToggleButton,
    ButtonLabel,
} from "./common";

import Results from "./Results";
import { collapseChange } from "../actions/collapse-actions";


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
        keys: store.keys,
        page: store.page,
        models: store.models,
        ui: store.ui,
        user: store.models.user,
        draftUpdates: getDraftUpdates(store),
        approvedPeriods: getApprovedPeriods(store),
        approvedUpdates: getUpdatesForApprovedPeriods(store),
        needReportingPeriods: getNeedReportingPeriods(store),
        MEManagerDefaultKeys: getMEManagerDefaultKeys(store),
    }
})
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.showDraft = this.showDraft.bind(this);
        this.showApproved = this.showApproved.bind(this);
        this.unlockSelected = this.unlockSelected.bind(this);
        this.lockSelected = this.lockSelected.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.needReporting = this.needReporting.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.openResults = this.openResults.bind(this);
        this.state = {
            selectedOption: undefined,
            hash: window.location.hash && window.location.hash.substring(1),
            initialViewSet: false,
        }
    }

    fetchUser(userId) {
        fetchModel('user', userId, activateToggleAll);
        this.props.dispatch({type: c.UPDATE_MODEL_FULFILLED, payload: {model, object}});
    }

    componentDidMount() {
        const project = dataFromElement('project-ids');
        const settings = dataFromElement('settings');
        const strings = dataFromElement('translation-texts');
        this.props.dispatch(setPageData({project, settings, strings}));

        const userId = dataFromElement('endpoint-data').userID;
        const isMEManager = dataFromElement('endpoint-data').isMEManager;
        fetchModel('user', userId, activateToggleAll, modifyUser(isMEManager));

        const projectId = project.project_id;
        fetchModel('results', projectId, activateToggleAll);
        fetchModel('indicators', projectId, activateToggleAll);
        // fetchModel('periods', projectId, [activateToggleAll, selectablePeriods]);
        fetchModel('periods', projectId, activateToggleAll);
        fetchModel('updates', projectId, activateToggleAll);
        fetchModel('comments', projectId, activateToggleAll);
    }

    componentWillReceiveProps(nextProps) {
        // Check if a filter should be applied from the based on URL fragment
        if (this.state.hash && nextProps.ui.allFetched) {
            const hash = this.state.hash;
            switch(hash) {
                case c.FILTER_NEED_REPORTING: {
                    this.needReporting();
                    break;
                }
                case c.FILTER_SHOW_DRAFT: {
                    this.showDraft();
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
        // set the initial state of the Results panels to open of the user is an M&E manager
        if (this.userIsMEManager() && nextProps.ui.allFetched && !this.state.initialViewSet) {
            collapseChange(resultsCollapseID, this.props.MEManagerDefaultKeys);
            this.setState({initialViewSet: true});
        }
    }

    manageButtonsAndHash(element) {
    /*
        Set state for the button to highlight, set the URL # value, set selectedOption to undefined
        so it doesn't show a date period
     */
        activateFilterCSS(element);
        setHash(element);
        this.setState({selectedOption: undefined});
    }

    showDraft() {
        showUpdates(this.props.draftUpdates, true);
        this.manageButtonsAndHash(c.FILTER_SHOW_DRAFT);
    }

    showApproved(set=true) {
        showUpdates(this.props.approvedUpdates);
        this.manageButtonsAndHash(c.FILTER_SHOW_APPROVED);
    }

    unlockSelected() {
        unlockSelectedPeriods();
    }

    lockSelected() {
        lockSelectedPeriods();
    }

    selectChange(e) {
        this.setState({selectedOption: e});
        e.value();
    }

    needReporting() {
        selectPeriodsThatNeedReporting(this.props.needReportingPeriods);
        this.manageButtonsAndHash(c.FILTER_NEED_REPORTING);
    }

    resetFilters() {
        noHide();
        setHash();
    }

    userIsMEManager() {
        const user = this.props.user;
        return user.fetched ?
            user.objects[user.ids[0]].isMEManager
            : false;
    }

    filterButtonClass(button) {
        return this.props.ui.activeFilter === button ?
            'btn btn-sm btn-default filterActive'
        :
            'btn btn-sm btn-default';
    }

    filterSelectClass(select) {
        return this.props.ui.activeFilter === select ? 'filterActive' : '';
    }

    activeKey() {
        return this.props.keys["results-results"];
    }

    openResults() {
        // Determine if we should open the full tree or close it
        const keys = this.props.keys;
        const activeKey = this.activeKey();
        if (this.userIsMEManager()) {
            // if activeKey is identical to the MEManagerDefaultKeys selector we are at the "closed"
            // closed view for an M&E manager
            const openCollapses = Object.keys(keys).filter(key => keys[key].length !== 0);
            return identicalArrays(activeKey, this.props.MEManagerDefaultKeys) &&
                openCollapses.length === 1;
        } else {
            // otherwise open only if the whole tree is closed
            return activeKey == undefined || activeKey.length == 0;
        }
    }

    createToggleKeys() {
        const open = this.openResults(this.activeKey());
        let MEManagerKeys;
        if (this.userIsMEManager()) {
            MEManagerKeys = this.props.MEManagerDefaultKeys;
        }
        // construct the array of Collapse activeKeys for the sub-tree
        return toggleTree(c.OBJECTS_RESULTS, c.OBJECTS_RESULTS, open, MEManagerKeys);
    }


    toggleAll() {
        const keys = this.createToggleKeys();
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        });
        noHide();
        updateFormReset();
    }

    render() {
        const clearfix = {clear: 'both'};
        const openCloseLabel = this.openResults() ? _('full_view') : _('overview');
        const selectOptions = selectablePeriods(this.props.models.periods && this.props.models.periods.ids);
        let value, icon;
        ({value, icon} = fieldValueOrSpinner(this.props.needReportingPeriods, 'length'));
        const needReportingLabel = <ButtonLabel label={_("needs_reporting")} value={value} icon={icon}/>;
        ({value, icon} = fieldValueOrSpinner(this.props.draftUpdates, 'length'));
        const draftUpdateLabel = <ButtonLabel label={_("pending_approval")} value={value} icon={icon}/>;
        ({value, icon} = fieldValueOrSpinner(this.props.approvedPeriods, 'length'));
        const approvedUpdateLabel = <ButtonLabel label={_("approved")} value={value} icon={icon}/>;
        const buttonDisabled = !this.props.ui.allFetched;
        const resetFilterDisabled = buttonDisabled || !this.props.ui.hide;
        const restrictedButtonDisabled = buttonDisabled || !this.userIsMEManager();

        return (
            <div className={'periodMenuBar'}>
                <div className={'periodBtns'}>
                    <div className={'row'}>
                        <div className={'periodFilter col-sm-6'}>
                            <div className={'row'}><h5>{_("filter_periods")}</h5>
                                <div className="col-xs-12">
                                    {/*<ToggleButton onClick={this.resetFilters} label={_("reset_filter")}*/}
                                                  {/*disabled={resetFilterDisabled}/>*/}
                                    <ToggleButton onClick={this.needReporting}
                                                  label={needReportingLabel}
                                                  disabled={buttonDisabled}
                                                  className={
                                                      this.filterButtonClass(c.FILTER_NEED_REPORTING)
                                                  }/>
                                    <ToggleButton onClick={this.showDraft} label={draftUpdateLabel}
                                                  disabled={buttonDisabled}
                                                  className={
                                                      this.filterButtonClass(c.FILTER_SHOW_DRAFT)
                                                  }/>
                                    <ToggleButton onClick={this.showApproved}
                                                  label={approvedUpdateLabel}
                                                  disabled={buttonDisabled}
                                                  className={
                                                      this.filterButtonClass(c.FILTER_SHOW_APPROVED)
                                                  }/>
                                </div>
                            </div>
                        </div>
                        <div className={'periodBulkAct col-sm-6'}>
                            <div className={'row'}><h5>{_("bulk_action")}</h5>
                                <div className="col-xs-6">
                                    <Select options={selectOptions}
                                            value={this.state.selectedOption}
                                            multi={false} placeholder={_("select_periods")}
                                            searchable={false} clearable={false}
                                            onChange={this.selectChange}
                                            className={
                                                this.filterSelectClass(c.FILTER_BULK_SELECT)
                                            }/>
                                </div>
                                <div className="col-xs-6">
                                    <ToggleButton onClick={this.lockSelected} label={_("lock_selected")}
                                                  disabled={restrictedButtonDisabled}/>
                                    <ToggleButton onClick={this.unlockSelected}
                                                  label="Unlock selected"
                                                  disabled={restrictedButtonDisabled}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'periodOverview'}>
                    <div className={'row'}>
                        <div className="col-xs-12">
                            <ToggleButton onClick={this.toggleAll} label={openCloseLabel}
                                          disabled={buttonDisabled} className="overviewBtn btn btn-sm btn-default"/>

                        </div>
                    </div>
                </div>
                <Results parentId="results"/>
            </div>
        );
    }
}
