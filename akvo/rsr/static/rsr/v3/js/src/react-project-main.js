/** @jsx React.DOM */

var Accordion = ReactBootstrap.Accordion;
var Carousel = ReactBootstrap.Carousel;
var CarouselItem = ReactBootstrap.CarouselItem;
var Panel = ReactBootstrap.Panel;

var AccordionInstance = React.createClass({displayName: 'AccordionInstance',
    render: function() {
        var background, current_status, project_plan, target_group, sustainability;
        if (this.props.source.background != "") {
            background = Panel( {className:"background", header:"Background", key:'background'}, this.props.source.background);
        } else {
            background = null;
        }
        if (this.props.source.current_status != "") {
            current_status = Panel(  {className:"current_status", header:"Current situation", key:'current_status'}, this.props.source.current_status);
        } else {
            current_status = null;
        }
        if (this.props.source.project_plan != "") {
            project_plan = Panel(  {className:"project_plan", header:"Project plan", key:'project_plan'}, this.props.source.project_plan);
        } else {
            project_plan = null;
        }
        if (this.props.source.target_group != "") {
            target_group = Panel(  {className:"target_group", header:"Target group", key:'target_group'}, this.props.source.target_group);
        } else {
            target_group = null;
        }
        if (this.props.source.sustainability != "") {
            sustainability = Panel(  {className:"sustainability", header:"Sustainability", key:'sustainability'}, this.props.source.sustainability);
        } else {
            sustainability = null;
        }

        return (
            Accordion(null, 
                background,
                current_status,
                project_plan,
                target_group,
                sustainability
            )
            );
    }
});

var CarouselInstance = React.createClass({displayName: 'CarouselInstance',
    render: function() {
        var photos = this.props.source.photos.map(function(photo) {
          return (
            CarouselItem(null, 
                React.DOM.a( {href:photo.original_url, target:"_blank"}, React.DOM.img( {src:photo.url} )),
                React.DOM.div( {className:"carousel-caption"}, 
                    React.DOM.h4(null, photo.caption),
                    React.DOM.p(null, photo.credit)
                )
            )
          );
        });
        return (
            Carousel(null, 
                photos
            )
            );
    }
});

React.renderComponent(
    AccordionInstance( {source:JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)} ),
    document.getElementById('accordion'));
React.renderComponent(
    CarouselInstance( {source:JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)} ),
    document.getElementById('carousel'));
