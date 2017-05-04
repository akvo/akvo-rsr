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
    unlockSelectedPeriods
} from "../actions/model-actions";
import {setPageData} from "../actions/page-actions";
import {
    activateToggleAll,
    noHide,
    periodsThatNeedReporting,
    selectablePeriods,
    selectPeriodsThatNeedReporting,
    showUpdates
} from "../actions/ui-actions";
import {getApprovedUpdates, getDraftUpdates} from "../selectors";
import {fieldValueOrSpinner} from "../utils";

import Results from "./Results";
import {ToggleButton} from "./common";


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
        approvedUpdates: getApprovedUpdates(store),
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
        this.state = {selectedOption: undefined}
    }

    fetchUser(userId) {
        fetchModel('user', userId, activateToggleAll);
        this.props.dispatch(
            {type: UPDATE_MODEL_FULFILLED, payload: {model, object}});

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
    }

    showApproved() {
        showUpdates(this.props.approvedUpdates);
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
        selectPeriodsThatNeedReporting();
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

    render() {
        const clearfix = {clear: 'both'};
        const selectOptions = selectablePeriods(this.props.models.periods && this.props.models.periods.ids);
        const needReportingCount = fieldValueOrSpinner(periodsThatNeedReporting(), 'length');
        const needReportingLabel = `Need reporting (${needReportingCount})`;
        const draftUpdateCount = fieldValueOrSpinner(this.props.draftUpdates, 'length');
        const draftUpdateLabel = `Pending approval (${draftUpdateCount})`;
        const approvedUpdateCount = fieldValueOrSpinner(this.props.approvedUpdates, 'length');
        const approvedUpdateLabel = `Approved (${approvedUpdateCount})`;
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
                        <div className={'periodFilter col-sm-12'}>
                            <div className={'row'}><h5>Filter periods</h5>
                                <div className="col-xs-12">
                                    <ToggleButton onClick={this.needReporting}
                                                  label={needReportingLabel}
                                                  disabled={buttonDisabled}/>
                                    <ToggleButton onClick={this.showDraft} label={draftUpdateLabel}
                                                  disabled={buttonDisabled}/>
                                    <ToggleButton onClick={this.showApproved}
                                                  label={approvedUpdateLabel}
                                                  disabled={buttonDisabled}/>
                                </div>
                            </div>
                        </div>
                        <div className={'periodBulkAct col-sm-12'}>
                            <div className={'row'}><h5>Bulk action</h5>
                                <div className="col-xs-6">
                                    <Select options={selectOptions}
                                            value={this.state.selectedOptions}
                                            multi={false} placeholder="Select period(s)"
                                            searchable={false}
                                            clearable={false} onChange={this.selectChange}/>
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
