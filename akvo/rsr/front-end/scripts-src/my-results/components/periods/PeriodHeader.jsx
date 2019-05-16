/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as alertActions from "../../actions/alert-actions";
import * as collapseActions from "../../actions/collapse-actions";

import * as c from "../../const";

import AlertFactory from "../alertContainer";

import {
    getPeriodsActualValue,
    getPeriodsChildrenIds,
    getIndicatorsDimensionIds,
    getPeriodsApprovedDisaggregationIds
} from "../../selectors";

import { displayDate, getAncestor } from "../../utils.js";

import { DisaggregationsDisplay } from "../common";
import { NewUpdateButton } from "../updates/UpdateForm";

import { _, disaggregationsToDisplayData } from "../../utils";

const PeriodSelect = ({ id, toggleCheckbox, isChecked }) => {
    // NOTE: the onChange event handler can't be used here because it fires too late and the event
    // for opening/closing the collapse panel will be triggered. However when using the onClick
    // handler React complains that the component isn't managed correctly, thus the noop onChange.
    return (
        <input
            id={id}
            type="checkbox"
            checked={isChecked ? "checked" : ""}
            onClick={toggleCheckbox}
            onChange={() => {}}
        />
    );
};
PeriodSelect.propTypes = {
    id: PropTypes.number.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired
};

const DeleteUpdateAlert = ({ message, close }) => (
    <div className="alert delete-update-alert">
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>
            X
        </button>
    </div>
);

class PeriodHeader extends React.Component {
    static propTypes = {
        period: PropTypes.object.isRequired,
        toggleCheckbox: PropTypes.func.isRequired
    };

    render() {
        const showNewUpdateButton = (page, period, ui, indicator) => {
            if (page.mode.public) {
                return false;
            }
            if (period.is_locked) {
                return false;
            }
            if (
                ui.updateFormDisplay ||
                ui.reportFormDisplay ||
                (ui.activeFilter !== c.FILTER_NEED_REPORTING && ui.activeFilter !== undefined)
            ) {
                return false;
            }
            return true;
        };

        const {
            period,
            toggleCheckbox,
            page,
            project,
            ui,
            user,
            periodsActualValue,
            periodChildrenIds,
            disaggregations,
            dimensions,
            periodDisaggregationIds
        } = this.props;

        const actualValue = periodsActualValue[period.id];
        const isChecked = new Set(ui[c.SELECTED_PERIODS]).has(period.id);
        const formOpen =
            periodChildrenIds[period.id].indexOf(this.props.ui[c.UPDATE_FORM_DISPLAY] || 0) > -1;
        const indicator = getAncestor(c.OBJECTS_PERIODS, period.id, c.OBJECTS_INDICATORS);
        const isQualitative = indicator.type === c.INDICATOR_QUALITATIVE;
        let periodStart, periodEnd;
        // Use the project's dates if this project is part of a single period hierarchy
        if (project.hierarchy_name) {
            periodStart = project.start_date ? project.start_date : period.period_start;
            periodEnd = project.end_date ? project.end_date : period.period_end;
            periodStart = displayDate(periodStart);
            periodEnd = displayDate(periodEnd);
        } else {
            periodStart = displayDate(period.period_start);
            periodEnd = displayDate(period.period_end);
        }
        const periodDate = `${periodStart} - ${periodEnd}`;
        const showLockCheckbox =
            ui.activeFilter !== c.FILTER_NEED_REPORTING &&
            ui.activeFilter !== c.FILTER_SHOW_PENDING &&
            !project.hierarchy_name;

        const lockStatus = period.is_locked ? (
            <i title={_("locked")} className="fa fa-lock" aria-hidden="true" />
        ) : (
            <i title={_("unlocked")} className="fa fa-unlock-alt" aria-hidden="true" />
        );

        let periodSelect;
        if (user.isMEManager && showLockCheckbox) {
            periodSelect = (
                <PeriodSelect
                    id={period.id}
                    toggleCheckbox={toggleCheckbox}
                    isChecked={isChecked}
                />
            );
        }

        let newUpdateButton, delUpdateAlert;
        if (showNewUpdateButton(page, period, ui, indicator)) {
            newUpdateButton = <NewUpdateButton period={period} user={this.props.user} />;
            // TODO: fix for new updates. The alert won't render since the temp update
            // object gets deleted when saving.
            // Possible solution: add an alert action and reducer instead of using callback
            const DelUpdateAlert = AlertFactory({ alertName: "DeleteUpdateAlert-" + period.id })(
                DeleteUpdateAlert
            );
            delUpdateAlert = <DelUpdateAlert />;
        }

        const disaggregationData = disaggregationsToDisplayData(
            periodDisaggregationIds[period.id],
            disaggregations,
            dimensions
        );

        return (
            <span className="periodWrap">
                <ul className={formOpen ? "periodHeader formOpen" : "periodHeader"}>
                    <li>{periodSelect}</li>
                    <li>{periodDate}</li>
                    {isQualitative ? (
                        undefined
                    ) : (
                        <li className="targetValue">
                            <span>Target:</span> {period.target_value}
                        </li>
                    )}
                    {isQualitative ? (
                        undefined
                    ) : (
                        <li className="actualValue">
                            <span>Actual:</span> {actualValue}
                        </li>
                    )}
                    <li>
                        {newUpdateButton}
                        {delUpdateAlert}
                    </li>
                    {/* Don't show locking icon if we're on the public project page, or if the */}
                    {/* project is part of a single period hierarchy */}
                    {page.mode.public || page.project.hierarchy_name ? (
                        undefined
                    ) : (
                        <li>{lockStatus}</li>
                    )}
                </ul>
                {isQualitative || !page.mode.public ? (
                    undefined
                ) : (
                    <DisaggregationsDisplay disaggregationData={disaggregationData} />
                )}
            </span>
        );
    }
}

const mapStateToProps = store => {
    return {
        page: store.page,
        project: store.page.project,
        updates: store.models.updates,
        dimensions: store.models.dimensions.objects,
        disaggregations: store.models.disaggregations.objects,
        user:
            store.models.user.ids && store.models.user.ids.length > 0
                ? store.models.user.objects[store.models.user.ids[0]]
                : {},
        ui: store.ui,
        periodsActualValue: getPeriodsActualValue(store),
        periodChildrenIds: getPeriodsChildrenIds(store),
        periodDisaggregationIds: getPeriodsApprovedDisaggregationIds(store),
        dimensionIds: getIndicatorsDimensionIds(store)
    };
};

export default connect(
    mapStateToProps,
    { ...alertActions, ...collapseActions }
)(PeriodHeader);
