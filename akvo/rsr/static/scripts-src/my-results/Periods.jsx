/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */
import React, {PropTypes} from "react";
import {Panel} from "rc-collapse";
import update  from 'immutability-helper';

import Level from "./Level.jsx";
import {Updates, NewUpdateButton} from "./Updates.jsx";
import {displayDate, APICall, endpoints, levelToggle} from "./utils.js";


class PeriodLockToggle extends React.Component {
    constructor (props) {
        super(props);
        this.lockToggle = this.lockToggle.bind(this);
        this.state = {locking: false};
    }

    basePeriodSave(periodId, data, callback) {
        // Base function for saving a period with a data Object.
        const url = endpoints.period(periodId);
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

PeriodLockToggle.propTypes = {
    period: PropTypes.object,
    callbacks: PropTypes.object
};

const periodActualValue = (period) => {
    return period.updates && period.updates.length > 0 ?
        period.updates[period.updates.length-1].actual_value
    :
        "";
};

export class PeriodsBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: "periods",
            newKeys: [] // Keep track of keys for new updates, used to open the UpdateForm
        };
        this.openNewForm = this.openNewForm.bind(this);
    }

    componentWillMount() {
        this.props.callbacks.loadModel('updates');
    }

    openNewForm(newKey, data) {
        // Add the key for a new update to the list of open panels
        this.setState(
            {newKeys: update(this.state.newKeys, {$push: [newKey]})},
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel('updates', data)
        );
    }

    renderPanel(period) {
        const periodStart = displayDate(period.period_start);
        const periodEnd = displayDate(period.period_end);
        const periodDate = `${periodStart} - ${periodEnd}`;
        const header = (
            <span>
                <span>
                    Period: {periodDate} |
                    Target value: {period.target_value} |
                    Actual value: {periodActualValue(period)}
                </span>
                <PeriodLockToggle period={period} callbacks={this.props.callbacks}/>
            </span>
        );
        const updateCallbacks = update(this.props.callbacks, {$merge: {onChange: this.onChange}});
        const buttonCallbacks = update(this.props.callbacks, {$merge: {openNewForm: this.openNewForm}});
        return (
            <Panel header={header} key={period.id}>
                <Updates
                    items={period.updates}
                    callbacks={updateCallbacks}
                    newKeys={this.state.newKeys}/>
                <NewUpdateButton
                    callbacks={buttonCallbacks}
                    period={period}/>
            </Panel>
        )
    }

    render() {
        return (
            <Level renderPanel={this.renderPanel.bind(this)} {...this.props}/>
        );
    }
}

PeriodsBase.propTypes = {
    items: PropTypes.array,
    callbacks: PropTypes.object.isRequired,
};

export default levelToggle(PeriodsBase);