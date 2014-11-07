/** @jsx React.DOM */

var Accordion = ReactBootstrap.Accordion;
var Carousel = ReactBootstrap.Carousel;
var CarouselItem = ReactBootstrap.CarouselItem;
var Panel = ReactBootstrap.Panel;

var AccordionInstance = React.createClass({displayName: 'AccordionInstance',
    render: function() {
        var background, current_status, project_plan, target_group, sustainability;
        if (this.props.source.background != "") {
            background = Panel( {header:"Background", key:'background'}, this.props.source.background);
        } else {
            background = null;
        }
        if (this.props.source.current_status != "") {
            current_status = Panel( {header:"Current status", key:'current_status'}, this.props.source.current_status);
        } else {
            current_status = null;
        }
        if (this.props.source.project_plan != "") {
            project_plan = Panel( {header:"Project plan", key:'project_plan'}, this.props.source.project_plan);
        } else {
            project_plan = null;
        }
        if (this.props.source.target_group != "") {
            target_group = Panel( {header:"Target group", key:'target_group'}, this.props.source.target_group);
        } else {
            target_group = null;
        }
        if (this.props.source.sustainability != "") {
            sustainability = Panel( {header:"Sustainability", key:'sustainability'}, this.props.source.sustainability);
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
                React.DOM.img( {width:"100%", height:400, src:photo.url} ),
                React.DOM.div( {className:"carousel-caption"}, 
                    React.DOM.h3(null, photo.caption),
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

var accordion_data = JSON.parse(document.getElementById("accordion-data").innerHTML);
var carousel_data = JSON.parse(document.getElementById("carousel-data").innerHTML);

React.renderComponent(AccordionInstance( {source:accordion_data} ), document.getElementById('accordion'));
React.renderComponent(CarouselInstance( {source:carousel_data} ), document.getElementById('carousel'));
