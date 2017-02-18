/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from 'react';
import { connect } from "react-redux"

import { fetchModel, fetchUser } from "../actions/model-actions"
import { setPageData } from "../actions/page-actions"


import Results from "./Results"


const dataFromElement = (elementName) => {
    return JSON.parse(document.getElementById(elementName).innerHTML)
};

const testCallback = (stuff) => {
    console.log(stuff);
};

@connect((store) => {
    return {
        page: store.page,
    }
})
export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const project = dataFromElement('project-ids');
        const settings = dataFromElement('settings');
        const strings = dataFromElement('translation-texts');
        this.props.dispatch(setPageData({project, settings, strings}));

        const userId = dataFromElement('endpoint-data').userID;
        fetchUser(userId);

        const projectId = project.project_id;
        fetchModel('results', projectId);
        fetchModel('indicators', projectId);
        fetchModel('periods', projectId);
        fetchModel('updates', projectId);
        fetchModel('comments', projectId);
    }

    render() {
        return (
            <Results parentId="results"/>
        );
    }
}
