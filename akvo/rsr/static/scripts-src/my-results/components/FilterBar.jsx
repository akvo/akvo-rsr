/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */


import * as React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Select from "react-select";
import "react-select/dist/react-select.css";

import {noHide, selectablePeriods, updateFormReset} from "../actions/ui-actions";

import {
    lockSelectedPeriods,
    unlockSelectedPeriods,
} from "../actions/model-actions";

import * as c from "../const"

import {
    getApprovedPeriods,
    getMEManagerDefaultKeys,
    getNeedReportingPeriods,
    getPendingUpdates,
} from "../selectors";

import {
    _,
    fieldValueOrSpinner,
    identicalArrays, toggleTree,
    userIsMEManager,
} from "../utils";

import {
    ButtonLabel,
    ToggleButton,
} from "./common";
import {collapseChange} from "../actions/collapse-actions";


const InteractiveLabel = ({label, selector}) => {
    let value, icon;
    ({value, icon} = fieldValueOrSpinner(selector, 'length'));
    return <ButtonLabel label={label} value={value} icon={icon}/>;
};


const PeriodLockingButtons = ({user, disabled}) => {
    return userIsMEManager(user) ?
        <div className="col-xs-6">
            <ToggleButton onClick={lockSelectedPeriods}
                          label={_("lock_selected")}
                          disabled={disabled}/>
            <ToggleButton onClick={unlockSelectedPeriods}
                          label="Unlock selected"
                          disabled={disabled}/>
        </div>
    :
        <div className="col-xs-6">
        </div>;
};

@connect((store) => {
    return {
        keys: store.keys,
        periods: store.models.periods,
        ui: store.ui,
        user: store.models.user,
        draftUpdates: getPendingUpdates(store),
        approvedPeriods: getApprovedPeriods(store),
        needReportingPeriods: getNeedReportingPeriods(store),
        MEManagerDefaultKeys: getMEManagerDefaultKeys(store),
    }
})
export default class FilterBar extends React.Component {
    static propTypes = {
        callbacks: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.selectChange = this.selectChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.openResults = this.openResults.bind(this);
        this.state = {selectedOption: undefined,}
    }

    selectChange(e) {
        this.setState({selectedOption: e});
        e.value();
    }

    activeKey() {
        return this.props.keys["results-results"];
    }

    createToggleKeys() {
        const open = this.openResults(this.activeKey());
        let MEManagerKeys;
        if (userIsMEManager(this.props.user)) {
            MEManagerKeys = this.props.MEManagerDefaultKeys;
        }
        // construct the array of Collapse activeKeys for the sub-tree
        return toggleTree(c.OBJECTS_RESULTS, c.OBJECTS_RESULTS, open, MEManagerKeys);
    }

    toggleAll() {
        const keys = this.createToggleKeys();
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        });
        noHide();
        updateFormReset();
    }

    openResults() {
        // Determine if we should open the full tree or close it
        const activeKey = this.props.keys["results-results"];
        if (userIsMEManager(this.props.user)) {
            const keys = this.props.keys;
            // if activeKey is identical to the MEManagerDefaultKeys selector we are at the "closed"
            // closed view for an M&E manager
            const openCollapses = Object.keys(keys).filter(key => keys[key].length !== 0);
            return identicalArrays(activeKey, this.props.MEManagerDefaultKeys) &&
                openCollapses.length === 1;
        } else {
            // otherwise open only if the whole tree is closed
            return activeKey === undefined || activeKey.length === 0;
        }
    }

    filterButtonClass(button) {
        return this.props.ui.activeFilter === button ?
            'btn btn-sm btn-default filterActive'
        :
            'btn btn-sm btn-default';
    }

    filterSelectClass(select) {
        return this.props.ui.activeFilter === select ? 'filterActive' : '';
    }

    render() {
        const {callbacks} = this.props;
        const openCloseLabel = this.openResults() ? _('full_view') : _('overview');
        const selectOptions = selectablePeriods(this.props.periods && this.props.periods.ids);

        const needReportingLabel = <InteractiveLabel label={_("needs_reporting")}
                                                     selector={this.props.needReportingPeriods}/>;
        const draftUpdateLabel = <InteractiveLabel label={_("pending_approval")}
                                                   selector={this.props.draftUpdates}/>;
        const approvedUpdateLabel = <InteractiveLabel label={_("approved")}
                                                      selector={this.props.approvedPeriods}/>;
        const buttonDisabled = !this.props.ui.allFetched;

        return (
            <header role="banner">
                <nav>
                    <div className={'periodBtns'}>
                        <div className={'row'}>
                            <div className={'periodFilter col-sm-6'}>
                                <div className={'row'}>
                                    <h5>{_("filter_periods")}</h5>
                                    <div className="col-xs-12">
                                        <ToggleButton onClick={callbacks.needReporting}
                                                      label={needReportingLabel}
                                                      disabled={buttonDisabled}
                                                      className={
                                                          this.filterButtonClass(c.FILTER_NEED_REPORTING)
                                                      }/>
                                        <ToggleButton onClick={callbacks.showDraft} label={draftUpdateLabel}
                                                      disabled={buttonDisabled}
                                                      className={
                                                          this.filterButtonClass(c.FILTER_SHOW_DRAFT)
                                                      }/>
                                        <ToggleButton onClick={callbacks.showApproved}
                                                      label={approvedUpdateLabel}
                                                      disabled={buttonDisabled}
                                                      className={
                                                          this.filterButtonClass(c.FILTER_SHOW_APPROVED)
                                                      }/>
                                    </div>
                                </div>
                            </div>
                            <div className={'periodBulkAct col-sm-6'}>
                                <div className={'row'}><h5>{_("bulk_action")}</h5>
                                    <div className="col-xs-6">
                                        <Select options={selectOptions}
                                                value={this.state.selectedOption}
                                                multi={false}
                                                placeholder={_("select_periods")}
                                                searchable={false}
                                                clearable={false}
                                                onChange={this.selectChange}
                                                className={
                                                    this.filterSelectClass(c.FILTER_BULK_SELECT)}/>
                                    </div>
                                    <PeriodLockingButtons user={this.props.user}
                                                          disabled={buttonDisabled}/>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="col-xs-12">
                                <ToggleButton onClick={this.toggleAll} label={openCloseLabel}
                                              disabled={buttonDisabled} className="overviewBtn btn btn-sm btn-default"/>

                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
};