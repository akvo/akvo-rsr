/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Level from './Level.jsx'
import Indicators from './Indicators.jsx'


export default class Results extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "results"};
    }

    renderPanel(result, i) {
        return (
            <Panel header={"Result: " + result.title} key={i}>
                <Indicators
                    items={result.indicators}
                    models={this.props.models}
                    callbacks={this.props.callbacks}/>
            </Panel>
        )
    }
}

Results.propTypes = {
    items: PropTypes.array,
    models: PropTypes.object,
    callbacks: PropTypes.object
};
