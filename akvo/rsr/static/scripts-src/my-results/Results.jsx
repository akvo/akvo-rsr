/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Indicators from './Indicators.jsx';

import {level} from './Level.jsx';
import {OBJECTS_RESULTS} from './const.js';


const ResultHeader = ({item: result}) => {
    return (
        <span>
            {"Result: " + result.title}
        </span>
    )
};

ResultHeader.propTypes = {
    item: PropTypes.object
};


class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {model: OBJECTS_RESULTS};
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Result.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    render() {
        const result = this.props.item;
        return (
            <div>
                <Indicators
                    items={result.indicators}
                    callbacks={this.props.callbacks}
                    propagate={this.props.propagate}/>
            </div>
        );
    }
}

Result.propTypes = {
    items: PropTypes.array,
    callbacks: PropTypes.object.isRequired,
};

export default level(ResultHeader, Result);
