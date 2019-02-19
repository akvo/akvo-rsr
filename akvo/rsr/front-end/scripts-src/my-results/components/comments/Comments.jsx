/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { collapseChange } from "../../actions/collapse-actions";

import { collapseId, _, displayDate } from "../../utils";

import { getUpdatesChildrenIds } from "../../selectors";
import * as c from "../../const";

import CommentForm from "./CommentForm";

const Comment = ({ comment }) => {
    const name = comment.user_details
        ? comment.user_details.first_name + " " + comment.user_details.last_name
        : undefined;
    return (
        <div className={"commentContainer"}>
            {comment.created_at ? <strong>{displayDate(comment.created_at)} </strong> : undefined}
            {name ? <span className={"commentLabel"}>{name} says: </span> : undefined}
            <div className={"comment"}>{comment.comment}</div>
        </div>
    );
};
Comment.propTypes = {
    comment: PropTypes.object.isRequired
};

class Comments extends React.Component {
    static propTypes = {
        parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        inForm: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        // concatenate this model's name with parent's ID
        this.state = { collapseId: collapseId(c.OBJECTS_COMMENTS, this.props.parentId) };
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    renderComments(commentIds) {
        return commentIds.map(id => {
            const comment = this.props.comments.objects[id];
            return <Comment key={id} comment={comment} />;
        });
    }

    render() {
        const commentIds = this.props.updateChildrenIds[this.props.parentId] || [];
        const { inForm } = this.props;
        if (!commentIds) {
            return <p>Loading...</p>;
        } else {
            // const disabled = isNewUpdate(this.props.parentId);
            // const disabledNote = disabled ? " (" + _("notes_disabled") + ")" : undefined;
            return (
                <div className={c.OBJECTS_COMMENTS}>
                    <strong>Internal notes:</strong>
                    {this.renderComments(commentIds)}
                    {inForm ? <CommentForm parentId={this.props.parentId} /> : undefined}
                </div>
            );
        }
    }
}

const mapStateToProps = store => {
    return {
        comments: store.models["comments"],
        keys: store.keys,
        updateChildrenIds: getUpdatesChildrenIds(store)
    };
};

export default connect(mapStateToProps)(Comments);
