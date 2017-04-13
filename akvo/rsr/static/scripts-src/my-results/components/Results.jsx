/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import { connect } from "react-redux"
import Collapse, {  Panel } from 'rc-collapse';

import { onChange } from "../actions/collapse-actions"

import { _, createToggleKey, collapseId, cascadeIds, createToggleKeys } from '../utils';
import { OBJECTS_RESULTS, OBJECTS_INDICATORS } from '../const.js';

import Indicators from './Indicators';
import { ToggleButton } from "./common"
import {getResultsChildrenIds} from "../selectors";


const ResultHeaderIndicatorCount = ({count}) => {
    let indicatorText;
    if (count == 1) {
        indicatorText = _('indicator');
    } else {
        indicatorText = _('indicators');
    }
    return (
        <span className="result-indicator-count">
            <i className="fa fa-tachometer" />
            <span className="indicator-count inlined"> {count} {indicatorText}</span>
        </span>
    )
};

ResultHeaderIndicatorCount.propTypes = {
    count: PropTypes.number
};


const ResultHeader = ({result, indicatorCount}) => {
    const renderResultType = (result) => {
        // Show the result type, if available
        switch (result.type) {
            case '1':
                return <span className="indicatorType">{_('output')}</span>;
            case '2': 
                return <span className="indicatorType">{_('outcome')}</span>;
            case '3': 
                return <span className="indicatorType">{_('impact')}</span>;
            case '9': 
                return <span className="indicatorType">{_('other')}</span>;
            default: 
                return <span />;
        }
    };

    return (
        <span>
            {"Result: " + result.title}
            {renderResultType(result)}
            <ResultHeaderIndicatorCount count={indicatorCount || 0} />
        </span>
    )
};

ResultHeader.propTypes = {
    result: PropTypes.object
};


@connect((store) => {
    return {
        results: store.models['results'],
        keys: store.keys,
        ui: store.ui,
        resultChildrenIds: getResultsChildrenIds(store),
    }
})
export default class Results extends React.Component {

    static propTypes = {
        parentId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.collapseChange = this.collapseChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        // Note that there is only one Collapse component for Results, so the collapseID will always
        // be "results-results"
        this.state = {collapseId: collapseId(OBJECTS_RESULTS, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        this.props.dispatch(onChange(this.state.collapseId, activeKey));
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, OBJECTS_RESULTS, this.activeKey());
        keys.map((collapse) => {
            this.props.dispatch(onChange(collapse.collapseId, collapse.activeKey));
        })
    }

    renderPanels({ids}) {
        return (ids.map(
            (id) => {
                const result = this.props.results.objects[id];
                const indicatorIds = this.props.resultChildrenIds[id] || [];
                return (
                    <Panel header={<ResultHeader result={result}
                                        indicatorCount={indicatorIds.length}/>}
                           key={id}>
                        <Indicators ids={indicatorIds}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        const {ids=undefined} = this.props.results;
        const toggleKey = createToggleKey(ids, this.activeKey());

        if (!ids) {
            return (
                <p>Loading...</p>
            );
        } else if (ids.length > 0) {
            return (
                <div className={OBJECTS_RESULTS}>
                    <ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>
                    <ToggleButton onClick={this.toggleAll} label="++"
                                  disabled={!this.props.ui.allFetched}/>
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(this.props.results)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <p>No results</p>
            );
        }
    }
    // render() {
    //     const { ids, results } = findChildren(this.props.parentId, OBJECTS_RESULTS);
    //     const toggleKey = createToggleKey(ids, this.activeKey());
    //
    //     if (!results) {
    //         return (
    //             <p>Loading...</p>
    //         );
    //     } else if (results.length > 0) {
    //         return (
    //             <div className={OBJECTS_RESULTS}>
    //                 <ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>
    //                 <ToggleButton onClick={this.toggleAll} label="++"
    //                               disabled={!this.props.ui.allFetched}/>
    //                 <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
    //                     {this.renderPanels(results)}
    //                 </Collapse>
    //             </div>
    //         );
    //     } else {
    //         return (
    //             <p>No results</p>
    //         );
    //     }
    // }
}
