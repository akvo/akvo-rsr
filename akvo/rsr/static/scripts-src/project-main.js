/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Accordion = ReactBootstrap.Accordion,
    AccordionInstance,
    Carousel = ReactBootstrap.Carousel,
    CarouselInstance,
    CarouselItem = ReactBootstrap.CarouselItem,
    Panel = ReactBootstrap.Panel,
    i18n;

Indicator = React.createClass({displayName: 'Indicator',
  render: function () {
    var period_start = this.props.indicator.period_start;
    var period_end = this.props.indicator.period_end;
    var periods;
    if (period_start !== undefined) {
        if (period_end !== undefined) {
            periods = "(" + period_start + " - " + period_end + ")";
        } else {
            periods = "(" + period_start + " - " + i18n.end_date_unknown_text + ")";
        }
    } else if (period_end !== undefined) {
        periods = "(" + i18n.start_date_unknown_text + " - " + period_end + ")";
    } else {
        periods = "";
    }

    var target_value = this.props.indicator.target_value;
    var actual_value = this.props.indicator.actual_value;
    var value = "";
    if (actual_value !== "") {
        value += actual_value + " (" + i18n.actual_text + ")";
        if (target_value !== "") {
            value += " / ";
        }
    }
    if (target_value !== "") {
        value += target_value + " (" + i18n.target_text + ")";
    }

    return (
      React.DOM.div(null, 
        React.DOM.dt(null, 
            this.props.indicator.title, " ", periods
        ),
        React.DOM.dd(null, 
            value
        )
      )
    );
  }
});

Result = React.createClass({displayName: 'Result',
  render: function () {
    var indicators = this.props.result.indicators.map(function(indicator) {
      return (
        Indicator( {key:indicator.id, indicator:indicator} )
      );
    });
    return (
      React.DOM.span(null, 
        React.DOM.li(null, React.DOM.i( {className:"fa fa-check"}), " ", this.props.result.title),
        React.DOM.dl( {className:"indicators"}, indicators)
      )
    );
  }
});

ResultList = React.createClass({displayName: 'ResultList',
  render: function () {
    var results = this.props.results.map(function(result) {
      return (
        Result( {key:result.id, result:result} )
      );
    });
    return (
      React.DOM.ul( {className:"results list-unstyled"}, results)
    );
  }
});


AccordionInstance = React.createClass({displayName: 'AccordionInstance',

  splitLines: function(text) {
    var i = 0;
    var lines = text.match(/[^\r\n]+/g).map(function(line) {
      i = i + 1;
      return (
          React.DOM.p( {key:i}, line)
      );
    });
    return lines;
  },

  getIndicators: function(indicators) {
      var i = 0;
      var result_list = indicators.map(function(indicator) {
          i = i + 1;
          return (
              React.DOM.dl( {className:"indicators"}, 
                  React.DOM.dt(null, 
                      React.DOM.i( {className:"fa fa-check"}), " ", result.title
                  ),
                  React.DOM.dd(null)
              )
          );
      });
      return result_list;
  },

  getResults: function(results) {
      var i = 0;
      var result_list = results.map(function(result) {
          i = i + 1;
          return (
              React.DOM.dl( {className:"results"}, 
                  React.DOM.dt(null, 
                      React.DOM.i( {className:"fa fa-check"}), " ", result.title
                  ),
                  React.DOM.dd(null),
                    this.getIndicators(result.indicators)
              )
          );
      });
      return result_list;
  },

  render: function() {
    var background = this.props.source.background || null,
        current_status = this.props.source.current_status || null,
        goals_overview = this.props.source.goals_overview || null,
        project_plan = this.props.source.project_plan || null,
        sustainability = this.props.source.sustainability || null,
        target_group = this.props.source.target_group || null,
        results = this.props.source.results || null,
        panel_id = 0;

    if (background !== null) {
      background = Panel( {key:panel_id++, className:"background", header:i18n.background_text, eventKey:'background'}, 
        this.splitLines(background)
      );
    }

    if (current_status !== null) {
      current_status = Panel( {key:panel_id++, className:"current_status", header:i18n.current_situation_text, eventKey:'current_status'}, 
        this.splitLines(current_status)
      );
    }

    if (goals_overview !== null) {
      goals_overview = Panel( {key:panel_id++, className:"goals_overview", header:i18n.goals_overview_text, eventKey:'goals_overview'}, 
        this.splitLines(goals_overview)
      );
    }

    if (project_plan !== null) {
      project_plan = Panel( {key:panel_id++, className:"project_plan", header:i18n.project_plan_text, eventKey:'project_plan'}, 
        this.splitLines(project_plan)
      );
    }

    if (sustainability !== null) {
      sustainability = Panel( {key:panel_id++, className:"sustainability", header:i18n.sustainability_text, eventKey:'sustainability'}, 
        this.splitLines(sustainability)
      );
    }

    if (target_group !== null) {
      target_group = Panel( {key:panel_id++, className:"target_group", header:i18n.target_group_text, eventKey:'target_group'}, 
        this.splitLines(target_group)
      );
    }

    if (results !== null) {
      results = Panel( {key:panel_id++, className:"result", header:i18n.results_text, eventKey:'results'}, 
        ResultList( {key:0, results:results} )
      );
    }

    return (
        Accordion(null, 
        background,
        current_status,
        project_plan,
        target_group,
        sustainability,
        goals_overview,
        results
      )
    );
  }
});

CarouselInstance = React.createClass({displayName: 'CarouselInstance',
  render: function() {
    var photos = this.props.source.photos.map(function(photo) {
      return (
          CarouselItem( {key:photo.url} , 
          React.DOM.a( {target:"_blank", href:photo.direct_to_url}, React.DOM.img( {src:photo.url} )),
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

// Initial data
i18n = JSON.parse(document.getElementById("project-main-text").innerHTML);

React.renderComponent(
    AccordionInstance( {source:JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)} ),
    document.getElementById('accordion'));
React.renderComponent(
    CarouselInstance( {source:JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)} ),
    document.getElementById('carousel'));

// Open the first accordion item on load
var firstAccordionChild = document.querySelector('#accordion div.panel-group div:first-child div a');
if (firstAccordionChild !== null) {
    firstAccordionChild.click();
}


///////// RESULTS FRAMEWORK /////////

  // Default values
  var defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);
  var currentDate = defaultValues.current_datetime;

  /* Set the click listeners that expand or hide the full
  ** "Results" entries in the sidebar.
  */
  function setResultExpandOnClicks() {
    var els = document.querySelectorAll('.sidebar .result-expand');
    var el = null;
    var resultID = null;

    for (var i = 0; i < els.length; i++) {
      el = els[i];

      el.addEventListener('click', function() {
        if (!this.parentNode.classList.contains('expanded')) {
          // Expand this result!

          // Collapse any expanded results in the sidebar
          removeClassFromAll('.result-nav', 'expanded');

          // Expand this result in the sidebar
          this.parentNode.classList.add('expanded');

          // Hide all indicators in the main panel
          hideAll('.indicator');

          // Expand the appropriate result in the main panel
          resultID = this.getAttribute('data-result-id');
          showResultsSummary(resultID);
        } else {

          // Collapse all result entries in the sidebar
          removeClassFromAll('.result-nav', 'expanded');

          // Hide all result summaries in the main panel
          hideAllResultsSummaries();

          // Hide all indicators in the main panel
          hideAll('.indicator-group, .indicator');

          // Remove the "active" status of any indicators in main panel
          removeClassFromAll('.indicator-nav.active', 'active');
        }
      });
    }
  }

  /* Show the results summary in the main panel when the
  ** appropriate side bar link is activated.
  */
  function showResultsSummary(id) {
    var selector = '.result-' + id + '.result-summary';
    var resultSummary = document.querySelector(selector);

    hideAllResultsSummaries();
    resultSummary.style.display = 'initial';
  }

  /* Hide all results summaries. */
  function hideAllResultsSummaries() {
    hideAll('.result-summary');
  }

  /* Set the listeners to show the appropriate indicator in
  ** the main panel when the sidebar link is clicked.
  */
  function setIndicatorLinkOnClicks() {
    var els = document.querySelectorAll('.indicator-nav, .indicator-link');

    for (var i = 0; i < els.length; i++) {
      el = els[i];

      el.addEventListener('click', function() {

        /* Hide all the indicator and result summary elements */
        hideAll('.indicator-group, .indicator');
        hideAllResultsSummaries();

        /* Now show the indicator group and indicator that
        ** matches the element that's been clicked.
        */
        var indicatorID = this.getAttribute('data-indicator-id');
        var indicatorSelector = '.indicator-' + indicatorID;
        var indicatorGroupSelector = '.indicator-group.result-' + this.getAttribute('data-result-id');

        document.querySelector(indicatorGroupSelector).style.display = 'block';
        document.querySelector(indicatorSelector).style.display = 'block';

        /* Add an "active" class to this indicator in the sidebar for styling purposes */
        removeClassFromAll('.indicator-nav.active', 'active');
        document.querySelector('.indicator-nav[data-indicator-id="' + indicatorID + '"').classList.add('active');

      });
    }
  }
  /* Set the onClicks to expand a given indicator period and show the "Add update" dialog */
  function setExpandIndicatorPeriodOnClicks() {
    var els = document.querySelectorAll('.expand-indicator-period');
    var el = null;

    for (var i = 0; i < els.length; i++) {
      el = els[i];

      el.addEventListener('click', function() {
        var parentElement, periodId, periodNode;

        periodNode = this.closest('tbody');
        periodId = periodNode.getAttribute('period-id');
        parentElement = document.querySelector('.indicator-period-' + periodId + '-tr');

        if (this.classList.contains('expanded')) {
          /* This is period already expanded. Collapse it and remove all update dialogs. */
          removeFromPeriod(periodId, 'tr.update-dialog-container');
          displayAddButton(periodId, false);
          removeClassFromAll('tr.expanded, .expand-indicator-period.expanded', 'expanded', periodId);
          /* Remove the 'add' update in the store, in case the 'add Update' button was clicked */
          removeUpdatefromStore(periodId, 'add');
        } else {
          var container;

          displayAddButton(periodId, true);
          parentElement.parentNode.appendChild(getUpdateDialog(periodId));

          this.parentNode.parentNode.classList.add('expanded');
          this.classList.add('expanded');

          addEditOnClicks();
          addDeleteOnClicks();
        }
      });
    }
  }

  function addAddOnClicks() {
    var els = document.querySelectorAll('.add-button');

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.addEventListener('click', function() {
        var addUpdateContainer, container, containerCell, newUpdate, periodId, periodNode, periodTarget;

        periodNode = this.closest('tbody');
        periodId = periodNode.getAttribute('period-id');
        periodTarget = periodNode.getAttribute('period-target');

        newUpdate = {
          id: 'add',
          indicator_period: {
            id: periodId,
            target_value: periodTarget
          },
          period_update: "0",
          created_at: currentDate,
          user: {
            id: defaultValues.user_id,
            first_name: defaultValues.user_first_name,
            last_name: defaultValues.user_last_name
          },
          text: '',
          photo: ''
        };
        addUpdateToStore(newUpdate);

        container = document.createElement('tr');
        container.classList.add('update-dialog-container');

        containerCell = document.createElement('td');
        containerCell.setAttribute('colspan', '6');

        addUpdateContainer = getUpdateEntry(newUpdate);
        containerCell.appendChild(addUpdateContainer);
        container.appendChild(containerCell);

        if (this.parentNode.parentNode.nextSibling) {
          this.parentNode.parentNode.parentNode.insertBefore(container, this.parentNode.parentNode.nextSibling);
        } else {
          this.parentNode.parentNode.parentNode.appendChild(container);
        }
        addEditOnClicks();
        addDeleteOnClicks();
        container.querySelector('.edit-button').click();
        displayAddButton(periodId, false);
      });
    }
  }

  function savingPeriod(periodNode, saving) {
    var saveMessageContainer = periodNode.querySelector('.add-new-update-container');
    var saveMessageNode;
    if (saving) {
      saveMessageNode = document.createElement('div');
      saveMessageNode.classList.add('save-message');
      saveMessageNode.innerHTML = 'Saving...';
      saveMessageContainer.appendChild(saveMessageNode);
    } else {
      saveMessageNode = saveMessageContainer.querySelector('.save-message');
      if (saveMessageNode !== null) {
        saveMessageNode.parentNode.removeChild(saveMessageNode);
      }
    }
  }

  function savingPeriodError(periodNode, message) {
    var saveMessageContainer = periodNode.querySelector('.add-new-update-container');
    var saveMessageNode = saveMessageContainer.querySelector('.save-message');
    if (saveMessageNode !== null) {
      saveMessageNode = document.createElement('div');
      saveMessageNode.classList.add('save-message');
      saveMessageContainer.appendChild(saveMessageNode);
    }
    saveMessageNode.innerHTML = message;

    setInterval(function () {
      saveMessageNode.parentNode.removeChild(saveMessageNode);
    }, 10000);
  }

  function addSaveOnClicks() {
    var els = document.querySelectorAll('.save-button');

    for (var i = 0; i < els.length; i++) {
      var el = els[i];

      el.addEventListener('click', function() {
        var actualValue, description, periodId, periodNode, photo, photoNode, newValue, updateContainer, updateId, value;
        var exceedTargetNode, exceedCheckbox, exceedValueNode;

        updateContainer = this.parentNode;
        updateId = updateContainer.getAttribute('update-id');
        periodNode = this.closest('tbody');

        exceedTargetNode = updateContainer.querySelector('.update-exceed-target');
        exceedCheckbox = exceedTargetNode.querySelector('.update-exceed-target-checkbox');
        exceedValueNode = exceedTargetNode.querySelector('.exceed-value');

        // When checkbox is checked, use the exceeding value
        if (exceedCheckbox.checked) {
          newValue = parseInt(exceedValueNode.value);
        } else {
          newValue = parseInt(updateContainer.querySelector('.update-dialog-timeline-marker:first-child').getAttribute('data-value'));
        }

        if (updateId !== 'add') {
          actualValue = parseInt(updateContainer.getAttribute('current-actual'));
          value = newValue - actualValue + parseInt(updateContainer.getAttribute('current-change'));
        } else {
          actualValue = parseInt(periodNode.getAttribute('period-actual'));
          value = newValue - actualValue;
        }

        description = updateContainer.querySelector('.update-description').innerText;

        photoNode = updateContainer.querySelector('.photo-upload');
        if (photoNode !== null) {
          photo = photoNode.files.length > 0 ? photoNode.files[0] : undefined;
        }
        periodId = parseInt(this.closest('tbody').getAttribute('period-id'));
        updateId === 'add' ? addNewUpdate(description, periodId, value, photo) : editUpdate(updateId, periodId, description, value, updateContainer.getAttribute('current-change'), photo);
      });
    }
  }

  function addDeleteOnClicks() {
      var els = document.querySelectorAll('.delete-button');

      for (var i = 0; i < els.length; i++) {
          var el = els[i];

          el.addEventListener('click', function () {
            var api_url, deleteConfirmContainer, deleteConfirmYes, deleteConfirmNo, periodId, periodNode, request, requestData, updateNode, updateChange, updateId;

            updateNode = this.closest('.update-entry-container');
            updateChange = parseInt(updateNode.getAttribute('current-change'));
            updateId = updateNode.getAttribute('update-id');
            periodNode = updateNode.closest('tbody');
            periodId = periodNode.getAttribute('period-id');

            // Show confirmation dialog
            deleteConfirmContainer = updateNode.querySelector('.delete-confirm');

            // Add a class to update-name so we can set a margin on it to make room
            // for the delete confirmation dialog.
            updateNode.querySelector('.update-name').classList.add('delete-pending');
            deleteConfirmContainer.style.display="block";

            deleteConfirmNo = updateNode.querySelector('.delete-confirm-no');
            deleteConfirmNo.removeEventListener('click');
            deleteConfirmNo.addEventListener('click', function() {

              // Cancel the delete operation
              deleteConfirmContainer.style.display='none';
              updateNode.querySelector('.update-name').classList.remove('delete-pending');
            });

            deleteConfirmYes = updateNode.querySelector('.delete-confirm-yes');
            deleteConfirmYes.removeEventListener('click');
            deleteConfirmYes.addEventListener('click', function() {

              // Create request
              api_url = '/rest/v1/project_update/' + updateId + '/?format=json';
              request = new XMLHttpRequest();
              request.open('DELETE', api_url, true);
              request.setRequestHeader("X-CSRFToken", csrftoken);
              request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

              // TODO: Create recalculation function so that closing isn't necessary
              savingPeriod(periodNode, true);
              periodNode.querySelector('.expand-indicator-period').click();

              request.onload = function() {
                if (request.status === 204) {
                  // Object successfully deleted
                  removeUpdatefromStore(periodId, parseInt(updateId));
                  updateActualValue(periodId, updateChange * -1);

                  savingPeriod(periodNode, false);
                  deleteConfirmContainer.style.display='none';
                  updateNode.querySelector('.update-name').classList.remove('delete-pending');                  
                  return true;
                } else {
                  // We reached our target server, but it returned an error
                  savingPeriodError(periodNode, 'Could not delete update.');
                  return false;
                }
              };

              request.onerror = function() {
                // There was a connection error of some sort
                savingPeriodError(periodNode, 'Connection error.');
                return false;
              };

              request.send(JSON.stringify(requestData));              
            });
          });
      }
  }

  function addEditOnClicks() {
    var els = document.querySelectorAll('.edit-button');

    for (var i = 0; i < els.length; i++) {
      var el = els[i];

      el.addEventListener('click', function() {
        var updateContainer = this.parentNode;
        var updateId = updateContainer.getAttribute('update-id');
        var periodNode = this.closest('tbody');
        var periodId = periodNode.getAttribute('period-id');
        var exceedTargetNode = updateContainer.querySelector('.update-exceed-target');
        var exceedCheckbox = exceedTargetNode.querySelector('.update-exceed-target-checkbox');
        var exceedValueNode = exceedTargetNode.querySelector('.exceed-value');
        var deleteButton = updateContainer.querySelector('.delete-button');

        if (this.classList.contains('activated')) {
          var editables = updateContainer.querySelectorAll('.editable');

          for (var j = 0; j < editables.length; j++) {
            editables[j].classList.remove('editable');
            editables[j].removeAttribute('contenteditable');
          }
          this.classList.remove('activated');
          updateContainer.querySelector('.save-button').classList.remove('active');
          updateContainer.querySelector('.cancel-button').classList.remove('active');
          updateContainer.querySelector('.edit-slider').noUiSlider.destroy();

          if (deleteButton !== null) {
            deleteButton.classList.remove('activated');
          }

          exceedCheckbox.setAttribute('disabled', '');
          exceedValueNode.setAttribute('disabled', '');

          var photoUpload = updateContainer.querySelector('.photo-upload');
          photoUpload.parentNode.removeChild(photoUpload);
        } else {
          this.classList.add('activated');
          if (deleteButton !== null) {
            deleteButton.classList.add('activated');
          }

          updateContainer.querySelector('.update-description').setAttribute('contentEditable', 'true');
          updateContainer.querySelector('.update-description').classList.add('editable');

          updateContainer.querySelector('.save-button').classList.add('active');
          updateContainer.querySelector('.cancel-button').classList.add('active');

          updateContainer.querySelector('.cancel-button').addEventListener('click', function() {
              if (updateId === 'add') {
                  updateContainer.parentNode.removeChild(updateContainer);
                  displayAddButton(periodId, true);
              } else {
                  periodNode.querySelector('.expand-indicator-period').click();
              }
          });

          var uploadPhoto = document.createElement('input');
          uploadPhoto.setAttribute('type', 'file');
          uploadPhoto.setAttribute('accept', 'image/*');
          uploadPhoto.classList.add('photo-upload');
          updateContainer.appendChild(uploadPhoto);

          var sliderEl = updateContainer.querySelector('.edit-slider');
          var startVal = updateContainer.getAttribute('current-actual');
          var minVal = parseInt(this.closest('.indicator-period').getAttribute('period-start'));
          var maxVal = parseInt(sliderEl.getAttribute('data-max'));

          noUiSlider.create(sliderEl, {
            start: startVal,
            step: 1,
            range: {
              'min': minVal,
              'max': maxVal
            }
          });

          var updateMarker = updateContainer.querySelector('.update-dialog-timeline-marker:first-child');
          var updateProgress = updateContainer.querySelector('.indicator-bar-progress-amount');
          var updateActual = updateContainer.querySelector('.update-target-actual');

          exceedCheckbox.removeAttribute('disabled');
          if (exceedCheckbox.checked) {
            exceedValueNode.removeAttribute('disabled');
            displayEditSlider(updateContainer, false);
          }

          sliderEl.noUiSlider.on('update', function(value) {
            if (exceedCheckbox.checked) {
              updateActual.textContent = exceedValueNode.value;
            } else {
              var percentage;
              value = parseInt(value);

              percentage = (value - minVal) / (maxVal - minVal) * 100;
              percentage = percentage > 100 ? 100 : percentage;

              updateMarker.style.left = percentage + '%';
              updateMarker.setAttribute('data-value', value);
              updateProgress.style.width = percentage + '%';

              updateActual.textContent = value;
            }
          });

          addSaveOnClicks();
        }
      });
    }
  }

  /* GENERAL HELPER FUNCTIONS */

  /* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  var csrftoken = getCookie('csrftoken');

  /* Time remaining to edit (needs to be in GMT) */
  function getTimeDifference(endDate) {
    var remainingDate = endDate - new Date(currentDate);

    return {
      'days': Math.floor( remainingDate/(1000*60*60*24) ),
      'hours': Math.floor( (remainingDate/(1000*60*60)) % 24 ),
      'minutes': Math.floor( (remainingDate/1000/60) % 60 )
    };
  }

  function setMinutesRemaining(node, createdAtDate) {
    var endDate = createdAtDate;
    endDate.setMinutes(endDate.getMinutes() + parseInt(defaultValues.update_timeout));

    var timeinterval = setInterval(function(){
      var remainingTime = getTimeDifference(endDate);
      node.setAttribute('title', remainingTime.minutes + ' minutes remaining');

      if (remainingTime.minutes < 0) {
        clearInterval(timeinterval);
        node.parentNode.removeChild(node);
      }
    },100);
  }

  /* Upload photo */
  function uploadPhoto(photo, updateId, periodNode) {
    var apiUrl, fileRequest, formData;

    apiUrl = '/rest/v1/project_update/' + updateId + '/upload_photo/?format=json';

      formData = new FormData();
      formData.append("photo", photo);

      fileRequest = new XMLHttpRequest();
      fileRequest.open("POST", apiUrl);
      fileRequest.setRequestHeader("X-CSRFToken", csrftoken);

      fileRequest.onload = function() {
        if (fileRequest.status >= 200 && fileRequest.status < 400) {
          addAdditionalUpdateData(updateId);
          savingPeriod(periodNode, false);
          return false;
        } else {
          // We reached our target server, but it returned an error
          savingPeriodError(periodNode, 'Uploading photo failed.');
          return false;
        }
      };

      fileRequest.onerror = function() {
        // There was a connection error of some sort
        savingPeriodError(periodNode, 'Uploading photo failed: connection error.');
        return false;
      };

      fileRequest.send(formData);
  }

  /* Add new update */
  function addNewUpdate(text, periodId, value, photo) {
    var api_url, periodNode, request, requestData;

    removeUpdatefromStore(periodId, 'add');
    periodNode = findPeriod(periodId);

    // TODO: Create recalculation function per period so that closing it isn't necessary
    savingPeriod(periodNode, true);
    periodNode.querySelector('.expand-indicator-period').click();

    // Create request
    api_url = '/rest/v1/project_update/?format=json';
    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        if (request.status === 201) {
            // Object successfully created
            var response, updateId, updateNode;
            response = JSON.parse(request.response);
            updateId = response.id;

            updateActualValue(periodId, value);
            addAdditionalUpdateData(updateId);
            // updateUpdateValues(periodId, 'add', updateId, value);

            // Upload photo
            if (photo !== undefined) {
              uploadPhoto(photo, updateId, periodNode);
            } else {
              savingPeriod(periodNode, false);
            }

            return true;
        } else {
            // We reached our target server, but it returned an error
            savingPeriodError(periodNode, 'Adding update failed.');
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        savingPeriodError(periodNode, 'Connection error.');
        return false;
    };

    requestData = {
      project: defaultValues.project_id,
      user: defaultValues.user_id,
      title: 'Indicator update',
      text: text,
      indicator_period: periodId,
      period_update: value
    };

    request.send(JSON.stringify(requestData));
  }

  /* Edit existing update */
  function editUpdate(updateId, periodId, text, value, oldValue, photo) {
    var api_url, periodNode, request;

    periodNode = findPeriod(periodId);

    // TODO: Create recalculation function per period so that closing it isn't necessary
    savingPeriod(periodNode, true);
    periodNode.querySelector('.expand-indicator-period').click();

    // Create request
    api_url = '/rest/v1/project_update/' + updateId + '/?format=json';
    request = new XMLHttpRequest();
    request.open('PATCH', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Object successfully saved
            addAdditionalUpdateData(updateId);
            updateActualValue(periodId, value - oldValue);
            // updateUpdateValues(periodId, updateId, updateId, value);

            // Upload photo
            if (photo !== undefined) {
              uploadPhoto(photo, updateId, periodNode);
            } else {
              savingPeriod(periodNode, false);
            }

            return true;
        } else {
            // We reached our target server, but it returned an error
            savingPeriodError(periodNode, 'Editing update failed.');
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        savingPeriodError(periodNode, 'Connection error.');
        return false;
    };

    request.send(JSON.stringify({text: text, period_update: value}));
  }

  /* Display the photo in the update. Either by replacing the existing photo or by adding a new photo */
  function displayPhoto(update, updateNode) {
    if (update.photo) {
      var photoNode = document.createElement('div');
      photoNode.classList.add('update-photo');
      photoNode.style['background-image'] = 'url("' + update.photo + '")';
      photoNode.style['background-size'] = 'cover';
      photoNode.style.height = '120px';
      photoNode.style.width = '200px';
      updateNode.appendChild(photoNode);
    }
  }

  /* Display the add button in the top row */
  function displayAddButton(periodId, display) {
    var addUpdateButton, canUpdate, isAdmin, periodNode;

    canUpdate = defaultValues.can_update;
    isAdmin = defaultValues.user_is_admin;
    periodNode = findPeriod(periodId);
    addUpdateButton = periodNode.querySelector('.add-button');

    addUpdateButton.style.display = display && (isAdmin || canUpdate) ? '' : 'none';
  }

  /* Display the edit slider in the update */
  function displayEditSlider(updateNode, display) {
    var editSlider = updateNode.querySelector('.edit-slider');
    editSlider.style.display = display ? '' : 'none';
  }

  /* Get additional data of update */
  function addAdditionalUpdateData(updateId) {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project_update_extra/' + updateId + '/?format=json';
    request = new XMLHttpRequest();
    request.open('GET', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Object successfully retrieved
          var response, updateNode;

          response = JSON.parse(request.response);

          addUpdateToStore(response);

          // Try to display the photo in the update node
          updateNode = findUpdate(response.indicator_period.id, response.id);
          if (updateNode !== undefined) {
            displayPhoto(response, updateNode);
          }
        } else {
          return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        return false;
    };

    request.send();
  }

  /* Update the values of a period */
  function updateActualValue(periodId, value) {
    var baseline, newPercentage, newValue, oldValue, periodNode, target;

    periodNode = findPeriod(periodId);
    target = parseInt(periodNode.getAttribute('period-target'));
    oldValue = parseInt(periodNode.getAttribute('period-actual'));
    newValue = oldValue + parseInt(value);
    baseline = parseInt(periodNode.getAttribute('period-start'));
    periodNode.setAttribute('period-actual', newValue);

    newPercentage = (newValue - baseline) / (target - baseline) * 100;
    newPercentage = newPercentage > 100 ? 100 : newPercentage;
    periodNode.querySelector('.indicator-bar-progress-amount').setAttribute('style', 'width: ' + newPercentage + '%;');
    periodNode.querySelector('.indicator-bar-progress').setAttribute('style', 'left: ' + newPercentage + '%; z-index: ' + newPercentage + ';');
    periodNode.querySelector('.indicator-bar-progress').setAttribute('data-progress', newPercentage);
    periodNode.querySelector('.indicator-bar-progress-text').textContent = newValue.toString();// > target ? target.toString() : newValue.toString();
  }

  /* Update the values of an update */
  function updateUpdateValues(periodId, oldUpdateId, newUpdateId, change) {
    var updateNode = findUpdate(periodId, oldUpdateId);
    updateNode.setAttribute('update-id', newUpdateId);
    updateNode.setAttribute('current-change', change);
    // Only works for the latest update
    updateNode.setAttribute('current-actual', findPeriod(periodId).getAttribute('period-actual'));
  }

  /* Find the period node based on its' ID */
  function findPeriod(periodId) {
    var indicatorsPeriods = document.querySelectorAll('tbody.indicator-period');
    for (var i=0; i < indicatorsPeriods.length; i++) {
      if (indicatorsPeriods[i].getAttribute('period-id') == periodId) {
        return indicatorsPeriods[i];
      }
    }
  }

  /* Find the update node based on the period ID and update ID */
  function findUpdate(periodId, updateId) {
    var periodNode = findPeriod(periodId);
    var updateNodes = periodNode.querySelectorAll('.update-entry-container');
    for (var i=0; i < updateNodes.length; i++) {
      if (updateNodes[i].getAttribute('update-id') == updateId) {
        return updateNodes[i];
      }
    }
  }

  /* User allowed to click edit button */
  function allowEdit(update) {
    if (defaultValues.user_is_admin) {
      return true;
    } else {
      var endDate = new Date(update.created_at);
      endDate.setMinutes(endDate.getMinutes() + parseInt(defaultValues.update_timeout));
      var remaining = getTimeDifference(endDate);
      var enoughTime = !!(remaining.days >= 0 && remaining.hours >= 0 && remaining.minutes >= 0);
      var userPk = defaultValues.user_id;
      return !!(enoughTime && userPk == update.user.id);
    }
  }

  /* Hide all elements for a given selector */
  function hideAll(selector) {
    var els = document.querySelectorAll(selector);

    for (var i = 0; i < els.length; i++) {
      var el = els[i];

      el.style.display = 'none';
    }
  }

  /* Remove all elements for a given selector from the DOM */
  function removeFromPeriod(periodId, selector) {
    var periodNode, els;

    periodNode = findPeriod(periodId);
    els = periodNode.querySelectorAll(selector);

    for (var i = 0; i < els.length; i++) {
      var el = els[i];

      el.parentNode.removeChild(el);
    }
  }

  /* Remove a class from all elements for a given selector */
  function removeClassFromAll(selector, className, periodId) {
    var els, periodNode;

    if (periodId === undefined) {
      els = document.querySelectorAll(selector);
    } else {
      periodNode = findPeriod(periodId);
      els = periodNode.querySelectorAll(selector);
    }

    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove(className);
    }
  }
  function addClassActive(elem) {
      // get all 'a' elements
      var a = document.getElementsByTagName('a');
      // loop through all 'a' elements
      for (i = 0; i < a.length; i++) {
          // Remove the class 'active' if it exists
          a[i].classList.remove('active');
      }
      // add 'active' classs to the element that was clicked
      elem.classList.add('active');
  }
  var updatesByIndicatorPeriod = {};

  /* Get the grab the update data from the script we use to print
  ** the template tags, then format that data into an object sorted
  ** by indicator period, to make life easier for us later.
  */

  function buildUpdateJSON() {
    var updateJSON = document.querySelector('#update-json').innerHTML;
    var updateData = JSON.parse(updateJSON);

    for (var i=0; i<updateData.length; i++) {
      var update = updateData[i];

      if (update.indicator_period) {
        addUpdateToStore(update);
      }
    }
  }

  /* This function takes an object representing an update (in the same format as the
  ** "update-data" script we use to print template tags) and adds that update to the
  ** updatesByIndicatorPeriod object.
  */
  function addUpdateToStore(update) {
    if (!updatesByIndicatorPeriod.hasOwnProperty([update.indicator_period.id])) {
      updatesByIndicatorPeriod[update.indicator_period.id] = {};
    }
    updatesByIndicatorPeriod[update.indicator_period.id][update.id] = update;
  }

  function removeUpdatefromStore(periodId, updateId) {
    if (updatesByIndicatorPeriod.hasOwnProperty([periodId])) {
      if (updatesByIndicatorPeriod[periodId].hasOwnProperty([updateId])) {
        delete updatesByIndicatorPeriod[periodId][updateId];
      }
    }
  }

  /* Returns a node representing the "Add update" dialog, ready to be injected at
  ** the appropriate point in the DOM.
  */
  function getUpdateDialog(indicatorPeriodID) {
    var container = document.createElement('tr');
    var containerCell = document.createElement('td');
    var currentUpdate = null;
    var childElements = [];
    container.classList.add('update-dialog-container');
    containerCell.setAttribute('colspan', '6');

    if (updatesByIndicatorPeriod[indicatorPeriodID]) {
      for (var updateID in updatesByIndicatorPeriod[indicatorPeriodID]) {
        if (updatesByIndicatorPeriod[indicatorPeriodID].hasOwnProperty(updateID)) {
          currentUpdate = updatesByIndicatorPeriod[indicatorPeriodID][updateID];
          childElements.push(getUpdateEntry(currentUpdate));
        }
      }

      /* Child elements will be sorted oldest-last, so work backwards to add them in
      ** the correct order.
      */
      for (var i = childElements.length - 1; i >= 0; i--) {
        containerCell.appendChild(childElements[i]);
      }
    }
    container.appendChild(containerCell);
    return container;
  }

  /* Returns a node representing a single "update" entry for the "Add update" dialog.
  ** E.G if an indicator period has 7 updates, this function should be called once
  ** for each and return the appropriate markup each time.
  */

  function getUpdateEntry(update) {
    var updateContainer = document.createElement('div');
    var deleteEl, deleteConfirmEl, deleteConfirmContentsEl, deleteConfirmYesEl, deleteConfirmNoEl, editEl, dateEl, userNameEl, timeLineEl, targetEl, targetText, photoEl, descriptionEl;

    updateContainer.setAttribute("update-id", update.id);
    updateContainer.setAttribute("current-change", update.period_update);
    updateContainer.classList.add('update-entry-container');

    if (allowEdit(update)) {
      editEl = document.createElement('i');
      editEl.classList.add('fa');
      editEl.classList.add('fa-pencil-square-o');
      editEl.classList.add('edit-button');
      editEl.classList.add('clickable');
      updateContainer.appendChild(editEl);

      if (!defaultValues.user_is_admin) {
        setMinutesRemaining(editEl, new Date(update.created_at));
      } else {
        deleteEl = document.createElement('i');
        deleteEl.classList.add('fa');
        deleteEl.classList.add('fa-trash-o');
        deleteEl.classList.add('delete-button');
        deleteEl.classList.add('clickable');
        updateContainer.appendChild(deleteEl);

        deleteConfirmEl = document.createElement('div');
        // TODO: use "delete_confirm_text" from translation strings in main template
        deleteConfirmEl.textContent = "Are you sure you want to delete this update?";
        deleteConfirmEl.style.display = 'none';
        deleteConfirmEl.classList.add('delete-confirm');

        deleteConfirmYesEl = document.createElement('a');
        deleteConfirmYesEl.classList.add('btn');
        deleteConfirmYesEl.classList.add('btn-primary');
        deleteConfirmYesEl.classList.add('delete-confirm-yes');
        // TODO: use "delete_confirm_yes_text" from translation strings in main template
        deleteConfirmYesEl.textContent = "Delete update";

        deleteConfirmNoEl = document.createElement('a');        
        deleteConfirmNoEl.classList.add('btn');
        deleteConfirmNoEl.classList.add('btn-primary');  
        deleteConfirmNoEl.classList.add('delete-confirm-no');   
        // TODO: use "delete_confirm_cancel_text" from translation strings in main template
        deleteConfirmNoEl.textContent = "Cancel";   

        deleteConfirmContentsEl = document.createElement('div');    

        deleteConfirmContentsEl.appendChild(deleteConfirmNoEl); 
        deleteConfirmContentsEl.appendChild(deleteConfirmYesEl); 
        deleteConfirmEl.appendChild(deleteConfirmContentsEl);           
        updateContainer.appendChild(deleteConfirmEl);
      }
    }

    if (update.created_at) {
      var dateObj = new Date(update.created_at);
      dateEl = document.createElement('div');
      dateEl.classList.add('update-date');
      dateEl.textContent = dateObj.toString();
      updateContainer.appendChild(dateEl);
    }
    if (update.user) {
      userNameEl = document.createElement('div');
      userNameEl.classList.add('update-name');
      userNameEl.textContent = update.user.first_name + ' ' + update.user.last_name;
      updateContainer.appendChild(userNameEl);
    }
    var exceedTargetEl = document.createElement('div');
    exceedTargetEl.classList.add('update-exceed-target');

    var exceedTargetLabel = document.createElement('label');
    exceedTargetLabel.textContent = 'Exceed target';
    exceedTargetLabel.setAttribute('for', 'exceed-' + update.id);

    var exceedTargetCheckbox = document.createElement('input');
    exceedTargetCheckbox.setAttribute('type', 'checkbox');
    exceedTargetCheckbox.setAttribute('id', 'exceed-' + update.id);
    exceedTargetCheckbox.setAttribute('disabled', '');
    exceedTargetCheckbox.classList.add('update-exceed-target-checkbox');

    var exceedTargetNewValue = document.createElement('input');
    exceedTargetNewValue.setAttribute('type', 'number');
    exceedTargetNewValue.setAttribute('disabled', '');
    exceedTargetNewValue.classList.add('exceed-value');

    exceedTargetNewValue.addEventListener('input', function () {
      if (exceedTargetCheckbox.checked) {
        updateContainer.querySelector('.update-target-actual').textContent = exceedTargetNewValue.value;
      }
    });

    exceedTargetCheckbox.addEventListener('change', function () {
      if (exceedTargetCheckbox.checked) {
        exceedTargetNewValue.removeAttribute('disabled');
        exceedTargetNewValue.value = parseInt(findPeriod(update.indicator_period.id).getAttribute('period-target'));
        displayEditSlider(updateContainer, false);
      } else {
        exceedTargetNewValue.value = '';
        exceedTargetNewValue.setAttribute('disabled', '');
        displayEditSlider(updateContainer, true);
      }
    });

    exceedTargetEl.appendChild(exceedTargetCheckbox);
    exceedTargetEl.appendChild(exceedTargetLabel);
    exceedTargetEl.appendChild(exceedTargetNewValue);
    updateContainer.appendChild(exceedTargetEl);

    timeLineEl = document.createElement('div');
    timeLineEl.classList.add('update-timeline');

    var progressContainer = document.createElement('div');
    progressContainer.classList.add('indicator-bar-display-container');
    var markerContainer = document.createElement('div');
    markerContainer.classList.add('indicator-bar-progress-container');

      var previousUpdates = [];
      /* Now we need to loop through every update with an ID lower than the id of *this* update,
      ** and store its change amount so we can build the timeline.
      */
      for (var updateID in updatesByIndicatorPeriod[update.indicator_period.id]) {
        if (updatesByIndicatorPeriod[update.indicator_period.id].hasOwnProperty(updateID)) {
          var previousUpdate = updatesByIndicatorPeriod[update.indicator_period.id][updateID];

          /* If the change amount is "None", changes this to zero */
          if (previousUpdate.period_update === 'None') {
            previousUpdate.period_update = "0";
          }

          previousUpdates.push(previousUpdate);
        }
      }

      previousUpdates.sort(function(a,b) {
          return a.id > b.id;
      });

      var actualText, highestValue, periodNode, periodValue, periodTarget, periodBaseline;

      highestValue = 0;

      periodNode = findPeriod(update.indicator_period.id);
      periodValue = parseInt(periodNode.getAttribute('period-actual'));
      periodTarget = parseInt(periodNode.getAttribute('period-target'));
      periodBaseline = parseInt(periodNode.getAttribute('period-start'));

      for (var i = previousUpdates.length - 1; i >= 0; i--) {
        var entry;

        entry = previousUpdates[i];

        if (entry.id > update.id && update.id !== 'add') {
          /* This update is *newer* than the one we're building the dialog
          ** for. We don't need to add a marker for it, but we do need to
          ** use it's "change" value to calculate the end value for the
          ** timeline for this particular update.
          */
          periodValue = periodValue - parseInt(entry.period_update);
        } else {
          /* This update is *older* (or the same) as the update we're
          ** building the dialog for. We need to make a marker for it.
          */
          if (periodValue > highestValue) {
            highestValue = periodValue;
          }
          var updateMarker = document.createElement('div');
          var textSpan = document.createElement('div');

          var percentage = (periodValue - periodBaseline) / (periodTarget - periodBaseline) * 100;
          percentage = percentage > 100 ? 100 : percentage;

          updateMarker.classList.add('update-dialog-timeline-marker');
          updateMarker.classList.add('indicator-bar-progress');
          updateMarker.style.left = percentage + '%';
          updateMarker.style['z-index'] = periodValue;


          textSpan.classList.add('indicator-bar-progress-text');
          textSpan.textContent = periodValue > periodTarget ? periodTarget : periodValue;
          textSpan.style.left = percentage + '%';

          markerContainer.appendChild(updateMarker);
          markerContainer.appendChild(textSpan);

          periodValue = periodValue - parseFloat(entry.period_update);
        }
      }
      var indicatorBar = document.createElement('div');
      indicatorBar.classList.add('indicator-bar');
      progressContainer.appendChild(indicatorBar);

      var highPercentage = (highestValue - periodBaseline) / (periodTarget - periodBaseline) * 100;
      highPercentage = highPercentage > 100 ? 100 : highPercentage;

      var indicatorBarProgressAmount = document.createElement('div');
      indicatorBarProgressAmount.classList.add('indicator-bar-progress-amount');
      indicatorBarProgressAmount.style.width = highPercentage + '%';

      progressContainer.appendChild(indicatorBarProgressAmount);
      progressContainer.appendChild(markerContainer);

      updateContainer.setAttribute("current-actual", highestValue);
      var sliderEl = document.createElement('div');
      sliderEl.classList.add('edit-slider');
      sliderEl.setAttribute('data-start', highestValue);
      sliderEl.setAttribute('data-max', periodTarget);

      progressContainer.appendChild(sliderEl);
      timeLineEl.appendChild(progressContainer);
      updateContainer.appendChild(timeLineEl);

      if (highestValue > periodTarget) {
        exceedTargetNewValue.value = highestValue;
        exceedTargetCheckbox.checked = true;
      }

      targetEl = document.createElement('div');
      targetEl.classList.add('update-target');

      actualText = document.createElement('span');
      actualText.classList.add('update-target-actual');
      actualText.textContent = highestValue;
      targetEl.appendChild(actualText);

      targetText = document.createElement('span');
      actualText.classList.add('update-target-actual');
      targetText.textContent =  ' / ' + periodTarget;
      targetEl.appendChild(targetText);
      updateContainer.appendChild(targetEl);

      descriptionEl = document.createElement('div');
      descriptionEl.classList.add('update-description');
      descriptionEl.innerHTML = update.text.replace(/\n/g,"<br>");

      updateContainer.appendChild(descriptionEl);

      displayPhoto(update, updateContainer);

      var saveEl = document.createElement('div');
      saveEl.classList.add('save-button');
      saveEl.classList.add('clickable');
      saveEl.textContent = 'Save';

      updateContainer.appendChild(saveEl);

      var cancelEl = document.createElement('div');
      cancelEl.classList.add('cancel-button');
      cancelEl.classList.add('clickable');
      cancelEl.textContent = 'Cancel';
      updateContainer.appendChild(cancelEl);

    return updateContainer;
  }

  function setCurrentDate() {
    var interval = setInterval(function(){
      var localCurrentDate = new Date(currentDate);
      localCurrentDate.setSeconds(localCurrentDate.getSeconds() + 1);
      currentDate = localCurrentDate.toString();
    }, 1000);
  }

  function showTab(tabClass) {
    var allTabs = document.querySelectorAll('.project-tab');
    var allTabLinks = document.querySelectorAll('.tab-link.selected');
    var activeTab = document.querySelector('.' + tabClass);
    var activeTabLink = document.querySelector('.tab-link[href="#' + tabClass + '"]');

    for (var i = 0; i < allTabs.length; i++) {
      var tab = allTabs[i];

      tab.style.display = 'none';
    }
    for (var j = 0; j < allTabLinks.length; j++) {
      var tabLink = allTabLinks[j];

      tabLink.classList.remove('selected');
    }

    activeTab.style.display = 'block';
    activeTabLink.classList.add('selected');
  }

  function setTabOnClicks() {
    var allTabs = document.querySelectorAll('.tab-link');

    for (var i = 0; i < allTabs.length; i++) {
      var tab = allTabs[i];

      tab.addEventListener('click', function() {
        var tabClass = this.getAttribute('href');

        // Remove the '#' from the href
        tabClass = tabClass.substring(1);
        showTab(tabClass);
      });
    }
  }

  function readTabFromFragment() {
    var fragment = window.location.hash;
    var parameters = window.location.search;

    if (fragment || parameters.indexOf('?page') > -1) {
      if (parameters.indexOf('?page') > -1) {
        // KB: Hack, only the updates tab has a 'page' parameter
        fragment = 'updates';
      } else {
        // Remove the '#' from the fragment
        fragment = fragment.substring(1);
      }

      if (fragment === 'summary' || fragment === 'report' || fragment === 'finance') {
          showTab(fragment);
      } else if (fragment === 'partners' && defaultValues.show_partners_tab) {
          showTab(fragment);
      } else if (fragment === 'results' && defaultValues.show_results_tab) {
          showTab(fragment);
      } else if (fragment === 'updates' && defaultValues.show_updates_tab) {
          showTab(fragment);
      } else {
        showTab('summary');
      }
    } else {
      showTab('summary');
    }
  }

  /* Initialise page */
  document.addEventListener('DOMContentLoaded', function() {
    setCurrentDate();

    // Setup project tabs
    setTabOnClicks();
    readTabFromFragment();

    // Setup results framework
    setResultExpandOnClicks();
    setIndicatorLinkOnClicks();
    setExpandIndicatorPeriodOnClicks();
    addAddOnClicks();
    buildUpdateJSON();
  });