/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from 'react';
import { connect } from "react-redux"

import { fetchModel, fetchUser, testFetchModel } from "../actions/model-actions"
import { setPageData } from "../actions/page-actions"
import { activateToggleAll } from "../actions/ui-actions"

import { OBJECTS_PERIODS, PARENT_FIELD } from "../const"
import { openNodes } from "../utils"


import Results from "./Results"
import { ToggleButton } from "./common"


const dataFromElement = (elementName) => {
    return JSON.parse(document.getElementById(elementName).innerHTML);
};


@connect((store) => {
    return {
        page: store.page,
        models: store.models
    }
})
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.showLocked = this.showLocked.bind(this);
        this.showUnlocked = this.showUnlocked.bind(this);
    }

    componentDidMount() {
        const project = dataFromElement('project-ids');
        const settings = dataFromElement('settings');
        const strings = dataFromElement('translation-texts');
        this.props.dispatch(setPageData({project, settings, strings}));

        const userId = dataFromElement('endpoint-data').userID;
        fetchUser(userId);

        const projectId = project.project_id;
        fetchModel('results', projectId, activateToggleAll);
        fetchModel('indicators', projectId, activateToggleAll);
        fetchModel('periods', projectId, activateToggleAll);
        fetchModel('updates', projectId, activateToggleAll);
        fetchModel('comments', projectId, activateToggleAll);
    }

    parentOf(model, id) {
        return this.props.models[model].objects[id][PARENT_FIELD[model]]
    }

    showLocked() {
        const periods = this.props.models[OBJECTS_PERIODS];
        const locked = periods.ids.filter((id) => periods.objects[id].locked);
        openNodes(OBJECTS_PERIODS, locked);
    }

    showUnlocked() {
        const periods = this.props.models[OBJECTS_PERIODS];
        const locked = periods.ids.filter((id) => !periods.objects[id].locked);
        openNodes(OBJECTS_PERIODS, locked);
    }

    render() {
        const style = {float: 'right'};
        return (
            <div>
                <ToggleButton onClick={this.showLocked} label="Show locked" style={style}/>
                <ToggleButton onClick={this.showUnlocked} label="Show unlocked" style={style}/>
                <Results parentId="results"/>
            </div>
        );
    }
}
