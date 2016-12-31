/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Level from './Level.jsx'
import Comments from './Comments.jsx'

import {displayDate} from './utils.js';


export default class Updates extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "updates"};
    }

    componentWillMount() {
        this.props.callbacks.loadModel('comments');
    }

    renderPanel(update, i) {
        const organisation = update.user_details.approved_organisations[0].name;
        const userName = update.user_details.first_name +" "+ update.user_details.last_name;
        const data = update.data;
        const headerText = `Update: ${userName} at ${organisation}, data: ${data}`;
        return (
            <Panel header={headerText} key={i}>
                <div>

                    When: {displayDate(update.created_at)} |
                    By: {userName} |
                    Org: {update.user_details.approved_organisations[0].name} |
                    Status: {update.status} <br/>
                    Update value: {update.data} | {/*
                        NOTE: we use update.actual_value, a value calculated in App.annotate(), not
                        update.period_actual_value from the backend
                    */}
                    Actual total for this period (including this update): {update.actual_value}
                </div>
                <div>
                    <Comments
                        items={update.comments}
                        models={this.props.models}
                        callbacks={this.props.callbacks}/>
                </div>
            </Panel>
        )
    }
}

Updates.propTypes = {
    items: PropTypes.array,
    models: PropTypes.object,
    callbacks: PropTypes.object
};
