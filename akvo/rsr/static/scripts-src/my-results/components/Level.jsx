/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import Collapse, {Panel} from 'rc-collapse';
import update  from 'immutability-helper';

import {identicalArrays} from '../utils.js'

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

const PROPAGATE_NO = false,
      PROPAGATE_OPEN = 'open',
      PROPAGATE_CLOSE = 'close';

export function level(Header, Content) {

    function itemIDsArray(items) {
        // Return an array with item IDs as as stings, the same format as Collapse.activeKey
        if (items)
            return items.map((item) => item.id.toString());
        return [];
    }

    return class extends React.Component {
        constructor(props) {
            super(props);
            let activeKey = [];
            if (props.propagate == PROPAGATE_OPEN && this.props.items) {
                activeKey = itemIDsArray(this.props.items);
            }
            this.state = {activeKey: activeKey, propagate: props.propagate || PROPAGATE_NO};

            this.onChange = this.onChange.bind(this);
            this.openAll = this.openAll.bind(this);
            this.closeAll = this.closeAll.bind(this);
            // this.togglePanels = this.togglePanels;
            this.toggleAll = this.toggleAll.bind(this);
        }

        // componentWillReceiveProps(nextProps) {
        //     console.log("Level.componentWillReceiveProps: nextProps.propagate: " + JSON.stringify(nextProps.propagate));
        // }

        onChange(activeKey) {
            // Keep track of open panels
            this.setState({activeKey});
        }

        openAll(setPropagate=false) {
            const items = this.props.items;
            const nextState = {activeKey: itemIDsArray(items)};
            if (setPropagate) {
                nextState.propagate = PROPAGATE_OPEN;
            }
            this.setState(
                nextState
            );
        }

        closeAll(setPropagate=false) {
            const nextState = {activeKey: []};
            if (setPropagate) {
                nextState.propagate = PROPAGATE_CLOSE;
            }
            this.setState(nextState);
        }

        togglePanels(setPropagate) {
            // If activeKey holds all items' IDs then all Panels are open and we should
            // close them, otherwise we open all Panels
            const activeKey = this.state.activeKey;
            const items = this.props.items;
            if (identicalArrays(activeKey, itemIDsArray(items))) {
                this.closeAll(setPropagate);
            } else {
                this.openAll(setPropagate);
            }
        }

        toggleAll() {
            this.togglePanels(true);
        }

        componentWillReceiveProps(nextProps) {
            // Combine activeKey with props.newKeys to create a new activeKey
            // Currently used in Period to open a new update form when it's created
            if (nextProps.newKeys) {
                this.setState({activeKey: update(this.state.activeKey, {$push: nextProps.newKeys})})
            }
            if (nextProps.propagate) {
                if (nextProps.propagate == PROPAGATE_OPEN) {
                    this.openAll();
                } else if (nextProps.propagate == PROPAGATE_CLOSE) {
                    this.closeAll();
                }
            }
        }

        renderPanels(items, propagate, props) {
            return (
                items.map(
                    function(item) {
                        // Note: I've tried to have the Panel in the respective Content components
                        // and render <Content /> here, but it seems Panel doesn't like being
                        // separated from Collapse by any component between them so I gave up
                        return (
                            <Panel header={<Header item={item} {...props}/>} key={item.id}>
                                <Content key={item.id} item={item} propagate={propagate} callbacks={props.callbacks}/>
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
                        <ToggleButton onClick={this.togglePanels.bind(this, false)} label="+"/>
                        <ToggleButton onClick={this.toggleAll} label="++"/>
                        <Collapse activeKey={this.state.activeKey} onChange={this.onChange}>
                            {this.renderPanels(
                                items,
                                this.state.propagate || this.props.propagate,
                                this.props
                            )}
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
