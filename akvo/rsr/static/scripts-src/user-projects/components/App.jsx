/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import update from "immutability-helper";
import { connect } from "react-redux";
import { inArray } from "../utils";

const Projects = ({ projects, user, toggleSelect, toggleAll }) => {
    const { ids, objects } = projects;
    return (
        <span>
            {/*<SelectAll onChange={toggleAll} />*/}
            <ul>
                {ids.map(id => {
                    const checked = inArray(id, user.projects);
                    return (
                        <li id={id}>
                            <span>{objects[id].title}</span>
                            <input
                                id={id}
                                type="checkbox"
                                checked={checked}
                                onChange={toggleSelect}
                            />
                        </li>
                    );
                })}
            </ul>
        </span>
    );
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.toggleSelect = this.toggleSelect.bind(this);
    }

    toggleSelect(e) {
        const id = e.target.id;
        const checked = this.state.projects.objects[id].checked;
        const projects = update(
            { ...this.state.projects },
            { objects: { [id]: { $merge: { checked: !checked } } } }
        );
        this.setState({ projects });
    }

    toggleAll() {
        const projects = update(
            { ...this.state.projects },
            { objects: { [id]: { $merge: { checked: !checked } } } }
        );
        this.setState({ projects });
    }

    componentDidMount() {
        this.props.onFetchUserProjects();
    }

    render() {
        return this.props.projects ? (
            <Projects
                user={this.props.user}
                projects={this.props.projects}
                onChange={this.toggleSelect}
            />
        ) : (
            <div>Loading...</div>
        );
    }
}

const mapStateToProps = state => {
    return {
        fetching: state.fetching,
        error: state.error,
        user: state.user,
        projects: state.projects
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUserProjects: () => dispatch({ type: "API_CALL_REQUEST" })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
