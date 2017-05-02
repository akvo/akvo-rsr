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
import { findChildren, createToggleKey, collapseId, _, endpoints} from '../utils'
import { OBJECTS_COMMENTS } from '../const'

import { ToggleButton } from "./common"
import {getUpdatesChildrenIds} from "../selectors";
import {saveModelToBackend} from "../actions/model-actions";


@connect((store) => {
    return {
        user: store.models.user.objects[store.models.user.ids[0]],
    }
})
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
        this.state = {comment: ''};
    }

    onChange(e) {
        this.setState({comment: e.target.value});
    }

    addComment() {
        const newComment = {
            'data': this.props.parentId,
            'user': this.props.user.id,
            'comment': this.state.comment
        };
        saveModelToBackend(OBJECTS_COMMENTS, endpoints.post_comment(), newComment, null, this.resetComment)
    }

    resetComment() {
        this.setState({comment: ''})
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
            </div>
        )
    }
}

const Comment = ({comment}) => {
    const name = comment.user_details.first_name + ' ' + comment.user_details.last_name;
    return (
        <div>
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
        this.state = {collapseId: collapseId(OBJECTS_COMMENTS, this.props.parentId)};
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
                // return (
                //     <Panel header={<CommentHeader comment={comment}/>} key={id}>
                //         <div>By: {comment.user_details.first_name}</div>
                //     </Panel>
                // )
            }
        ))
    }

    render() {
        const commentIds = this.props.updateChildrenIds[this.props.parentId] || [];

        // const toggleKey = createToggleKey(ids, this.activeKey());
        if (!commentIds) {
            return (
                <p>Loading...</p>
            );
        } else if (commentIds.length > 0) {
            return (
                <div className={OBJECTS_COMMENTS + ' col-xs-12'}>
                    <strong>Internal notes:</strong>
                    {this.renderComments(commentIds)}
                    <CommentForm parentId={this.props.parentId}/>
                </div>
            );
        } else {
            return (
                <div className={OBJECTS_COMMENTS + ' col-xs-12'}>
                    <strong>Internal notes</strong>
                    <CommentForm parentId={this.props.parentId}/>
                </div>
            );
        }
    }
}
