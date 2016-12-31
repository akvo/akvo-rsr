/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Level from './Level.jsx'
import Periods from './Periods.jsx'


export default class Indicators extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "indicators"};
    }

    renderPanel(indicator, i) {
        const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
        return (
            <Panel header={"Indicator: " + title} key={i}>
                {title}
                <div className="baseline">
                    <div className="baseline-year">
                        Baseline year: {indicator.baseline_year}
                    </div>
                    <div className="baseline-value">
                        Baseline value: {indicator.baseline_value}
                    </div>
                </div>
                <Periods items={indicator.periods}
                         models={this.props.models}
                         callbacks={this.props.callbacks}/>
            </Panel>
        )
    }

    componentWillMount() {
        this.props.callbacks.loadModel('periods');
    }
}
