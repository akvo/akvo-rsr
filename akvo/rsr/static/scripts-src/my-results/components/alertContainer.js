/*
 Akvo RSR is covered by the GNU Affero General Public License.
 See more details in the license.txt file located at the root folder of the
 Akvo RSR module. For additional details on the GNU license please see
 < http://www.gnu.org/licenses/agpl.html >.
 */


import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import * as alertActions from "../actions/alert-actions";

const defaultState = {
    isVisible: false,
    message: ''
};


const AlertFactory = config => WrappedComponent => {
    const {alertName} = config;

    class AlertContainer extends React.Component {
        componentDidMount() {
            this.props.actions.initializeAlert(alertName);
        }

        componentWillUnmount() {
            this.props.actions.destroyAlert(alertName);
        }

        close(e) {
            this.props.actions.dismissAlert(alertName);
            e.stopPropagation();
        }

        render() {
            if (!this.props.isVisible) return false;
            return (
                <WrappedComponent message={this.props.message} close={(e) => this.close(e)}/>
            );
        }
    }

    function mapStateToProps(state) {
        const alerts = state.alerts;
        if (!alerts[alertName]) return defaultState;
        return {
            isVisible: alerts[alertName].isVisible,
            message: alerts[alertName].message
        };
    }

    function mapDispatchToProps(dispatch) {
        return {actions: bindActionCreators(alertActions, dispatch)};
    }
    return connect(mapStateToProps, mapDispatchToProps)(AlertContainer);

};

export default AlertFactory;