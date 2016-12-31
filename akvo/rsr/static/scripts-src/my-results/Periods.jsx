/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import Level from './Level.jsx'
import Updates from './Updates.jsx'

import {displayDate, APICall, endpoints} from './utils.js';


class PeriodLockToggle extends React.Component {
    constructor (props) {
        super(props);
        this.lockToggle = this.lockToggle.bind(this);
        this.state = {locking: false};
    }

    basePeriodSave(periodId, data, callback) {
        // Base function for saving a period with a data Object.
        const url = endpoints(periodId).period_framework;
        function success(data) {
            this.props.callbacks.updateModel("periods", data);

            // Call the callback, if not undefined.
            if (callback) {
                callback();
            }
        }
        APICall('PATCH', url, data, success.bind(this));
    }

    lockingToggle(locking) {
        this.setState({locking: locking});
    }

    notLocking() {
        this.lockingToggle(false);
    }

    lockToggle(e) {
        if (!this.state.locking) {
            this.lockingToggle(true);
            this.basePeriodSave(this.props.period.id, {locked: !this.props.period.locked}, this.notLocking.bind(this));
        }
        e.stopPropagation();
    }

    render() {
        let icon, label;
        if (this.state.locking) {
            icon = <i className="fa fa-spin fa-spinner" />;
            label = "Loading";
        } else if (this.props.period.locked) {
            icon = <i className={'fa fa-lock'}/>;
            label = "Unlock period";
        } else {
            icon = <i className="fa fa-unlock-alt" />;
            label = "Lock period";
        }
        return (
            <a onClick={this.lockToggle}
               className={'btn btn-sm btn-default'}
               style={{float: 'right', margin: '0.3em 0.5em'}}>
                {icon}
                {label}
            </a>
        )
    }
}


export default class Periods extends Level {
    constructor(props) {
        super(props);
        this.state = {model: "periods"};
    }

    renderPanel(period, i) {
        const periodDate = displayDate(period.period_start) + ' - ' + displayDate(period.period_end);
        const header = (
            <span>
                <span>
                    Period: {periodDate} |
                    Target value: {period.target_value} |
                    Actual value: {period.actual_value}
                </span>
                <PeriodLockToggle period={period} callbacks={this.props.callbacks}/>
            </span>
        );
        return (
            <Panel header={header} key={i}>
                <Updates items={period.updates}
                         models={this.props.models}
                         callbacks={this.props.callbacks}/>
            </Panel>
        )
    }
    componentWillMount() {
        this.props.callbacks.loadModel('updates');
    }
}
