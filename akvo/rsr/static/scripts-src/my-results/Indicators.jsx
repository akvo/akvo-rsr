/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Level from './Level.jsx';
import Periods from './Periods.jsx';

import {_, levelToggle}from './utils';
import {OBJECTS_INDICATORS} from './const.js';



export class IndicatorsBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {model: OBJECTS_INDICATORS};
    }

    componentWillMount() {
        this.props.callbacks.loadModel('periods');
    }

    renderPanel(indicator) {
        const title = indicator.title.length > 0 ? indicator.title : "Nameless indicator";
        return (
            <Panel header={"Indicator: " + title} key={indicator.id}>
                {title}
                <div className="baseline">
                    <div className="baseline-year">
                        {_('baseline_year')}: {indicator.baseline_year}
                    </div>
                    <div className="baseline-value">
                        {_('baseline_value')}: {indicator.baseline_value}
                    </div>
                </div>
                <Periods
                    items={indicator.periods}
                    callbacks={this.props.callbacks}/>
            </Panel>
        )
    }

    render() {
        return (
            <Level renderPanel={this.renderPanel.bind(this)} {...this.props}/>
        );
    }
}

IndicatorsBase.propTypes = {
    items: PropTypes.array,
    callbacks: PropTypes.object.isRequired,
};

export default levelToggle(IndicatorsBase);