/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from 'react'
import PropTypes from 'prop-types';
import { connect } from "react-redux"
import Collapse, { Panel } from 'rc-collapse';

import { collapseChange } from "../actions/collapse-actions"
import * as c from '../const.js';
import { getResultsChildrenIds } from "../selectors";

import {
    _,
    createToggleKey,
    collapseId,
    cascadeIds,
    createToggleKeys,
    hideMe,
} from '../utils';

import { ToggleButton } from "./common"
import Indicators from './Indicators';


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


const ResultHeader = ({result, indicatorCount=0}) => {
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
        <span className="resultTitle">
            <h5>{result.title}</h5>
            <div>
                {renderResultType(result)}
                <ResultHeaderIndicatorCount count={indicatorCount} />
            </div>
        </span>
    )
};
ResultHeader.propTypes = {
    result: PropTypes.object,
    indicatorCount: PropTypes.number,
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
        this.hideMe = this.hideMe.bind(this);
        // Note that there is only one Collapse component for Results, so the collapseID will always
        // be "results-results"
        this.state = {collapseId: collapseId(c.OBJECTS_RESULTS, this.props.parentId)};
    }

    activeKey() {
        return this.props.keys[this.state.collapseId];
    }

    collapseChange(activeKey) {
        collapseChange(this.state.collapseId, activeKey);
    }

    toggleAll() {
        const keys = createToggleKeys(this.props.parentId, c.OBJECTS_RESULTS, this.activeKey());
        keys.map((collapse) => {
            collapseChange(collapse.collapseId, collapse.activeKey);
        })
    }

    hideMe(id) {
        return hideMe(c.OBJECTS_RESULTS, this.props.parentId, id);
    }

    renderPanels(ids) {
        return (ids.map(
            (id) => {
                const result = this.props.results.objects[id];
                const indicatorCount =
                    this.props.resultChildrenIds[id] && this.props.resultChildrenIds[id].length || 0;
                const className = this.hideMe(id) ? 'hidePanel' : '';
                return (
                    <Panel header={<ResultHeader result={result}
                                                 indicatorCount={indicatorCount}/>}
                           className={className}
                           key={id}>
                        <Indicators parentId={id}/>
                    </Panel>
                )
            }
        ))
    }

    render() {
        // Special case, always get all Results
        const results = this.props.results;
        const resultIds = results.ids;
        const toggleKey = createToggleKey(resultIds, this.activeKey());

        if (!results.fetched) {
            return (
                <p className="loading">Loading <i className="fa fa-spin fa-spinner" /></p>
            );
        } else if (resultIds.length > 0) {
            return (
                <div className={c.OBJECTS_RESULTS}>
                    <ToggleButton onClick={this.collapseChange.bind(this, toggleKey)} label="+"/>
                    <ToggleButton onClick={this.toggleAll} label="++"
                                  disabled={!this.props.ui.allFetched}/>
                    <Collapse activeKey={this.activeKey()} onChange={this.collapseChange}>
                        {this.renderPanels(resultIds)}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <div className="emptyData">
                     <p>No results</p>
                </div>
            );
        }
    }
}
