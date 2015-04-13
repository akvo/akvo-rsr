/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


var AddEmploymentForm,
    Button = ReactBootstrap.Button,
    CountryInput,
    Employment,
    EmploymentApp,
    EmploymentList,
    Input = ReactBootstrap.Input,
    JobTitleInput,
    Modal = ReactBootstrap.Modal,
    ModalTrigger = ReactBootstrap.ModalTrigger,
    OrganisationInput,
    ResponseModal,
    initial_data,
    request_link;



ResponseModal = React.createClass({displayName: 'ResponseModal',
  render: function () {
    return this.transferPropsTo(
      Modal( {title:this.props.title}, 
        React.DOM.div( {className:"modal-body"}, this.props.response),
        React.DOM.div( {className:"modal-footer"}, 
          Button( {onClick:this.props.onRequestHide}, "Close")
        )
      )
    );
  }
});


Employment = React.createClass({displayName: 'Employment',
  getInitialState: function() {
    return {visible: true };
  },

  render: function() {
    if ( !this.state.visible ) {
      return (
        React.DOM.li(null)
      );
    }

    if ( this.props.employment.is_approved ) {
      return (
        React.DOM.li(null, this.props.employment.organisation_full.name)
      );
    } else {
      return (
        React.DOM.li(null, this.props.employment.organisation_full.name, " ", React.DOM.i(null, "(Not approved)"))
      );
    }
  }

});


EmploymentList = React.createClass({displayName: 'EmploymentList',

  render: function() {
    var employments = this.props.employments.map(function(job) {
      return Employment( {key:job.organisation_full.id, employment:job} );
    });

    return (
      React.DOM.ul(null, employments)
    );
  }
});

OrganisationInput = React.createClass({displayName: 'OrganisationInput',

  render: function() {
    return (
      Input( {type:"text", placeholder:"Organisation", id:"organisationInput"} )
    );
  }
});


CountryInput = React.createClass({displayName: 'CountryInput',
  render: function() {
    return (
      Input( {type:"text", placeholder:"Country (optional)", id:"countriesInput"} )
    );
  }
});


JobTitleInput = React.createClass({displayName: 'JobTitleInput',
  render: function() {
    return (
      Input( {type:"text", placeholder:"Job title (optional)", id:"jobtitleInput"} )
    );
  }
});


AddEmploymentForm = React.createClass({displayName: 'AddEmploymentForm',

  getInitialState: function() {
    return {
      title: '',
      response: ''
    };
  },

  handleAddEmployment: function(employment) {
    this.props.addEmployment(employment);
  },

  postEmployment: function( data ) {
    this.setState({
      response: "Linking user to organisation..."
    });
    $.ajax({
      type: "POST",
      url: this.props.link + "?format=json",
      data : JSON.stringify( data ),
      contentType : 'application/json; charset=UTF-8',
      success: function(response) {
        this.handleAddEmployment(response);
        this.setState({
          title: "Request successful",
          response: "Your request is now pending and will have to be approved."
        });
      }.bind(this),
      error: function(xhr, status, err) {
        if (xhr.status == 409) {
          this.setState({
            title: "Request failed",
            response: "You are already connected to this organisation. Only one connection per organisation is allowed."
          });
        } else {
          this.setState({
            title: "Request failed",
            response: "Request failed, could not connect to organisation."
          });
        }
      }.bind(this)
    });
  },

  getCountryByName: function( serializedData ) {
    this.setState({
      response: "Retrieving country information..."
    });
    var name = $('#countriesInput').val();
    $.get(this.props.country_link + "?format=json&name=" + name, function( data ) {
      if (data.count == 1) {
        serializedData.country = data.results[0].id;
      }
      this.postEmployment( serializedData );
    }.bind(this))
      .fail(function() {
        this.postEmployment( serializedData );
      }.bind(this)
           );
  },

  getOrgByName: function( serializedData ) {
    this.setState({
      response: "Retrieving organisation information..."
    });
    var name = $('#organisationInput').val();
    $.get(this.props.org_link + "?format=json&name=" + name, function( data ) {
      if (data.count == 1) {
        serializedData.organisation = data.results[0].id;
        this.getCountryByName( serializedData );
      } else if (data.count > 1) {
        this.setState({
          title: "Request failed",
          response: "Request failed, multiple organisations named \"" + name + "\" found. " +
            "Please send a mail to support@akvo.org to get this resolved."
        });
      } else {
        this.setState({
          title: "Request failed",
          response: "Request failed, could not find organisation \"" + name + "\"."
        });
      }
    }.bind(this))
      .fail(function() {
        this.setState({
          title: "Request failed",
          response: "Request failed, could not find organisation \"" + name + "\"."
        });
      }.bind(this)
           );
  },

  // getOrgByName: function( serializedData ) {
  //   var name,  ajaxUrl, request;
  //   this.setState({
  //     response: "Retrieving organisation information..."
  //   });
  //   // name = document.getElementById('organisationInput').val();
  //   name = $('#organisationInput').val();
  //   ajaxUrl = this.props.org_link + "asdf" + '?format=json&name=' + name;

  //   function ajaxError(e, that) {
  //     console.log(e);
  //     console.log(that);
  //     that.setState({
  //       title: e.title,
  //       response: e.response
  //     });
  //   }

  //   $.get(ajaxUrl).done(function(data) {
  //     var errorResponse;
  //     console.log('Done');
  //     if (data.count == 1) {
  //       console.log('Got one org!');
  //     } else if ( data.count > 1 ) {
  //       errorResponse = 'Request failed, multiple organisations named "' +
  //         name + '" found. ' +
  //         'Please send a mail to support@akvo.org to get this resolved.';
  //       ajaxUrl({
  //         response: errorResponse,
  //         title: 'Request failed'
  //       });
  //     }
  //   }).fail(function() {
  //     console.log('Fail');
  //     ajaxError({
  //       response: 'No response from server.',
  //       title: 'Request failed'
  //     }, thi);
  //   });

  //   // request = $.get(ajaxUrl, function (data) { ... });

  //   // request = $.get(ajaxUrl, function(data) {
  //   //   if (data.count == 1) {
  //   //     console.log('Request success');
  //   //   } else {
  //   //     console.log('Count not one.');
  //   //     throw new Error('Count not one');
  //   //   }
  //   // }).fail(function (e) {
  //   //   console.log('Request failed' + e);
  //   //   this.setState({
  //   //     title: "Request failed",
  //   //     response: "Request failed, cound not..."
  //   //   });
  //   // });



  getFormData: function() {
    return {
      organisation: $('#organisationInput').attr('value_id'),
      country: $('#countriesInput').attr('value_id'),
      job_title: $('#jobtitleInput').val()
    };
  },


  addEmployment: function() {
    this.setState(
      {
        title: 'Sending request',
        response: 'Waiting...'
      }
    );

    this.getOrgByName(this.getFormData());
  },

  render: function() {
    return (
      React.DOM.span(null, 
      React.DOM.h4(null, "Connect with your employer"),
      React.DOM.form(null, 
      OrganisationInput( {ref:"organisationInput"} ),
      CountryInput( {ref:"countryInput"} ),
      JobTitleInput( {ref:"jobtitleInput"} ),
      ModalTrigger( {modal:ResponseModal( {title:this.state.title, response:this.state.response} )}, 
      Button( {onClick:this.addEmployment, bsStyle:"primary"}, "Request to join")
      )
      )
      )
    );
  }

});


EmploymentApp = React.createClass({displayName: 'EmploymentApp',

  getInitialState: function() {
    return {employments: []};
  },

  componentDidMount: function() {
    if (this.isMounted()) {
      this.setState(
        {employments: this.props.employments}
      );
    }
  },

  addEmployment: function(employment) {
    this.setState(
      {employments: this.state.employments.concat([employment])}
    );
  },

  render: function() {
    return (
      React.DOM.span(null, 
      React.DOM.h3(null, React.DOM.i( {className:"fa fa-users"}), " My organisations"),
      EmploymentList( {employments:this.state.employments} ),

      AddEmploymentForm(
      {link:this.props.link,
      org_link:this.props.org_link,
      country_link:this.props.country_link,
      addEmployment:this.addEmployment}
      )
      )
    );
  }

});


// Initial data (via JSON from backend)
initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
request_link = JSON.parse(
  document.getElementById("user-request-link").innerHTML);


React.renderComponent(
  EmploymentApp( {employments:initial_data.user.employments,
  link:request_link.link,
  org_link:request_link.org_rest_link,
  country_link:request_link.country_rest_link} ),
  document.getElementById('organisations')
);


// Jquery dependent code
$(function() {

  // Typeahead
  var organisations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/typeaheads/organisations?format=json',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfOrganisations,
      filter: function(response) {
        return response.results;
      }
    }
  });

  var countries  = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/typeaheads/countries?format=json',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfCountries,
      filter: function(response) {
        return response.results;
      }
    }
  });

  organisations.initialize();
  countries.initialize();

  $('#organisationInput').typeahead(
    {
      highlight: true
    },
    {
      name: 'organisations',
      displayKey: 'name',
      source: organisations.ttAdapter()
    });

  $('#countriesInput').typeahead(
    {
      highlight: true
    },
    {
      name: 'countries',
      displayKey: 'name',
      source: countries.ttAdapter()
    });

});
