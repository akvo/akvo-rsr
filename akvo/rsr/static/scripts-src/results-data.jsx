/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var currentDate, endpoints, i18n, initialSettings, user;

  /* Show the results summary in the main panel when the
  ** appropriate side bar link is activated.
  */
  function showResultsSummary(id) {
    var selector = '.result-' + id + '.result-summary';

    hideAllResultsSummaries();
    fadeIn(selector);
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

        // document.querySelector(indicatorGroupSelector).style.display = 'block';
        // document.querySelector(indicatorSelector).style.display = 'block';

        fadeIn(indicatorGroupSelector);
        fadeIn(indicatorSelector);

        /* Add an "active" class to this indicator in the sidebar for styling purposes */
        removeClassFromAll('.indicator-nav.active', 'active');
        document.querySelector('.indicator-nav[data-indicator-id="' + indicatorID + '"]').classList.add('active');

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
          document.querySelector('.indicator-period-' + periodId + '-tr').parentNode.classList.remove('expanded');
          /* Remove the 'add' update in the store, in case the 'add Update' button was clicked */
          removeUpdatefromStore(periodId, 'add');
        } else {
          var container;
          var updateDialog = getUpdateDialog(periodId);

          displayAddButton(periodId, true);
          updateDialog.style.display = 'none';
          parentElement.parentNode.appendChild(updateDialog);
          fadeIn(updateDialog, true, 'table-row');

          this.parentNode.parentNode.classList.add('expanded');
          this.parentNode.parentNode.parentNode.classList.add('expanded');
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
        container.classList.add('pending-new-update');

        containerCell = document.createElement('td');
        containerCell.setAttribute('colspan', '6');

        addUpdateContainer = getUpdateEntry(newUpdate);
        containerCell.appendChild(addUpdateContainer);
        container.appendChild(containerCell);
        container.style.opacity = 0;

        if (this.parentNode.parentNode.nextSibling) {
          this.parentNode.parentNode.parentNode.insertBefore(container, this.parentNode.parentNode.nextSibling);
        } else {
          this.parentNode.parentNode.parentNode.appendChild(container);
        }
        fadeIn(container, true, 'table-row');

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
        var periodValue;

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
          newValue = parseInt(updateContainer.querySelector('.update-dialog-timeline-marker:nth-last-child(2)').getAttribute('data-value'));
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

              request.onload = function() {
                if (request.status === 204) {
                  // Object successfully deleted
                  removeUpdatefromStore(periodId, parseInt(updateId));
                  updateActualValue(periodId, updateChange * -1);

                  savingPeriod(periodNode, false);

                  // Close the indicator period panel
                  periodNode.querySelector('.expand-indicator-period').click();
                  deleteConfirmContainer.style.display='none';
                  updateNode.querySelector('.update-name').classList.remove('delete-pending');
                  updatePeriodValues(periodId, updateChange * -1);

                  // Reopen the indicator period panel
                  periodNode.querySelector('.expand-indicator-period').click();
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

          updateContainer.classList.remove('edit-in-progress');

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

          exceedTargetNode.style.display = 'none';
        } else {
          this.classList.add('activated');
          if (deleteButton !== null) {
            deleteButton.classList.add('activated');
          }

          updateContainer.classList.add('edit-in-progress');

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
          var minVal = parseInt(this.closest('.indicator-period').getAttribute('indicator-baseline'));
          var maxVal = parseInt(sliderEl.getAttribute('data-max'));

          noUiSlider.create(sliderEl, {
            start: startVal,
            step: 1,
            range: {
              'min': minVal,
              'max': maxVal
            }
          });

          var updateMarker = updateContainer.querySelector('.update-dialog-timeline-marker:nth-last-child(2)');
          var updateProgress = updateContainer.querySelector('.indicator-bar-progress-amount');
          var updateActual = updateContainer.querySelector('.update-target-actual');
          var originalPercentageProgress = parseInt(updateMarker.style.left.substring(0, updateMarker.style.left.length - 1));
          var originalValue = updateActual.textContent;
          var originalPositionMarkerEl = document.createElement('div');
          var changeIndicatorEl = document.createElement('div');
          var handleLabelEl = document.createElement('div');
          var handleChangeLabelEl = document.createElement('div');

          originalPositionMarkerEl.classList.add('original-position-marker');
          originalPositionMarkerEl.style.left = originalPercentageProgress + '%';

          changeIndicatorEl.classList.add('change-indicator');
          changeIndicatorEl.style.left = originalPercentageProgress + '%';

          handleLabelEl.classList.add('handle-label');

          // Placeholder to ensure label is correct size - under rare
          // conditions label will have no text content until slider handle
          // is moved.
          handleLabelEl.textContent = '--';

          handleChangeLabelEl.classList.add('handle-change-label');


          document.querySelector('.edit-slider').appendChild(originalPositionMarkerEl);
          document.querySelector('.edit-slider').appendChild(changeIndicatorEl);
          document.querySelector('.edit-slider .noUi-handle').appendChild(handleLabelEl);
          document.querySelector('.edit-slider .noUi-handle').appendChild(handleChangeLabelEl);

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
              var changeValueIsNegative;

              value = parseInt(value);

              percentage = (value - minVal) / (maxVal - minVal) * 100;
              percentage = percentage > 100 ? 100 : percentage;

              percentage < originalPercentageProgress ? changeValueIsNegative = true : changeValueIsNegative = false;

              updateMarker.style.left = percentage + '%';
              updateMarker.setAttribute('data-value', value);
              updateProgress.style.width = percentage + '%';

              handleLabelEl.textContent = value;
              handleChangeLabelEl.textContent = changeValueIsNegative ? '-' : '+';
              handleChangeLabelEl.textContent += Math.abs(value - originalValue);

              if (changeValueIsNegative) {
                // Change is negative
                changeIndicatorEl.style.right = (100 - originalPercentageProgress) + '%';
                changeIndicatorEl.style.left = percentage + '%';
                changeIndicatorEl.classList.add('negative');
              } else {
                // Change is positive
                changeIndicatorEl.style.left = originalPercentageProgress + '%';
                changeIndicatorEl.style.right = (100 - percentage) + '%';
                changeIndicatorEl.classList.remove('negative');
              }

              updateActual.textContent = value;
            }
          });

          fadeIn(exceedTargetNode, true);

          addSaveOnClicks();
        }
      });
    }
  }

  /* GENERAL HELPER FUNCTIONS */

  /* Fade in
  ** =======
  ** Takes a selector and fades in each matching element.
  ** Takes an optional second argument, isElement, that indicates
  ** the first argument in an element rather than a selector.
  ** Takes an optional third argument, displayVal, that indicates
  ** what display value to give the element after fading in.
  ** If this argument is not present, defaults to 'block'
  */
  function fadeIn(selector, isElement, displayVal) {

    if (isElement) {
      fadeElIn(selector);
    } else {
      var els = document.querySelectorAll(selector);

      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        fadeElIn(el);
      }
    }

    function fadeElIn(el) {
      var opacityCallback = getOpacityCallback(el);
      var classCallback = getClassCallback(el);

      el.classList.add('opacity-transition');
      el.style.opacity = 0;
      el.style.display = displayVal || 'block';
      el.classList.add('fading-in');

      setTimeout(opacityCallback, 1);
      setTimeout(classCallback, 250);
    }

    function getOpacityCallback(el) {
      var cb = function() {
        el.style.opacity = 1;
      };

      return cb;
    }

    function getClassCallback(el) {
      var cb = function() {
        el.classList.remove('fading-in');
      };

      return cb;
    }
  }

  /* Fade out */

  function fadeOut(selector) {
    var els = document.querySelectorAll(selector);

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var opacityCallback = getOpacityCallback(el);
      var displayCallback = getDisplayCallback(el);

      el.style.opacity = 1;
      setTimeout(opacityCallback, 1);
      setTimeout(displayCallback, 250);
    }

    function getOpacityCallback(el) {
      var cb = function() {
        el.style.opacity = 0;
      };

      return cb;
    }

    function getDisplayCallback(el) {
      var cb = function() {
        if (!el.classList.contains('fading-in')) {
          el.style.display = 'none';
        }
      };

      return cb;
    }
  }

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

    // Create request
    api_url = '/rest/v1/project_update/?format=json';
    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        if (request.status === 201) {
            // Object successfully created

            // This callback expands the indicator period panel when the new data is loaded
            var callback = function(){
              periodNode.querySelector('.expand-indicator-period').click();
            };

            // TODO: only close the panel and remove the "saving" message once the "addAdditionalUpdateData"
            // call has finished

            // Close the indicator period panel
            periodNode.querySelector('.expand-indicator-period').click();

            var response, updateId, updateNode;
            response = JSON.parse(request.response);
            updateId = response.id;

            updateActualValue(periodId, value);
            addAdditionalUpdateData(updateId, callback);
            updatePeriodValues(periodId, value);
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
    savingPeriod(periodNode, true);

    // Create request
    api_url = '/rest/v1/project_update/' + updateId + '/?format=json';
    request = new XMLHttpRequest();
    request.open('PATCH', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Object successfully saved

            // This callback expands the indicator period panel when the new data is loaded
            var callback = function(){
              periodNode.querySelector('.expand-indicator-period').click();
            };

            // TODO: only close the panel and remove the "saving" message once the "addAdditionalUpdateData"
            // call has finished

            // Close the indicator period panel
            periodNode.querySelector('.expand-indicator-period').click();
            addAdditionalUpdateData(updateId, callback);
            updateActualValue(periodId, value - oldValue);
            // updateUpdateValues(periodId, updateId, updateId, value);
            updatePeriodValues(periodId, (value - oldValue));

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
  function addAdditionalUpdateData(updateId, callback) {
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
          var response = JSON.parse(request.response);
          addUpdateToStore(response);
          callback();
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
    baseline = parseInt(periodNode.getAttribute('indicator-baseline'));
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

  /* Update the values of other periods when an earlier period is edited */
  function updatePeriodValues(periodId, change) {
    var baseDate = new Date(document.querySelector('.indicator-period[period-id="' + periodId + '"] .toTime').textContent);
    var resultEl = document.querySelector('.indicator-period[period-id="' + periodId + '"]').closest('.indicator-group');
    var allPeriods = resultEl.querySelectorAll('.indicator-period');

    for (var i = 0; i < allPeriods.length; i++) {
      var period = allPeriods[i];
      var periodDate = new Date(period.querySelector('.fromTime').textContent);

      if (periodDate.getTime() >= baseDate.getTime()) {
        // This indicator period is more recent that in the original
        // We need to update it's value with the new changes from the original

        var oldStart = parseInt(period.getAttribute('period-start'));
        var oldActual = parseInt(period.getAttribute('period-actual'));
        var oldProgress = parseInt(period.querySelector('.indicator-bar-progress-text'));


        var baseline = parseInt(period.getAttribute('indicator-baseline'));
        var target = parseInt(period.getAttribute('period-target'));
        var newValue = oldActual + change;
        var completionPercentage = ((newValue - baseline) / (target - baseline)) * 100;

        if (completionPercentage > 100) completionPercentage = 100;

        period.setAttribute('period-start', oldStart + change);
        period.setAttribute('period-actual', newValue);
        period.querySelector('.indicator-bar-progress-text').textContent = newValue;
        period.querySelector('.indicator-bar-progress').style.left = completionPercentage + '%';
        period.querySelector('.indicator-bar-progress-amount').style.width = completionPercentage + '%';
      }
    }
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
    updateContainer.classList.add('bg-border-transition');

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
      dateEl.textContent = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
      updateContainer.appendChild(dateEl);
    }
    if (update.user) {
      userNameEl = document.createElement('div');
      userNameEl.classList.add('update-name');
      userNameEl.textContent = update.user.first_name + ' ' + update.user.last_name;
      updateContainer.appendChild(userNameEl);
    }

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

      var actualText, periodNode, periodTarget, periodBaseline, progress;

      periodNode = findPeriod(update.indicator_period.id);
      periodTarget = parseInt(periodNode.getAttribute('period-target'));
      periodBaseline = parseInt(periodNode.getAttribute('period-start'));
      indicatorBaseline = parseInt(periodNode.getAttribute('indicator-baseline'));

      progress = periodBaseline;

      for (var i=0; i < previousUpdates.length; i++) {
        var entry = previousUpdates[i];

        if (entry.id <= update.id || update.id === 'add') {
          /* This update is older (or the same) as the update we're building the dialog for.
          We need to make a marker for it. */
          progress += parseInt(entry.period_update, 10);

          var updateMarker = document.createElement('div');
          var textSpan = document.createElement('div');

          var percentage = (progress - indicatorBaseline) / (periodTarget - indicatorBaseline) * 100;
          percentage = percentage > 100 ? 100 : percentage;

          updateMarker.classList.add('update-dialog-timeline-marker');
          updateMarker.classList.add('indicator-bar-progress');
          updateMarker.style.left = percentage + '%';
          updateMarker.style['z-index'] = progress;

          textSpan.classList.add('indicator-bar-progress-text');
          textSpan.classList.add('bg-transition');
          textSpan.textContent = progress;
          textSpan.style.left = percentage + '%';

          var textHoverEl = document.createElement('span');
          var createdDate = new Date(entry.created_at);

          textHoverEl.classList.add('progress-hover-text');
          textHoverEl.classList.add('opacity-transition');
          textHoverEl.textContent = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();
          textSpan.appendChild(textHoverEl);

          markerContainer.appendChild(updateMarker);
          markerContainer.appendChild(textSpan);
        }
      }

      if (progress > periodTarget) {
        updateContainer.classList.add('target-exceeded');
      }

      var baselineEl = document.createElement('div');
      baselineEl.classList.add('indicator-baseline');
      baselineEl.textContent = periodNode.querySelector('.indicator-bar-td > div > .indicator-baseline').textContent;
      progressContainer.appendChild(baselineEl);

      var indicatorBar = document.createElement('div');
      indicatorBar.classList.add('indicator-bar');
      progressContainer.appendChild(indicatorBar);

      var highPercentage = (progress - indicatorBaseline) / (periodTarget - indicatorBaseline) * 100;
      highPercentage = highPercentage > 100 ? 100 : highPercentage;

      var indicatorBarProgressAmount = document.createElement('div');
      indicatorBarProgressAmount.classList.add('indicator-bar-progress-amount');
      indicatorBarProgressAmount.style.width = highPercentage + '%';

      progressContainer.appendChild(indicatorBarProgressAmount);
      progressContainer.appendChild(markerContainer);

      updateContainer.setAttribute("current-actual", progress);
      var sliderEl = document.createElement('div');
      sliderEl.classList.add('edit-slider');
      sliderEl.setAttribute('data-start', progress);
      sliderEl.setAttribute('data-max', periodTarget);

      progressContainer.appendChild(sliderEl);
      timeLineEl.appendChild(progressContainer);
      updateContainer.appendChild(timeLineEl);

      targetEl = document.createElement('div');
      targetEl.classList.add('update-target');

      actualText = document.createElement('span');
      actualText.classList.add('update-target-actual');
      actualText.textContent = progress;
      targetEl.appendChild(actualText);

      targetText = document.createElement('span');
      actualText.classList.add('update-target-actual');
      targetText.textContent =  ' / ' + periodTarget;
      targetEl.appendChild(targetText);
      updateContainer.appendChild(targetEl);

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
    exceedTargetNewValue.classList.add('opacity-transition');

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
    exceedTargetEl.style.display = 'none';
    updateContainer.appendChild(exceedTargetEl);

    if (progress > periodTarget) {
      exceedTargetNewValue.value = progress;
      exceedTargetCheckbox.checked = true;
    }

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

/* General helper functions */

function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"

    var locale = "en-gb";
    var date = new Date(dateString.split(".")[0].replace("/", /-/g));
    var day = date.getUTCDate();
    var month = date.toLocaleString(locale, { month: "short" });
    var year = date.getUTCFullYear();
    return day + " " + month + " " + year;
}

function userIsManager() {
    if (user.is_admin || user.is_superuser) {
        return true;
    }
    // TODO: Check org admins

    return false;
}

var CommentEntry = React.createClass({
    render: function() {
        var comment = this.props.comment;
        var user = comment.user_details;
        return (
            <div className="row">
                <div class="col-xs-12 comment-header">
                    {user.first_name} {user.last_name} | {displayDate(comment.created_at)}
                </div>
                <div class="col-xs-12 comment-text">
                    {comment.comment}
                </div>
            </div>
        );
    }
});

var UpdateEntry = React.createClass({
    getInitialState: function() {
        return {
            data: this.props.update.data,
            description: this.props.update.text,
            comment: ''
        };
    },

    editing: function() {
        return this.props.editingData.indexOf(this.props.update.id) > -1;
    },

    baseSave: function(data, keepEditing, reloadPeriod) {
        var url = endpoints.base_url + endpoints.update.replace('{update}', this.props.update.id);
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                var update = JSON.parse(xmlHttp.responseText);
                var periodId = thisApp.props.selectedPeriod.id;
                thisApp.props.saveUpdateToPeriod(update, periodId);
                if (!keepEditing) {
                    thisApp.props.removeEditingData(update.id);
                }
                if (reloadPeriod) {
                    thisApp.props.reloadPeriod(periodId);
                }
            }
        };
        xmlHttp.open("PATCH", url, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(data));
    },

    saveUpdate: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description,
            'data': this.state.data
        }, false, false);
    },

    askForApproval: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description,
            'data': this.state.data,
            'status': 'P'
        }, false, false);
    },

    approve: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description,
            'data': this.state.data,
            'status': 'A'
        }, false, true);
    },

    returnForRevision: function() {
        this.baseSave({
            'user': user.id,
            'text': this.state.description,
            'data': this.state.data,
            'status': 'R'
        }, false, false);
    },

    removePhoto: function() {
        this.baseSave({'photo': ''}, true, false);
    },

    removeFile: function() {
        this.baseSave({'file': ''}, true, false);
    },

    baseUpload: function(file, type) {
        var thisApp = this;
        var updateId = this.props.update.id;
        var url = endpoints.file_upload.replace('{update}', updateId);

        var formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.onload = function() {
            if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
                var newFile = JSON.parse(xmlHttp.responseText).file;
                thisApp.props.saveFileInUpdate(newFile, updateId, type);
            }
        };

        xmlHttp.send(formData);
    },

    uploadImage: function(e) {
        var file = e.target.files[0];
        this.baseUpload(file, 'photo');
    },

    uploadFile: function(e) {
        var file = e.target.files[0];
        this.baseUpload(file, 'file');
    },

    addComment: function() {
        var url = endpoints.base_url + endpoints.comments;
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 201) {
                var comment = JSON.parse(xmlHttp.responseText);
                var updateId = thisApp.props.update.id;
                thisApp.props.saveCommentInUpdate(comment, updateId);
                thisApp.setState({comment: ''});
            }
        };
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify({
            'data': this.props.update.id,
            'user': user.id,
            'comment': this.state.comment
        }));
    },

    switchEdit: function() {
        var addEdit = this.props.addEditingData;
        var removeEdit = this.props.removeEditingData;
        var updateId = this.props.update.id;

        if (this.editing()) {
            removeEdit(updateId);
        } else {
            addEdit(updateId);
        }
    },

    handleDataChange: function(e) {
        this.setState({data: e.target.value});
    },

    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    renderUpdateClass: function() {
        var updateClass = "row update-entry-container";
        if (this.editing()) {
            updateClass += " edit-in-progress";
        }
        return updateClass;
    },

    renderHeader: function() {
        var headerLeft;

        if (this.editing()) {
            headerLeft = <div className="col-xs-9">
                <span className="edit-update">{i18n.edit_update}</span>
            </div>
        } else {
            headerLeft = <div className="col-xs-9">
                <span className="update-user">{this.props.update.user_details.first_name} {this.props.update.user_details.last_name}</span>
                <span className="update-created-at"> | {displayDate(this.props.update.created_at)}</span>
            </div>
        }

        return (
            <div className="row update-entry-container-header">
                {headerLeft}
                <div className="col-xs-3">
                    <span className="update-status"> {this.props.update.status_display}</span>
                </div>
            </div>
        );
    },

    renderActual: function() {
        var inputId = "actual-input-" + this.props.update.id;

        if (this.editing()) {
            return (
                <div className="row">
                    <div className="col-xs-4">
                        <label htmlFor={inputId}>{i18n.actual_value}</label>
                        <input className="form-control" id={inputId} defaultValue={this.props.update.data} onChange={this.handleDataChange} />
                    </div>
                    <div className="col-xs-8">
                        {i18n.current}: PERIOD ACTUAL
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <span className="update-actual-value-text">{i18n.actual_value}</span>
                        <span className="update-actual-value-data">{this.props.update.data}</span>
                    </div>
                </div>
            );
        }
    },

    renderDescription: function() {
        var inputId = "description-input-" + this.props.update.id;
        var photoPart, descriptionPart, descriptionClass;

        if (this.props.update.photo_url === "") {
            photoPart = <span />;
            descriptionClass = "col-xs-10 update-description";
        } else {
            if (this.editing()) {
                photoPart = <div className="col-xs-3 update-photo">
                    <img src={endpoints.base_url + this.props.update.photo_url} onClick={this.removePhoto} />
                </div>;
            } else {
                photoPart = <div className="col-xs-3 update-photo">
                    <img src={endpoints.base_url + this.props.update.photo_url}/>
                </div>;
            }
            descriptionClass = "col-xs-7 update-description";
        }

        if (this.editing()) {
            descriptionPart = <div className={descriptionClass}>
                <label htmlFor={inputId}>{i18n.note}</label>
                <textarea className="form-control" id={inputId} defaultValue={this.props.update.text} onChange={this.handleDescriptionChange} />
            </div>;
        } else {
            descriptionPart = <div className={descriptionClass}>
                {this.props.update.text}
            </div>;
        }

        return (
            <div className="row">
                {photoPart}
                {descriptionPart}
            </div>
        );
    },

    fileNameDisplay: function() {
        if (this.props.update.file_url !== '') {
            return decodeURIComponent(this.props.update.file_url.split('/').pop());
        } else {
            return '';
        }
    },

    renderFileUpload: function() {
        if (this.editing()) {
            var fileUpload;
            var labelText = this.props.update.photo_url === "" ? i18n.add_image : i18n.change_image;

            if (this.props.update.file_url !== '') {
                fileUpload = <div className="col-xs-6">
                    <i className="fa fa-paperclip"/> <a href={this.props.update.file_url} target="_blank">{this.fileNameDisplay()}</a>
                    <a onClick={this.removeFile}> Remove</a>
                </div>
            } else {
                fileUpload = <div className="col-xs-3">
                    <label className="fileUpload">
                        <input type="file" onChange={this.uploadFile} />
                        <a><i className="fa fa-paperclip"/> {i18n.attach_file}</a>
                    </label>
                </div>
            }

            return (
                <div className="row">
                    <div className="col-xs-3">
                        <label className="imageUpload">
                            <input type="file" accept="image/*" onChange={this.uploadImage} />
                            <a><i className="fa fa-camera"/> {labelText}</a>
                        </label>
                    </div>
                    {fileUpload}
                </div>
            );
        } else if (this.props.update.file_url !== '') {
            return (
                <div className="row">
                    <div className="col-xs-6">
                        <i className="fa fa-paperclip"/> <a href={this.props.update.file_url} target="_blank">{this.fileNameDisplay()}</a>
                    </div>
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    },

    renderComments: function() {
        var comments = this.props.update.comments.map(function(comment) {
            return (
                <div className="comment">
                    {React.createElement(CommentEntry, {
                        comment: comment
                    })}
                </div>
            )
        });

        var inputId = "new-comment-" + this.props.update.id;
        return (
            <div className="comments">
                {comments}
                <div className="row">
                    <div className="col-xs-8">
                        <label htmlFor={inputId}>{i18n.comment}</label>
                        <input className="form-control" value={this.state.comment} id={inputId} placeholder={i18n.add_comment_placeholder} onChange={this.handleCommentChange} />
                    </div>
                    <div className="col-xs-3">
                        <a onClick={this.addComment}>{i18n.add_comment}</a>
                    </div>
                </div>
            </div>
        );
    },

    renderFooter: function() {
        if (this.editing()) {
            switch(this.props.update.status) {
                case 'P':
                    return (
                        <div className="row">
                            <div className="col-xs-9">
                                <a onClick={this.switchEdit}>{i18n.cancel}</a>
                            </div>
                            <div className="col-xs-3">
                                <a onClick={this.approve}>{i18n.approve}</a>
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div className="row">
                            <div className="col-xs-7">
                                <a onClick={this.switchEdit}>{i18n.cancel}</a>
                            </div>
                            <div className="col-xs-2">
                                <a onClick={this.saveUpdate}>{i18n.save}</a>
                            </div>
                            <div className="col-xs-3">
                                <a onClick={this.askForApproval}>{i18n.submit_for_approval}</a>
                            </div>
                        </div>
                    );
            }
        } else {
            switch(this.props.update.status) {
                case 'P':
                    return (
                        <div className="row">
                            <div className="col-xs-7">
                                <a onClick={this.returnForRevision}>{i18n.return_for_revision}</a>
                            </div>
                            <div className="col-xs-2">
                                <a onClick={this.switchEdit}>{i18n.edit_update}</a>
                            </div>
                            <div className="col-xs-3">
                                <a onClick={this.approve}>{i18n.approve}</a>
                            </div>
                        </div>
                    );
                case 'A':
                    return (
                        <span />
                    );
                default:
                    return (
                        <div className="row">
                            <div className="col-xs-9"></div>
                            <div className="col-xs-3">
                                <a onClick={this.switchEdit}>{i18n.edit_update}</a>
                            </div>
                        </div>
                    );
            }
        }
    },

    render: function() {
        return (
            <div className={this.renderUpdateClass()}>
                <div className="col-xs-12">
                    {this.renderHeader()}
                    {this.renderActual()}
                    {this.renderDescription()}
                    {this.renderFileUpload()}
                    {this.renderComments()}
                    {this.renderFooter()}
                </div>
            </div>
        );
    }
});

var UpdatesList = React.createClass({
    sortedUpdates: function() {
        function compare(u1, u2) {
            if (u1.created_at > u2.created_at) {
                return -1;
            } else if (u1.created_at < u2.created_at) {
                return 1;
            } else {
                return 0;
            }
        }
        return this.props.selectedPeriod.data.sort(compare);
    },

    render: function() {
        var thisList = this;
        var updates = this.sortedUpdates().map(function (update) {
            return (
                <div className="update-container" key={update.id}>
                    {React.createElement(UpdateEntry, {
                        addEditingData: thisList.props.addEditingData,
                        removeEditingData: thisList.props.removeEditingData,
                        editingData: thisList.props.editingData,
                        saveUpdateToPeriod: thisList.props.saveUpdateToPeriod,
                        saveFileInUpdate: thisList.props.saveFileInUpdate,
                        saveCommentInUpdate: thisList.props.saveCommentInUpdate,
                        selectedPeriod: thisList.props.selectedPeriod,
                        selectPeriod: thisList.props.selectPeriod,
                        reloadPeriod: thisList.props.reloadPeriod,
                        update: update
                    })}
                </div>
            );
        });

        return (
            <div className="updates-container">
                <h5>{i18n.updates}</h5>
                {updates}
            </div>
        );
    }
});

var IndicatorPeriodMain = React.createClass({
    addNewUpdate: function() {
        this.props.addNewUpdate(this.props.selectedPeriod.id);
    },

    renderNewUpdate: function() {
        switch (this.props.selectedPeriod.locked) {
            case false:
                return (
                    <div className="col-xs-3 new-update">
                        <a onClick={this.addNewUpdate}>{i18n.new_update}</a>
                    </div>
                );
            default:
                return (
                    <div className="col-xs-3 new-update">
                        {i18n.new_update}
                    </div>
                );
        }
    },

    render: function() {
        return (
            <div className="indicator-period opacity-transition">
                <div className="row">
                    <div className="col-xs-9">
                        <h4 className="indicator-title">
                            {i18n.indicator_period}: {displayDate(this.props.selectedPeriod.period_start)} - {displayDate(this.props.selectedPeriod.period_end)}
                        </h4>
                    </div>
                    {this.renderNewUpdate()}
                </div>
                <dl className="period-target-actual">
                    <div className="period-target">
                        <dt>{i18n.target_value}</dt>
                        <dd>{this.props.selectedPeriod.target_value}</dd>
                    </div>
                    <div className="period-actual">
                        <dt>{i18n.actual_value}</dt>
                        <dd>
                            {this.props.selectedPeriod.actual_value}
                            <span className="percentage-complete"> (100%)</span>
                        </dd>
                    </div>
                    {React.createElement(UpdatesList, {
                        addEditingData: this.props.addEditingData,
                        removeEditingData: this.props.removeEditingData,
                        editingData: this.props.editingData,
                        saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                        saveFileInUpdate: this.props.saveFileInUpdate,
                        saveCommentInUpdate: this.props.saveCommentInUpdate,
                        selectedPeriod: this.props.selectedPeriod,
                        selectPeriod: this.props.selectPeriod,
                        reloadPeriod: this.props.reloadPeriod
                    })}
                </dl>
            </div>
        );
    }
});

var IndicatorPeriodEntry = React.createClass({
    selected: function() {
        if (this.props.selectedPeriod !== null) {
            return this.props.selectedPeriod.id === this.props.period.id;
        } else {
            return false;
        }
    },

    switchPeriod: function() {
        var selectPeriod = this.props.selectPeriod;
        this.selected() ? selectPeriod(null) : selectPeriod(this.props.period);
    },

    switchPeriodAndUpdate: function() {
        this.props.addNewUpdate(this.props.selectedPeriod.id);
        this.switchPeriod();
    },

    basePeriodSave: function(data) {
        var url = endpoints.base_url + endpoints.period.replace('{period}', this.props.period.id);
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                var period = JSON.parse(xmlHttp.responseText);
                var indicatorId = period.indicator;
                thisApp.props.savePeriodToIndicator(period, indicatorId);
            }
        };
        xmlHttp.open("PATCH", url, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(data));
    },

    lockPeriod: function() {
        this.basePeriodSave({locked: true});
    },

    unlockPeriod: function() {
        this.basePeriodSave({locked: false});
    },

    renderPeriodDisplay: function() {
        var periodDisplay = displayDate(this.props.period.period_start) + ' - ' + displayDate(this.props.period.period_end);

        switch(this.props.period.data.length) {
            case 0:
                return (
                    <td className="period-td">
                        {periodDisplay}
                    </td>
                );
            default:
                return (
                    <td className="period-td">
                        <a onClick={this.switchPeriod}>
                            {periodDisplay}
                        </a>
                    </td>
                );
        }
    },

    renderActions: function() {
        if (userIsManager()) {
            switch(this.props.period.locked) {
                case false:
                    return (
                        <td className="actions-td">
                            <a onClick={this.lockPeriod}>{i18n.lock_period}</a>
                        </td>
                    );
                default:
                    return (
                        <td className="actions-td">
                            <a onClick={this.unlockPeriod}>{i18n.unlock_period}</a>
                        </td>
                    )
            }
        } else {
            switch(this.props.period.locked) {
                case false:
                    return (
                        <td className="actions-td">
                            <a onClick={this.switchPeriod}>{i18n.update}</a>
                        </td>
                    );
                default:
                    return (
                        <td className="actions-td">
                            {i18n.update}
                        </td>
                    )
            }
        }
    },

    render: function() {
        return (
            <tr>
                {this.renderPeriodDisplay()}
                <td className="target-td">{this.props.period.target_value}</td>
                <td className="actual-td">
                    {this.props.period.actual_value}
                    <span className="percentage-complete"> (100%)</span>
                </td>
                {this.renderActions()}
            </tr>
        );
    }
});

var IndicatorPeriodList = React.createClass({
    render: function() {
        var thisList = this;

        var periods = this.props.indicator.periods.map(function (period) {
            return (
                <tbody className="indicator-period bg-transition" key={period.id}>
                    {React.createElement(IndicatorPeriodEntry, {
                        period: period,
                        selectedPeriod: thisList.props.selectedPeriod,
                        selectPeriod: thisList.props.selectPeriod,
                        addNewUpdate: thisList.props.addNewUpdate,
                        savePeriodToIndicator: thisList.props.savePeriodToIndicator
                    })}
                </tbody>
            );
        });

        return (
            <div className="indicator-period-list">
                <h4 className="indicator-periods-title">{i18n.indicator_periods}</h4>
                <table className="table table-responsive">
                    <thead>
                        <tr>
                            <td className="th-period">{i18n.period}</td>
                            <td className="th-target">{i18n.target_value}</td>
                            <td className="th-actual">{i18n.actual_value}</td>
                            <td className="th-actions" />
                        </tr>
                    </thead>
                    {periods}
                </table>
            </div>
        );
    }
});

var MainContent = React.createClass({
    addNewUpdate: function(periodId) {
        var xmlHttp = new XMLHttpRequest();
        var thisApp = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 201) {
                var update = JSON.parse(xmlHttp.responseText);
                thisApp.props.saveUpdateToPeriod(update, periodId);
            }
        };
        xmlHttp.open("POST", endpoints.base_url + endpoints.updates, true);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify({
            'period': periodId,
            'user': user.id,
            'data': 0
        }));
    },

    showMeasure: function() {
        switch(this.props.indicator.measure) {
            case "1":
                return i18n.unit;
            case "2":
                return i18n.percentage;
            default:
                return "";
        }
    },

    render: function() {
        if (this.props.selectedPeriod !== null) {
            return (
                <div className="indicator-period-container">
                    {React.createElement(IndicatorPeriodMain, {
                        addNewUpdate: this.addNewUpdate,
                        addEditingData: this.props.addEditingData,
                        removeEditingData: this.props.removeEditingData,
                        editingData: this.props.editingData,
                        saveUpdateToPeriod: this.props.saveUpdateToPeriod,
                        saveFileInUpdate: this.props.saveFileInUpdate,
                        saveCommentInUpdate: this.props.saveCommentInUpdate,
                        selectedPeriod: this.props.selectedPeriod,
                        reloadPeriod: this.props.reloadPeriod
                    })}
                </div>
            );
        } else if (this.props.indicator !== null) {
            return (
                <div className="indicator opacity-transition">
                    <h4 className="indicator-title">
                        <i className="fa fa-tachometer" />
                        {this.props.indicator.title}
                        ({this.showMeasure()})
                    </h4>
                    <div className="indicator-description">
                        {this.props.indicator.description}
                    </div>
                    <dl className="baseline">
                        <div className="baseline-year">
                            <dt>{i18n.baseline_year}</dt>
                            <dd>{this.props.indicator.baseline_year}</dd>
                        </div>
                        <div className="baseline-value">
                            <dt>{i18n.baseline_value}</dt>
                            <dd>{this.props.indicator.baseline_value}</dd>
                        </div>
                    </dl>
                    {React.createElement(IndicatorPeriodList, {
                        indicator: this.props.indicator,
                        selectedPeriod: this.props.selectedPeriod,
                        selectPeriod: this.props.selectPeriod,
                        addNewUpdate: this.addNewUpdate,
                        savePeriodToIndicator: this.props.savePeriodToIndicator
                    })}
                </div>
            )
        } else {
            return (
                <span />
            );
        }
    }
});

var IndicatorEntry = React.createClass({
    selected: function() {
        if (this.props.selectedIndicator !== null) {
            return this.props.selectedIndicator.id === this.props.indicator.id;
        } else {
            return false;
        }
    },

    switchIndicator: function() {
        var selectIndicator = this.props.selectIndicator;
        var selectPeriod = this.props.selectPeriod;
        this.selected() ? selectPeriod(null) : selectIndicator(this.props.indicator);
    },

    render: function() {
        var indicatorClass = "indicator-nav clickable bg-border-transition";
        if (this.selected()) {
            indicatorClass += " active"
        }

        return (
            <div className={indicatorClass} onClick={this.switchIndicator} key={this.props.indicator.id}>
                <a>
                    <h4>{this.props.indicator.title}</h4>
                </a>
            </div>
        );
    }
});

var ResultEntry = React.createClass({
    expanded: function() {
        if (this.props.selectedResult !== null) {
            return this.props.selectedResult.id === this.props.result.id;
        } else {
            return false;
        }
    },

    switchResult: function() {
        var selectResult = this.props.selectResult;
        this.expanded() ? selectResult(null) : selectResult(this.props.result);
    },

    render: function() {
        var indicatorCount, indicatorEntries;

        if (this.expanded()) {
            indicatorCount = <span />;
        } else {
            indicatorCount = <span className="result-indicator-count">
                <i className="fa fa-tachometer" />
                <span className="indicator-count">{this.props.result.indicators.length}</span>
            </span>;
        }

        if (this.expanded()) {
            var thisResult = this;
            indicatorEntries = this.props.result.indicators.map(function (indicator) {
                return (
                    <div key={indicator.id}>
                        {React.createElement(IndicatorEntry, {
                            indicator: indicator,
                            selectedIndicator: thisResult.props.selectedIndicator,
                            selectIndicator: thisResult.props.selectIndicator,
                            selectPeriod: thisResult.props.selectPeriod
                        })}
                    </div>
                );
            });
            indicatorEntries = <div className="result-nav-full clickable">{indicatorEntries}</div>;
        } else {
            indicatorEntries = <span />;
        }

        var resultNavClass = "result-nav bg-transition";
        resultNavClass += this.expanded() ? " expanded" : "";

        return (
            <div className={resultNavClass} key={this.props.result.id}>
                <div className="result-nav-summary clickable" onClick={this.switchResult}>
                    <h3 className="result-title">
                        <i className="fa fa-chevron-down" />
                        <i className="fa fa-chevron-up" />
                        <span>{this.props.result.title}</span>
                    </h3>
                    {indicatorCount}
                </div>
                {indicatorEntries}
            </div>
        );
    }
});

var SideBar = React.createClass({
    render: function() {
        var thisList = this;
        var resultEntries = this.props.results.map(function (result) {
            return (
                <div key={result.id}>
                    {React.createElement(ResultEntry, {
                        result: result,
                        selectedResult: thisList.props.selectedResult,
                        selectedIndicator: thisList.props.selectedIndicator,
                        selectResult: thisList.props.selectResult,
                        selectIndicator: thisList.props.selectIndicator,
                        selectPeriod: thisList.props.selectPeriod
                    })}
                </div>
            );
        });

        return (
            <div className="results-list">
                {resultEntries}
            </div>
        );
    }
});

var ResultsApp = React.createClass({
    getInitialState: function() {
        return {
            selectedResult: null,
            selectedIndicator: null,
            selectedPeriod: null,
            editingData: [],
            results: []
        };
    },

    componentDidMount: function() {
        // Load results data
        var xmlHttp = new XMLHttpRequest();
        var thisApp = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                thisApp.setState({'results': JSON.parse(xmlHttp.responseText).results});
            }
        };
        xmlHttp.open("GET", endpoints.base_url + endpoints.results, true);
        xmlHttp.send();
    },

    findIndicator: function(indicatorId) {
        for (var i = 0; i < this.state.results.length; i++) {
            var result = this.state.results[i];
            for (var j = 0; j < result.indicators.length; j++) {
                var indicator = result.indicators[j];
                if (indicator.id == indicatorId) {
                    return indicator;
                }
            }
        }
        return null;
    },

    findPeriod: function(periodId) {
        for (var i = 0; i < this.state.results.length; i++) {
            var result = this.state.results[i];
            for (var j = 0; j < result.indicators.length; j++) {
                var indicator = result.indicators[j];
                for (var k = 0; k < indicator.periods.length; k++) {
                    var period = indicator.periods[k];
                    if (period.id == periodId) {
                        return period;
                    }
                }
            }
        }
        return null;
    },

    findUpdate: function(updateId) {
        for (var i = 0; i < this.state.results.length; i++) {
            var result = this.state.results[i];
            for (var j = 0; j < result.indicators.length; j++) {
                var indicator = result.indicators[j];
                for (var k = 0; k < indicator.periods.length; k++) {
                    var period = indicator.periods[k];
                    for (var l = 0; l < period.data.length; l++) {
                        var update = period.data[l];
                        if (update.id == updateId) {
                            return update;
                        }
                    }
                }
            }
        }
        return null;
    },

    savePeriodToIndicator: function(period, indicatorId) {
        var indicator = this.findIndicator(indicatorId);

        if (indicator !== null) {
            var dataFound = null;
            for (var l = 0; l < indicator.periods.length; l++) {
                var oldPeriod = indicator.periods[l];
                if (oldPeriod.id == period.id) {
                    dataFound = oldPeriod;
                    break;
                }
            }

            if (dataFound !== null) {
                // Remove old period and insert updated period if update exists
                var periodsList = indicator.periods;
                periodsList.splice(periodsList.indexOf(dataFound), 1);
                periodsList.push(period);
                this.forceUpdate();
            }
        }
    },

    saveUpdateToPeriod: function(update, periodId) {
        var period = this.findPeriod(periodId);

        if (period !== null) {
            var dataFound = null;
            for (var l = 0; l < period.data.length; l++) {
                var dataUpdate = period.data[l];
                if (dataUpdate.id == update.id) {
                    dataFound = dataUpdate;
                    break;
                }
            }

            if (dataFound === null) {
                // Insert new update if not
                period.data.push(update);
                this.forceUpdate();
                this.addEditingData(update.id);
            } else {
                // Remove old update and insert updated update if update exists
                var periodDataList = period.data;
                periodDataList.splice(periodDataList.indexOf(dataFound), 1);
                periodDataList.push(update);
                this.forceUpdate();
            }
        }
    },

    saveFileInUpdate: function(file, updateId, fileType) {
        var update = this.findUpdate(updateId);

        if (update !== null) {
            if (fileType === 'photo') {
                update.photo_url = file;
                this.forceUpdate();
            } else if (fileType === 'file') {
                update.file_url = file;
                this.forceUpdate();
            }
        }
    },

    saveCommentInUpdate: function(comment, updateId) {
        var update = this.findUpdate(updateId);

        if (update !== null) {
            update.comments.push(comment);
            this.forceUpdate();
        }
    },

    reloadPeriod: function(periodId) {
        var url = endpoints.base_url + endpoints.period.replace('{period}', periodId);
        var thisApp = this;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                var period = JSON.parse(xmlHttp.responseText);
                var indicatorId = period.indicator;
                thisApp.savePeriodToIndicator(period, indicatorId);
                thisApp.setState({selectedPeriod: period});
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    },

    selectResult: function(resultId) {
        this.setState({selectedResult: resultId});
    },

    selectIndicator: function(indicator) {
        this.setState({selectedIndicator: indicator});
    },

    selectPeriod: function(period) {
        this.setState({selectedPeriod: period});
    },

    addEditingData: function(updateId) {
        var editingDataList = this.state.editingData;
        editingDataList.push(updateId);
        this.setState({editingData: editingDataList});
    },

    removeEditingData: function(updateId) {
        var editingDataList = this.state.editingData;
        editingDataList.splice(editingDataList.indexOf(updateId), 1);
        this.setState({editingData: editingDataList});
    },

    render: function() {
        return (
            <div className="results">
                <article>
                    <div className="results-container container">
                        <div className="sidebar">
                            <div className="result-nav-header">
                                <h3>{i18n.results}</h3>
                            </div>
                            {React.createElement(
                                SideBar, {
                                    results: this.state.results,
                                    selectedResult: this.state.selectedResult,
                                    selectedIndicator: this.state.selectedIndicator,
                                    selectResult: this.selectResult,
                                    selectIndicator: this.selectIndicator,
                                    selectPeriod: this.selectPeriod
                                }
                            )}
                        </div>
                        <div className="indicator-container">
                            {React.createElement(
                                MainContent, {
                                    addEditingData: this.addEditingData,
                                    removeEditingData: this.removeEditingData,
                                    editingData: this.state.editingData,
                                    saveUpdateToPeriod: this.saveUpdateToPeriod,
                                    savePeriodToIndicator: this.savePeriodToIndicator,
                                    saveFileInUpdate: this.saveFileInUpdate,
                                    saveCommentInUpdate: this.saveCommentInUpdate,
                                    reloadPeriod: this.reloadPeriod,
                                    indicator: this.state.selectedIndicator,
                                    selectedPeriod: this.state.selectedPeriod,
                                    selectPeriod: this.selectPeriod
                                }
                            )}
                        </div>
                    </div>
                </article>
            </div>
        );
    }
});

function setCurrentDate() {
    currentDate = initialSettings.current_datetime;
    setInterval(function () {
        var localCurrentDate = new Date(currentDate);
        localCurrentDate.setSeconds(localCurrentDate.getSeconds() + 1);
        currentDate = localCurrentDate.toString();
    }, 1000);
}

function getUserData() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            user = JSON.parse(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", endpoints.base_url + endpoints.user, true);
    xmlHttp.send();
}

// Polyfill for element.closest() for IE and Safari
this.Element && function(ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
        function (selector) {
            var el = this;
            while (el.matches && !el.matches(selector)) el = el.parentNode;
            return el.matches ? el : null;
        };
}(Element.prototype);

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data endpoints, translations and page settings
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);
    initialSettings = JSON.parse(document.getElementById('initial-settings').innerHTML);

    setCurrentDate();
    getUserData();

    // Initialize the 'My reports' app
    ReactDOM.render(
        React.createElement(ResultsApp),
        document.getElementById('results-framework')
    );
});