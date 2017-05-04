/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from 'react'
import PropTypes from 'prop-types';
import Collapse, { Panel } from 'rc-collapse'
import { connect } from "react-redux"

import { onChange } from "../actions/collapse-actions"
import {
    collapseId,
    _,
    endpoints
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
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.addComment = this.addComment.bind(this);
        this.resetComment = this.resetComment.bind(this);
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
                [c.UPDATE_MODEL_FULFILLED]: this.resetComment.bind(this, 'Comment saved'),
                [c.UPDATE_MODEL_REJECTED]: createAlert.bind(
                    this, commentAlertName, 'Comment could not be saved, plz try again.'
                )
            };
            saveModelToBackend(
                c.OBJECTS_COMMENTS, endpoints.post_comment(), newComment, null, callbacks
            );
        } else  {
            creat1eAlert(commentAlertName, "Please enter some comment text");
        }
    }

    resetComment(message) {
        this.setState({comment: ''});
        this.props.createAlert(this.state.commentAlertName, message);
    }

    render() {
        return (
            <div>
                <div className="input-group">
                    <input className="form-control" value={this.state.comment}
                           onChange={this.onChange}
                           placeholder={_('add_comment_placeholder')}/>
                    <span className="input-group-btn">
                        <button type="submit" onClick={this.addComment} className="btn btn-default">
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
        this.props.dispatch(onChange(this.state.collapseId, activeKey));
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

        if (!commentIds) {
            return (
                <p>Loading...</p>
            );
        } else if (commentIds.length > 0) {
            return (
                <div className={c.OBJECTS_COMMENTS + ' col-xs-12'}>
                    <strong>Internal notes:</strong>
                    {this.renderComments(commentIds)}
                    <CommentForm parentId={this.props.parentId}/>
                </div>
            );
        } else {
            return (
                <div className={c.OBJECTS_COMMENTS + ' col-xs-12'}>
                    <strong>Internal notes</strong>
                    <CommentForm parentId={this.props.parentId}/>
                </div>
            );
        }
    }
}
