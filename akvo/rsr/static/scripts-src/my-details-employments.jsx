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



ResponseModal = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <Modal title={this.props.title}>
        <div className="modal-body">{this.props.response}</div>
        <div className="modal-footer">
          <Button onClick={this.props.onRequestHide}>Close</Button>
        </div>
      </Modal>
    );
  }
});


Employment = React.createClass({
  getInitialState: function() {
    return {visible: true };
  },

  render: function() {
    if ( !this.state.visible ) {
      return (
        <li></li>
      );
    }

    if ( this.props.employment.is_approved ) {
      return (
        <li>{this.props.employment.organisation_full.name}</li>
      );
    } else {
      return (
        <li>{this.props.employment.organisation_full.name} <i>(Not approved)</i></li>
      );
    }
  }

});


EmploymentList = React.createClass({

  render: function() {
    var employments = this.props.employments.map(function(job) {
      return <Employment key={job.organisation_full.id} employment={job} />;
    });

    return (
      <ul>{employments}</ul>
    );
  }
});

OrganisationInput = React.createClass({

  render: function() {
    return (
      <Input type="text" placeholder={i18n.organisation_text} id="organisationInput" />
    );
  }
});


CountryInput = React.createClass({
  render: function() {
    return (
      <Input type="text" placeholder={i18n.country_text} id="countriesInput" />
    );
  }
});


JobTitleInput = React.createClass({
  render: function() {
    return (
      <Input type="text" placeholder={i18n.job_title_text} id="jobtitleInput" />
    );
  }
});


AddEmploymentForm = React.createClass({

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
      response: i18n.linking_user_text
    });
    $.ajax({
      type: "POST",
      url: this.props.link + "?format=json",
      data : JSON.stringify( data ),
      contentType : 'application/json; charset=UTF-8',
      success: function(response) {
        this.handleAddEmployment(response);
        this.setState({
          title: i18n.request_successful_text,
          response: i18n.request_pending_text
        });
      }.bind(this),
      error: function(xhr, status, err) {
        if (xhr.status == 409) {
          this.setState({
            title: i18n.request_failed_text,
            response: i18n.already_connected_text
          });
        } else {
          this.setState({
            title: i18n.request_failed_text,
            response: i18n.not_connected_text
          });
        }
      }.bind(this)
    });
  },

  getCountryByName: function( serializedData ) {
    this.setState({
      response: i18n.retrieve_country_text
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
      response: i18n.retrieve_organisation_text
    });
    var name = $('#organisationInput').val();
    $.get(this.props.org_link + "?format=json&name=" + name, function( data ) {
      if (data.count == 1) {
        serializedData.organisation = data.results[0].id;
        this.getCountryByName( serializedData );
      } else if (data.count > 1) {
        this.setState({
          title: i18n.request_failed_text,
          response: i18n.multiple_organisations_text +
              " \"" + name + "\". " + i18n.send_mail_text
        });
      } else {
        this.setState({
          title: i18n.request_failed_text,
          response: i18n.no_organisation_text + " \"" + name + "\"."
        });
      }
    }.bind(this))
      .fail(function() {
        this.setState({
          title: i18n.request_failed_text,
          response: i18n.no_organisation_text + " \"" + name + "\"."
        });
      }.bind(this)
           );
  },

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
        title: i18n.sending_request_text,
        response: i18n.waiting_text
      }
    );

    this.getOrgByName(this.getFormData());
  },

  render: function() {
    return (
      <span>
      <h4>{i18n.connect_employer_text}</h4>
      <form>
      <OrganisationInput ref="organisationInput" />
      <CountryInput ref="countryInput" />
      <JobTitleInput ref="jobtitleInput" />
      <ModalTrigger modal={<ResponseModal title={this.state.title} response={this.state.response} />}>
      <Button onClick={this.addEmployment} bsStyle='primary'>{i18n.request_join_text}</Button>
      </ModalTrigger>
      </form>
      </span>
    );
  }

});


EmploymentApp = React.createClass({

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
      <span>
      <h3><i className="fa fa-users"></i> {i18n.my_organisations_text}</h3>
      <EmploymentList employments={this.state.employments} />

      <AddEmploymentForm
      link={this.props.link}
      org_link={this.props.org_link}
      country_link={this.props.country_link}
      addEmployment={this.addEmployment}
      />
      </span>
    );
  }

});


// Initial data (via JSON from backend)
initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
request_link = JSON.parse(document.getElementById("user-request-link").innerHTML);
i18n = JSON.parse(document.getElementById("my-details-text").innerHTML);


React.renderComponent(
  <EmploymentApp employments={initial_data.user.employments}
  link={request_link.link}
  org_link={request_link.org_rest_link}
  country_link={request_link.country_rest_link}
  />,
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
