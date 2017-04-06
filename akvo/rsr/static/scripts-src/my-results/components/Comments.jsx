/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react'
import Collapse, { Panel } from 'rc-collapse'
import { connect } from "react-redux"

import { onChange } from "../actions/collapse-actions"
import { findChildren, createToggleKey, collapseId } from '../utils'
import { OBJECTS_COMMENTS } from '../const'

import { ToggleButton } from "./common"


const CommentHeader = ({comment}) => {
    return (
        <span>
            {"Comment: " + comment.comment}
        </span>
    )
};

CommentHeader.propTypes = {
    comment: PropTypes.object.isRequired,
};


@connect((store) => {
    return {
        comments: store.models['comments'],
        keys: store.keys
    }
})
export default class Comments extends React.Component {

    static propTypes = {
        parentId: PropTypes.number.isRequired,
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

    renderPanels(comments) {
        return (comments.map(
            (comment) =>
                <Panel header={<CommentHeader comment={comment}/>} key={comment.id}>
                    <div>By: {comment.user_details.first_name}</div>
                </Panel>
        ))
    }

    render() {
        const { ids, comments } = findChildren(this.props.parentId, OBJECTS_COMMENTS);
        const toggleKey = createToggleKey(ids, this.activeKey());
        if (!comments) {
            return (
                <p>Loading...</p>
            );
        } else if (comments.length > 0) {
            return (
                <div className={OBJECTS_COMMENTS}>
                    {/*<ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>*/}
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(comments)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <p>No comments</p>
            );
        }
    }
}
