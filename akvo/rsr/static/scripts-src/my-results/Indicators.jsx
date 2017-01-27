/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import {level} from './Level.jsx';
import Periods from './Periods.jsx';

import {_}from './utils';
import {OBJECTS_INDICATORS} from './const.js';


const IndicatorHeader = ({item: indicator}) => {
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <span>
            {"Indicator: " + title}
        </span>
    )
};

IndicatorHeader.propTypes = {
    item: PropTypes.object
};


const IndicatorContent = ({indicator}) => {
    const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
    return (
        <div>
            {title}
            <div className="baseline">
                <div className="baseline-year">
                    {_('baseline_year')}: {indicator.baseline_year}
                </div>
                <div className="baseline-value">
                    {_('baseline_value')}: {indicator.baseline_value}
                </div>
            </div>
        </div>
    )
};

IndicatorContent.propTypes = {
    indicator: PropTypes.object
};


class Indicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {model: OBJECTS_INDICATORS};
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Indicator.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    render() {
        const indicator = this.props.item;
        return (
            <div>
                <IndicatorContent indicator={indicator}/>
                <Periods
                    items={indicator.periods}
                    callbacks={this.props.callbacks}
                    propagate={this.props.propagate}/>
            </div>
        );
    }
}

Indicator.propTypes = {
    items: PropTypes.array,
    callbacks: PropTypes.object.isRequired,
};

export default level(IndicatorHeader, Indicator);