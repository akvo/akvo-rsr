/*
   Akvo RSR is covered by the GNU Affero General Public License.
   See more details in the license.txt file located at the root folder of the
   Akvo RSR module. For additional details on the GNU license please see
   < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import { connect } from "react-redux";
import { _, dataFromElement, inArray } from "../utils";

import * as c from "../const";

const IsRestricted = ({ _, is_restricted, onChangeIsRestricted }) => {
    return (
        <span>
            <label>
                <input
                    id="is_restricted"
                    type="checkbox"
                    checked={is_restricted}
                    onChange={onChangeIsRestricted}
                />
                {_("restrict_access")}
            </label>
        </span>
    );
};

const Project = ({ _, project, user_projects, is_restricted, onChangeProjectSelected }) => {
    const checked = user_projects && inArray(project.id, user_projects);
    return (
        <tr
            key={project.id}
            id={project.id}
            onClick={onChangeProjectSelected}
            className={checked ? "projectSelected" : undefined}
        >
            <td>
                <input
                    id={project.id}
                    type="checkbox"
                    checked={checked}
                    disabled={!is_restricted}
                    readOnly={true}
                />
            </td>
            <td>{project.id}</td>
            <td>{project.title || _("no_title")}</td>
        </tr>
    );
};

const SelectAll = ({ _, selectAll, onChangeProjectSelectAll, is_restricted }) => {
    return (
        <div className={is_restricted ? undefined : "disabled"}>
            <button onClick={onChangeProjectSelectAll} disabled={is_restricted ? false : true} className="selectAllProject">
                {selectAll ? _("select_all") : _("deselect_all")}
            </button>
        </div>
    );
};

const Projects = ({
    _,
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
                _={_}
                is_restricted={is_restricted}
                onChangeIsRestricted={onChangeIsRestricted}
            />
            <SelectAll
                _={_}
                selectAll={selectAll}
                onChangeProjectSelectAll={onChangeProjectSelectAll}
                is_restricted={is_restricted}
            />
            <table className={is_restricted ? undefined : "disabled"}>
                <thead>
                    <tr>
                        <th>{_("can_access")}</th>
                        <th>{_("project_id")}</th>
                        <th>{_("project_title")}</th>
                    </tr>
                </thead>
                <tbody>
                    {all_projects.map(project => (
                        <Project
                            _={_}
                            key={project.id}
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
        this._ = this._.bind(this);
    }

    // Translation handling
    _(s) {
        return this.props.strings && this.props.strings[s];
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
        e.stopPropagation();
        const target = e.currentTarget;
        if (!target.closest("table").classList.contains("disabled")) {
            const id = parseInt(target.getAttribute("id"));
            this.props.onUpdateProjectSelection(id);
        }
    }

    componentDidMount() {
        const userId = dataFromElement("user-to-restrict").id;
        this.props.setStore({ userId });

        const strings = dataFromElement("user-projects-text");
        this.props.setStore({ strings });

        this.props.onFetchUserProjects(userId);
    }

    render() {
        const { is_restricted, selectAll, all_projects, user_projects } = this.props;
        return all_projects ? (
            <Projects
                _={this._}
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
    const {
        fetching,
        error,
        all_projects,
        is_restricted,
        selectAll,
        user_projects,
        strings
    } = state;
    return { fetching, error, all_projects, is_restricted, selectAll, user_projects, strings };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUserProjects: userId => dispatch({ type: c.API_GET_INIT, data: { userId } }),
        setStore: data => dispatch({ type: c.SET_STORE, data }),
        onUpdateProjectSelection: projectId =>
            dispatch({ type: c.UPDATE_PROJECT_SELECTION, data: { projectId } }),
        onUpdateIsRestricted: is_restricted =>
            dispatch({ type: c.UPDATE_IS_RESTRICTED, data: { is_restricted } }),
        onUpdateSelectAll: () => dispatch({ type: c.UPDATE_SELECT_ALL_PROJECTS })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
