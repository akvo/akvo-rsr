/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import update from "immutability-helper";
import { connect } from "react-redux";
import { dataFromElement, inArray } from "../utils";

import * as c from "../const";

const userId = dataFromElement("user").id;

const IsRestricted = ({ is_restricted, onChangeIsRestricted }) => {
    return (
        <span>
            <span>Is restricted</span>
            <input
                id="is_restricted"
                type="checkbox"
                checked={is_restricted}
                onChange={onChangeIsRestricted}
            />
        </span>
    );
};

const Project = ({ project, user_projects, is_restricted, onChangeProjectSelected }) => {
    const checked = user_projects && inArray(project.id, user_projects);
    return (
        <tr key={project.id} data-item={project.id} onClick={onChangeProjectSelected}>
            <td>
                <input
                    id={project.id}
                    type="checkbox"
                    checked={checked}
                    disabled={!is_restricted}
                />
            </td>
            <td className={checked ? "projectSelected" : undefined}>{project.id}</td>
            <td className={checked ? "projectSelected" : undefined}>
                {project.title || "Project without a title"}
            </td>
        </tr>
    );
};

const SelectAll = ({ selectAll, onChangeProjectSelectAll }) => {
    return (
        <div onClick={onChangeProjectSelectAll}>
            <span>{selectAll ? "Select all projects" : "De-select all projects"}</span>
        </div>
    );
};

const Projects = ({
    all_projects,
    user_projects,
    is_restricted,
    selectAll,
    onChangeIsRestricted,
    onChangeProjectSelectAll,
    onChangeProjectSelected
}) => {
    return (
        <span>
            <IsRestricted
                is_restricted={is_restricted}
                onChangeIsRestricted={onChangeIsRestricted}
            />
            <SelectAll
                selectAll={selectAll}
                onChangeProjectSelectAll={onChangeProjectSelectAll}
                className={is_restricted ? undefined : "disabled"}
            />
            <table className={is_restricted ? undefined : "disabled"}>
                <thead>
                    <th>Can access</th>
                    <th>Project ID</th>
                    <th>Project title</th>
                </thead>
                <tbody>
                    {all_projects.map(project => (
                        <Project
                            project={project}
                            user_projects={user_projects}
                            is_restricted={is_restricted}
                            onChangeProjectSelected={onChangeProjectSelected}
                        />
                    ))}
                </tbody>
            </table>
        </span>
    );
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.toggleProjectSelected = this.toggleProjectSelected.bind(this);
        this.toggleIsRestricted = this.toggleIsRestricted.bind(this);
        this.toggleProjectSelectAll = this.toggleProjectSelectAll.bind(this);
    }

    toggleIsRestricted(e) {
        e.stopPropagation();
        this.props.onUpdateIsRestricted(e.target.checked);
    }

    toggleProjectSelectAll(e) {
        e.stopPropagation();
        this.props.onUpdateSelectAll();
    }

    toggleProjectSelected(e) {
        const id = parseInt(e.currentTarget.getAttribute("data-item"));
        this.props.onUpdateProjectSelection(id);
        e.stopPropagation();
    }

    componentDidMount() {
        this.props.setUserId();
        this.props.onFetchUserProjects();
    }

    render() {
        const { is_restricted, selectAll, all_projects, user_projects } = this.props;
        return all_projects ? (
            <Projects
                is_restricted={is_restricted}
                selectAll={selectAll}
                all_projects={all_projects}
                user_projects={user_projects}
                onChangeIsRestricted={this.toggleIsRestricted}
                onChangeProjectSelectAll={this.toggleProjectSelectAll}
                onChangeProjectSelected={this.toggleProjectSelected}
            />
        ) : (
            <div>Loading...</div>
        );
    }
}

const mapStateToProps = state => {
    const { fetching, error, all_projects, is_restricted, selectAll, user_projects } = state;
    return { fetching, error, all_projects, is_restricted, selectAll, user_projects };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUserProjects: () => dispatch({ type: c.API_GET_INIT, data: { userId } }),
        setUserId: () => dispatch({ type: c.SET_USER_ID, data: { userId } }),
        onUpdateProjectSelection: projectId =>
            dispatch({ type: c.UPDATE_PROJECT_SELECTION, data: { projectId } }),
        onUpdateIsRestricted: is_restricted =>
            dispatch({ type: c.UPDATE_IS_RESTRICTED, data: { is_restricted } }),
        onUpdateSelectAll: () => dispatch({ type: c.UPDATE_SELECT_ALL_PROJECTS })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
