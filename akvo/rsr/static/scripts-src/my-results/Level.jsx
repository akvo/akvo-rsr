/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import Collapse, {Panel} from 'rc-collapse';

export default class Level extends React.Component {
    render() {
        const items = this.props.items;
        if (! this.props.models[this.state.model] || ! items) {
            console.log(this.constructor.name + " " + this._reactInternalInstance._debugID + " loading...");
            return (
                <p>Loading...</p>
            );
        } else if (items.length > 0) {
            return (
                <Collapse>
                    {items.map((item, i) => this.renderPanel(item, i))}
                </Collapse>
            );
        } else {
            return (
                <p>No items</p>
            );
        }
    }
}
