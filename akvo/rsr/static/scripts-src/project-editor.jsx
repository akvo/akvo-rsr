/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// DEFAULT VALUES
var defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);
var countryValues = JSON.parse(document.getElementById("country-values").innerHTML);

// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

// TYPEAHEADS
var MAX_RETRIES = 2;
var projectsAPIUrl = '/rest/v1/typeaheads/projects?format=json';
var orgsAPIUrl = '/rest/v1/typeaheads/organisations?format=json';
var responses = {};
responses[projectsAPIUrl] = null;
responses[orgsAPIUrl] = null;
var update_section_states_timer;

// LOCAL STORAGE
var MAX_LOCALSTORAGE_DAYS = 30;
var MAX_LOCALSTORAGE_AGE = MAX_LOCALSTORAGE_DAYS * 24 * 60 * 60 * 1000;
var localStorageName = 'cachedAPIResponses';
var localStorageResponses = localStorage.getItem(localStorageName);

// PARTIALS
var partials = [
    'related-project', 'humanitarian-scope', 'budget-item', 'condition', 'contact-information',
    'country-budget-item', 'document', 'document-category', 'indicator', 'indicator-dimension',
    'indicator-label', 'indicator-period', 'indicator-reference', 'indicator-period-actual-dimension',
    'indicator-period-actual-location', 'indicator-period-target-dimension',
    'indicator-period-target-location', 'link', 'partner', 'planned-disbursement', 'policy-marker',
    'recipient-country', 'recipient-region', 'related-project','result', 'sector', 'transaction',
    'transaction-sector', 'location-administrative', 'project-location', 'keyword', 'crs-add',
    'crsadd-other-flag', 'fss', 'fss-forecast', 'legacy-data'
];

// Measure the percentage of completion for each panel and display the results to the user
// Which elements count as inputs?
var INPUT_ELEMENTS = ['input', 'select', 'textarea'];

function findAncestorByClass(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function findAncestorByTag(el, tag) {
    while ((el = el.parentElement) && el.tagName !== tag.toUpperCase());
    return el;
}

function fieldIsHidden(node) {
    /* Checks if the field is hidden or not. */
    return findAncestorByClass(node, 'form-group').classList.contains('hidden');
}

function hasParent(node) {
    /* Checks if a node is part of a partial. */
    return findAncestorByClass(node, 'parent') !== null;
}

function serialize(form) {
    /* Serialize the form so that it can be sent through the API.
       Modified to skip hidden fields and added / removed some field types.
       Modified to only serialize fields that have been changed. */

  var  q = [];

  for (var i = 0; i < form.elements.length; i++) {
        var formField = form.elements[i];

    if (formField.name !== "" && fieldChanged(formField)) {
            // Form field has a name and is changed (and not hidden), only then process it
            if (formField.nodeName === 'INPUT') {
                if (formField.type === 'text' || formField.type === 'number') {
                    if (formField.parentNode.classList.contains('typeahead')) {
                        // Special case for typeaheads, the ID of the object is stored in the value attribute
                        q.push(formField.name + "=" + encodeURIComponent(formField.getAttribute('value')));
                    } else {
                        q.push(formField.name + "=" + encodeURIComponent(formField.value));
                    }
                }
            } else if (formField.nodeName === 'TEXTAREA' || formField.nodeName === 'SELECT') {
                q.push(formField.name + "=" + encodeURIComponent(formField.value));
            }
        }
  }
  return q.join("&");
}

function startSave(saveButton) {
    /* Indicate that saving has started:
        - Disable save button
        - Show 'Saving...' message */

    saveButton.setAttribute('disabled', '');

    var save_message_div = findAncestorByClass(saveButton, 'row').querySelector('.save-message');
    save_message_div.innerHTML = defaultValues.saving + '...';
}

function finishSave(saveButton, success, message) {
    /* Indicate that saving has finished:
        - Enable the save button again
        - If no errors, show that it has successfully completed
        - If errors, show the error message */

    saveButton.removeAttribute('disabled');

    var save_message_div = findAncestorByClass(saveButton, 'row').querySelector('.save-message');
    var message_div = document.createElement('div');
    var icon = document.createElement('span');

    save_message_div.innerHTML = '';
    icon.classList.add('glyphicon');

    if (success) {
        icon.classList.add('glyphicon-ok-circle');
        message_div.classList.add('save-success');
        message_div.appendChild(icon);

        setTimeout(function () {
            save_message_div.innerHTML = '';
        }, 5000);
    } else {
        icon.classList.add('glyphicon-remove-circle');
        message_div.classList.add('help-block-error');
        message_div.appendChild(icon);
    }

    message_div.appendChild(document.createTextNode(' ' + message));
    save_message_div.appendChild(message_div);
}

function removeErrors(form) {
    var errorElements, formElements;

    errorElements = form.querySelectorAll('.help-block-error');
    formElements = form.querySelectorAll('.has-error');

    for (var i = errorElements.length; i > 0; i--) {
        var errorElement = errorElements[i - 1];
        errorElement.parentNode.removeChild(errorElement);
    }

    for (var j = formElements.length; j > 0; j--) {
        var FormElement = formElements[j - 1];
        FormElement.className = FormElement.className.replace('has-error', '');
    }
}

function addErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
        try {
            var error, errorNode, textnode;

            error = errors[i];
            errorNode = document.getElementById(error.name);
            errorNode = findAncestorByClass(errorNode, 'form-group');
            errorNode.classList.add('has-error');

            var pNode = document.createElement("p");
            pNode.className = "help-block help-block-error";
            textnode = document.createTextNode(error.error);
            pNode.appendChild(textnode);
            errorNode.appendChild(pNode);

            var parentExists = hasParent(errorNode);
            var partialNode = errorNode;
            while (parentExists) {
                partialNode = findAncestorByClass(partialNode, 'parent');
                if (partialNode.querySelector('.hide-partial').classList.contains('hidden')) {
                    // Open partial to show error
                    partialNode.querySelector('.hide-partial-click').click();
                }
                parentExists = hasParent(partialNode);
            }

            if (i === 0) {
                document.getElementById(error.name).scrollIntoView();
                window.scrollBy(0, -100);
            }
        } catch (tryError) {
            // Can't find attribute, probably due to a name change
        }
    }
}

function successSave(node) {
    /* Add a 5 second green border to the element to indicate that it has been saved successfully */
    var parentNode = findAncestorByClass(node, 'form-group');
    parentNode.classList.add('has-success');
    setTimeout(function () {
        parentNode.classList.remove('has-success');
    }, 5000);
}

function replaceNames(newObjects) {
    /* Update the names and IDs of fields.
       Also show the new unicode of related objects in the header. */

    for (var i = 0; i < newObjects.length; i++) {
        // Update parent node ID
        var parentNode = document.getElementById(newObjects[i].old_id);
        var newParentNodeId = newObjects[i].old_id.split('.')[0] + '.' + newObjects[i].new_id;
        parentNode.setAttribute("id", newParentNodeId);

        // Update unicode
        var unicodeNode = parentNode.querySelector('.unicode');
        unicodeNode.innerHTML = newObjects[i].unicode;

        // Update IDs and names of all input fields
        for (var j = 0; j < INPUT_ELEMENTS.length; j++) {
            var inputElement = INPUT_ELEMENTS[j];
            var relObjectElements = parentNode.querySelectorAll(inputElement);

            for (var k = 0; k < relObjectElements.length; k++) {
                var relObjectElement = relObjectElements[k];

                if (relObjectElement.type !== 'checkbox') {
                    // Check if the input is an underlying partial or not
                    var relObjectParentElement = findAncestorByClass(relObjectElement, 'parent');
                    var idList = relObjectElement.getAttribute('id').split('.');
                    if (relObjectParentElement === parentNode) {
                        idList[2] = newObjects[i].new_id;
                        relObjectElement.setAttribute('id', idList.join('.'));
                        relObjectElement.setAttribute('name', idList.join('.'));
                    } else {
                        // Update underlying objects if they're not going to be replaced later on or
                        // already replaced (e.g. there's no 'new' in the ID)
                        var relObjectParentElementId = relObjectParentElement.getAttribute('id');
                        var relObjectWillBeReplaced = false;
                        if (relObjectParentElementId.indexOf('new') > -1) {
                            for (var newObjectsKey in newObjects) {
                                if (Object.prototype.hasOwnProperty.call(newObjects, newObjectsKey) &&
                                    newObjects[newObjectsKey].old_id === relObjectParentElementId) {
                                    relObjectWillBeReplaced = true;
                                    break;
                                }
                            }
                            if (!relObjectWillBeReplaced) {
                                // Underlying object is not in newObjects, so we need to replace the IDs of
                                // those inputs as well
                                var indexToBeReplaced = newObjects[i].old_id.split('.')[1].split('_').length - 1;
                                var newRelObjectParentElementIdList = idList[2].split('_');
                                newRelObjectParentElementIdList[indexToBeReplaced] = newObjects[i].new_id;
                                idList[2] = newRelObjectParentElementIdList.join('_');
                                relObjectElement.setAttribute('id', idList.join('.'));
                                relObjectElement.setAttribute('name', idList.join('.'));

                                // And we need to update the parent ID of that partial too
                                var relObjectParentElementIdList = relObjectParentElementId.split('.');
                                relObjectParentElementIdList[1] = newRelObjectParentElementIdList.join('_');
                                relObjectParentElement.setAttribute('id', relObjectParentElementIdList.join('.'));
                            }
                        }
                    }
                }
            }
        }
    }
}

function replaceTotalBudget(total_budget) {
    var totalBudgetNode;

    totalBudgetNode = document.getElementById('total-budget');
    totalBudgetNode.innerHTML = total_budget;
}

function doSubmitStep(saveButton) {
    /* Main function for submitting a form */
    var api_url, form, form_data, request, file_request, message;

    // Collect form data
    form = findAncestorByTag(saveButton, 'form');
    form_data = serialize(form);

    // Remove existing errors and indicate that saving has started
    removeErrors(form);
    startSave(saveButton);

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/project_editor/?format=json';
    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var response;
            response = JSON.parse(request.responseText);
            // Check for errors
            if (response.errors.length > 0) {
                message = defaultValues.save_error;
                addErrors(response.errors);
                finishSave(saveButton, false, message);
            } else {
                message = defaultValues.save_success;
                finishSave(saveButton, true, message);
            }

            // Replace saved values and show that it updated
            for (var i=0; i < response.changes.length; i++) {
                var formElement = document.getElementById(response.changes[i][0]);
                formElement.setAttribute('saved-value', response.changes[i][1]);
                if (formElement.parentNode !== null && elHasClass(formElement.parentNode, 'typeahead')) {
                    var typeaheadContainer = findAncestorByClass(formElement.parentNode, 'typeahead-container');
                    typeaheadContainer.setAttribute('data-value', response.changes[i][1]);
                }

                // Set warning for default indicator periods if new indicator saved
                if (formElement.id.indexOf('rsr_indicator') > -1 && defaultValues.default_indicator > -1) {
                    var parentIndicator = findAncestorByClass(formElement.parentNode, 'indicator-item');
                    if (!parentIndicator.classList.contains('default-period-buttons-set')) {
                        parentIndicator.querySelector('.reload-warning').classList.remove('hidden');
                    }
                }

                successSave(formElement);
            }


            // Replace field IDs, names and unicode
            replaceNames(response.rel_objects);

            // Update progress bars
            var section = findAncestorByClass(form, 'formStep');
            setSectionCompletionPercentage(section);
            setPageCompletionPercentage();

            // Check partnerships (hide or show delete button)
            checkPartnerships();

            // Reset ordering buttons if necessary
            if (form_data.indexOf('rsr_indicator') > -1) {
                setIndicatorSorting();
            }
            if (form_data.indexOf('rsr_result') > -1) {
                setResultSorting();
            }

            return false;
        } else if (request.status === 403) {
            // Not allowed to save
            message = defaultValues.save_forbidden;
            finishSave(saveButton, false, message);
            return false;
        } else {
            // We reached our target server, but it returned an error
            message = defaultValues.save_general_error;
            finishSave(saveButton, false, message);
            return false;
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        message = defaultValues.connection_error;
        finishSave(saveButton, false, message);
        return false;
    };

    request.send(form_data);
}

function submitStep(saveButton) {
    return function(e) {
        e.preventDefault();
        doSubmitStep(saveButton);
    };
}

function setDeletePhoto() {
    var deletePhotoButton = document.getElementById('delete-photo');

    if (deletePhotoButton !== null) {
        deletePhotoButton.onclick = function (e) {
            e.preventDefault();

            // Remove 'delete' button
            var deletePhotoContainer = deletePhotoButton.parentNode;
            deletePhotoContainer.removeChild(deletePhotoButton);

            // Remove any existing errors
            var inputNode = document.getElementById('rsr_project.current_image.' + defaultValues.project_id);
            findAncestorByClass(inputNode, 'form-group').classList.remove('has-error');
            var errorNode = findAncestorByClass(inputNode, 'form-group').querySelector('.help-block-error');
            if (errorNode !== null) {
                errorNode.parentNode.removeChild(errorNode);
            }

            // Create request
            var api_url = '/rest/v1/project/' + defaultValues.project_id + '/?format=json';
            var request = new XMLHttpRequest();
            request.open('PATCH', api_url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.setRequestHeader("Content-type", "application/json");

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var imgNode = document.getElementById('img-photo');
                    imgNode.parentNode.removeChild(imgNode);
                    inputNode.setAttribute('saved-value', '');
                    inputNode.value = '';

                    setSectionCompletionPercentage(findAncestorByClass(inputNode, 'formStep'));
                    setPageCompletionPercentage();

                    return false;
                } else {
                    // We reached our target server, but it returned an error
                    deletePhotoContainer.appendChild(deletePhotoButton);
                    addErrors([
                        {"name": "rsr_project.current_image." + defaultValues.project_id,
                          "error": defaultValues.file_delete_error}
                    ]);
                    return false;
                }
            };

            request.onerror = function () {
                // There was a connection error of some sort
                return false;
            };

            request.send('{"current_image": null}');
        };
    }
}

function setDeleteDocument(documentInput) {
    var deleteDocumentButton = documentInput.parentNode.querySelector('.delete-document');

    if (deleteDocumentButton !== null) {
        deleteDocumentButton.onclick = function (e) {
            e.preventDefault();

            // Remove 'delete' button
            var deleteDocumentContainer = deleteDocumentButton.parentNode;
            deleteDocumentContainer.removeChild(deleteDocumentButton);

            // Remove any existing errors
            var inputNode = deleteDocumentContainer.querySelector('input');
            findAncestorByClass(inputNode, 'form-group').classList.remove('has-error');
            var errorNode = findAncestorByClass(inputNode, 'form-group').querySelector('.help-block-error');
            if (errorNode !== null) {
                errorNode.parentNode.removeChild(errorNode);
            }

            // Get document ID
            var documentId = inputNode.getAttribute('id').split('.').pop();

            // Create request
            var api_url = '/rest/v1/project_document/' + documentId + '/?format=json';
            var request = new XMLHttpRequest();
            request.open('PATCH', api_url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.setRequestHeader("Content-type", "application/json");

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var preview = deleteDocumentContainer.querySelector('.document-preview');
                    preview.parentNode.removeChild(preview);
                    inputNode.setAttribute('saved-value', '');
                    inputNode.value = '';

                    setSectionCompletionPercentage(findAncestorByClass(inputNode, 'formStep'));
                    setPageCompletionPercentage();

                    return false;
                } else {
                    // We reached our target server, but it returned an error
                    deleteDocumentContainer.appendChild(deleteDocumentButton);
                    addErrors([
                        {"name": inputNode.getAttribute('id'),
                         "error": defaultValues.file_delete_error}
                    ]);
                    return false;
                }
            };

            request.onerror = function () {
                // There was a connection error of some sort
                return false;
            };

            request.send('{"document": null}');
        };
    }
}

function replacePhoto(photo) {
    if (photo !== null) {
        var img_photo, photo_container, add_html;

        img_photo = document.querySelector('#img-photo');

        if (img_photo !== null) {
            var delete_link;

            img_photo.parentNode.removeChild(img_photo);
            delete_link = document.querySelector('#delete-photo');

            if (delete_link !== null) {
                delete_link.parentNode.removeChild(delete_link);
            }
        }

        photo_container = document.querySelector('#photo-container');
        add_html = '<img src="' + photo + '" class="current-project-photo" id="img-photo"><a class="btn btn-link delete-photo-button" id="delete-photo"><span class="glyphicon glyphicon-remove"></span> Delete photo</a>';

        photo_container.innerHTML = add_html + photo_container.innerHTML;

        setDeletePhoto();
    }
}

function replaceDocument(documentUrl, documentInput) {
    if (documentUrl !== null) {

        var documentContainer = documentInput.parentNode;
        var documentPreview = documentContainer.querySelector('.document-preview');

        if (documentPreview !== null) {
            var delete_link;

            documentPreview.parentNode.removeChild(documentPreview);
            delete_link = document.querySelector('.delete-document');

            if (delete_link !== null) {
                delete_link.parentNode.removeChild(delete_link);
            }
        }

        var documentUrlNode = document.createElement('a');
        documentUrlNode.setAttribute('class', 'document-preview');
        documentUrlNode.setAttribute('target', '_blank');
        documentUrlNode.setAttribute('href', documentUrl);
        var documentUrlTextNode = document.createTextNode(defaultValues.uploaded_document);
        documentUrlNode.appendChild(documentUrlTextNode);
        documentContainer.appendChild(documentUrlNode);

        var deleteDocumentNode = document.createElement('a');
        deleteDocumentNode.setAttribute('class', 'delete-document');
        var deleteButton = document.createElement('span');
        deleteButton.setAttribute('class', 'glyphicon glyphicon-remove');
        deleteDocumentNode.appendChild(deleteButton);
        documentContainer.appendChild(deleteDocumentNode);

        setDeleteDocument(documentInput);
    }
}

function setFileUploads() {
    var inputs = document.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'file') {
            if (inputs[i].getAttribute('id') === 'rsr_project.current_image.' + defaultValues.project_id) {
                // Project.current_image uploads
                inputs[i].onchange = uploadFile(inputs[i], 2, 'photo');
                setDeletePhoto();
            } else {
                // ProjectDocument.document uploads
                inputs[i].onchange = uploadFile(inputs[i], 5, 'document');
                setDeleteDocument(inputs[i]);
            }
        }
    }
    return false;
}

function uploadFile(fileInput, maxFileSize, fileType) {
    return function(e) {
        e.preventDefault();

        function checkFileSize(file, maxSize) {
            /* Check the size of a file. MaxSize is specified in MB. */
            return file.size < maxSize * 1024 * 1024;
        }

        // Remove error indications
        var errorHelpNodes = fileInput.parentNode.querySelectorAll('.help-block-error');
        for (var i = 0; i < errorHelpNodes.length; i++) {
            errorHelpNodes[i].parentNode.removeChild(errorHelpNodes[i]);
        }
        fileInput.parentNode.classList.remove('has-error');

        // Get file
        var file = fileInput.files[0];

        // Check file size first
        if (!checkFileSize(file, maxFileSize)) {
            var errorText, uploadFileSize;

            uploadFileSize = file.size / 1024 / 1024;

            errorText = defaultValues.file_size + ': ' + uploadFileSize.toFixed(2) + ' MB. ';
            errorText += defaultValues.file_size_allowed + ' ' + maxFileSize.toString() + ' MB.';

            addErrors([{"name": fileInput.getAttribute('id'),
                        "error": errorText}]);
            return false;
        }

        // Check if file is image, supported formats are: jpg, jpeg, png, gif
        if (fileType === 'photo' && !file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            addErrors([{"name": fileInput.getAttribute('id'),
                        "error": defaultValues.image_file_format + ": jpg, jpeg, png, gif"}]);
            return false;
        }

        var api_url = '/rest/v1/project/' + defaultValues.project_id + '/upload_file/?format=json';

        var formData = new FormData();
        formData.append("file", file);
        formData.append("field_id", fileInput.getAttribute('id'));

        var request = new XMLHttpRequest();

        var progressBarContainer = findAncestorByClass(fileInput, 'form-group').querySelector('.file-progress');

        if (request.upload) {
            // Show upload progress bar
            progressBarContainer.classList.remove('hidden');

            // Upload progress bar
            request.upload.addEventListener("progress", function(e) {
                var progressBar = progressBarContainer.querySelector('.progress-bar');
                var percentage = parseInt(e.loaded / e.total * 100);
                progressBar.setAttribute('aria-valuenow', percentage);
                progressBar.style.width = percentage + '%';
                progressBar.innerHTML = percentage + '%';
            }, false);
        }

        request.open("POST", api_url);
        request.setRequestHeader("X-CSRFToken", csrftoken);

        request.onload = function() {
            // Remove upload progress bar
            progressBarContainer.classList.add('hidden');

            if (request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);

                // Check for errors
                if (response.errors.length > 0) {
                    addErrors(response.errors);
                }

                // Replace saved values and show that it updated
                for (var i=0; i < response.changes.length; i++) {
                    if (fileType === 'photo') {
                        // Show photo
                        replacePhoto(response.changes[i][1]);
                    } else {
                        // Show document
                        replaceDocument(response.changes[i][1], fileInput);
                    }

                    var formElement = document.getElementById(response.changes[i][0]);
                    formElement.setAttribute('saved-value', response.changes[i][1]);
                    successSave(formElement);
                }

                // Replace field IDs, names and unicode
                replaceNames(response.rel_objects);

                // Update progress bars
                var section = findAncestorByClass(fileInput, 'formStep');
                setSectionCompletionPercentage(section);
                setPageCompletionPercentage();
            } else {
                // Could not save file
                addErrors([{"name": fileInput.getAttribute('id'),
                            "error": defaultValues.save_general_error}]);
            }
            return false;
        };

        request.onerror = function() {
            // Remove progress bar
            progressBarContainer.classList.add('hidden');

            addErrors([{"name": fileInput.getAttribute('id'),
                        "error": defaultValues.connection_error}]);

            return false;
        };

        request.send(formData);
    };
}

function getTotalBudget() {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/?format=json';

    request = new XMLHttpRequest();
    request.open('GET', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var response;

            response = JSON.parse(request.responseText);
            try {
                replaceTotalBudget(response.budget);
            } catch (error) {
                return false;
            }
        } else {
            // We reached our target server, but it returned an error
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        return false;
    };

    request.send();
}

function returnRemoveButton(parentNode, error) {
    var container = parentNode.querySelector('.delete-related-object-container');

    if (error) {
        var errorNode = document.createElement('div');
        errorNode.setAttribute('style', 'color: red; margin-left: 5px;');
        errorNode.innerHTML = defaultValues.delete_error;
        container.appendChild(errorNode);
    }

    var node = document.createElement('a');
    node.setAttribute('class', 'delete-related-object');
    node.onclick = setRemovePartial(node);

    var trashCan = document.createElement('span');
    trashCan.setAttribute('class', 'glyphicon glyphicon-trash');

    node.appendChild(trashCan);
    container.appendChild(node);
}

function deleteItem(itemId, itemType) {
    /* Delete an item through the API, and remove the associated related object div. */

    var relatedObjDiv = document.getElementById(itemType + '.' + itemId);
    var form = findAncestorByTag(relatedObjDiv, 'form');

    var request = new XMLHttpRequest();
    if (itemType === 'keyword') {
        request.open('DELETE', '/rest/v1/project/' + defaultValues.project_id + '/remove_keyword/' + itemId + '/?format=json', true);
    } else {
        request.open('DELETE', '/rest/v1/' + itemType + '/' + itemId + '/?format=json', true);
    }

    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            relatedObjDiv.parentNode.removeChild(relatedObjDiv);

            // Update the budget in case of removed budget
            if (itemType === 'budget-item') {
                getTotalBudget();
            } else if (itemType === 'result') {
                setResultSorting();
            } else if (itemType === 'indicator') {
                setIndicatorSorting();
            }

            // Update progress bars
            setPageCompletionPercentage();
            setAllSectionsCompletionPercentage();

            checkPartnerships();

            return false;
        } else {
            // We reached our target server, but it returned an error
            returnRemoveButton(relatedObjDiv, true);
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        returnRemoveButton(relatedObjDiv, true);
        return false;
    };

    request.send();
}

function dismissRemove(noNode) {
    return function(e) {
        e.preventDefault();
        var sureNode = noNode.parentNode;
        var parentNode = sureNode.parentNode;
        parentNode.removeChild(sureNode);

        returnRemoveButton(findAncestorByClass(parentNode, 'parent'), false);
    };
}

function confirmRemove(yesNode, objId, apiEndpoint) {
    return function(e) {
        e.preventDefault();
        var sureNode = yesNode.parentNode;
        var parentNode = sureNode.parentNode;
        parentNode.removeChild(sureNode);

        deleteItem(objId, apiEndpoint);
    };
}

function setRemovePartial(node) {
    return function(e) {
        e.preventDefault();

        var parentDiv = findAncestorByClass(node, "parent");
        var parentParent = parentDiv.parentNode;

        // Id will be in the form of 'related_project.1234' or 'related_project.1234_new-0'
        var idArray = parentDiv.getAttributeNode("id").value.split(".");
        var apiEndpoint = idArray[0];
        var objId = idArray[1];

        if (objId.indexOf("new") > -1) {
            // New object, not saved to the DB, so partial can be directly deleted
            parentParent.removeChild(parentDiv);

            setPageCompletionPercentage();
            setAllSectionsCompletionPercentage();
            checkPartnerships();
        } else {
            // Show warning first
            var parentNode = node.parentNode;
            parentNode.removeChild(node);

            var sureNode = document.createElement('div');
            sureNode.setAttribute('class', 'sure-message');
            sureNode.innerHTML = defaultValues.sure_message;

            var yesNode = document.createElement('a');
            yesNode.setAttribute('style', 'color: green; margin-left: 5px;');
            yesNode.onclick = confirmRemove(yesNode, objId, apiEndpoint);
            yesNode.innerHTML = defaultValues.yes;

            var noNode = document.createElement('a');
            noNode.setAttribute('style', 'color: red; margin-left: 5px;');
            noNode.onclick = dismissRemove(noNode);
            noNode.innerHTML = defaultValues.no;

            sureNode.appendChild(yesNode);
            sureNode.appendChild(noNode);
            parentNode.appendChild(sureNode);
        }
    };
}

function buildReactComponents(typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption, inputType) {
    var Typeahead, TypeaheadLabel, TypeaheadContainer, selectorTypeahead, selectorClass, inputClass, typeaheadInput;
    Typeahead = ReactTypeahead.Typeahead;

    if (inputType === 'project') {
        typeaheadOptions.forEach(function(o) {
            o.filterOption = o.id + ' ' + o.title;
            o.displayOption = o.title + ' (ID: ' + o.id + ')';
        });
        filterOption = 'filterOption';
        displayOption = 'displayOption';
    } else if (inputType === 'org') {
        typeaheadOptions.forEach(function(o) {
            var newName = getDisplayOption(o.name, o.long_name);

            o.filterOption = o.name + ' ' + o.long_name;
            o.displayOption = newName;
        });
        filterOption = 'filterOption';
        displayOption = 'displayOption';
    }

    function getDisplayOption(short, long) {
        if (short === long) {
            return short;
        }
        if (!long) {
            return short;
        }
        return short + ' (' + long + ')';
    }
    inputClass = "form-control " + childClass;

    selectorClass = document.getElementById(selector);

    TypeaheadContainer = React.createClass({
        getInitialState: function() {
            return ({focusClass: 'inactive'});
        },

        onKeyUp: function() {
            // Only activate the "add org" button for typeaheads that are for organisations
            if (inputType === 'org') {
                this.setState({focusClass: 'active'});
            }
        },

        onBlur: function() {
            this.setState({focusClass: 'inactive'});
        },

        render: function() {
            return React.createElement('div', {className: this.state.focusClass},
                React.createElement(Typeahead, {
                    placeholder: '',
                    options: typeaheadOptions,
                    onOptionSelected: typeaheadCallback,
                    maxVisible: 10,
                    displayOption: displayOption,
                    filterOption: filterOption,
                    childID: selector,
                    onKeyUp: this.onKeyUp,
                    onBlur: this.onBlur,
                    customClasses: {
                        typeahead: "",
                        input: inputClass,
                        results: "",
                        listItem: "",
                        token: "",
                        customAdd: ""
                    },
                    inputProps: {
                        name: selector,
                        id: selector
                    }
                }),
                React.createElement('div', {
                    className: "addOrg",
                    onMouseDown: addOrgModal
                }, '+ ' + defaultValues.add_new_organisation)
            );
        }
    });

    var footer = document.querySelector('footer');
    footer.setAttribute('selector', selector);

    ReactDOM.render(
        React.createElement(TypeaheadContainer), selectorClass
    );

    selectorClass.removeAttribute('id');

    typeaheadInput = selectorClass.querySelector('.typeahead input');
    typeaheadInput.setAttribute('autocomplete', 'off');
    typeaheadInput.setAttribute('id', selector);

    if (valueId !== null) {
        for (var i = 0; i < typeaheadOptions.length; i++) {
            if (parseInt(typeaheadOptions[i].id, 10) == parseInt(valueId, 10)) {
                var savedResult;

                savedResult = typeaheadOptions[i];

                typeaheadInput.value = savedResult[displayOption];
                typeaheadInput.setAttribute('value', savedResult.id);
                if (selectorClass.hasAttribute('not-saved')) {
                    selectorClass.removeAttribute('not-saved');
                    typeaheadInput.setAttribute('saved-value', '');
                } else {
                    typeaheadInput.setAttribute('saved-value', savedResult.id);
                }
            }
        }
    } else {
        typeaheadInput.setAttribute('saved-value', '');
    }

    selectorTypeahead = selectorClass.querySelector('.typeahead');
    selectorTypeahead.appendChild(label);
    selectorTypeahead.appendChild(help);
    elAddClass(selectorClass, 'has-typeahead');
}

function updateSectionState(section) {
    // FIXME: Not all functions called here update just the section state --
    // some of them update the state everywhere in the page!

    // Check if the section was already updated, and return if so
    if (elHasClass(section, 'section-state-updated')) {
        return;
    }

    updateAllHelpIcons();
    markMandatoryFields(section);
    setHiddenFields(section);
    checkPartnerships();
    setAllSectionsCompletionPercentage();
    setSectionChangeListener(section);
    setPageCompletionPercentage();

    // Mark section as updated
    elAddClass(section, 'section-state-updated');

}

function updateAllSectionState(){
    document.querySelectorAll('.myPanel').forEach(function(section){
        updateSectionState(section);
    });
}

function loadAsync(url, retryCount, retryLimit, callback, forceReloadOrg) {
    var xmlHttp;

    // If we already have the response cached, don't fetch it again
    if (responses[url] !== null && !forceReloadOrg) {
        callback(responses[url]);
        return;
    }

    // If the response is in localStorage, don't fetch it again
    if (localStorageResponses !== null && localStorageResponses !== '' && !forceReloadOrg) {
        if (localStorageResponses[url] !== undefined) {
            var response = localStorageResponses[url];

            if (isFresh(response.date, MAX_LOCALSTORAGE_AGE)) {
                callback(response.json);
                return;
            }
        }
    }

    function isFresh(writeDate, maxAge) {
        var currentDate, age;

        currentDate = new Date();
        currentDate = currentDate.getTime();
        age = currentDate - writeDate;

        return age <= maxAge;
    }

    xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {

            if (xmlHttp.status == 200){
                var response = JSON.parse(xmlHttp.responseText);
                responses[url] = response;
                updateLocalStorage(url, response);
                callback(response);
            } else {
                if (retryCount >= retryLimit) {
                    // we should load the project list from localstorage here
                    return false;
                } else {
                    retryCount = retryCount + 1;
                    loadAsync(url, retryCount, retryLimit, callback);
                }
            }
        } else {
            return false;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function updateLocalStorage(url, response) {
    var output, writeDate, lsData;

    if (localStorageResponses === null || localStorageResponses === '') {
        localStorageResponses = {};
    }

    output = {};

    writeDate = new Date();
    writeDate = writeDate.getTime();
    output.date = writeDate;
    output.json = response;

    localStorageResponses[url] = output;

    lsData = JSON.stringify(localStorageResponses);

    try {
        localStorage.setItem(localStorageName, lsData);
    } catch (error) {
        // Not enough space in local storage
        localStorage.setItem(localStorageName, JSON.stringify({}));
    }
}

function processResponse(response, selector, childClass, valueId, label, help, filterOption, inputType) {
    var typeaheadOptions = response.results;
    var typeaheadCallback = function(option) {
        var el = document.getElementById(selector);
        el.setAttribute('value', option.id);
    };
    var displayOption = function(option, index) {
        return option[filterOption];
    };

    buildReactComponents(typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption, inputType);

    // Clear all old timers to update the section states and setup a new one in a second.
    clearTimeout(update_section_states_timer);
    update_section_states_timer = setTimeout(updateAllSectionState, 1000);
}

function getCallback(selector, childClass, valueId, label, help, filterOption, inputType) {
    var output = function(response) {
        processResponse(response, selector, childClass, valueId, label, help, filterOption, inputType);
    };

    return output;
}

function setSubmitOnClicks() {
    var saveDivs = document.querySelectorAll('.save-button');

    for (var i=0; i < saveDivs.length; i++) {
        var saveButton = saveDivs[i].querySelector('button');
        saveButton.addEventListener('click', submitStep(saveButton));
    }
}

function setPartialOnClicks() {
    /* Set all onclicks and onchanges of a partial */

    // Set the 'Add new ...' button onclicks
    for (var i=0; i < partials.length; i++) {
        var partial = partials[i];
        var buttons = document.querySelectorAll('.add-' + partial);

        for (var j = 0; j < buttons.length; j++) {
            var el = buttons[j];
            var callback;

            if (elHasClass(el, 'has-onclick')) {
                // already set the onclick, do nothing
                continue;
            }

            callback = addPartial(partial, findAncestorByClass(el, partial + '-container'));
            el.addEventListener('click', callback);
            elAddClass(el, 'has-onclick');
        }
    }

    // Set the delete object button onclicks
    var removeLinks = document.querySelectorAll('.delete-related-object');
    for (var k = 0; k < removeLinks.length; k++) {
        removeLinks[k].onclick = setRemovePartial(removeLinks[k]);
    }

    // Set the hide or show partial onclick
    var hidePartials = document.querySelectorAll('.hide-partial-click');
    for (var l = 0; l < hidePartials.length; l++) {
        hidePartials[l].onclick = togglePartial(hidePartials[l]);
    }

    var selectInputs = document.querySelectorAll('select');
    for (var m = 0; m < selectInputs.length; m++) {
        if (selectInputs[m].getAttribute('id') !== 'progress-bar-select') {
            var selectInputId = selectInputs[m].getAttribute('id').split('.');
            // Set the organisation role onchange
            if (selectInputId[0] == 'rsr_partnership' && selectInputId[1] == 'iati_organisation_role') {
                selectInputs[m].onchange = togglePartner(selectInputs[m]);
            }
            // Set the budget item labels onchange
            if (selectInputId[0] == 'rsr_budgetitem' && selectInputId[1] == 'label') {
                selectInputs[m].onchange = toggleOtherLabel(selectInputs[m]);
            }
            if (selectInputId[0] == 'rsr_indicator' && selectInputId[1] == 'type') {
                selectInputs[m].onchange = function(e){
                    setMeasureVisibility(e.target);
                    setDimensionVisibility(e.target);
                };
            }
        }
    }

    // Set the special info icons
    var specialInfoIcons = document.querySelectorAll('.info-icon-special');
    for (var n = 0; n < specialInfoIcons.length; n++) {
        specialInfoIcons[n].onclick = toggleHelpText(specialInfoIcons[n]);
    }

    // Set the document file upload toggle
    var documentToggles = document.querySelectorAll('.document-toggle');
    for (var o = 0; o < documentToggles.length; o++) {
        documentToggles[o].onchange = toggleDocumentUpload(documentToggles[o]);
    }

    // Set the related project toggle
    var relatedProjectToggles = document.querySelectorAll('.related-project-toggle');
    for (var p = 0; p < relatedProjectToggles.length; p++) {
        relatedProjectToggles[p].onchange = toggleRelatedProject(relatedProjectToggles[p]);
    }
}

function toggleRelatedProject(toggleNode) {
    /* It is possible to switch between entering an RSR project and an IATI identifier */
    return function(e) {
        e.preventDefault();

        var parent = findAncestorByClass(toggleNode, 'parent');
        var relatedProjectFormGroup = findAncestorByClass(parent.querySelectorAll('input')[0], 'form-group');
        var iatiIdFormGroup = findAncestorByClass(parent.querySelectorAll('input')[1], 'form-group');

        if (toggleNode.checked) {
            // Show the IATI identifier
            iatiIdFormGroup.classList.remove('hidden');
            relatedProjectFormGroup.classList.add('hidden');
        } else {
            // Show the URL field
            iatiIdFormGroup.classList.add('hidden');
            relatedProjectFormGroup.classList.remove('hidden');
        }
    };
}

function toggleDocumentUpload(toggleNode) {
    /* It is possible to switch between entering a document URL and uploading a file */
    return function(e) {
        e.preventDefault();

        var parent = findAncestorByClass(toggleNode, 'parent');
        var urlFormGroup = findAncestorByClass(parent.querySelectorAll('input')[0], 'form-group');
        var fileFormGroup = findAncestorByClass(parent.querySelectorAll('input')[1], 'form-group');

        if (toggleNode.checked) {
            // Show the file upload
            fileFormGroup.classList.remove('hidden');
            fileFormGroup.classList.remove('always-hidden');
            urlFormGroup.classList.add('hidden');
            urlFormGroup.classList.add('always-hidden');
        } else {
            // Show the URL field
            fileFormGroup.classList.add('hidden');
            fileFormGroup.classList.add('always-hidden');
            urlFormGroup.classList.remove('hidden');
            urlFormGroup.classList.remove('always-hidden');
        }
    };
}

function toggleHelpText(helpIconNode) {
    /* For several help texts we show an info icon (different from those in the labels of fields) */
    return function(e) {
        e.preventDefault();
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

        var toggleNode = document.getElementById(helpIconNode.getAttribute('toggleid'));

        if (toggleNode.classList.contains('hidden')) {
            toggleNode.classList.remove('hidden');
            helpIconNode.classList.add('activated');
        } else {
            toggleNode.classList.add('hidden');
            helpIconNode.classList.remove('activated');
        }
    };
}

function toggleOtherLabel(selectNode) {
    /* The 'Other' label for budget items can only be filled in when the budget item is 'Other' */
    return function(e) {
        e.preventDefault();

        var parent = findAncestorByClass(selectNode, 'parent');
        var nodeIdList = selectNode.getAttribute('id').split('.');
        var labelNodeId = [nodeIdList[0], 'other_extra', nodeIdList[2]].join('.');
        var labelNode = document.getElementById(labelNodeId);

        if (selectNode.options[selectNode.selectedIndex].text === 'Other' && labelNode.hasAttribute('disabled')) {
            labelNode.removeAttribute('disabled');
        } else if (selectNode.options[selectNode.selectedIndex].text !== 'Other' && !(labelNode.hasAttribute('disabled'))) {
            labelNode.setAttribute('disabled', '');
            labelNode.value = '';
        }
    };
}

function checkPartnerships() {
    /* - Hides the trash can if there's only one partnership.
    *  - Hides the trash can if removing the partnership will not allow the user to edit anymore.
    *  - Remove the 'Reporting organisation' option when it is already selected. */

    if (!defaultValues.is_admin) {
        var partnerContainer = document.getElementById('partner-container');
        var trashCan;

        if (partnerContainer !== null) {
            var partnerPartials = partnerContainer.querySelectorAll('.parent');
            if (partnerPartials.length === 1) {
                // Hides the trash can if there's only one partnership.
                trashCan = partnerPartials[0].querySelector('.delete-related-object');
                if (!elHasClass(trashCan, 'hidden')) {
                    elAddClass(trashCan, 'hidden');
                }
            } else {
                // Remove the 'Reporting organisation' option when it is already selected.
                var reportingSelected = false;
                var options, partialId, roleNode;

                for (var i = 0; i < partnerPartials.length; i++) {
                    partialId = partnerPartials[i].getAttribute('id').split('.')[1];
                    roleNode = document.getElementById('rsr_partnership.iati_organisation_role.' + partialId);

                    if (roleNode.value === '101') {
                        reportingSelected = true;
                    }

                    trashCan = partnerPartials[i].querySelector('.delete-related-object');
                    if (elHasClass(trashCan, 'hidden')) {
                        elRemoveClass(trashCan, 'hidden');
                    }
                }

                if (reportingSelected === true) {
                    for (var j = 0; j < partnerPartials.length; j++) {
                        partialId = partnerPartials[j].getAttribute('id').split('.')[1];
                        roleNode = document.getElementById('rsr_partnership.iati_organisation_role.' + partialId);

                        if (roleNode.value !== '101') {
                            options = roleNode.querySelectorAll('option');
                            for (var k = 0; k < options.length; k++) {
                                if (options[k].getAttribute('value') === '101') {
                                    options[k].parentNode.removeChild(options[k]);
                                }
                            }
                        }
                    }
                } else {
                    for (var l = 0; l < partnerPartials.length; l++) {
                        partialId = partnerPartials[l].getAttribute('id').split('.')[1];
                        roleNode = document.getElementById('rsr_partnership.iati_organisation_role.' + partialId);
                        var hasReportingOption = false;

                        options = roleNode.querySelectorAll('option');
                        for (var m = 0; m < options.length; m++) {
                            if (options[m].getAttribute('value') === '101') {
                                hasReportingOption = true;
                            }
                        }

                        if (hasReportingOption === false) {
                            var reportingOption = document.createElement('option');
                            reportingOption.setAttribute('value', '101');
                            var reportingOptionText = document.createTextNode(defaultValues.reporting_org);
                            reportingOption.appendChild(reportingOptionText);
                            roleNode.appendChild(reportingOption);
                        }
                    }
                }

                // Hides the trash can if removing the partnership will not allow the user to edit anymore.
                var partnerNodes = [];
                for (var n = 0; n < partnerPartials.length; n++) {
                    var partnerIdNode = partnerPartials[n].querySelector('.typeahead');
                    if (partnerIdNode !== null) {
                        var partnerId = partnerIdNode.querySelector('input').getAttribute('saved-value');
                        if (defaultValues.org_permissions.indexOf(parseInt(partnerId)) > -1) {
                            partnerNodes.push(partnerPartials[n].querySelector('.delete-related-object'));
                        }
                    }
                }
                if (partnerNodes.length === 1 && !elHasClass(partnerNodes[0], 'hidden')) {
                    elAddClass(partnerNodes[0], 'hidden');
                } else if (partnerNodes.length > 1) {
                    for (var o = 0; o < partnerNodes.length; o++) {
                        if (elHasClass(partnerNodes[o], 'hidden')) {
                            elRemoveClass(partnerNodes[o], 'hidden');
                        }
                    }
                }
            }
        }
    }
}

function togglePartner(selectNode) {
    /* The funding amount can only be filled in when a partner is a funding partner
     * The secondary reporter can only be filled in when a partner is a reporting partner */
    return function(e) {
        e.preventDefault();

        var parent = findAncestorByClass(selectNode, 'parent');
        var nodeIdList = selectNode.getAttribute('id').split('.');

        var fundingNodeId = [nodeIdList[0], 'funding_amount', nodeIdList[2]].join('.');
        var fundingNode = document.getElementById(fundingNodeId);
        var fundingFormGroup = findAncestorByClass(fundingNode, 'form-group');

        var secondaryNodeId = [nodeIdList[0], 'is_secondary_reporter', nodeIdList[2]].join('.');
        var secondaryNode = document.getElementById(secondaryNodeId);
        var secondaryFormGroup = findAncestorByClass(secondaryNode, 'form-group');

        if (selectNode.value !== '101') {
            if (selectNode.value === '1' && fundingNode.hasAttribute('disabled')) {
                fundingNode.removeAttribute('disabled');
            } else if (selectNode.value !== '1') {
                fundingNode.setAttribute('disabled', '');
                fundingNode.value = '';
            }
            if (elHasClass(fundingFormGroup, 'hidden')) {
                elRemoveClass(fundingFormGroup, 'hidden');
                elRemoveClass(fundingFormGroup, 'always-hidden');
                elAddClass(secondaryFormGroup, 'hidden');
                elAddClass(secondaryFormGroup, 'always-hidden');
            }
        } else if (elHasClass(secondaryFormGroup, 'hidden')) {
            elRemoveClass(secondaryFormGroup, 'hidden');
            elRemoveClass(secondaryFormGroup, 'always-hidden');
            elAddClass(fundingFormGroup, 'hidden');
            elAddClass(fundingFormGroup, 'always-hidden');
        }

        checkPartnerships();
        markMandatoryFields(parent);
    };
}

function setMeasureVisibility(indicatorTypeSelect) {
    /*
        Show or hide measure fields depending on indicator type
     */
    // parent is the div wrapping one whole indicator form, it's the outer node in
    // related_objects/indicator_input.html
    var parent = findAncestorByClass(indicatorTypeSelect, 'parent');
    var measureRow = parent.getElementsByClassName('measure')[0];
    // hide measure fields for qualitative indicators
    if (indicatorTypeSelect.value === '2') {
        elAddClass(measureRow, 'hidden');
    } else {
        elRemoveClass(measureRow, 'hidden');
    }
}

function setDimensionVisibility(indicatorTypeSelect) {
    /*
       Show or hide dimension fields depending on indicator type
     */
    // parent is the div wrapping one whole indicator form, it's the outer node in
    // related_objects/indicator_input.html
    var parent = findAncestorByClass(indicatorTypeSelect, 'parent'),
        dimensionDiv = parent.querySelector('.indicator-dimension-container'),
        relatedContainer = dimensionDiv.parentElement;
    // hide indicator dimension fields for qualitative indicators
    if (indicatorTypeSelect.value === '2') {
        elAddClass(dimensionDiv, 'hidden');
        elAddClass(relatedContainer, 'hidden');
    } else {
        elRemoveClass(dimensionDiv, 'hidden');
        elRemoveClass(relatedContainer, 'hidden');
    }
}

function togglePartial(hidePartial) {
    return function(e) {
        e.preventDefault();

        var partialToHide, foldedIndicator, fold;

        partialToHide = hidePartial.parentNode.parentNode.getElementsByClassName('hide-partial')[0];
        foldedIndicator = hidePartial.getElementsByClassName('folded-sign')[0];

        if (foldedIndicator.innerHTML === '-') {
            foldedIndicator.innerHTML = '+';
            partialToHide.className += ' hidden';
        } else {
            foldedIndicator.innerHTML = '-';
            partialToHide.className = partialToHide.className.replace('hidden', '');
        }
    };
}

function updatePartialIDs(partial, newID) {
    /* Function that updates all IDs and names of a partial to the new ID
     * Fields will be in the form of '<model_name>.<field_name>.<new_ID>'
     * The general ID will be in the form of '<model_name>.<new_ID>' */

    // Set general ID of the partial
    var oldIdList = partial.getAttribute('id').split('.');
    partial.setAttribute('id', [oldIdList[0], newID].join('.'));

    // Replace names and IDs of all input, select and textarea fields
    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var partialInputs = partial.querySelectorAll(INPUT_ELEMENTS[i]);
        for (var j = 0; j < partialInputs.length; j++) {
            if (partialInputs[j].type !== 'checkbox') {
                var oldFieldIdList = partialInputs[j].getAttribute('id').split('.');
                partialInputs[j].setAttribute('id', [oldFieldIdList[0], oldFieldIdList[1], newID].join('.'));
                partialInputs[j].setAttribute('name', [oldFieldIdList[0], oldFieldIdList[1], newID].join('.'));
            }
        }
    }

    // Replace names and IDs of all typeahead fields
    var typeaheadContainers = partial.querySelectorAll('.typeahead-container');
    for (var k = 0; k < typeaheadContainers.length; k++) {
        // Update the data-child-id attribute
        var oldChildIdList = typeaheadContainers[k].getAttribute('data-child-id').split('.');
        var oldTypeaheadId = oldChildIdList[2];
        typeaheadContainers[k].setAttribute('data-child-id', [oldChildIdList[0], oldChildIdList[1], newID].join('.'));

        // Update the parent's id
        typeaheadContainers[k].setAttribute('id', [oldChildIdList[0], oldChildIdList[1], newID].join('.'));

        var typeaheadParent = typeaheadContainers[k].parentNode;
        var typeaheadParentClassList = typeaheadParent.classList;
        for (var l = 0; l < typeaheadParentClassList.length; l++) {
            if (typeaheadParentClassList[l].indexOf(oldTypeaheadId) > -1) {
                typeaheadParentClassList.add([oldChildIdList[0], oldChildIdList[1], newID].join('_'));
                typeaheadParentClassList.remove(typeaheadParentClassList[l]);
            }
        }

        // Update the data-child-class attribute
        var childClassList = typeaheadContainers[k].getAttribute('data-child-class').trim().split(' ');
        for (var m = 0; m < childClassList.length; m++) {
            if (childClassList[m].indexOf(oldTypeaheadId) > -1) {
                var newChildClass = [oldChildIdList[0], oldChildIdList[1], newID].join('_');
                childClassList.splice(m, 1);
                childClassList.push(newChildClass);
                break;
            }
        }
        typeaheadContainers[k].setAttribute('data-child-class', childClassList.join(' '));
    }

    // Replace IDs of all date fields
    var dateContainers = partial.querySelectorAll('.datepicker-container');
    for (var n = 0; n < dateContainers.length; n++) {
        // Update the data-id attribute
        var oldDataIdList = dateContainers[n].getAttribute('data-id').split('.');
        dateContainers[n].setAttribute('data-id', [oldDataIdList[0], oldDataIdList[1], newID].join('.'));
    }
}

function addPartial(partialName, partialContainer) {
    return function(e) {
        e.preventDefault();

        function findInHierachy(hierarchy, partialName) {
            /* Find the partial in the hierarchy, and return the depth with the remaining
             * partials in a list. Returns [-1, false] if not found. */
            for (var i = 0; i < hierarchy.length; i++) {
                for (var j = 0; j < hierarchy[i].length; j++) {
                    if (hierarchy[i][j] === partialName) {
                        hierarchy[i].splice(0, j + 1);
                        return [j + 1, hierarchy[i]];
                    }
                }
            }

            return [-1, false];
        }

        // Indicate the hierarchy of partials
        var partialHierarchy = [
            ['result', 'indicator', 'indicator-period', 'indicator-period-actual-dimension'],
            ['result', 'indicator', 'indicator-period', 'indicator-period-actual-location'],
            ['result', 'indicator', 'indicator-period', 'indicator-period-target-dimension'],
            ['result', 'indicator', 'indicator-period', 'indicator-period-target-location'],
            ['result', 'indicator', 'indicator-dimension'],
            ['result', 'indicator', 'indicator-label'],
            ['result', 'indicator', 'indicator-reference'],
            ['transaction', 'transaction-sector'],
            ['project-location', 'location-administrative'],
            ['document', 'document-category'],
            ['crs-add', 'crsadd-other-flag'],
            ['fss', 'fss-forecast']
        ];

        // Get partial from partial templates and add it to DOM
        var markupSelector = '#' + partialName + '-input';
        var partialString = document.querySelector(markupSelector).innerHTML;
        var domParser = new DOMParser();
        var partial = domParser.parseFromString(partialString, "text/html").querySelector('.parent');

        // Add partial to container, before the 'Add new ..' row
        var addRow = partialContainer.querySelector('.add-' + partialName).parentNode.parentNode;
        partialContainer.insertBefore(partial, addRow);

        // Fetch the number of times the partial is already in the document, and add the count
        // to "new-" to create the new partial id
        var newID = 'new-' + document.querySelectorAll('.' + partialName + '-item').length;

        // Look for the partial in the hierarchy
        var hierarchyList = findInHierachy(partialHierarchy, partialName);

        // Always update the partial's ID itself first
        var oldPartialID = partial.getAttribute('id').split('.')[1];
        newID = oldPartialID.substring(0, oldPartialID.length - 5) + newID;
        updatePartialIDs(partial, newID);

        var childContainer, relatedObjCount;
        if (hierarchyList[0] === 1) {
            // First level, with more related objects underneath, update second level
            childContainer = partial.querySelector('.parent');
            relatedObjCount = document.querySelectorAll('.' + hierarchyList[1][0] + '-item').length;
            var childId = [newID, 'new-' + relatedObjCount.toString()].join('_');
            updatePartialIDs(childContainer, childId);

            // Check if there is a third level
            if (hierarchyList[1].length > 1) {
                var childChildContainers = childContainer.querySelectorAll('.parent');
                var childRelatedObjCount = document.querySelectorAll('.' + hierarchyList[1][1] + '-item').length;
                for (var i = 0; i < childChildContainers.length; i++) {
                    updatePartialIDs(childChildContainers[i], [childId, 'new-' + childRelatedObjCount.toString()].join('_'));

                    // Check if there is a fourth level
                    if (hierarchyList[1].length > 2) {
                        var childChildChildContainers = childChildContainers[i].querySelectorAll('.parent');
                        var childChildRelatedObjCount = document.querySelectorAll('.' + hierarchyList[1][2] + '-item').length;
                        for (var j = 0; j < childChildChildContainers.length; j++) {
                            updatePartialIDs(childChildChildContainers[j], [childId, 'new-' + childRelatedObjCount.toString(), 'new-' + childChildRelatedObjCount.toString()].join('_'));
                        }
                    }
                }
            }
        } else if (hierarchyList[0] > 1) {
            // Second, third or fourth level: fetch the ID from the parent item and add the new ID to it
            parentContainer = findAncestorByClass(partialContainer, 'parent');
            parentID = parentContainer.getAttribute('id').split('.')[1];
            newID = 'new-' + document.querySelectorAll('.' + partialName + '-item').length;
            if (parentID.indexOf('_') > -1) {
                // Parent ID + new ID
                newID = [parentID, newID].join('_');
            } else {
                if (hierarchyList[0] === 2) {
                    // Parent ID is e.g. "5", but child ID must be "1205_5_new-1"
                    newID = [defaultValues.project_id, parentID, newID].join('_');
                } else {
                    // Parent ID is e.g. "5", but child ID must be "1205_15_5_new-1"
                    var parentParentContainer = findAncestorByClass(parentContainer, 'parent');
                    var parentParentID = parentParentContainer.getAttribute('id').split('.')[1];
                    newID = [defaultValues.project_id, parentParentID, parentID, newID].join('_');
                }
            }
            updatePartialIDs(partial, newID);

            // Check if there is a third level (only possible on level 2)
            if (hierarchyList[1].length > 0) {
                var childContainers = partial.querySelectorAll('.parent');
                relatedObjCount = document.querySelectorAll('.' + hierarchyList[1][0] + '-item').length;
                for (var k = 0; k < childContainers.length; k++) {
                    updatePartialIDs(childContainers[k], [newID, 'new-' + relatedObjCount.toString()].join('_'));

                    // Check if there is a fourth level
                    if (hierarchyList[1].length > 1) {
                        var childOfChildContainers = childContainers[k].querySelectorAll('.parent');
                        var childOfRelatedObjCount = document.querySelectorAll('.' + hierarchyList[1][1] + '-item').length;
                        for (var l = 0; l < childOfChildContainers.length; l++) {
                            updatePartialIDs(childOfChildContainers[l], [newID, 'new-' + relatedObjCount.toString(), 'new-' + childOfRelatedObjCount.toString()].join('_'));
                        }
                    }
                }
            }
        }

        // Update the currency
        var projectCurrencyDropdown = document.getElementById('rsr_project.currency.' + defaultValues.project_id),
            currencyDisplays = partial.querySelectorAll('.currency-display'),
            projectCurrency = 'EUR';
        if (projectCurrencyDropdown !== null) {
            projectCurrency = projectCurrencyDropdown.value;
        }
        for (var m = 0; m < currencyDisplays.length; m++) {
            currencyDisplays[m].innerHTML = projectCurrency;
        }

        var parentContainer, parentID;

        // Update the typeaheads, datepickers and currency fields
        updateTypeaheads();
        setDatepickers();
        setCurrencyOnChange();
        setSectorOnChange();

        // Update help icons and progress bars
        updateHelpIcons('.' + partialName + '-container');
        setPageCompletionPercentage();
        setAllSectionsCompletionPercentage();
        setAllSectionsChangeListener();
        setValidationListeners();

        // Set onClicks for partials again in case this partial contains other partials
        setPartialOnClicks();
        setFileUploads();
        checkPartnerships();
    };
}

function updateTypeahead(els, filterOption, labelText, helpText, API, inputType, forceReloadOrg) {
    function getLoadAsync(childSelector, childClass, valueId, label, help, filterOption, inputType, forceReloadOrg) {
        return function() {
            loadAsync(API, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, filterOption, inputType), forceReloadOrg);
        };
    }

    for (var i = 0; i < els.length; i++) {
        var el = els[i];

        // Check if we've already rendered this typeahead
        if (elHasClass(el, 'has-typeahead')) {
            if (forceReloadOrg) {
                // Remove the existing typeahead, then build a new one with the reloaded API response
                var child = el.querySelector('div');
                el.removeChild(child);
                el.setAttribute('id', el.getAttribute('data-child-id'));

            } else {
                // Typeahead exists and we don't need to reload the API response. Do nothing.
                continue;
            }
        }

        var childSelector = el.getAttribute('data-child-id');
        var childClass = el.getAttribute('data-child-class');
        var valueId = null;
        var label = document.createElement('label');
        var help = document.createElement('p');

        label.setAttribute('for', childSelector);
        elAddClass(label, 'control-label');
        elAddClass(label, 'typeahead-label');
        label.textContent = labelText;

        elAddClass(help, 'help-block');
        elAddClass(help, 'hidden');
        help.textContent = helpText;

        if (el.getAttribute('data-value') !== "") {
            valueId = el.getAttribute('data-value');
        }

        var cb = getLoadAsync(childSelector, childClass, valueId, label, help, filterOption, inputType, forceReloadOrg);
        cb();
    }
}

function updateProjectTypeaheads() {
    var els, filterOption, labelText, helpText, API, inputType;

    els = document.querySelectorAll('.rsr_relatedproject-related_project');
    labelText = defaultValues.related_project_label;
    helpText = defaultValues.related_project_helptext;
    filterOption = 'title';
    API = projectsAPIUrl;
    inputType = 'project';

    updateTypeahead(els, filterOption, labelText, helpText, API, inputType);
}

function updateOrganisationTypeaheads(forceReloadOrg) {
    var els, filterOption, labelText, helpText, API, inputType;

    els = document.querySelectorAll('.rsr_partnership-organisation');
    labelText = defaultValues.partner_label;
    helpText = defaultValues.partner_helptext;
    filterOption = 'name';
    API = orgsAPIUrl;
    inputType = 'org';
    updateTypeahead(els, filterOption, labelText, helpText, API, inputType, forceReloadOrg);

    els = document.querySelectorAll('.rsr_transaction-provider_organisation');
    labelText = defaultValues.provider_org_label;
    helpText = defaultValues.provider_org_helptext;
    filterOption = 'name';
    API = orgsAPIUrl;
    inputType = 'org';
    updateTypeahead(els, filterOption, labelText, helpText, API, inputType, forceReloadOrg);

    els = document.querySelectorAll('.rsr_transaction-receiver_organisation');
    labelText = defaultValues.recipient_org_label;
    helpText = defaultValues.recipient_org_helptext;
    filterOption = 'name';
    API = orgsAPIUrl;
    inputType = 'org';
    updateTypeahead(els, filterOption, labelText, helpText, API, inputType, forceReloadOrg);

    els = document.querySelectorAll('.rsr_planneddisbursement-provider_organisation');
    labelText = defaultValues.provider_org_label;
    helpText = defaultValues.provider_org_helptext;
    filterOption = 'name';
    API = orgsAPIUrl;
    inputType = 'org';
    updateTypeahead(els, filterOption, labelText, helpText, API, inputType, forceReloadOrg);

    els = document.querySelectorAll('.rsr_planneddisbursement-receiver_organisation');
    labelText = defaultValues.recipient_org_label;
    helpText = defaultValues.recipient_org_helptext;
    filterOption = 'name';
    API = orgsAPIUrl;
    inputType = 'org';
    updateTypeahead(els, filterOption, labelText, helpText, API, inputType, forceReloadOrg);
}

function updateTypeaheads(forceReloadOrg) {
    updateOrganisationTypeaheads(forceReloadOrg);
    updateProjectTypeaheads();
}

function updateHelpIcons(container) {
    /* Add an "info" glyphicon to each label and clicking the glyphicon shows the help text */
    var labels = document.querySelectorAll(container + ' label.control-label');

    for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        var output, helpBlockIsLabelSibling, iconClasses, helpBlockFromLabel;

        if (elHasClass(label, 'has-icon')) {
            // We've already processed this label. Do nothing.
            continue;
        }

        // Assume that the help block is a sibling of the label element
        helpBlockIsLabelSibling = true;
        var numHelpBlocks = label.parentNode.querySelectorAll('.help-block').length;
        var numParentHelpBlocks = label.parentNode.parentNode.querySelectorAll('.help-block').length;

        if (numHelpBlocks === 0) {
            if (numParentHelpBlocks === 1) {
                helpBlockIsLabelSibling = false;
            } else {

            // There is no help block for this label
            continue;
            }
        }

        if (helpBlockIsLabelSibling) {
            helpBlockFromLabel = label.parentNode.querySelector('.help-block');
        } else {
            helpBlockFromLabel = label.parentNode.parentNode.querySelector('.help-block');
        }

        iconClasses = ['glyphicon', 'glyphicon-info-sign', 'info-icon'];

        if (elIsVisible(helpBlockFromLabel)) {
            iconClasses.push('activated');
        }

        output = document.createElement('span');

        for (var k = 0; k < iconClasses.length; k++) {
            elAddClass(output, iconClasses[k]);
        }

        label.appendChild(output);

        var infoIcons = label.querySelectorAll('.info-icon');

        for (var j = 0; j < infoIcons.length; j++) {
            infoIcons[j].onclick = getInfoIconListener(infoIcons[j], helpBlockIsLabelSibling);
        }

        // Mark the label as processed to avoid adding extra help icons to it later
        elAddClass(label, 'has-icon');
    }
}

function getInfoIconListener(el, helpBlockIsLabelSibling) {
    return function(e) {
        e.preventDefault();

        var helpBlock;
        if (helpBlockIsLabelSibling) {
            helpBlock = el.parentNode.parentNode.querySelector('.help-block');
        } else {
            helpBlock = el.parentNode.parentNode.parentNode.querySelector('.help-block');
        }

        if (elHasClass(el, 'activated')) {
            // Hide the helpblock
            elRemoveClass(el, 'activated');
            helpBlock.style.display = 'none';
        } else {
            // Show the helpblock
            elAddClass(el, 'activated');
            if (elHasClass(helpBlock, 'hidden')) {
                elRemoveClass(helpBlock, 'hidden');
            }
            helpBlock.style.display = 'block';
        }
    };
}

function updateAllHelpIcons() {
    var pageContainer;

    pageContainer = '.projectEdit';
    updateHelpIcons(pageContainer);
}

function getValidationSets() {
    /* Get the validation sets of the page */
    return document.getElementById('progress-bar').getAttribute('validation-sets').split('-');
}

function inputCompleted(field) {
    if (field.getAttribute('name') === 'rsr_project.iati_status.' + defaultValues.project_id && field.value === '0') {
        // Do not count project status 'None'
        return false;
    } else if (field.type === 'checkbox') {
        // Do not count checkboxes
        return false;
    } else if (field.type === 'file' && field.getAttribute('saved-value') !== '') {
        // Custom code for file inputs
        return true;
    } else if (field.value !== '') {
        return true;
    }
    return false;
}

function partialFilled(parentNode) {
    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var inputElements = parentNode.querySelectorAll(INPUT_ELEMENTS[i]);
        for (var j = 0; j < inputElements.length; j++) {
            if (inputCompleted(inputElements[j])) {
                return true;
            }
        }
    }
    return false;
}

function shouldBeHidden(el) {
    /* A field should be hidden when all selected validation sets have set the field to hidden */
    var validationSets = getValidationSets();
    var hideAccordingToValidationSet = [];

    for (var i = 0; i < validationSets.length; i++) {
        var validationSet = validationSets[i];

        if (elHasClass(el, 'hidden-' + validationSet)) {
            // Check if the field itself should be hidden
            hideAccordingToValidationSet.push(validationSet);
        } else {
            // Check if the parent object(s) should be hidden
            var relatedObject = findAncestorByClass(el, 'related-object-container');
            while (relatedObject !== null) {
                if (elHasClass(relatedObject, 'hidden-' + validationSet)) {
                    hideAccordingToValidationSet.push(validationSet);
                    relatedObject = null;
                } else {
                    relatedObject = findAncestorByClass(relatedObject, 'related-object-container');
                }
            }
        }
    }

    return validationSets.length === hideAccordingToValidationSet.length;
}

function setHiddenFields(parent) {
    /* Hide fields based on the selected validation sets. */

    parent = parent || document;

    // Check per field if it should be hidden or not
    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var allElements = parent.querySelectorAll(INPUT_ELEMENTS[i]);
        for (var j = 0; j < allElements.length; j++) {
            var formGroupNode = findAncestorByClass(allElements[j], 'form-group');
            if (formGroupNode !== null) {
                if (!(shouldBeHidden(allElements[j]) || elHasClass(formGroupNode, 'always-hidden'))) {
                    elRemoveClass(formGroupNode, 'hidden');
                } else {
                    elAddClass(formGroupNode, 'hidden');
                }
            }
        }
    }

    // Also check the related objects if they should be hidden or not
    var relatedObjectContainers = parent.querySelectorAll('.related-object-container');
    for (var k = 0; k < relatedObjectContainers.length; k++) {
        var relatedObjectContainer = relatedObjectContainers[k];
        if (!shouldBeHidden(relatedObjectContainer)) {
            elRemoveClass(relatedObjectContainer, 'hidden');
        } else {
            elAddClass(relatedObjectContainer, 'hidden');
        }
    }

    // Finally, even check the sections if they should be hidden or not
    // FIXME: If called with a section, this may not be required, but leaving
    // this as it is, for now.
    var sections = document.querySelectorAll('.myPanel');
    for (var l = 0; l < sections.length; l++) {
        var section = sections[l];
        if (!shouldBeHidden(section)) {
            elRemoveClass(section, 'hidden');
        } else {
            elAddClass(section, 'hidden');
        }
    }
}

function setSectionCompletionPercentage(section) {
    var inputResults = getInputResults(section);
    var numInputs = inputResults[0];
    var numInputsCompleted = inputResults[1];

    if (numInputs === 0) {
        // There are no mandatory fields, show the section as complete
        renderCompletionPercentage(1, 1, section);
        return;
    }

    renderCompletionPercentage(numInputsCompleted, numInputs, section);
}

function setPageCompletionPercentage() {
    var inputResults = getInputResults(document.querySelector('.projectEdit'));
    var numInputs = inputResults[0];
    var numInputsCompleted = inputResults[1];
    var completionPercentage = renderCompletionPercentage(numInputsCompleted, numInputs, document.querySelector('.progress-and-publish'));

    // Don't mess with the Publish button if you're not allowed to publish!
    if (defaultValues.can_create_projects) {
        var publishButton = document.getElementById('publishProject');
        if (publishButton !== null) {
            if (completionPercentage !== 100 && publishButton.getAttribute('status') === 'unpublished') {
                publishButton.setAttribute('disabled', '');
            } else {
                publishButton.removeAttribute('disabled');
            }
        }
    }
}

function getInputResults(section) {
    function getOrField(field) {
        var validationSets = getValidationSets();

        for (var i = 0; i < validationSets.length; i++) {
            var orValidation = 'mandatory-' + validationSets[i] + '-or-';
            var fieldClassList = field.classList;

            for (var j = 0; j < fieldClassList.length; j++) {
                if (fieldClassList[j].indexOf(orValidation) > -1) {
                    var otherFieldName = fieldClassList[j].replace(orValidation, '');
                    var fieldIdList = field.getAttribute('id').split('.');
                    var otherFieldId = [fieldIdList[0], otherFieldName, fieldIdList[2]].join('.');
                    return document.getElementById(otherFieldId);
                }
            }
        }

        return null;
    }

    var numInputs = 0;
    var numInputsCompleted = 0;
    var processedFields = [];
    var mandatoryFields = section.querySelectorAll('span.mandatory');

    for (var i = 0; i < mandatoryFields.length; i++) {
        // Ignore the 'OR' indications
        if (elHasClass(mandatoryFields[i], 'mandatory-block')) {
            continue;
        }

        var formGroup = findAncestorByClass(mandatoryFields[i], 'form-group');

        if (formGroup === null) {
            // Mandatory partial
            var parent = findAncestorByClass(mandatoryFields[i], 'parent');
            if (parent !== null) {
                if (partialFilled(parent)) {
                    numInputs += 1;
                }
            } else {
                numInputs += 1;
            }

            var underlyingPartials = findAncestorByClass(mandatoryFields[i], 'related-object-container').querySelectorAll('.parent');
            for (var l = 0; l < underlyingPartials.length; l++) {
                var partialParentNode = underlyingPartials[l];
                if (partialFilled(partialParentNode)) {
                    numInputsCompleted += 1;
                    break;
                }
            }
        } else {
            // 'Normal' mandatory field
            var field = null;

            for (var j = 0; j < INPUT_ELEMENTS.length; j++) {
                field = formGroup.querySelector(INPUT_ELEMENTS[j]);
                if (field !== null) {
                    break;
                }
            }

            if (field === null) {
                // No input field found (should not occur)
                continue;
            }

            if (field.getAttribute('disabled') !== null) {
                // Ignore disabled fields
                continue;
            }

            var parentNode = findAncestorByClass(field, 'parent');
            if (parentNode !== null && !partialFilled(parentNode)) {
                // Ignore fields in underlying empty partials
                continue;
            }

            numInputs += 1;

            // Check if there is an 'Or' mandatory field
            var orField = getOrField(field);
            if (orField === null) {
                // Regular processing, check if the input is completed
                if (inputCompleted(field)) {
                    numInputsCompleted += 1;
                }
            } else {
                // There is an 'Or' mandatory field specified
                if (processedFields.indexOf(orField) > -1) {
                    if (inputCompleted(orField)) {
                        // The 'Or' field has already been processed and was filled
                        numInputsCompleted += 1;
                    } else if (inputCompleted(field)) {
                        // The 'Or' field has already been processed and was not filled, but this
                        // field is, so add 2 inputs completed
                        numInputsCompleted += 2;
                    }
                } else {
                    // Regular processing, check if the input is completed
                    if (inputCompleted(field)) {
                        numInputsCompleted += 1;
                    }
                }
            }

            processedFields.push(field);
        }
    }

    return [numInputs, numInputsCompleted];
}

function renderCompletionPercentage(numInputsCompleted, numInputs, section) {
    var completionPercentage, completionClass, publishButton;

    completionPercentage = Math.floor((numInputsCompleted / numInputs) * 100);
    if (completionPercentage === 0) {
        // Never show an empty bar
        completionPercentage = 1;
    }

    section.querySelector('.progress-bar').setAttribute('aria-valuenow', completionPercentage);
    section.querySelector('.progress .sr-only').textContent = completionPercentage + '% Complete';
    section.querySelector('div.progress-bar').style.width = completionPercentage + '%';

    if (completionPercentage < 10) {
        completionClass = 'empty';
    } else if (completionPercentage < 100) {
        completionClass = 'incomplete';
    } else if (completionPercentage === 100) {
        completionClass = 'complete';
    }

    section.querySelector('div.progress-bar').setAttribute('data-completion', completionClass);

    return completionPercentage;
}

function setSectionChangeListener(section) {
    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var elements = section.querySelectorAll(INPUT_ELEMENTS[i]);

        for (var y = 0; y < elements.length; y++) {
            var listener;
            var el = elements[y];

            if (elHasClass(el, 'has-listener')) {

                // We have already added a class for this listener
                // do nothing
                continue;
            }

            listener = getChangeListener(section, el);
            el.addEventListener('change', listener);
        }
    }
}

function getChangeListener(section, el) {
    return function() {
        var currentSection;
        currentSection = section;

        setSectionCompletionPercentage(currentSection);
        elAddClass(el, 'has-listener');
        setPageCompletionPercentage();
        markMandatoryFields(findAncestorByClass(el, 'parent')||section);
    };
}

function setAllSectionsCompletionPercentage() {
    var formSteps = document.querySelectorAll('.formStep');

    for (var i = 0; i < formSteps.length; i++) {
        setSectionCompletionPercentage(formSteps[i]);
    }
}

function setAllSectionsChangeListener() {
    var formSteps = document.querySelectorAll('.formStep');

    for (var i = 0; i < formSteps.length; i++) {
        setSectionChangeListener(formSteps[i]);
    }
}

function markMandatoryOrField(element, otherField) {
    /* Mark a field as an OR mandatory field */
    var formGroupNode = findAncestorByClass(element, 'form-group');

    // Check if mandatory node already exists
    if (formGroupNode.querySelector('span.mandatory-block') === null) {
        var markContainer = document.createElement('span');
        markContainer.setAttribute('class', 'mandatory-block mandatory');
        markContainer.textContent = '*' + defaultValues.or_mandatory_1 + ' ' + otherField + ' ' + defaultValues.or_mandatory_2 + '.';
        formGroupNode.appendChild(markContainer);
    }
}

function markMandatoryField(element) {
    /* Mark a field as mandatory */
    var formGroupNode = findAncestorByClass(element, 'form-group');

    var elementLabel;
    if (formGroupNode !== null) {
        elementLabel = formGroupNode.querySelector('label');
    } else {
        // This happens for mandatory related objects
        elementLabel = element.querySelector('h5');
    }

    // Check if mandatory node already exists
    if (elementLabel.querySelector('span.mandatory') === null) {
        var markContainer = document.createElement('span');
        markContainer.setAttribute('class', 'mandatory');
        markContainer.textContent = '*';
        elementLabel.appendChild(markContainer);
    }
}

function markMandatoryFields(parent) {
    /* Mark mandatory fields with an asterisk */

    parent = parent || document;

    // Clear any existing markers
    var existingMarkers = parent.querySelectorAll('.mandatory:not(.in-org-modal)');
    for (var i = 0; i < existingMarkers.length; i++) {
        existingMarkers[i].parentNode.removeChild(existingMarkers[i]);
    }

    // Mark the new elements
    var validationSets = getValidationSets();
    for (var j = 0; j < validationSets.length; j++) {
        var mandatoryIndicator = '.mandatory-' + validationSets[j];
        var elementsToMark = parent.querySelectorAll(mandatoryIndicator);
        for (var k = 0; k < elementsToMark.length; k++) {
            if (!elementsToMark[k].hasAttribute("disabled") &&
                !findAncestorByClass(elementsToMark[k], 'always-hidden') &&
                    (!hasParent(elementsToMark[k]) ||
                     partialFilled(findAncestorByClass(elementsToMark[k], 'parent')) ||
                     (hasParent(elementsToMark[k]) &&
                      elHasClass(findAncestorByClass(elementsToMark[k], 'related-object-container'),
                                                     'mandatory-' + validationSets[j])))) {
                markMandatoryField(elementsToMark[k]);

                var mandatoryOrClass = mandatoryIndicator.replace('.', '') + '-or-';
                var fieldClassList = elementsToMark[k].classList;
                for (var l = 0; l < fieldClassList.length; l++) {
                    if (fieldClassList[l].indexOf(mandatoryOrClass) > -1) {
                        var otherFieldName = fieldClassList[l].replace(mandatoryOrClass, '').replace(/_/g, ' ');
                        markMandatoryOrField(elementsToMark[k], otherFieldName);
                    }
                }
            }
        }
    }
}

function setValidationListeners() {
    /* Validate all inputs with the given class and display validation status to the user
     * in real time */
    function getLengthListener(el) {
        return function() {
            var maxLength, currentLength, charsLeft, charMessage;

            maxLength = parseInt(el.getAttribute('maxlength'), 10);
            currentLength = el.value.length;
            charsLeft = maxLength - currentLength;
            charMessage = '';

            if (el.parentNode.querySelectorAll('.charsLeft').length === 0) {
                var child = document.createElement('span');
                elAddClass(child, 'charsLeft');
                el.parentNode.appendChild(child);
            }

            if (charsLeft === 1) {
                charMessage = ' character remaining';
            } else {
                charMessage = ' characters remaining';
            }

            el.parentNode.querySelector('.charsLeft').style.display = '';
            el.parentNode.querySelector('.charsLeft').textContent = charsLeft + charMessage;
        };
    }

    function getHideCharsListener(el) {
        var parent = el.parentNode;
        var output;
        var outputTimeout;

        output = function() {
            var charsLeft = parent.querySelector('.charsLeft');
            if (charsLeft) {
                charsLeft.style.display = 'none';
            }
        };

        outputTimeout = function() {
            setTimeout(output, 250);
        };

        return outputTimeout;
    }

    var inputs = document.querySelectorAll('input');
    var textareas = document.querySelectorAll('textarea');
    var inputListener, focusOutListener;

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        if (elHasClass(input, 'validation-listener')) {
            // We've already set the listener for this element, do nothing
            continue;
        }

        // Max character counts for text inputs
        if (input.getAttribute('type') === 'text' && input.hasAttribute('maxlength')) {
            inputListener = getLengthListener(input);
            focusOutListener = getHideCharsListener(input);
            input.addEventListener('input', inputListener);
            input.addEventListener('focusout', focusOutListener);
        }

    }

    for (var j = 0; j < textareas.length; j++) {
        var textarea = textareas[j];

        if (elHasClass(textarea, 'validation-listener')) {
            // We've already set the listener for this element, do nothing
            continue;
        }

        // Max character counts for textareas
        if (textarea.hasAttribute('maxlength')) {
            inputListener = getLengthListener(textarea);
            focusOutListener = getHideCharsListener(textarea);
            textarea.addEventListener('input', inputListener);
            textarea.addEventListener('focusout', focusOutListener);
        }
    }

    markMandatoryFields();
    setHiddenFields();
}

function setCurrencyOnChange() {
    var currencyDropdown = document.getElementById('rsr_project.currency.' + defaultValues.project_id);

    if (currencyDropdown !== null) {
        currencyDropdown.onchange = updateCurrency(currencyDropdown);
    }

    var currencyDropdowns = document.querySelectorAll('.currency-select');
    for (var i = 0; i < currencyDropdowns.length; i++) {
        var otherCurrencyDropdown = currencyDropdowns[i];
        if (otherCurrencyDropdown !== currencyDropdown) {
            otherCurrencyDropdown.onchange = updateObjectCurrency(otherCurrencyDropdown);
        }
    }
}

function hasObjectCurrency(currencyDisplay) {
    if (currencyDisplay !== null) {
        var parent = findAncestorByClass(currencyDisplay, 'parent');
        if (parent !== null) {
            var currencyNode = parent.querySelector('.currency-select');
            if (currencyNode !== null) {
                return currencyNode.value !== '';
            }
        }
    }
    return false;
}

function updateCurrency(currencyDropdown) {
    return function(e) {
        e.preventDefault();

        var newCurrency = currencyDropdown.value;
        var currencyDisplays = document.querySelectorAll('.currency-display');

        for (var i = 0; i < currencyDisplays.length; i++) {
            var currencyDisplay = currencyDisplays[i];
            if (!hasObjectCurrency(currencyDisplay)) {
                currencyDisplay.innerHTML = newCurrency;
            }
        }
    };
}

function updateObjectCurrency(currencyDropdown) {
    return function(e) {
        e.preventDefault();

        if (currencyDropdown !== null) {
            var parent = findAncestorByClass(currencyDropdown, 'parent'),
                newCurrency = currencyDropdown.value;

            if (newCurrency === '') {
                var projectCurrencyDropdown = document.getElementById('rsr_project.currency.' + defaultValues.project_id);
                if (projectCurrencyDropdown !== null) {
                    newCurrency = projectCurrencyDropdown.value;
                }
            }

            if (parent !== null) {
                var currencyDisplays = parent.querySelectorAll('.currency-display');
                for (var i = 0; i < currencyDisplays.length; i++) {
                    var currencyDisplay = currencyDisplays[i];
                    if (currencyDisplay !== null) {
                        currencyDisplay.innerHTML = newCurrency;
                    }
                }
            }
        }
    };
}

function setSectorOnChange () {
    var sectorVocabularyFields = document.querySelectorAll('.sector-vocabulary');

    for (var i = 0; i < sectorVocabularyFields.length; i++) {
        sectorVocabularyFields[i].getElementsByTagName('select')[0].onchange = sectorCodeSelectorOnClick(sectorVocabularyFields[i]);
        sectorCodeSwitcher(sectorVocabularyFields[i]);
    }
}

function sectorCodeSelectorOnClick (vocabularyField) {
    return function(e) {
        e.preventDefault();
        sectorCodeSwitcher(vocabularyField);
    };
}

function sectorCodeSwitcher (vocabularyField) {

    var selectField = vocabularyField.getElementsByTagName('select')[0];
    var vocabularyValue = selectField.options[selectField.selectedIndex].value;

    var sectorOther = vocabularyField.parentNode.querySelector('.sector-code-other');
    var sectorDAC5 = vocabularyField.parentNode.querySelector('.sector-code-dac5');
    var sectorDAC3 = vocabularyField.parentNode.querySelector('.sector-code-dac3');

    var itemName = sectorOther.getElementsByTagName('input')[0].getAttribute('name').replace('.other', '');
    var itemId = sectorOther.getElementsByTagName('input')[0].getAttribute('id').replace('.other', '');

    if (vocabularyValue == '1' && sectorDAC5.classList.contains('hidden')) {
        sectorDAC5.classList.remove('hidden');
        sectorDAC5.querySelector('.form-group').classList.remove('always-hidden');
        sectorDAC5.querySelector('.form-group').classList.remove('hidden');

        sectorDAC5.getElementsByTagName('select')[0].setAttribute('name', itemName);
        sectorDAC5.getElementsByTagName('select')[0].setAttribute('id', itemId);

        if (!sectorOther.classList.contains('hidden')) {
            sectorOther.classList.add('hidden');
            sectorOther.querySelector('.form-group').classList.add('always-hidden');
            sectorOther.querySelector('.form-group').classList.add('hidden');

            sectorOther.getElementsByTagName('input')[0].setAttribute('name', itemName + '.other');
            sectorOther.getElementsByTagName('input')[0].setAttribute('id', itemId + '.other');

            sectorDAC5.getElementsByTagName('select')[0].setAttribute('saved-value', sectorOther.getElementsByTagName('input')[0].getAttribute('saved-value'));
        }
        if (!sectorDAC3.classList.contains('hidden')) {
            sectorDAC3.classList.add('hidden');
            sectorDAC3.querySelector('.form-group').classList.add('always-hidden');
            sectorDAC3.querySelector('.form-group').classList.add('hidden');

            sectorDAC3.getElementsByTagName('select')[0].setAttribute('name', itemName + '.dac3');
            sectorDAC3.getElementsByTagName('select')[0].setAttribute('id', itemId + '.dac3');

            sectorDAC5.getElementsByTagName('select')[0].setAttribute('saved-value', sectorDAC3.getElementsByTagName('select')[0].getAttribute('saved-value'));
        }

    } else if (vocabularyValue == '2' && sectorDAC3.classList.contains('hidden')) {
        sectorDAC3.classList.remove('hidden');
        sectorDAC3.querySelector('.form-group').classList.remove('always-hidden');
        sectorDAC3.querySelector('.form-group').classList.remove('hidden');

        sectorDAC3.getElementsByTagName('select')[0].setAttribute('name', itemName);
        sectorDAC3.getElementsByTagName('select')[0].setAttribute('id', itemId);

        if (!sectorOther.classList.contains('hidden')) {
            sectorOther.classList.add('hidden');
            sectorOther.querySelector('.form-group').classList.add('always-hidden');
            sectorOther.querySelector('.form-group').classList.add('hidden');

            sectorOther.getElementsByTagName('input')[0].setAttribute('name', itemName + '.other');
            sectorOther.getElementsByTagName('input')[0].setAttribute('id', itemId + '.other');

            sectorDAC3.getElementsByTagName('select')[0].setAttribute('saved-value', sectorOther.getElementsByTagName('input')[0].getAttribute('saved-value'));
        }
        if (!sectorDAC5.classList.contains('hidden')) {
            sectorDAC5.classList.add('hidden');
            sectorDAC5.querySelector('.form-group').classList.add('always-hidden');
            sectorDAC5.querySelector('.form-group').classList.add('hidden');

            sectorDAC5.getElementsByTagName('select')[0].setAttribute('name', itemName + '.dac5');
            sectorDAC5.getElementsByTagName('select')[0].setAttribute('id', itemId + '.dac5');

            sectorDAC3.getElementsByTagName('select')[0].setAttribute('saved-value', sectorDAC5.getElementsByTagName('select')[0].getAttribute('saved-value'));
        }

    } else if (vocabularyValue != '1' && vocabularyValue != '2' && sectorOther.classList.contains('hidden')) {
        sectorOther.classList.remove('hidden');
        sectorOther.querySelector('.form-group').classList.remove('always-hidden');
        sectorOther.querySelector('.form-group').classList.remove('hidden');

        sectorOther.getElementsByTagName('input')[0].setAttribute('name', itemName);
        sectorOther.getElementsByTagName('input')[0].setAttribute('id', itemId);

        if (!sectorDAC5.classList.contains('hidden')) {
            sectorDAC5.classList.add('hidden');
            sectorDAC5.querySelector('.form-group').classList.add('always-hidden');
            sectorDAC5.querySelector('.form-group').classList.add('hidden');

            sectorDAC5.getElementsByTagName('select')[0].setAttribute('name', itemName + '.dac5');
            sectorDAC5.getElementsByTagName('select')[0].setAttribute('id', itemId + '.dac5');

            sectorOther.getElementsByTagName('input')[0].setAttribute('saved-value', sectorDAC5.getElementsByTagName('select')[0].getAttribute('saved-value'));
        }
        if (!sectorDAC3.classList.contains('hidden')) {
            sectorDAC3.classList.add('hidden');
            sectorDAC3.querySelector('.form-group').classList.add('always-hidden');
            sectorDAC3.querySelector('.form-group').classList.add('hidden');

            sectorDAC3.getElementsByTagName('select')[0].setAttribute('name', itemName + '.dac3');
            sectorDAC3.getElementsByTagName('select')[0].setAttribute('id', itemId + '.dac3');

            sectorOther.getElementsByTagName('input')[0].setAttribute('saved-value', sectorDAC3.getElementsByTagName('select')[0].getAttribute('saved-value'));
        }
    }
}


// add arrow buttons to each indicator
function setIndicatorSorting () {
    var indicatorContainers = document.querySelectorAll('.indicator-container');

    for (var i=0; i < indicatorContainers.length; i++) {
        var indicatorSections = indicatorContainers[i].querySelectorAll('.indicator-item:not([id*="new"])');

        for (var j=0; j < indicatorSections.length; j++) {
            setReorderButtons(indicatorSections[j], 'indicator', j, indicatorSections.length);

            if (!indicatorSections[j].classList.contains('default-period-buttons-set')) {
                setDefaultPeriodButtons(indicatorSections[j]);
            }
        }
    }
}

// add arrow buttons to each result
function setResultSorting () {
    var resultSections = document.querySelectorAll('.result-item:not([id*="new"])');

    for (var i=0; i < resultSections.length; i++) {
        setReorderButtons(resultSections[i], 'result', i, resultSections.length);
    }
}

function setReorderButtons (itemNode, itemType, itemIndex, listLength) {
    var itemId = itemNode.getAttribute('id').split('.')[1];

    if (itemNode.classList.contains('sort-buttons-set')) {
        if (itemIndex === 0 || listLength < 2) {
            itemNode.querySelector('.sort-up').setAttribute('class', 'sort-up hidden');
        } else {
            itemNode.querySelector('.sort-up').setAttribute('class', 'sort-up');
        }
        if (itemIndex == listLength - 1 || listLength < 2) {
            itemNode.querySelector('.sort-down').setAttribute('class', 'sort-down hidden');
        } else {
            itemNode.querySelector('.sort-down').setAttribute('class', 'sort-down');
        }
    } else {
        var sortItemNode = document.createElement('span');
        itemNode.className += ' sort-buttons-set';

        var sortItemUp = document.createElement('a');
        var upButton = document.createElement('span');
        upButton.style = 'margin-right: 10px; font-size: 80%;';

        if (itemIndex === 0 || listLength < 2) {
            upButton.setAttribute('class', 'sort-up hidden');
            upButton.innerHTML = defaultValues.move_up;
        } else {
            upButton.setAttribute('class', 'sort-up');
            upButton.innerHTML = defaultValues.move_up;
        }

        if (itemType == 'indicator') {
            upButton.onclick = reorderItems('indicator', itemId, 'up');
        } else if (itemType == 'result') {
            upButton.onclick = reorderItems('result', itemId, 'up');
        }

        sortItemUp.appendChild(upButton);


        var sortItemDown = document.createElement('a');
        var downButton = document.createElement('span');
        downButton.style = 'margin-right: 10px; font-size: 80%;';

        if (itemIndex == listLength - 1 || listLength < 2) {
            downButton.setAttribute('class', 'sort-down hidden');
            downButton.innerHTML = defaultValues.move_down;
        } else {
            downButton.setAttribute('class', 'sort-down');
            downButton.innerHTML = defaultValues.move_down;
        }

        if (itemType == 'indicator') {
            downButton.onclick = reorderItems('indicator', itemId, 'down');
        } else if (itemType == 'result') {
            downButton.onclick = reorderItems('result', itemId, 'down');
        }

        sortItemDown.appendChild(downButton);

        sortItemNode.appendChild(sortItemUp);
        sortItemNode.appendChild(sortItemDown);


        var itemContainer = itemNode.querySelector('.delete-related-object-container');
        itemContainer.insertBefore(sortItemNode, itemContainer.childNodes[0]);
    }
}

function reorderItems (itemType, itemId, direction) {
    return function(e) {
        e.preventDefault();
        var api_url, request;

        var form_data = 'item_type=' + itemType + '&item_id=' + itemId + '&item_direction=' + direction;

        // Create request
        api_url = '/rest/v1/project/' + defaultValues.project_id + '/reorder_items/?format=json';

        request = new XMLHttpRequest();
        request.open('POST', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                if (response.swap_id > -1) {
                    swapReorderedItems(itemType, itemId, response.swap_id, direction);
                } else {
                    console.log(response.errors);
                }

            } else {
                // We reached our target server, but it returned an error
                return false;
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            return false;
        };

        request.send(form_data);
    };
}

function swapReorderedItems (itemType, itemId, swapId, direction) {
    var selectedItem = document.getElementById(itemType + '.' + itemId);
    var swapItem = document.getElementById(itemType + '.' + swapId);
    var parentContainer = selectedItem.parentNode;

    if (direction == 'up') {
        parentContainer.insertBefore(selectedItem, swapItem);

        // update buttons if necessary
        if (parentContainer.firstElementChild == selectedItem) {
            selectedItem.querySelector('.sort-up').className += ' hidden';
            elRemoveClass(swapItem.querySelector('.sort-up'), 'hidden');
        }
        if (parentContainer.lastElementChild.previousElementSibling == swapItem) {
            elRemoveClass(selectedItem.querySelector('.sort-down'), 'hidden');
            swapItem.querySelector('.sort-down').className += ' hidden';
        }
    } else if (direction == 'down') {
        parentContainer.insertBefore(swapItem, selectedItem);

        // update buttons if necessary
        if (parentContainer.firstElementChild == swapItem) {
            elRemoveClass(selectedItem.querySelector('.sort-up'), 'hidden');
            swapItem.querySelector('.sort-up').className += ' hidden';
        }
        if (parentContainer.lastElementChild.previousElementSibling == selectedItem) {
            selectedItem.querySelector('.sort-down').className += ' hidden';
            elRemoveClass(swapItem.querySelector('.sort-down'), 'hidden');
        }
    }
}

// add buttons to set default indicator periods
function setDefaultPeriodButtons (indicatorNode) {

    indicatorId = indicatorNode.getAttribute('id').split('.')[1];

    var defaultPeriodNode = document.createElement('span');
    defaultPeriodNode.setAttribute('class', 'default-period-container');

    var addButton = document.createElement('a');
    addButton.setAttribute('class', 'default-period-add');
    addButton.innerHTML = defaultValues.set_default;
    addButton.onclick = promptCopyDefaultPeriods(defaultPeriodNode, indicatorId);

    var removeButton = document.createElement('a');
    removeButton.setAttribute('class', 'default-period-remove');
    removeButton.innerHTML = defaultValues.remove_default;
    removeButton.onclick = removeDefaultPeriods(defaultPeriodNode, indicatorId);

    if (defaultValues.default_indicator === '-1') {
        removeButton.classList.add('hidden');
    } else {
        if (indicatorId == defaultValues.default_indicator) {
            addButton.classList.add('hidden');
        } else {
            addButton.classList.add('hidden');
            removeButton.classList.add('hidden');
        }
    }

    defaultPeriodNode.appendChild(addButton);
    defaultPeriodNode.appendChild(removeButton);

    var indicatorContainer = indicatorNode.querySelector('.delete-related-object-container');
    indicatorContainer.insertBefore(defaultPeriodNode, indicatorContainer.childNodes[0]);

    indicatorNode.className += ' default-period-buttons-set';
}

// ask if defaults should be copied to existing indicators
function promptCopyDefaultPeriods (defaultPeriodNode, indicatorId) {
    return function(e) {
        e.preventDefault();

        defaultPeriodNode.querySelector('.default-period-add').classList.add('hidden');

        var confirmContainer = document.createElement('span');
        confirmContainer.setAttribute('class', 'default-confirm-container');

        var confirmText = document.createElement('span');
        confirmText.innerHTML = defaultValues.add_to_existing;

        var yesButton = document.createElement('a');
        yesButton.setAttribute('class', 'default-yes-button');
        yesButton.innerHTML = defaultValues.yes;
        yesButton.onclick = setDefaultPeriods(defaultPeriodNode, indicatorId, true);

        var noButton = document.createElement('a');
        noButton.setAttribute('class', 'default-no-button');
        noButton.innerHTML = defaultValues.no;
        noButton.onclick = setDefaultPeriods(defaultPeriodNode, indicatorId, false);

        confirmContainer.appendChild(confirmText);
        confirmContainer.appendChild(yesButton);
        confirmContainer.appendChild(noButton);
        defaultPeriodNode.appendChild(confirmContainer);
    };
}

function setDefaultPeriods (defaultPeriodNode, indicatorId, addExisting) {
    return function(e) {
        e.preventDefault();

        var indicatorNode = defaultPeriodNode.parentNode;
        indicatorNode.classList.add('default-indicator');

        defaultPeriodNode.querySelector('.default-confirm-container').classList.add('hidden');

        if (addExisting === true) {
            var refreshText = document.createElement('span');
            refreshText.innerHTML = defaultValues.refresh_periods;
            defaultPeriodNode.appendChild(refreshText);

            submitDefaultPeriods(indicatorId, true, true);
        } else {
            defaultPeriodNode.querySelector('.default-period-remove').classList.remove('hidden');

            submitDefaultPeriods(indicatorId, false, true);
        }

        // hide all other default add buttons
        var defaultButtons = document.querySelectorAll('.default-period-add');
        for (var i=0; i < defaultButtons.length; i++) {
            defaultButtons[i].classList.add('hidden');
        }

    };
}

function removeDefaultPeriods(defaultPeriodNode, indicatorId) {
    return function(e) {
        e.preventDefault();

        defaultPeriodNode.querySelector('.default-period-remove').classList.add('hidden');
        submitDefaultPeriods(indicatorId, false, false);

        // show all default add buttons
        var defaultButtons = document.querySelectorAll('.default-period-add');
        for (var i=0; i < defaultButtons.length; i++) {
            defaultButtons[i].classList.remove('hidden');
        }
    };
}

function submitDefaultPeriods(indicatorId, copy, setDefault) {

    var api_url, request;

    var form_data = 'indicator_id=' + indicatorId + '&copy=' + copy + '&set_default=' + setDefault;

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/default_periods/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var response = JSON.parse(request.responseText);
            if (setDefault === true) {
                defaultValues.default_indicator = indicatorId;
            } else {
                defaultValues.default_indicator = '-1';
            }
        } else {
            // We reached our target server, but it returned an error
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        return false;
    };

    request.send(form_data);

}

function setToggleSectionOnClick () {
    var toggleSections = document.getElementsByClassName('toggleSection');
    var projectOptions = document.querySelector('.formOverviewInfo');
    var projectProgress = document.querySelector('.formProgress');

    for (var i=0; i < toggleSections.length; i++) {
        toggleSections[i].onclick = toggleSection(toggleSections[i]);
    }

    if (projectOptions !== null) {
        var optionsPanelHeading = projectOptions.querySelector('.panel-heading');
        optionsPanelHeading.onclick = showHidePanel(optionsPanelHeading.parentNode);
    }

    if (projectProgress !== null) {
        var progressPanelHeading = projectProgress.querySelector('.panel-heading');
        progressPanelHeading.onclick = showHidePanel(progressPanelHeading.parentNode);
    }
}

function showHidePanel(panel) {
    return function(e) {
        e.preventDefault();

        var panelBody = panel.querySelector('.panel-body');
        if (!elHasClass(panelBody,'hidden')) {
            elAddClass(panelBody, 'hidden');
        } else {
            elRemoveClass(panelBody, 'hidden');
        }
    };
}

function toggleSection(node) {
    return function(e) {
        e.preventDefault();

        var allFormBlocks, allSections, div, formBlock, infoIcon, inputStep;

        div = node.parentNode.parentNode;
        allFormBlocks = document.getElementsByClassName('formBlock');
        allSections = document.getElementsByClassName('toggleSection');
        formBlock = div.getElementsByClassName('formBlock')[0];
        inputStep = div.getElementsByTagName('input')[0];
        infoIcon = node.getElementsByClassName('info-icon')[0];

        if (formBlock.className.indexOf('hidden') > -1) {
            formBlock.className = formBlock.className.replace('hidden', '');
            inputStep.checked = true;
            setTimeout(function () {
                div.scrollIntoView();
                window.scrollBy(0, -100);
            }, 1);
            for (var i=0; i < allFormBlocks.length; i++) {
                if (allFormBlocks[i] !== formBlock && allFormBlocks[i].className.indexOf('hidden') === -1) {
                    allFormBlocks[i].className += ' hidden';
                }
            }
            for (var j=0; j < allSections.length; j++) {
                var sectionInfoIcon = allSections[j].getElementsByClassName('info-icon')[0];
                if (sectionInfoIcon.className.indexOf('hidden') === -1) {
                    sectionInfoIcon.className += ' hidden';
                }
            }
            if (infoIcon.className.indexOf('hidden') > -1) {
                infoIcon.className = infoIcon.className.replace('hidden', '');
            }
            updateSectionState(div);
        } else {
            formBlock.className += ' hidden';
            infoIcon.className += ' hidden';
        }
    };
}

function setPrivateProject() {
    // Set private project switch
    var privateProject = document.getElementById('private-project');
    if (privateProject !== null) {
        privateProject.onchange = privateProjectSwitch(privateProject);
    }
}

function privateProjectSwitch(privateProject) {
    return function(e) {
        e.preventDefault();

        var api_url = '/rest/v1/project/' + defaultValues.project_id + '/?format=json';

        var request = new XMLHttpRequest();
        request.open('PATCH', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                if (privateProject.hasAttribute('checked')) {
                    privateProject.removeAttribute('checked');
                } else {
                    privateProject.setAttribute('checked', '');
                }
            }
        };

        var changePrivate = privateProject.hasAttribute('checked') ? '{"is_public": true}' : '{"is_public": false}';

        request.send(changePrivate);
    };
}

function setImpactProject() {
    // Set RSR Impact switch
    var impactProject = document.getElementById('impact-project');
    if (impactProject !== null) {
        impactProject.onchange = impactProjectSwitch(impactProject);
    }

    // Set import button
    var importButton = document.getElementById('import-results');
    if (importButton !== null) {
        importButton.onclick = getImportResults(importButton);
    }
}

function impactProjectSwitch(impactProject) {
    return function(e) {
        e.preventDefault();

        var api_url = '/rest/v1/project/' + defaultValues.project_id + '/?format=json';

        var request = new XMLHttpRequest();
        request.open('PATCH', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                if (impactProject.hasAttribute('checked')) {
                    impactProject.removeAttribute('checked');
                } else {
                    impactProject.setAttribute('checked', '');
                }
            }
        };

        var changeImpact = impactProject.hasAttribute('checked') ? '{"is_impact_project": false}' : '{"is_impact_project": true}';

        request.send(changeImpact);
    };
}

function getImportResults(importButton) {
    return function(e) {
        var api_url, parentNode, request;

        e.preventDefault();

        importButton.setAttribute('disabled', '');
        parentNode = importButton.parentNode;

        // Create request
        api_url = '/rest/v1/project/' + defaultValues.project_id + '/import_results/?format=json';

        request = new XMLHttpRequest();
        request.open('POST', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            var response, divNode;
            try {
                response = JSON.parse(request.responseText);
            } catch (e) {
                response = {code: 0};
            }
            divNode = document.createElement('div');

            if (response.code === 1) {
                parentNode.removeChild(importButton);

                divNode.classList.add('save-success');
                divNode.innerHTML = 'Import successful. Please refresh the page to see (and edit) the imported results.';
                parentNode.appendChild(divNode);
            } else {
                importButton.removeAttribute('disabled');

                divNode.classList.add('help-block-error');
                divNode.innerHTML = response.message;
                parentNode.appendChild(divNode);
            }
        };

        request.send();
    };
}

function setPublishOnClick() {
    var publishButton = document.getElementById('publishProject');
    if (publishButton !== null) {
        publishButton.onclick = getProjectPublish(defaultValues.publishing_status_id, publishButton);
    }

    return false;
}

function getProjectPublish(publishingStatusId, publishButton) {
    return function(e) {
        e.preventDefault();

        publishButton.setAttribute('disabled', '');

        var api_url, request, publishErrorNode, span, status, unsavedMessage, unsavedSections;

        status = publishButton.getAttribute('status');

        // Remove any previous errors
        publishErrorNode = document.getElementById('publishErrors');
        publishErrorNode.innerHTML = '';

        // If we want to publish, check for unsaved changes first
        if (status === 'unpublished') {
            unsavedSections = checkUnsavedChanges();
            if (unsavedSections.length > 0) {
                unsavedMessage = "There are unsaved changes in the following section(s):<ul>";

                for (var i = 0; i < unsavedSections.length; i++) {
                    unsavedMessage += "<li>" + unsavedSections[i] + "</li>";
                }

                unsavedMessage += "</ul>";

                span = document.createElement("span");
                span.className = 'notPublished';
                span.innerHTML = unsavedMessage;
                publishErrorNode.appendChild(span);

                publishButton.removeAttribute('disabled');

                // Don't publish
                return;
            }
        }

        // Create request
        api_url = '/rest/v1/publishing_status/' + publishingStatusId + '/?format=json';

        request = new XMLHttpRequest();
        request.open('PATCH', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Succesfully (un)published project!
                var publishIndicator = document.getElementById('publish-indicator');

                // Change the view project page button to "View project" or "Preview project"
                // Update the button's status and appearance

                var iconElement, textElement, otherTextElement, otherIconElement;
                if (status === 'unpublished') {
                    publishIndicator.className = 'published';
                    publishIndicator.innerHTML = defaultValues.published;

                    publishButton.setAttribute('status', 'published');
                    otherTextElement = document.createTextNode(' ' + defaultValues.unpublish);
                    otherIconElement = document.createElement('span');
                    otherIconElement.className = "glyphicon glyphicon-remove";
                    publishButton.innerHTML = '';
                    publishButton.className = publishButton.className.replace('btn-success', 'btn-danger');

                    publishButton.appendChild(otherIconElement);
                    publishButton.appendChild(otherTextElement);
                } else {
                    publishIndicator.className = 'notPublished';
                    publishIndicator.innerHTML = defaultValues.not_published;

                    publishButton.setAttribute('status', 'unpublished');
                    otherTextElement = document.createTextNode(' ' + defaultValues.publish);
                    otherIconElement = document.createElement('span');
                    otherIconElement.className = "glyphicon glyphicon-ok";
                    publishButton.innerHTML = '';
                    publishButton.className = publishButton.className.replace('btn-danger', 'btn-success');

                    publishButton.appendChild(otherIconElement);
                    publishButton.appendChild(otherTextElement);
                }

                publishButton.removeAttribute('disabled');

                return false;
            } else {
                // We reached our target server, but it returned an error
                publishButton.removeAttribute('disabled');

                if (request.status == 400) {
                    // Could not publish due to checks
                    var response;

                    response = JSON.parse(request.responseText);

                    span = document.createElement("span");
                    span.className = 'notPublished';
                    publishErrorNode.appendChild(span);

                    try {
                        for (var i=0; i < response.__all__.length; i++) {
                            span.innerHTML += response.__all__[i] + '<br/>';
                        }
                    } catch (error) {
                        // General error message
                        if (status === 'unpublished') {
                            publishErrorNode.innerHTML = 'Could not publish project.';
                        } else {
                            publishErrorNode.innerHTML = 'Could not unpublish project.';
                        }
                    }
                }

                return false;
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            span = document.createElement("span");
            span.className = 'notPublished';
            publishErrorNode.appendChild(span);

            if (status === 'unpublished') {
                publishErrorNode.innerHTML = 'Could not publish project due to a connection error.';
            } else {
                publishErrorNode.innerHTML = 'Could not unpublish project due to a connection error.';
            }

            publishButton.removeAttribute('disabled');
            return false;
        };

        if (status === 'unpublished') {
            request.send('{"status": "published"}');
        } else {
            request.send('{"status": "unpublished"}');
        }

    };
}

function setDatepickers() {
    function getDatepickerComponent(datepickerId, initialDate, disableInput) {
        return React.createClass({
            displayName: datepickerId,

            getInitialState: function () {
                return {
                    initialDate: initialDate,
                    disableInput: disableInput
                };
            },

            handleDateChange: function (date) {
                this.setState({
                    initialDate: date
                }, this.fireInputChangeListener);
            },

            fireInputChangeListener: function () {
                // Fire the change listener here: react-datepicker changes the
                // input element and the listener setup in
                // setSectionChangeListener doesn't get fired.
                var inputNode = this.getDOMNode().querySelector('input');
                var section = findAncestorByClass(inputNode, 'formStep');
                getChangeListener(section, inputNode)();
            },

            render: function () {
                if (disableInput !== 'true') {
                    return React.createElement('div', null,
                        React.createElement(DatePicker, {
                            locale: 'en',
                            placeholderText: '',
                            showYearDropdown: true,
                            dateFormat: 'DD/MM/YYYY',
                            selected: this.state.initialDate,
                            onChange: this.handleDateChange,
                            todayButton: defaultValues.today,
                            className: this.props.classNames
                        })
                    );
                } else {
                    return React.createElement('div', null,
                        React.createElement(DatePicker, {
                            locale: 'en',
                            placeholderText: '',
                            dateFormat: 'DD/MM/YYYY',
                            selected: this.state.initialDate,
                            className: this.props.classNames
                        })
                    );
                }
            }
        });
    }

    var datepickerContainers = document.getElementsByClassName('datepicker-container');

    for (var i=0; i < datepickerContainers.length; i++) {
        var datepickerId, DatePickerComponent, datepickerContainer, disableInput, extraAttributes, helptext, initialDate, inputNode, inputValue, label;

        datepickerContainer = datepickerContainers[i];

        // Check if datepicker already has been set
        if (datepickerContainer.className.indexOf('has-datepicker') == -1) {
            datepickerId = datepickerContainer.getAttribute('data-id');

            // Set initial value of datepicker
            inputValue = datepickerContainer.getAttribute('data-child');
            disableInput = datepickerContainer.getAttribute('data-disabled');

            if (inputValue !== "") {
                initialDate = moment(inputValue, "DD-MM-YYYY");
            } else {
                initialDate = null;
            }

            var mandatoryOr = datepickerContainer.getAttribute('mandatory-or');
            var classNames = 'form-control ' + datepickerContainer.getAttribute('data-classes');

            DatePickerComponent = getDatepickerComponent(datepickerId, initialDate, disableInput);
            ReactDOM.render(
                React.createElement(DatePickerComponent, {key: datepickerId, classNames: classNames}),
                datepickerContainer
            );

            // Set id, name and saved value of datepicker input
            inputNode = datepickerContainer.querySelector('input');
            inputNode.setAttribute("id", datepickerId);
            inputNode.setAttribute("name", datepickerId);
            inputNode.setAttribute("saved-value", inputValue);
            if (disableInput === 'true') {
                inputNode.setAttribute("disabled", '');
            }

            // Remove 'react-datepicker__input-container' class
            // This is required for the current CSS to not break
            inputNode.parentNode.className = '';

            // Set addtional attributes of input
            inputNode.setAttribute('mandatory-or', mandatoryOr);

            // Set label of datepicker
            label = document.createElement('label');
            label.setAttribute("for", datepickerId);
            label.setAttribute("class", "control-label");
            label.innerHTML = datepickerContainer.getAttribute('data-label');
            inputNode.parentNode.appendChild(label);

            // Set helptext of datepicker
            helptext = document.createElement('p');
            helptext.setAttribute("class", "help-block hidden");
            helptext.innerHTML = datepickerContainer.getAttribute('data-helptext');
            inputNode.parentNode.appendChild(helptext);

            datepickerContainer.className += ' has-datepicker';
        }
    }
}

function fieldChanged(inputField) {
    /* Check if a field has changed, based on it's value and saved-value.
    *  Ignores file fields, checkboxes and hidden fields. */

    if (inputField.type === 'file' || inputField.type === 'checkbox' || fieldIsHidden(inputField)) {
        return false;
    } else if (inputField.parentNode.classList.contains('typeahead')) {
        return (inputField.getAttribute('value') !== inputField.getAttribute('saved-value'));
    } else {
        return (inputField.value !== inputField.getAttribute('saved-value'));
    }
}

function checkUnsavedChangesForm(form) {
    /* Checks if a form has unsaved changes. Returns true if so and false otherwise. */

    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var inputElements = form.querySelectorAll(INPUT_ELEMENTS[i]);
        for (var j = 0; j < inputElements.length; j++) {
            if (inputElements[j].type !== 'checkbox' && fieldChanged(inputElements[j])) {
                return true;
            }
        }
    }
    return false;
}

function checkUnsavedChanges() {
    var forms, formNames, unsavedForms;

    unsavedForms = [];
    formNames = [
        '01 - General information',
        '02 - Contact information',
        '03 - Project partners',
        '04 - Project descriptions',
        '05 - Results and indicators',
        '06 - Finance',
        '07 - Project locations',
        '08 - Project focus',
        '09 - Links and documents',
        '10 - Project comments',
        '11 - Special reporting'
    ];

    forms = document.querySelectorAll('form');

    for (var i = 0; i < forms.length; i++) {
        if (checkUnsavedChangesForm(forms[i])) {
            unsavedForms.push(formNames[i]);
        }
    }

    return unsavedForms;
}

function setUnsavedChangesMessage() {
    window.onbeforeunload = function(e) {
        var unsavedSections, message;

        e = e || window.event;

        unsavedSections = checkUnsavedChanges();
        if (unsavedSections.length > 0) {
            message = "You have unsaved changes in the following section(s):\n\n";
            for (var i = 0; i < unsavedSections.length; i++) {
                message += "\t• " + unsavedSections[i] + "\n";
            }

            // For IE and Firefox
            if (e) {
                e.returnValue = message;
            }
            // For Safari and Chrome
            return message;
        }
    };
}

/* Show the "add organisation" modal dialog */
function addOrgModal() {

    /* Save section 3 */
    function saveSectionThree() {
        var saveButton = document.getElementById('panel3').querySelector('.save-button');
        doSubmitStep(saveButton);
    }

    /* Set the new organisation on the typeahead by default */
    function updateThisOrganisationTypeahead(orgId) {
        var footer = document.querySelector('footer');
        var child = document.getElementById(footer.getAttribute('selector'));
        var parent = findAncestorByClass(child, 'typeahead-container');
        parent.setAttribute('data-value', orgId);
        parent.setAttribute('not-saved', '');
    }

    /* Remove the modal */
    function cancelModal() {
        var modal = document.querySelector('.modalParent');
        modal.parentNode.removeChild(modal);
    }

    /* Submit the new org */
    function submitModal() {
        if (allInputsFilled()) {
            var api_url, request, form, form_data;

            // Add organisation to DB
            form = document.querySelector('#addOrganisation');
            form_data = serialize(form);

            // Remove empty IATI organistion id
            form_data = form_data.replace('iati_org_id=&', '');

            api_url = '/rest/v1/organisation/?format=json';

            request = new XMLHttpRequest();
            request.open('POST', api_url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            request.onload = function() {
                var response;
                if (request.status === 201) {
                    var organisation_id;

                    // Get organisation ID
                    response = JSON.parse(request.responseText);
                    organisation_id = response.id;

                    // Add location (fails silently)
                    if (form.querySelector('#latitude').value !== '' && form.querySelector('#longitude').value !== '') {
                        var request_loc;
                        api_url = '/rest/v1/organisation_location/?format=json';
                        request_loc = new XMLHttpRequest();
                        request_loc.open('POST', api_url, true);
                        request_loc.setRequestHeader("X-CSRFToken", csrftoken);
                        request_loc.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        request_loc.send(form_data + '&location_target=' + organisation_id);
                    }

                    // Add logo (fails silently)
                    var logo_request, logo_data, org_logo_files;
                    org_logo_files = document.getElementById("org-logo").files;
                    if (org_logo_files !== undefined) {
                        api_url = '/rest/v1/organisation/' + organisation_id + '/add_logo/?format=json';
                        logo_data = new FormData();
                        logo_data.append("logo", org_logo_files[0]);
                        logo_request = new XMLHttpRequest();
                        logo_request.open("POST", api_url);
                        logo_request.setRequestHeader("X-CSRFToken", csrftoken);
                        logo_request.send(logo_data);
                    }

                    updateThisOrganisationTypeahead(organisation_id);
                    updateOrganisationTypeaheads(true);
                    cancelModal();
                } else if (request.status === 400) {
                    response = JSON.parse(request.responseText);

                    document.querySelector('.orgModal').scrollTop = 0;

                    for (var key in response) {
                        if (response.hasOwnProperty(key)) {
                            var input = form.querySelector('#' + key);
                            var inputParent = input.parentNode;
                            var inputHelp = inputParent.querySelector('.help-block');
                            inputHelp.textContent = response[key];
                            elAddClass(inputHelp, 'help-block-error');
                            elAddClass(inputParent, 'has-error');
                        }
                    }
                    return false;
                } else {
                    elAddClass(form, 'has-error');
                    return false;
                }
            };

            request.onerror = function() {
                // There was a connection error of some sort
                document.querySelector('#addOrgGeneralError').textContent = defaultValues.general_error;
                document.querySelector('.orgModal').scrollTop = 0;
                return false;
            };

            request.send(form_data);
        } else {
            document.querySelector('.orgModal').scrollTop = 0;
        }
    }

    function allInputsFilled() {
        var allInputsFilledBoolean = true;

        // Name, long name, type, latitude, longitude, country settings
        var fields = [
            ['name', 'newOrgName'],
            ['long_name', 'newOrgLongName'],
            ['new_organisation_type', 'IATIOrgTypeContainer'],
            ['latitude', 'orgLatitude'],
            ['longitude', 'orgLongitude'],
            ['iati_country', 'orgCountry']
        ];

        // Check all fields
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var fieldNode = document.querySelector('#' + field[0]);
            var fieldNodeHelp = document.querySelector('#' + field[0] + ' + label + .help-block');
            var fieldNodeContainer = document.querySelector('.inputContainer.' + field[1]);

            if (fieldNode.value === '') {
                fieldNodeHelp.textContent = defaultValues.blank_field;
                elAddClass(fieldNodeHelp, 'help-block-error');
                elAddClass(fieldNodeContainer, 'has-error');
                allInputsFilledBoolean = false;
            } else {
                if ((field[0] === 'latitude' || field[0] === 'longitude') && fieldNode.value.indexOf(',') > 0) {
                    fieldNodeHelp.textContent = defaultValues.comma_value;
                    elAddClass(fieldNodeHelp, 'help-block-error');
                    elAddClass(fieldNodeContainer, 'has-error');
                    allInputsFilledBoolean = false;
                } else {
                    fieldNodeHelp.textContent = '';
                    elRemoveClass(fieldNodeHelp, 'help-block-error');
                    elRemoveClass(fieldNodeContainer, 'has-error');
                }
            }
        }

        return allInputsFilledBoolean;
    }

    var Modal = React.createClass({
        render: function() {
            var country_option_list = countryValues.map(function(country) {
              return (
                  <option value={country.pk}>{country.name}</option>
              );
            });

            return (
                <div className="modalParent">
                    <div className="modalBackground">
                    </div>
                    <div className="modalContainer">
                        <div className="orgModal">
                            <div className="modalContents projectEdit">
                                <h4>{defaultValues.add_new_organisation}</h4>
                                <form id="addOrganisation">
                                    <div className="row">
                                        <div id="addOrgGeneralError" className="col-md-12 help-block-error"></div>
                                    </div>
                                    <div className="row">
                                        <div className="inputContainer newOrgName col-md-4 form-group">
                                            <input name="name" id="name" type="text" className="form-control" maxLength="40"/>
                                            <label htmlFor="newOrgName" className="control-label">{defaultValues.name}<span className="mandatory in-org-modal">*</span></label>
                                            <p className="help-block">{defaultValues.max} 40 {defaultValues.characters}</p>
                                        </div>
                                        <div className="inputContainer newOrgLongName col-md-4 form-group">
                                            <input name="long_name" id="long_name" type="text"  className="form-control" maxLength="100"/>
                                            <label htmlFor="newOrgLongName" className="control-label">{defaultValues.long_name}<span className="mandatory in-org-modal">*</span></label>
                                            <p className="help-block">{defaultValues.max} 100 {defaultValues.characters}</p>
                                        </div>
                                        <div className="inputContainer newOrgIatiId col-md-4 form-group">
                                            <input name="iati_org_id" id="iati_org_id" type="text"  className="form-control" maxLength="75"/>
                                            <label htmlFor="newOrgIatiId" className="control-label">{defaultValues.iati_org_id}</label>
                                            <p className="help-block">{defaultValues.max} 75 {defaultValues.characters}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="inputContainer col-md-12 form-group">
                                            <input type="file" className="form-control" id="org-logo" name="org-logo" accept="image/*"/>
                                            <label className="control-label" for="org-logo">{defaultValues.org_logo}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="IATIOrgTypeContainer inputContainer col-md-6 form-group">
                                            <select name="new_organisation_type" id="new_organisation_type"  className="form-control">
                                                <option value=""></option>
                                                <option value="10">10 - {defaultValues.government}</option>
                                                <option value="15">15 - {defaultValues.other_public_sector}</option>
                                                <option value="21">21 - {defaultValues.international_ngo}</option>
                                                <option value="22">22 - {defaultValues.national_ngo}</option>
                                                <option value="23">23 - {defaultValues.regional_ngo}</option>
                                                <option value="30">30 - {defaultValues.public_private_partnership}</option>
                                                <option value="40">40 - {defaultValues.multilateral}</option>
                                                <option value="60">60 - {defaultValues.foundation}</option>
                                                <option value="70">70 - {defaultValues.private_sector}</option>
                                                <option value="80">80 - {defaultValues.academic_training_research}</option>
                                            </select>
                                            <label htmlFor="newOrgIATIType" className="control-label">{defaultValues.org_type}<span className="mandatory in-org-modal">*</span></label>
                                            <p className="help-block"></p>
                                        </div>
                                        <div className="inputContainer col-md-6 form-group">
                                            <input name="url" id="url" type="text" className="form-control"/>
                                            <label htmlFor="url" className="control-label">{defaultValues.website}</label>
                                            <p className="help-block">{defaultValues.start_http}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="inputContainer orgLatitude col-md-4 form-group">
                                            <input name="latitude" id="latitude" type="text" className="form-control"/>
                                            <label htmlFor="latitude" className="control-label">{defaultValues.latitude}<span className="mandatory in-org-modal">*</span></label>
                                            <p className="help-block"></p>
                                        </div>
                                        <div className="inputContainer orgLongitude col-md-4 form-group">
                                            <input name="longitude" id="longitude" type="text"  className="form-control"/>
                                            <label htmlFor="longitude" className="control-label">{defaultValues.longitude}<span className="mandatory in-org-modal">*</span></label>
                                            <p className="help-block"></p>
                                        </div>
                                        <div className="inputContainer orgCountry col-md-4 form-group">
                                            <select name="iati_country" id="iati_country" className="form-control">
                                                <option value=""></option>
                                                {country_option_list}
                                            </select>
                                            <label htmlFor="country" className="control-label">{defaultValues.country}<span className="mandatory in-org-modal">*</span></label>
                                            <p className="help-block"></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p className="help-block">{defaultValues.use_link} <a href='http://www.latlong.net/' target='_blank'>http://www.latlong.net/</a> {defaultValues.coordinates}</p>
                                    </div>
                                    <div className="row">
                                        <div className="inputContainer col-md-6 form-group">
                                            <input name="contact_person" id="contact_person" type="text" className="form-control"/>
                                            <label htmlFor="contact_person" className="control-label">{defaultValues.contact_person}</label>
                                            <p className="help-block"></p>
                                        </div>
                                        <div className="inputContainer col-md-6 form-group">
                                            <input name="contact_email" id="contact_email" type="text" className="form-control"/>
                                            <label htmlFor="contact_email" className="control-label">{defaultValues.contact_email}</label>
                                            <p className="help-block"></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="inputContainer col-md-12 form-group">
                                            <textarea id="description" className="form-control" name="description" rows="3"></textarea>
                                            <label className="control-label" htmlFor="description">{defaultValues.description}</label>
                                            <p className="help-block"></p>
                                        </div>
                                    </div>
                                </form>
                                <div className="controls">
                                    <button className="modal-cancel btn btn-danger" onClick={cancelModal}>
                                    <span className="glyphicon glyphicon-trash"></span> {defaultValues.cancel}
                                    </button>
                                    <button className="modal-save btn btn-success" onClick={submitModal}>
                                        <span className="glyphicon glyphicon-floppy-disk"></span> {defaultValues.save}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });

    saveSectionThree();

    ReactDOM.render(
        React.createElement(Modal), document.querySelector('footer')
    );
}

/* Add validation set to the progress bar */
function removeFromProgressBar(validationSetId) {
    var progressBar = document.getElementById('progress-bar');
    var currentValidationSets = progressBar.getAttribute('validation-sets').split('-');
    var index = currentValidationSets.indexOf(validationSetId);

    if (index > -1) {
        currentValidationSets.splice(index, 1);
        progressBar.setAttribute('validation-sets', currentValidationSets.join('-'));

        setValidationListeners();
        setPageCompletionPercentage();
        setAllSectionsCompletionPercentage();
    }
}

/* Remove a validation set from project */
function removeValidationSetFromProject(validationSet) {
    var validationSetId = validationSet.getAttribute('id').split('-')[2];
    var addValidationUrl = '/rest/v1/project/' + defaultValues.project_id + '/remove_validation/' + validationSetId + '/?format=json';

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("DELETE", addValidationUrl);
    xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            if (xmlHttp.status == 200) {
                removeFromProgressBar(validationSetId);
            }
        } else {
            return false;
        }
    };

    xmlHttp.send();
}

/* Add validation set to the progress bar */
function addToProgressBar(validationSetId) {
    var progressBar = document.getElementById('progress-bar');
    var currentValidationSets = progressBar.getAttribute('validation-sets').split('-');
    currentValidationSets.push(validationSetId);
    progressBar.setAttribute('validation-sets', currentValidationSets.join('-'));

    setValidationListeners();
    setPageCompletionPercentage();
    setAllSectionsCompletionPercentage();
}

/* Add a validation set to project */
function addValidationSetToProject(validationSet) {
    var validationSetId = validationSet.getAttribute('id').split('-')[2];
    if (validationSetId !== '') {
        var addValidationUrl = '/rest/v1/project/' + defaultValues.project_id + '/add_validation/' + validationSetId + '/?format=json';

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open("POST", addValidationUrl);
        xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                if (xmlHttp.status == 200) {
                    addToProgressBar(validationSetId);
                }
            } else {
                return false;
            }
        };

        xmlHttp.send();
    }
}

/* Change the validation sets, either add or remove one */
function changeValidationSet(validationSet) {
    return function(e) {
        e.preventDefault();

        if (validationSet.hasAttribute('checked')) {
            // Validation set has been unchecked and should be removed
            removeValidationSetFromProject(validationSet);
            validationSet.removeAttribute('checked');
        } else {
            // Validation set has been checked and should be added
            addValidationSetToProject(validationSet);
            validationSet.setAttribute('checked', '');
        }
    };
}

/* Set the link for adding a new validation set */
function setValidationSets() {
    var validationSetContainer = document.getElementById('validation-sets');
    if (validationSetContainer !== null) {
        var validationSets = validationSetContainer.querySelectorAll('input');
        for (var i = 0; i < validationSets.length; i++) {
            validationSets[i].onchange = changeValidationSet(validationSets[i]);
        }
    }
}

/* Retrieve all projects for the typeaheads and store in the responses global variable */
function getAllProjects() {
    var url = projectsAPIUrl;
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            if (xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.responseText);
                responses[url] = response;
                updateLocalStorage(url, response);
                updateProjectTypeaheads();
            }
        } else {
            return false;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

/* Retrieve all organisations for the typeaheads and store in the responses global variable */
function getAllOrganisations() {
    var url = orgsAPIUrl;
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            if (xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.responseText);
                responses[url] = response;
                updateLocalStorage(url, response);
                updateOrganisationTypeaheads();
            }
        } else {
            return false;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function setLocalStorage() {
    try {
        localStorageResponses = JSON.parse(localStorageResponses);
    } catch (error) {
        localStorageResponses = {};
    }
}

/* General Helper Functions */
function elHasClass(el, className) {
    if (el.classList && el.classList.forEach) {
        var result = false;
        el.classList.forEach( function(entry) {
            if (entry.toString() === className.toString()) {
                result = true;
                return;
            }
        });
        return result;
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}

function elAddClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
}

function elRemoveClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    }
    else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function elIsVisible(el) {
    return el.offsetWidth > 0 && el.offsetHeight > 0;
}

function initApp() {
    getAllOrganisations();
    getAllProjects();

    setUnsavedChangesMessage();
    setImpactProject();
    setPrivateProject();
    setValidationSets();
    setPublishOnClick();
    setSubmitOnClicks();

    setDatepickers();
    setToggleSectionOnClick();
    setPartialOnClicks();
    setCurrencyOnChange();
    setSectorOnChange();
    setFileUploads();
    checkPartnerships();

    setIndicatorSorting();
    setResultSorting();

    setValidationListeners();
    updateAllHelpIcons();

    setPageCompletionPercentage();
    setAllSectionsCompletionPercentage();
    setAllSectionsChangeListener();

    setLocalStorage();
}

var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactDatepicker() {
        var reactDatepickerSrc = document.getElementById('react-datepicker-compat').src;
        loadJS(reactDatepickerSrc, initApp, document.body);
    }

    function loadReactOnclickoutside() {
        var reactOnclickoutsideSrc = document.getElementById('react-onclickoutside').src;
        loadJS(reactOnclickoutsideSrc, loadReactDatepicker, document.body);
    }

    function loadReactTypeahead() {
        var reactTypeaheadSrc = document.getElementById('react-typeahead').src;
        loadJS(reactTypeaheadSrc, loadReactOnclickoutside, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, loadReactTypeahead, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof ReactTypeahead !== 'undefined' && typeof DatePicker !== 'undefined') {
        initApp();
    } else {
        loadAndRenderReact();
    }
});
