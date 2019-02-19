/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import update from "immutability-helper";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { _, endpoints, isNewUpdate } from "../../utils";

import { saveModelToBackend, updateModel } from "../../actions/model-actions";
import * as alertActions from "../../actions/alert-actions";
import * as c from "../../const";

import AlertFactory from "../alertContainer";

let newCommentID = 1;

const CommentAlert = ({ message, close }) => (
    <div className="results-alert comment-alert">
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>
            X
        </button>
    </div>
);
CommentAlert.propTypes = {
    message: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
};

class CommentForm extends React.Component {
    static propTypes = {
        parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        disabled: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.addComment = this.addComment.bind(this);
        this.onSave = this.onSave.bind(this);
        // we need a unique name for each alert
        const alertName = "CommentAlert-" + this.props.parentId;
        this.state = {
            comment: "",
            commentAlertName: alertName,
            CommentAlert: AlertFactory({ alertName: alertName })(CommentAlert)
        };
    }

    onChange(e) {
        this.setState({ comment: e.target.value });
    }

    onSave() {
        this.setState({ comment: "" });
    }

    addComment() {
        const { parentId, user, createAlert } = this.props;
        const { comment, commentAlertName } = this.state;
        const id = `new-${newCommentID}`;
        if (comment.trim()) {
            const newComment = {
                id,
                comment,
                data: parentId,
                user: user.id
            };
            /*
                This is a somewhat ugly hack to be abe to post an empty update that only has a
                comment.
                When a note is added to a new update, it's instantiated in the store, but also set
                to the _comment field on the update.
                Also set the _callbacks field on the update to be able to show an alert if the post
                of the comment fails.
                When the update is saved (model-action.sendUpdateToBackend) the _comment field is
                checked and if it holds a comment it's posted to the backend and the store is
                updated.
             */
            if (isNewUpdate(parentId)) {
                const callbacks = {
                    [c.UPDATE_MODEL_FULFILLED]: null,
                    [c.UPDATE_MODEL_REJECTED]: createAlert.bind(
                        this,
                        commentAlertName,
                        _("comment_not_saved")
                    )
                };
                let newUpdate = { ...this.props.updates.objects[parentId] };
                newUpdate = update(newUpdate, {
                    $merge: { _comment: newComment, _callbacks: callbacks }
                });
                updateModel(c.OBJECTS_UPDATES, newUpdate);
                updateModel(c.OBJECTS_COMMENTS, newComment);
            } else {
                const callbacks = {
                    [c.UPDATE_MODEL_FULFILLED]: this.onSave,
                    [c.UPDATE_MODEL_REJECTED]: createAlert.bind(
                        this,
                        commentAlertName,
                        _("comment_not_saved")
                    )
                };
                saveModelToBackend(
                    c.OBJECTS_COMMENTS,
                    endpoints.post_comment(),
                    newComment,
                    null,
                    callbacks
                );
            }
        } else {
            createAlert(commentAlertName, "Please enter a comment text");
        }
    }

    render() {
        return (
            <div>
                <div className="input-group">
                    <input
                        className="form-control"
                        value={this.state.comment}
                        onChange={this.onChange}
                        placeholder={_("add_comment_placeholder")}
                    />
                    <span className="input-group-btn">
                        <button type="submit" onClick={this.addComment} className="btn btn-default">
                            {_("add_comment")}
                        </button>
                    </span>
                </div>
                {<this.state.CommentAlert />}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        user: store.models.user.objects[store.models.user.ids[0]],
        updates: store.models.updates
    };
};

export default connect(
    mapStateToProps,
    alertActions
)(CommentForm);
