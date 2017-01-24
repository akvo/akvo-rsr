/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import Collapse, {Panel} from 'rc-collapse';
import update  from 'immutability-helper';

// export default class Level extends React.Component {
    // render() {
    //     const items = this.props.items;
    //     if (!items) {
    //         console.log(this.constructor.name + " " + this._reactInternalInstance._debugID + " loading...");
    //         return (
    //             <p>Loading...</p>
    //         );
    //     } else if (items.length > 0) {
    //         return (
    //             <Collapse activeKey={this.props.activeKey} onChange={this.props.onChange}>
    //                 {items.map((item) => this.props.renderPanel(item))}
    //             </Collapse>
    //         );
    //     } else {
    //         return (
    //             <p>No items</p>
    //         );
    //     }
    // }
// }
//
// Level.propTypes = {
//     items: PropTypes.array,
//     renderPanel: PropTypes.func.isRequired,
//     callbacks: PropTypes.object,
//     activeKey: PropTypes.array,
//     onChange: PropTypes.func
// };



const ToggleButton = ({onClick, label}) => {
    return (
        <a onClick={onClick}
            className={'btn btn-sm btn-default'}
            style={{margin: '0.3em 0.5em'}}>
            {label}
        </a>
    )
};

ToggleButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};


export function level(Header, Content) {

    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {activeKey: [], isOpen: false};
            this.onChange = this.onChange.bind(this);
            this.toggleLevel = this.toggleLevel.bind(this);
        }

        onChange(activeKey) {
            // Keep track of open panels
            this.setState({activeKey});
        }

        toggleLevel() {
            const isOpen = this.state.isOpen;
            if (isOpen) {
                this.setState({activeKey: [], isOpen: !isOpen});
            } else {
                this.setState({
                    activeKey: this.props.items.map((item) => item.id.toString()),
                    isOpen: !isOpen
                });
            }
        }

        componentWillReceiveProps(newProps) {
            // Combine activeKey with props.newKeys to create a new activeKey
            // Currently used in Period to open a new update form when it's created
            if (newProps.newKeys) {
                this.setState({activeKey: update(this.state.activeKey, {$push: newProps.newKeys})})
            }
        }

        renderPanels(items, props) {
            return (
                items.map(
                    function(item) {
                        // Note: I've tried to have the Panel in the respective Content components
                        // and render <Content /> here, but it seems Panel doesn't like being
                        // separated from Collapse by any component between them so I gave up
                        return (
                            <Panel header={<Header item={item} {...props}/>} key={item.id}>
                                <Content key={item.id} item={item} {...props}/>
                            </Panel>
                        )
                    }
                )
            )
        }

        render() {
            const items = this.props.items;
            if (!items) {
                console.log(this.constructor.name + " " + this._reactInternalInstance._debugID + " loading...");
                return (
                    <p>Loading...</p>
                );
            } else if (items.length > 0) {
                return (
                    <div>
                        <ToggleButton onClick={this.toggleLevel} label="+"/>
                        <Collapse activeKey={this.state.activeKey} onChange={this.onChange}>
                            {this.renderPanels(items, this.props)}
                        </Collapse>
                    </div>
                );
            } else {
                return (
                    <p>No items</p>
                );
            }
        }
    }
}

                            // {items.map(
                            //     (item) => (<WrappedComponent key={item.id} item={item} {...this.props}/>)
                            // )}
