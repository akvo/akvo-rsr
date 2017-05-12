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
    activateFilter,
    activateToggleAll, filterActive,
    noHide,
    selectablePeriods,
    selectPeriodsThatNeedReporting,
    showUpdates,
} from "../actions/ui-actions";

import * as c from "../const"

import {
    getApprovedPeriods,
    getDraftUpdates,
    getNeedReportingPeriods,
    getUpdatesForApprovedPeriods,
} from "../selectors";

import { fieldValueOrSpinner } from "../utils"

import {
    ToggleButton,
    ButtonLabel,
} from "./common";

import Results from "./Results";


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
        models: store.models,
        ui: store.ui,
        user: store.models.user,
        draftUpdates: getDraftUpdates(store),
        approvedPeriods: getApprovedPeriods(store),
        approvedUpdates: getUpdatesForApprovedPeriods(store),
        needReportingPeriods: getNeedReportingPeriods(store),
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
        this.state = {selectedOption: undefined}
    }

    fetchUser(userId) {
        fetchModel('user', userId, activateToggleAll);
        this.props.dispatch(
            {type: c.UPDATE_MODEL_FULFILLED, payload: {model, object}});

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


    showDraft() {
        showUpdates(this.props.draftUpdates);
        activateFilter(c.FILTER_SHOW_DRAFT);
    }

    showApproved() {
        showUpdates(this.props.approvedUpdates);
        activateFilter(c.FILTER_SHOW_APPROVED);
    }

    unlockSelected() {
        unlockSelectedPeriods();
    }

    lockSelected() {
        lockSelectedPeriods();
    }

    selectChange(e) {
        this.setState({selectedOptions: e});
        e.value();
    }

    needReporting() {
        selectPeriodsThatNeedReporting(this.props.needReportingPeriods);
        activateFilter(c.FILTER_NEED_REPORTING);
    }

    resetFilters() {
        noHide();
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

    render() {
        const clearfix = {clear: 'both'};
        const selectOptions = selectablePeriods(this.props.models.periods && this.props.models.periods.ids);
        let value, icon;
        ({value, icon} = fieldValueOrSpinner(this.props.needReportingPeriods, 'length'));
        const needReportingLabel = <ButtonLabel label="Needs reporting " value={value} icon={icon}/>;
        ({value, icon} = fieldValueOrSpinner(this.props.draftUpdates, 'length'));
        const draftUpdateLabel = <ButtonLabel label="Pending approval " value={value} icon={icon}/>;
        ({value, icon} = fieldValueOrSpinner(this.props.approvedPeriods, 'length'));
        const approvedUpdateLabel = <ButtonLabel label="Approved " value={value} icon={icon}/>;
        const buttonDisabled = !this.props.ui.allFetched;
        const restrictedButtonDisabled = buttonDisabled || !this.userIsMEManager();

        return (
            <div className={'periodMenuBar'}>
                <div className={'row results-bar-titles'}>
                    <div className="col-sm-6"><h4>Bulk action</h4></div>
                    <div className="col-sm-6"><h4>Filter periods</h4></div>
                </div>
                <div className={'periodBtns'}>
                    <div className={'row'}>                        
                        <div className={'periodFilter col-sm-6'}>
                            <div className={'row'}><h5>Filter periods</h5>
                                <div className="col-xs-12">                                    
                                    <ToggleButton onClick={this.resetFilters} label="All periods"
                                                  disabled={buttonDisabled}/>
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
                            <div className={'row'}><h5>Bulk action</h5>
                                <div className="col-xs-6">
                                    <Select options={selectOptions}
                                            value={this.state.selectedOptions}
                                            multi={false} placeholder="Select period(s)"
                                            searchable={false} clearable={false}
                                            onChange={this.selectChange}
                                            className={
                                                this.filterSelectClass(c.FILTER_BULK_SELECT)
                                            }/>
                                </div>
                                <div className="col-xs-6">
                                    <ToggleButton onClick={this.lockSelected} label="Lock selected"
                                                  disabled={restrictedButtonDisabled}/>
                                    <ToggleButton onClick={this.unlockSelected}
                                                  label="Unlock selected"
                                                  disabled={restrictedButtonDisabled}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={clearfix}></div>
                <Results parentId="results"/>
            </div>
        );
    }
}
