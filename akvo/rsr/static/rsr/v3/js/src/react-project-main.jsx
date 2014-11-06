/** @jsx React.DOM */

var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;

var AccordionInstance = React.createClass({
    render: function() {
        var background, current_status, project_plan, target_group, sustainability;
        if (this.props.source.background != "") {
            background = <Panel header="Background" key={'background'}>{this.props.source.background}</Panel>;
        } else {
            background = null;
        }
        if (this.props.source.current_status != "") {
            current_status = <Panel header="Current status" key={'current_status'}>{this.props.source.current_status}</Panel>;
        } else {
            current_status = null;
        }
        if (this.props.source.project_plan != "") {
            project_plan = <Panel header="Project plan" key={'project_plan'}>{this.props.source.project_plan}</Panel>;
        } else {
            project_plan = null;
        }
        if (this.props.source.target_group != "") {
            target_group = <Panel header="Target group" key={'target_group'}>{this.props.source.target_group}</Panel>;
        } else {
            target_group = null;
        }
        if (this.props.source.sustainability != "") {
            sustainability = <Panel header="Sustainability" key={'sustainability'}>{this.props.source.sustainability}</Panel>;
        } else {
            sustainability = null;
        }

        return (
            <Accordion>
                {background}
                {current_status}
                {project_plan}
                {target_group}
                {sustainability}
            </Accordion>
            );
    }
});

var accordion_data = JSON.parse(document.getElementById("accordion-data").innerHTML);

React.renderComponent(<AccordionInstance source={accordion_data} />, document.getElementById('accordion'));
