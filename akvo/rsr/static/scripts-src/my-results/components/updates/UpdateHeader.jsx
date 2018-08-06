import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as c from "../../const";
import * as alertActions from "../../actions/alert-actions";

import { uiHideMode, updateFormOpen } from "../../actions/ui-actions";
import { _, closeNodes, fullUpdateVisibility, openNodes } from "../../utils";
import { ToggleButton } from "../common";

const UserInfo = ({ user_details }) => {
    const { approved_organisations, first_name, last_name } = user_details;
    const organisation = approved_organisations.length ? approved_organisations[0].name : null;
    const userName = first_name + " " + last_name;

    return (
        <span>
            <span>{userName}</span> {organisation ? " at " + organisation : ""}
        </span>
    );
};
UserInfo.propTypes = {
    user_details: PropTypes.object.isRequired
};

class UpdateHeader extends React.Component {
    static propTypes = {
        update: PropTypes.object.isRequired,
        collapseId: PropTypes.string.isRequired,
        periodLocked: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.formToggle = this.formToggle.bind(this);
        this.showEditButton = this.showEditButton.bind(this);
    }

    formToggle(e) {
        const { collapseId, update } = this.props;
        updateFormOpen(update.id);
        uiHideMode(c.OBJECTS_PERIODS);
        openNodes(c.OBJECTS_PERIODS, [update.period]);
        closeNodes(c.OBJECTS_PERIODS, [update.period]);
        e.stopPropagation();
    }

    showEditButton() {
        // Only show the Edit update button if the period is unlocked, the update is shown in the
        // relevant filter and the user can edit at this time
        const { page, update, activeFilter } = this.props;
        if (page.mode.public) {
            return false;
        }
        const show = fullUpdateVisibility(update, activeFilter);
        if (!show) {
            return false;
        }
        if (this.props.periodLocked) {
            return false;
        }
        // M&E manager can always edit updates
        if (this.props.user.isMEManager) {
            return true;
        }
        // Can't edit other's updates
        if (this.props.user.id !== update.user) {
            return false;
        }
        // Can't update submitted or approved
        return (
            update.status !== c.UPDATE_STATUS_PENDING && update.status !== c.UPDATE_STATUS_APPROVED
        );
    }

    render() {
        let editUpdateButton;
        const { updateFormDisplay, update } = this.props;

        if (this.showEditButton()) {
            let className;
            if (updateFormDisplay) {
                className = "btn btn-sm btn-default editingForm";
            } else {
                className = "btn btn-sm btn-default";
            }
            editUpdateButton = (
                <ToggleButton
                    onClick={this.formToggle}
                    className={className}
                    label={_("edit")}
                    disabled={updateFormDisplay !== false}
                />
            );
        }
        return (
            <div className="UpdateHead">
                <span className="updateName">
                    <UserInfo user_details={update.user_details} />
                </span>
                <span className="updateStatus">{_("update_statuses")[update.status]}</span>
                <span>{editUpdateButton}</span>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        page: store.page,
        [c.UPDATE_FORM_DISPLAY]: store.ui[c.UPDATE_FORM_DISPLAY],
        activeFilter: store.ui.activeFilter,
        user: store.models.user.objects[store.models.user.ids[0]]
    };
};

export default connect(
    mapStateToProps,
    alertActions
)(UpdateHeader);
