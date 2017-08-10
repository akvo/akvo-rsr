/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from 'react'
import PropTypes from 'prop-types';
import { Panel } from 'rc-collapse'
import { connect } from "react-redux"

import { collapseChange } from "../actions/collapse-actions"

import {
    collapseId,
    _,
    endpoints,
    isNewUpdate,
    displayDate,
} from '../utils'

import { getUpdatesChildrenIds } from "../selectors";
import { saveModelToBackend } from "../actions/model-actions";
import * as alertActions from "../actions/alert-actions"
import * as c from "../const"

import AlertFactory from "./alertContainer"


const CommentAlert = ({message, close}) => (
        <div className='comment-alert'>
        {message}
        <button className="btn btn-sm btn-default" onClick={close}>X</button>
    </div>
);
CommentAlert.propTypes = {
    message: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};


@connect((store) => {
    return {
        user: store.models.user.objects[store.models.user.ids[0]],
    }
}, alertActions)
class CommentForm extends React.Component {

    static propTypes = {
        parentId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        disabled: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.addComment = this.addComment.bind(this);
        this.resetComment = this.resetComment.bind(this);
        this.onSave = this.onSave.bind(this);
        // we need a unique name for each alert
        const alertName = 'CommentAlert-' + this.props.parentId;
        this.state = {
            comment: '',
            commentAlertName: alertName,
            CommentAlert: AlertFactory({alertName: alertName})(CommentAlert),
        };
    }

    onChange(e) {
        this.setState({comment: e.target.value});
    }

    onSave() {
        this.setState({comment: ''});
    }

    addComment() {
        const { parentId, user, createAlert } = this.props;
        const { comment, commentAlertName } = this.state;
        if (comment.trim()) {
            const newComment = {
                'data': parentId,
                'user': user.id,
                'comment': comment
            };
            const callbacks = {
                [c.UPDATE_MODEL_FULFILLED]: this.onSave,
                [c.UPDATE_MODEL_REJECTED]: createAlert.bind(
                    this, commentAlertName, _("comment_not_saved")
                )
            };
            saveModelToBackend(
                c.OBJECTS_COMMENTS, endpoints.post_comment(), newComment, null, callbacks
            );
        } else  {
            createAlert(commentAlertName, "Please enter a comment text");
        }
    }

    resetComment(message) {
        this.setState({comment: ''});
        this.props.createAlert(this.state.commentAlertName, message);
    }

    render() {
        const {disabled} = this.props;
        return (
            <div>
                <div className="input-group">
                    <input className="form-control" value={this.state.comment}
                           onChange={this.onChange} placeholder={_('add_comment_placeholder')}
                           disabled={disabled}/>
                    <span className="input-group-btn">
                        <button type="submit" onClick={this.addComment} className="btn btn-default"
                                disabled={disabled}>
                            {_('add_comment')}
                        </button>
                    </span>
                </div>
                {<this.state.CommentAlert />}
            </div>
        )
    }
}


const Comment = ({comment}) => {
    const name = comment.user_details.first_name + ' ' + comment.user_details.last_name;
    return (
        <div className={'commentContainer'}>
            <strong>{displayDate(comment.created_at)} </strong>
            {name} says:
            <span className={'comment'}>{comment.comment}</span>
        </div>
    )
};
Comment.propTypes = {
    comment: PropTypes.object.isRequired,
};


@connect((store) => {
    return {
        comments: store.models['comments'],
        keys: store.keys,
        updateChildrenIds: getUpdatesChildrenIds(store),
    }
})
export default class Comments extends React.Component {

    static propTypes = {
        parentId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        inForm: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        // concatenate this model's name with parent's ID
        this.state = {collapseId: collapseId(c.OBJECTS_COMMENTS, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    renderComments(commentIds) {
        return (commentIds.map(
            (id) => {
                const comment = this.props.comments.objects[id];
                return <Comment key={id} comment={comment} />
            }
        ))
    }

    render() {
        const commentIds = this.props.updateChildrenIds[this.props.parentId] || [];
        const {inForm} = this.props;
        if (!commentIds) {
            return (
                <p>Loading...</p>
            );
        } else {
            const disabled = isNewUpdate(this.props.parentId);
            const disabledNote = disabled ? " (" + _("notes_disabled") + ")" : undefined;
            return (
                <div className={c.OBJECTS_COMMENTS}>
                    <strong>Internal notes:</strong>{disabledNote}
                    {disabled ? undefined : this.renderComments(commentIds)}
                    {inForm ?
                        <CommentForm parentId={this.props.parentId} disabled={disabled}/>
                        :
                        undefined}
                </div>
            );
        }
    }
}
