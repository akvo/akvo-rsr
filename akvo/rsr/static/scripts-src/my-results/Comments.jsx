/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import {Panel} from 'rc-collapse';

import {level} from './Level.jsx'

import {levelToggle} from './utils.js';
import {OBJECTS_COMMENTS} from './const.js';

const CommentHeader = ({item: comment}) => {
    return (
        <span>
            {"Comment: " + comment.comment}
        </span>
    )
};


class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {model: OBJECTS_COMMENTS};
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Comments.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
    // }

    render() {
        const comment = this.props.item;
        return (
            <div>By: {comment.user_details.first_name}</div>
        );
    }
}

Comment.propTypes = {
    items: PropTypes.array
};

export default level(CommentHeader, Comment);
