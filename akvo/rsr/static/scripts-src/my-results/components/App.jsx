/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import { connect } from "react-redux"

import {
    fetchModel, fetchUser, testFetchModel, lockSelectedPeriods, unlockSelectedPeriods
} from "../actions/model-actions"
import { setPageData } from "../actions/page-actions"
import { activateToggleAll, updateFormOpen, selectablePeriods } from "../actions/ui-actions"

import { OBJECTS_PERIODS, OBJECTS_UPDATES, UPDATE_STATUS_DRAFT, PARENT_FIELD } from "../const"
import { openNodes } from "../utils"

import Results from "./Results"
import { ToggleButton } from "./common"


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
    }
})
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.showDraft = this.showDraft.bind(this);
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
        fetchModel('periods', projectId, [activateToggleAll, selectablePeriods]);
        fetchModel('updates', projectId, activateToggleAll);
        fetchModel('comments', projectId, activateToggleAll);
    }

    parentOf(model, id) {
        return this.props.models[model].objects[id][PARENT_FIELD[model]]
    }

    showDraft() {
        const updates = this.props.models[OBJECTS_UPDATES];
        const draftUpdates = updates.ids.filter((id) =>
            updates.objects[id].status == UPDATE_STATUS_DRAFT
        );
        draftUpdates.map((id) => updateFormOpen(id));
        openNodes(OBJECTS_UPDATES, draftUpdates, true);
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

    render() {
        const right = {float: 'right'};
        const clearfix = {clear: 'both'};
        const selectOptions = this.props.ui.periodDates;
        return (
            <div>
                <div style={right}>
                    <Select options={selectOptions} value={this.state.selectedOptions} multi={false} placeholder="Select period(s)"
                            searchable={false} clearable={false} onChange={this.selectChange}/>
                    <ToggleButton onClick={this.lockSelected} label="Lock selected" style={right}
                                  disabled={!this.props.ui.allFetched}/>
                    <ToggleButton onClick={this.unlockSelected} label="Unlock selected" style={right}
                                  disabled={!this.props.ui.allFetched}/>
                    <ToggleButton onClick={this.showDraft} label="Show draft updates" style={right}
                                  disabled={!this.props.ui.allFetched}/>
                </div>
                <div style={clearfix}></div>
                <Results parentId="results"/>
            </div>
        );
    }
}
