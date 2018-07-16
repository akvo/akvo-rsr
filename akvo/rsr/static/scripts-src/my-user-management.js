/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Button,
    MenuItem,
    Modal,
    SplitButton,
    Table,
    initial_employment_data,
    orgAdmin,
    organisation_data,
    roles,
    i18n;

// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie("csrftoken");

function initReact() {
    // Load globals
    Button = ReactBootstrap.Button;
    MenuItem = ReactBootstrap.MenuItem;
    Modal = ReactBootstrap.Modal;
    SplitButton = ReactBootstrap.SplitButton;
    Table = ReactBootstrap.Table;

    var InviteRow = React.createClass({displayName: "InviteRow",
        getInitialState: function() {
            return {
                button_text: "+",
                button_style: "success"
            };
        },

        handleRowClick: function() {
            if (this.state.button_style === "success") {
                this.props.addRow();
                this.setState({
                    button_text: "x",
                    button_style: "danger"
                });
            } else {
                this.props.deleteRow(this.props.rowId);
            }
        },

        render: function() {
            var orgs = organisation_data.map(function(org) {
                return (
                    React.createElement("option", {key: org.id, value: org.id}, 
                        org.name
                    )
                );
            });

            var roles = roles.map(function(role) {
                return (
                    React.createElement("option", {key: role.id, value: role.id}, 
                        role.name
                    )
                );
            });

            var thisButton = React.createElement(
                Button,
                {
                    bsStyle: this.state.button_style,
                    onClick: this.handleRowClick
                },
                this.state.button_text
            );

            return (
                React.createElement("tr", {className: "invite-row"}, 
                    React.createElement("td", null, 
                        React.createElement("input", {
                            className: "form-control", 
                            type: "email", 
                            placeholder: i18n.email_text, 
                            maxLength: "254", 
                            required: "required"}
                        )
                    ), 
                    React.createElement("td", null, 
                        React.createElement("select", {className: "form-control org-select", defaultValue: ""}, 
                            React.createElement("option", {value: ""}, i18n.select_org_text), 
                            orgs
                        )
                    ), 
                    React.createElement("td", null, 
                        React.createElement("select", {className: "form-control role-select", defaultValue: ""}, 
                            React.createElement("option", {value: ""}, i18n.select_role_text), 
                            roles
                        )
                    ), 
                    React.createElement("td", null, thisButton)
                )
            );
        }
    });

    var InviteTable = React.createClass({displayName: "InviteTable",
        getInitialState: function() {
            return {
                rows: [0]
            };
        },

        addRow: function() {
            var currentRows = this.state.rows;
            var max = 0;
            for (var i = 0; i < currentRows.length; i++) {
                if (currentRows[i] > max) {
                    max = currentRows[i];
                }
            }
            currentRows.push(max + 1);

            this.setState({ rows: currentRows });
        },

        deleteRow: function(key) {
            var currentRows = this.state.rows;
            for (var i = 0; i < currentRows.length; i++) {
                if (currentRows[i] === key) {
                    currentRows.splice(i, 1);

                    this.setState({ rows: currentRows });
                    break;
                }
            }
        },

        render: function() {
            var thisTable = this;

            var rows = this.state.rows.map(function(row) {
                return React.createElement(InviteRow, {
                    key: row,
                    rowId: row,
                    addRow: thisTable.addRow,
                    deleteRow: thisTable.deleteRow
                });
            });

            return React.createElement(
                Table,
                { striped: true, id: "invite-table" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement("th", null, i18n.email_text),
                        React.createElement("th", null, i18n.organisations_text),
                        React.createElement("th", null, i18n.role_text),
                        React.createElement("th")
                    )
                ),
                React.createElement("tbody", null, rows)
            );
        }
    });

    var InviteModal = React.createClass({displayName: "InviteModal",
        getInitialState: function() {
            return {
                disable: false,
                successes: 0,
                showModal: false
            };
        },

        close: function() {
            this.setState({
                showModal: false
            });
        },

        open: function() {
            this.setState({
                showModal: true
            });
        },

        inviteApiCall: function(email, org, role, row) {
            var thisModal = this;

            if (email === "" && org === "" && role === "") {
                // Row without any data, ignore
            } else {
                // Create request
                var url = "/rest/v1/invite_user/?format=json";

                var request = new XMLHttpRequest();
                request.open("POST", url, true);
                request.setRequestHeader("X-CSRFToken", csrftoken);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                request.onload = function() {
                    var status = request.status;

                    if (status === 201) {
                        // Remove row
                        row.classList.add("has-success");
                        var button = row.querySelector("button");
                        button.parentNode.removeChild(button);
                        setTimeout(function() {
                            if (row.parentNode.querySelectorAll("tr").length === 1) {
                                // Only one row left, close modal
                                thisModal.close();
                            }
                            row.parentNode.removeChild(row);
                        }, 3000);
                    } else if (status === 400) {
                        // Missing data
                        var missingData = JSON.parse(request.responseText).missing_data;
                        for (var i = 0; i < missingData.length; i++) {
                            var fields = row.querySelectorAll("td");
                            var field = missingData[i];
                            if (field === "email") {
                                fields[0].classList.add("has-error");
                            } else if (field === "organisation") {
                                fields[1].classList.add("has-error");
                            } else if (field === "group") {
                                fields[2].classList.add("has-error");
                            }
                        }
                    } else {
                        // Forbidden or general error
                        row.classList.add("has-error");
                    }
                };

                var data =
                    "user_data=" +
                    JSON.stringify({
                        email: email,
                        organisation: org,
                        group: role
                    });

                request.send(data);
            }
        },

        sendInvite: function() {
            // Disable invite button
            this.setState({
                disable: true
            });

            var inviteTable = document.getElementById("invite-table");
            var inviteRows = inviteTable.querySelectorAll(".invite-row");
            for (var i = 0; i < inviteRows.length; i++) {
                var inviteRow = inviteRows[i];
                var emailInput = inviteRow.querySelector("input").value;
                var orgInput = inviteRow.querySelector(".org-select").value;
                var roleInput = inviteRow.querySelector(".role-select").value;
                this.inviteApiCall(emailInput, orgInput, roleInput, inviteRow);
            }

            // Enable invite button again
            var thisInviteModal = this;
            setTimeout(function() {
                thisInviteModal.setState({
                    disable: false
                });
            }, 5000);
        },

        render: function() {
            var modalButton = React.createElement(
                Button,
                {
                    className: "btn btn-default btn-sm",
                    onClick: this.open
                },
                React.createElement("i", { className: "glyphicon glyphicon-user" }),
                " +"
            );

            var thisModal = React.createElement(
                Modal,
                {
                    show: this.state.showModal,
                    onHide: this.close,
                    bsSize: "large"
                },
                React.createElement(
                    Modal.Header,
                    { closeButton: true },
                    React.createElement(Modal.Title, null, i18n.invite_users_text)
                ),
                React.createElement(
                    Modal.Body,
                    null,
                    i18n.invite_users_heading,
                    React.createElement("hr"),
                    React.createElement(InviteTable)
                ),
                React.createElement(
                    Modal.Footer,
                    null,
                    React.createElement(Button, { onClick: this.close }, i18n.close_text),
                    React.createElement(
                        Button,
                        {
                            onClick: this.sendInvite,
                            bsStyle: "success",
                            disabled: this.state.disable
                        },
                        i18n.invite_users_text
                    )
                )
            );

            return (
                React.createElement("div", null, 
                    modalButton, 
                    thisModal
                )
            );
        }
    });

    var DeleteModal = React.createClass({displayName: "DeleteModal",
        getInitialState: function() {
            return {
                showModal: false,
                showButton: false
            };
        },

        componentDidMount: function() {
            var approved = this.props.employment.is_approved;
            if (this.isMounted()) {
                this.setState({
                    showButton: true
                });
            }
        },

        close: function() {
            this.setState({
                showModal: false
            });
        },

        open: function() {
            this.setState({
                showModal: true
            });
        },

        deleteEmployment: function() {
            $.ajax({
                type: "DELETE",
                url: "/rest/v1/employment/" + this.props.employment.id + "/?format=json",
                success: function(data) {
                    this.handleDelete();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },

        handleDelete: function() {
            this.props.onDeleteToggle();
        },

        render: function() {
            var modalButton;

            if (!this.state.showButton) {
                modalButton = React.createElement("span");
            } else {
                modalButton = React.createElement(
                    Button,
                    { bsStyle: "danger", bsSize: "xsmall", onClick: this.open },
                    "X"
                );
            }

            var thisModal = React.createElement(
                Modal,
                {
                    show: this.state.showModal,
                    onHide: this.close,
                    employment: this.props.employment,
                    onDeleteToggle: this.props.onDeleteToggle
                },
                React.createElement(
                    Modal.Header,
                    { closeButton: true },
                    React.createElement(Modal.Title, null, i18n.remove_user_text)
                ),
                React.createElement(
                    Modal.Body,
                    null,
                    i18n.remove_text +
                        " " +
                        this.props.employment.user.first_name +
                        " " +
                        this.props.employment.user.last_name +
                        " " +
                        i18n.from_text +
                        " " +
                        this.props.employment.organisation.name +
                        "?"
                ),
                React.createElement(
                    Modal.Footer,
                    null,
                    React.createElement(Button, { onClick: this.close }, i18n.close_text),
                    React.createElement(
                        Button,
                        { onClick: this.deleteEmployment, bsStyle: "danger" },
                        i18n.remove_button_text
                    )
                )
            );
            var group = this.props.employment.group;
            if (group && group.name === "Admins" && !orgAdmin) {
                return React.createElement("span", null);
            } else {
                return (
                    React.createElement("span", null, 
                        modalButton, 
                        thisModal
                    )
                );
            }
        }
    });

    var ApproveModal = React.createClass({displayName: "ApproveModal",
        getInitialState: function() {
            return {
                showModal: false,
                showButton: false
            };
        },

        componentDidMount: function() {
            var approved = this.props.employment.is_approved;
            this.setState({
                showButton: !approved
            });
        },

        close: function() {
            this.setState({
                showModal: false
            });
        },

        open: function() {
            this.setState({
                showModal: true
            });
        },

        onApprove: function() {
            this.setState({
                showButton: false
            });
        },

        approveEmployment: function() {
            var thisModal = this;

            $.ajax({
                type: "POST",
                url: "/rest/v1/employment/" + this.props.employment.id + "/approve/?format=json",
                success: function(data) {
                    thisModal.handleApprove();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },

        handleApprove: function() {
            this.onApprove();
            this.close();
        },

        render: function() {
            var modalButton;

            if (!this.state.showButton) {
                modalButton = React.createElement("span");
            } else {
                modalButton = React.createElement(
                    Button,
                    { bsStyle: "success", bsSize: "xsmall", onClick: this.open },
                    "\u221A"
                );
            }

            var thisModal = React.createElement(
                Modal,
                {
                    show: this.state.showModal,
                    onHide: this.close
                },
                React.createElement(
                    Modal.Header,
                    { closeButton: true },
                    React.createElement(Modal.Title, null, i18n.approve_user_text)
                ),
                React.createElement(
                    Modal.Body,
                    null,
                    i18n.approve_text +
                        " " +
                        this.props.employment.user.first_name +
                        " " +
                        this.props.employment.user.last_name +
                        " " +
                        i18n.at_text +
                        " " +
                        this.props.employment.organisation.name +
                        "?"
                ),
                React.createElement(
                    Modal.Footer,
                    null,
                    React.createElement(Button, { onClick: this.close }, i18n.close_text),
                    React.createElement(
                        Button,
                        { onClick: this.approveEmployment, bsStyle: "success" },
                        i18n.approve_button_text
                    )
                )
            );

            var group = this.props.employment.group;
            if (group && group.name === "Admins" && !orgAdmin) {
                return React.createElement("span", null);
            } else {
                return (
                    React.createElement("span", null, 
                        modalButton, 
                        thisModal
                    )
                );
            }
        }
    });

    var CountryJobTitle = React.createClass({displayName: "CountryJobTitle",
        render: function() {
            var country = this.props.country;
            var job_title = this.props.job_title;
            if (country === "" && job_title === "") {
                return React.createElement("span", null, " ");
            } else {
                var text = "(";
                if (job_title !== "") {
                    text += job_title;
                }
                if (country !== "") {
                    if (job_title !== "") {
                        text += " ";
                    }
                    text += i18n.in_text + " " + country;
                }
                text += ")";
                return React.createElement("span", {className: "small"}, text, "   ");
            }
        }
    });

    var Employment = React.createClass({displayName: "Employment",
        getInitialState: function() {
            return {
                visible: true,
                error: false,
                button_title: "(" + i18n.none_text + ")",
                loading: false
            };
        },

        componentDidMount: function() {
            var group = this.props.employment.group;
            if (this.isMounted() && group !== null) {
                this.setState({
                    button_title: group.name
                });
            }
        },

        isLoading: function(boolean) {
            this.setState({
                loading: boolean
            });
        },

        onDelete: function() {
            this.setState({ visible: false });
        },

        setGroupName: function(group) {
            this.setState({
                button_title: group
            });
        },

        disableButton: function() {
            var group = this.props.employment.group;
            return this.state.loading || (group && group.name === "Admins" && !orgAdmin);
        },

        render: function() {
            var thisEmployment = this;
            var employment_id = this.props.employment.id;
            var setGroupName = this.setGroupName;
            var old_title = this.state.button_title;
            var loading = this.isLoading;

            var other_groups = this.props.employment.other_groups.map(function(group) {
                function setGroup() {
                    loading(true);
                    $.ajax({
                        type: "POST",
                        url:
                            "/rest/v1/employment/" +
                            employment_id +
                            "/set_group/" +
                            group.id +
                            "/?format=json",
                        success: function(data) {
                            setGroupName(group.name);
                            thisEmployment.setState({ error: false });
                            loading(false);
                        }.bind(this),
                        error: function(xhr, status, err) {
                            setGroupName(old_title);
                            loading(false);
                            var json_response;
                            try {
                                json_response = JSON.parse(xhr.responseText);
                            } catch (e) {
                                json_response = { error: xhr.statusText || e };
                            }
                            if (json_response.error == "Employment already exists.") {
                                thisEmployment.setState({ error: true });
                            }
                        }.bind(this)
                    });
                }

                var loadIcon;
                if (thisEmployment.state.loading) {
                    loadIcon = React.createElement("i", { className: "fa fa-spin fa-spinner" });
                } else {
                    loadIcon = React.createElement("span");
                }

                return React.createElement(
                    MenuItem,
                    {
                        eventKey: group.id,
                        key: group.id,
                        onSelect: setGroup
                    },
                    loadIcon,
                    group.name
                );
            });

            if (!this.state.visible) {
                return React.createElement("span");
            } else if (thisEmployment.state.error) {
                return React.createElement(
                    "span",
                    null,
                    React.createElement(
                        SplitButton,
                        {
                            id: employment_id,
                            title: this.state.button_title,
                            disabled: this.disableButton()
                        },
                        other_groups
                    ),
                    "  ",
                    React.createElement(DeleteModal, {
                        employment: this.props.employment,
                        onDeleteToggle: this.onDelete
                    }),
                    " ",
                    React.createElement(ApproveModal, {
                        employment: this.props.employment
                    }),
                    React.createElement("br"),
                    React.createElement(
                        "span",
                        { className: "employment-error" },
                        i18n.employment_exists
                    )
                );
            } else {
                return React.createElement(
                    "span",
                    null,
                    React.createElement(
                        SplitButton,
                        {
                            id: employment_id,
                            title: this.state.button_title,
                            disabled: this.disableButton()
                        },
                        other_groups
                    ),
                    "  ",
                    React.createElement(DeleteModal, {
                        employment: this.props.employment,
                        onDeleteToggle: this.onDelete
                    }),
                    " ",
                    React.createElement(ApproveModal, {
                        employment: this.props.employment
                    })
                );
            }
        }
    });


    var EmploymentRow = React.createClass({displayName: "EmploymentRow",
        render: function() {
            var employment = this.props.employment;
            var user = employment.user;
            var roleCell = React.createElement(Employment, {
                employment: employment,
                key: employment.id
            });
            var label;
            if (user.can_be_restricted) {
                if (user.is_restricted) {
                    label = i18n.edit_access + " (" + user.restricted_count + ")";
                } else {
                    label = i18n.restrict_access
                }
            }
            return (
                React.createElement("tr", null, 
                    React.createElement("td", null, user.email), 
                    user.first_name || user.last_name ?
                        React.createElement("td", null, user.first_name, " ", user.last_name)
                        :
                        React.createElement("td", null, i18n.user_with_id, user.id), 

                    
                    React.createElement("td", null, employment.organisation.name), 
                    user.can_be_restricted
                        ? React.createElement("td", null, 
                            React.createElement("a", {href: '/myrsr/user_projects/' + user.id + '/'}, 
                                label
                            )
                        )
                        : React.createElement("td", null), 
                    React.createElement("td", {className: "text-right"}, roleCell)
                )
            );
        }
    });

    var UserTable = React.createClass({displayName: "UserTable",
        getInitialState: function() {
            return {
                employments: []
            };
        },

        componentDidMount: function() {
            var employments = this.props.source;
            if (this.isMounted()) {
                this.setState({
                    employments: employments
                });
            }
        },

        render: function() {
            var employments_table = this.state.employments.map(function(employment) {

                return React.createElement(EmploymentRow, {
                    key: employment.id,
                    employment: employment
                });
            });

            var emailCell = React.createElement('th', null, i18n.email_text);
            var nameCell = React.createElement('th', null, i18n.name);
            var organisationCell = React.createElement('th', null, i18n.organisation);
            var projectsCell = React.createElement('th', null, i18n.project_access);
            var roleNameCell = React.createElement("th", {className: "text-right"}, i18n.role_text);

            var tableRow = React.createElement('tr', null, emailCell, nameCell, organisationCell, projectsCell, roleNameCell);
            var tableHead = React.createElement('thead', null, tableRow);
            var tableBody = React.createElement('tbody', null, employments_table);

            return React.createElement(Table, { striped: true }, tableHead, tableBody);
        }
    });

    ReactDOM.render(
        React.createElement(UserTable, { source: initial_employment_data }),
        document.getElementById("user_table")
    );

    ReactDOM.render(React.createElement(InviteModal), document.getElementById("invite_button"));
}

var loadJS = function(url, implementationCode, location) {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement("script");
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactBootstrap() {
        var reactBootstrapSrc = document.getElementById("react-bootstrap").src;
        loadJS(reactBootstrapSrc, initReact, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById("react-dom").src;
        loadJS(reactDOMSrc, loadReactBootstrap, document.body);
    }

    console.log("No React, load again.");
    var reactSrc = document.getElementById("react").src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

document.addEventListener("DOMContentLoaded", function() {
    // Initial data
    initial_employment_data = JSON.parse(
        document.getElementById("initial-employment-data").innerHTML
    );
    orgAdmin = JSON.parse(document.getElementById("org-admin").innerHTML).org_admin;
    organisation_data = JSON.parse(document.getElementById("organisation-data").innerHTML);
    roles = JSON.parse(document.getElementById("roles").innerHTML);
    i18n = JSON.parse(document.getElementById("user-management-text").innerHTML);

    // Check if React is loaded
    if (
        typeof React !== "undefined" &&
        typeof ReactDOM !== "undefined" &&
        typeof ReactBootstrap !== "undefined"
    ) {
        // Render React components
        initReact();
    } else {
        loadAndRenderReact();
    }
});
