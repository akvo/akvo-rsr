/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Collapse, { Panel } from "rc-collapse";
import { connect } from "react-redux"
import update from 'immutability-helper';


import * as alertActions from "../actions/alert-actions"
import * as collapseActions from "../actions/collapse-actions"

import { periodSelectToggle, } from "../actions/ui-actions"

import * as c from "../const"

import {
    getPeriodsActualValue,
    getIndicatorsChildrenIds,
    getPeriodsChildrenIds,
    getIndicatorsDimensionIds,
    getPeriodsApprovedDisaggregationIds,
} from "../selectors";

import {
    displayDate,
    collapseId,
    createToggleKeys,
    getAncestor,
} from "../utils.js";


import AlertFactory from "./alertContainer"
import { DisaggregationsDisplay } from "./common"
import { NewUpdateButton } from "./updates/UpdateForm";
import Updates from "./updates/Updates";

import {
    _,
    disaggregationsToDisplayData,
    hideMe,
} from "../utils";

import { collapseChange } from "../actions/collapse-actions";


const ToggleAlert = ({message, close}) => (
    <div className='results-alert lock-toggle-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);


const PeriodSelect = ({id, toggleCheckbox, isChecked}) => {
    // NOTE: the onChange event handler can't be used here because it fires too late and the event
    // for opening/closing the collapse panel will be triggered. However when using the onClick
    // handler React complains that the component isn't managed correctly, thus the noop onChange.
    return <input id={id} type="checkbox" checked={isChecked ? "checked" : ""}
                  onClick={toggleCheckbox} onChange={()=>{}}/>
};
PeriodSelect.propTypes = {
    id: PropTypes.number.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
};


const DeleteUpdateAlert = ({message, close}) => (
    <div className='alert delete-update-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);


@connect((store) => {
    return {
        page: store.page,
        updates: store.models.updates,
        dimensions: store.models.dimensions.objects,
        disaggregations: store.models.disaggregations.objects,
        user: store.models.user.ids && store.models.user.ids.length > 0 ?
              store.models.user.objects[store.models.user.ids[0]] : {},
        ui: store.ui,
        periodsActualValue: getPeriodsActualValue(store),
        periodChildrenIds: getPeriodsChildrenIds(store),
        periodDisaggregationIds: getPeriodsApprovedDisaggregationIds(store),
        dimensionIds: getIndicatorsDimensionIds(store),
    }
}, {...alertActions, ...collapseActions})
class PeriodHeader extends React.Component {
// actualValue, user, isChecked, isQualitative, newUpdateButton,
// delUpdateAlert, formOpen, showLockButton
    static propTypes = {
        period: PropTypes.object.isRequired,
        toggleCheckbox: PropTypes.func.isRequired,
    };

    render() {
        const showNewUpdateButton = (page, period, ui, indicator) => {
            if (page.mode.public) {
                return false;
            }
            if (period.locked) {
                return false;
            }
            if (ui.updateFormDisplay ||
                ui.activeFilter !== c.FILTER_NEED_REPORTING && ui.activeFilter !== undefined) {
                return false;
            }
            if (indicator.measure === c.MEASURE_PERCENTAGE &&
                    this.props.periodChildrenIds[period.id].length >= 1) {
                return false;
            }
            return true;
        };

        const {
            period, toggleCheckbox, page, ui, user, periodsActualValue, periodChildrenIds,
            disaggregations, dimensions, periodDisaggregationIds
        } = this.props;

        const actualValue = periodsActualValue[period.id];
        const isChecked = new Set(ui[c.SELECTED_PERIODS]).has(period.id);
        const formOpen = periodChildrenIds[period.id].indexOf(
            this.props.ui[c.UPDATE_FORM_DISPLAY] || 0
        ) > -1;
        const indicator = getAncestor(c.OBJECTS_PERIODS, period.id, c.OBJECTS_INDICATORS);
        const isQualitative = indicator.type === c.INDICATOR_QUALITATIVE;
        const periodStart = displayDate(period.period_start);
        const periodEnd = displayDate(period.period_end);
        const periodDate = `${periodStart} - ${periodEnd}`;
        const showLockButton = ui.activeFilter !== c.FILTER_NEED_REPORTING &&
                               ui.activeFilter !== c.FILTER_SHOW_PENDING;

        let periodSelect;
        if (user.isMEManager && showLockButton) {
            periodSelect = <PeriodSelect id={period.id}
                                         toggleCheckbox={toggleCheckbox}
                                         isChecked={isChecked}/>;
        }

        let newUpdateButton, delUpdateAlert;
        if (showNewUpdateButton(page, period, ui, indicator)){
            newUpdateButton = <NewUpdateButton period={period} user={this.props.user}/>;
            // TODO: fix for new updates. The alert won't render since the temp update
            // object gets deleted when saving.
            // Possible solution: add an alert action and reducer instead of using callback
            const DelUpdateAlert = AlertFactory(
                {alertName: 'DeleteUpdateAlert-' + period.id}
            )(DeleteUpdateAlert);
            delUpdateAlert = <DelUpdateAlert />;
        }

        const disaggregationData = disaggregationsToDisplayData(
            periodDisaggregationIds[period.id],
            disaggregations,
            dimensions
        );

        return (
            <span className="periodWrap">
                <ul className={formOpen ? "formOpen" : ""}>
                    <li>{periodSelect}</li>
                    <li>{periodDate}</li>
                    {isQualitative ?
                        undefined
                    :
                        <li className="targetValue">
                            <span>Target:</span> {period.target_value}
                        </li>}
                    {isQualitative ?
                        undefined
                    :
                        <li className="actualValue">
                            <span>Actual:</span> {actualValue}
                        </li>}
                    <li>{newUpdateButton}{delUpdateAlert}</li>
                </ul>
                {isQualitative || !page.mode.public?
                    undefined
                :
                    <DisaggregationsDisplay disaggregationData={disaggregationData}/>}
           </span>
        )
    }
}


@connect((store) => {
    return {
        page: store.page,
        periods: store.models.periods,
        keys: store.keys,
        user: store.models.user.ids && store.models.user.ids.length > 0 ?
              store.models.user.objects[store.models.user.ids[0]] : {},
        ui: store.ui,
        indicatorChildrenIds: getIndicatorsChildrenIds(store),
        periodChildrenIds: getPeriodsChildrenIds(store),
        actualValue: getPeriodsActualValue(store),
    }
}, {...alertActions, ...collapseActions})
export default class Periods extends React.Component {

    static propTypes = {
        parentId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.openNewForm = this.openNewForm.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.hideMe = this.hideMe.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(c.OBJECTS_PERIODS, this.props.parentId)};
    }

    openNewForm(newKey, data) {
        // Add the key for a new update to the list of open panels
        this.setState(
            {newKeys: update(this.state.newKeys, {$push: [newKey]})},
            // Only when the activeKey state is committed do we update the updates model
            this.props.callbacks.updateModel(c.OBJECTS_UPDATES, data)
        );
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, c.OBJECTS_PERIODS, this.activeKey());
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        })
    }

    toggleCheckbox(e) {
        e.stopPropagation();
        const periodId = parseInt(e.target.id);
        periodSelectToggle(periodId);
    }

    hideMe(id) {
        return hideMe(c.OBJECTS_PERIODS, this.props.parentId, id);
    }

    renderPanels(periodIds) {
        return (periodIds.map(
            (id) => {
                const {parentId, ui, page} = this.props;
                const period = this.props.periods.objects[id];
                // const actualValue = this.props.actualValue[id];
                const isChecked = new Set(this.props.ui[c.SELECTED_PERIODS]).has(id);
                // const formOpen = this.props.periodChildrenIds[id].indexOf(
                //     this.props.ui[c.UPDATE_FORM_DISPLAY] || 0
                // ) > -1;
                const needsReporting =
                    !period.locked && period._meta && period._meta.children.ids.length == 0;

                // const indicator = getAncestor(c.OBJECTS_PERIODS, id, c.OBJECTS_INDICATORS);

                // let newUpdateButton, delUpdateAlert;
                // if (showNewUpdateButton(page, period, ui, indicator)){
                //     newUpdateButton = <NewUpdateButton period={period} user={this.props.user}/>;
                //     // TODO: fix for new updates. The alert won't render since the temp update
                //     // object gets deleted when saving.
                //     // Possible solution: add an alert action and reducer instead of using callback
                //     const DelUpdateAlert = AlertFactory(
                //         {alertName: 'DeleteUpdateAlert-' + period.id}
                //     )(DeleteUpdateAlert);
                //     delUpdateAlert = <DelUpdateAlert />;
                // }

                let className = this.hideMe(id) ? 'hidePanel' : '';
                className += isChecked ? ' periodSelected' : needsReporting ? ' needsReporting' : '';
                // const showLockButton = this.props.ui.activeFilter !== c.FILTER_NEED_REPORTING &&
                //                        this.props.ui.activeFilter !== c.FILTER_SHOW_PENDING;
                return (
                    <Panel header={
                        <PeriodHeader period={period}
                                      // actualValue={actualValue}
                                      // user={this.props.user}
                                      toggleCheckbox={this.toggleCheckbox}
                                      // isChecked={isChecked}
                                      // isQualitative={indicator.type === c.INDICATOR_QUALITATIVE}
                                      // newUpdateButton={newUpdateButton}
                                      // delUpdateAlert={delUpdateAlert}
                                      // formOpen={formOpen}
                                      // showLockButton={showLockButton}
                        />}
                           key={id}
                           showArrow={!page.mode.public}
                           disabled={page.mode.public}
                           className={className}>
                        <Updates indicatorId={parentId} period={period}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        const periodIds = this.props.indicatorChildrenIds[this.props.parentId];
        if (!this.props.periods.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else if (periodIds.length > 0) {
            return (
                <div className={c.OBJECTS_PERIODS}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    {/*<ToggleButton onClick={this.toggleAll}*/}
                     {/*label="++"*/}
                     {/*disabled={!this.props.ui.allFetched}/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(periodIds)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <div className="emptyData">
                    <p>No periods</p>
                </div>
            );
        }
    }
}
