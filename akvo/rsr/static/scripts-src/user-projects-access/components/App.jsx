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

import projects from "../mock-data"

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
                {/* The strings include <strong> tags which requires the use of
                    dangerouslySetInnerHTML */}
                <span
                    dangerouslySetInnerHTML={{
                        __html: is_restricted
                            ? _("user_access_restricted")
                            : _("user_access_unrestricted")
                    }}
                />
            </label>
            {is_restricted ? (
                <div
                    className="restrictedInfo"
                    dangerouslySetInnerHTML={{ __html: _("restricted_info") }}
                />
            ) : (
                <div />
            )}
        </span>
    );
};

const Project = ({ _, project, user_projects, is_restricted, onChangeProjectSelected }) => {
    // NOTE: the checked value is set to true if is_restricted is false. This is so that the list of
    // projects looks like all projects are selected when restrictions are not in force.
    // This is _not_ reflected in the store.
    const uiSettings = (project, user_projects, is_restricted) => {
        const checked = !is_restricted || (user_projects && inArray(project.id, user_projects)),
            disabled = is_restricted ? "" : "disabled",
            projectSelected = checked ? " projectSelected" : "",
            trClassName = disabled + projectSelected,
            idClassName = disabled + " id";
        return { checked, trClassName, idClassName };
    };
    const { checked, trClassName, idClassName } = uiSettings(project, user_projects, is_restricted);
    return (
        <tr
            key={project.id}
            id={project.id}
            onClick={onChangeProjectSelected}
            className={trClassName}
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
            <td className={idClassName}>{project.id}</td>
            <td>{project.title || _("no_title")}</td>
        </tr>
    );
};

const SelectAll = ({ _, selectAll, onChangeProjectSelectAll, is_restricted }) => {
    const uiSettings = is_restricted => {
        const buttonClass = "selectAllProjects" + (is_restricted ? "" : " disabled"),
            disabled = !is_restricted,
            divClass = is_restricted ? "" : "disabled";
        return { buttonClass, disabled, divClass };
    };
    const { divClass, disabled, buttonClass } = uiSettings(is_restricted);
    return (
        <div className={divClass}>
            <button onClick={onChangeProjectSelectAll} disabled={disabled} className={buttonClass}>
                {selectAll ? _("check_all_projects") : _("uncheck_all_projects")}
            </button>
        </div>
    );
};

const Error = ({ _, error }) => {
    return error ? <div className="error">{_("an_error_occured") + error.message}</div> : null;
};

const Projects = ({
    _,
    error,
    projects,
    // user_projects,
    // is_restricted,
    selectAll,
    // onChangeIsRestricted,
    onChangeProjectSelectAll,
    onChangeProjectSelected
}) => {
    const className = is_restricted ? "" : "disabled";
    return (
        <span>
            <Error _={_} error={error} />
            {/*<IsRestricted*/}
                {/*_={_}*/}
                {/*is_restricted={is_restricted}*/}
                {/*onChangeIsRestricted={onChangeIsRestricted}*/}
            {/*/>*/}
            <SelectAll
                _={_}
                selectAll={selectAll}
                onChangeProjectSelectAll={onChangeProjectSelectAll}
                is_restricted={is_restricted}
            />
            <table>
                <thead>
                    <tr>
                        <th className={className}>{_("access")}</th>
                        <th className={className}>{_("project_id")}</th>
                        <th className={className}>{_("project_title")}</th>
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
        if (!target.classList.contains("disabled")) {
            const id = parseInt(target.getAttribute("id"));
            this.props.onUpdateProjectSelection(id);
        }
    }

    componentDidMount() {
        const userId = dataFromElement("user-to-restrict").id;
        this.props.setStore({ userId });

        const strings = dataFromElement("user-projects-text");
        this.props.setStore({ strings });

        // this.props.onFetchUserProjects(userId);
        this.props.setStore({ projects });
    }

    render() {
        const { is_restricted, selectAll, all_projects, user_projects, error } = this.props;
        return all_projects ? (
            <Projects
                _={this._}
                error={error}
                // is_restricted={is_restricted}
                selectAll={selectAll}
                projects={all_projects}
                // user_projects={user_projects}
                // onChangeIsRestricted={this.toggleIsRestricted}
                onChangeProjectSelectAll={this.toggleProjectSelectAll}
                onChangeProjectSelected={this.toggleProjectSelected}
            />
        ) : (
            <div>{_("loading")}</div>
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
        onFetchUserProjects: userId =>
            dispatch({
                type: c.API_GET_INIT,
                data: { userId }
            }),
        setStore: data =>
            dispatch({
                type: c.SET_STORE,
                data
            }),
        onUpdateProjectSelection: projectId =>
            dispatch({
                type: c.UPDATE_PROJECT_SELECTION,
                data: { projectId }
            }),
        onUpdateIsRestricted: is_restricted =>
            dispatch({
                type: c.UPDATE_IS_RESTRICTED,
                data: { is_restricted }
            }),
        onUpdateSelectAll: () => dispatch({ type: c.UPDATE_SELECT_ALL_PROJECTS })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
