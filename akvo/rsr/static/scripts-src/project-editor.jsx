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

// LOCAL STORAGE
var MAX_LOCALSTORAGE_DAYS = 30;
var MAX_LOCALSTORAGE_AGE = MAX_LOCALSTORAGE_DAYS * 24 * 60 * 60 * 1000;
var localStorageName = 'cachedAPIResponses';
var localStorageResponses = localStorage.getItem(localStorageName);

// PARTIALS
var partials = ['related-project', 'budget-item', 'condition', 'contact-information',
    'country-budget-item','document', 'indicator', 'indicator-period', 'link', 'partner',
    'planned-disbursement', 'policy-marker', 'recipient-country', 'recipient-region',
    'related-project','result', 'sector', 'transaction', 'transaction-sector',
    'location-administrative', 'project-location', 'keyword'];

// Measure the percentage of completion for each panel and display the results to the user
// Which elements count as inputs?
var INPUT_ELEMENTS = ['input', 'select', 'textarea'];

// Add a class selector here if you only want inputs with a certain class to count
// towards the completion percentage. If left blank, all inputs will count.
var MEASURE_CLASS = '.mandatory-rsr';
var MEASURE_CLASS_IATI = '.mandatory-iati';

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

// Source: http://form-serialize.googlecode.com/svn/trunk/serialize-0.2.js
function serialize(form) {
    /* Serialize the form so that it can be sent through the API.
       Modified to skip hidden fields and added / removed some field types.
       Modified to only serialize fields that have been changed. */

	var  q = [];

	for (var i = 0; i < form.elements.length; i++) {
        var formField = form.elements[i];

		if (formField.name === "" || !fieldChanged(formField)) {
			continue;
		}

		switch (formField.nodeName) {
            case 'INPUT':
                switch (formField.type) {
                    case 'text':
                        switch (formField.parentNode.className) {
                            case 'typeahead':
                                q.push(formField.name + "=" + encodeURIComponent(formField.getAttribute('value')));
                                break;
                            default:
                                q.push(formField.name + "=" + encodeURIComponent(formField.value));
                                break;
                        }
                        break;
                    case 'number':
                        q.push(formField.name + "=" + encodeURIComponent(formField.value));
                        break;
                    case 'file':
                        break;
                }
                break;
            case 'TEXTAREA':
                q.push(formField.name + "=" + encodeURIComponent(formField.value));
                break;
            case 'SELECT':
                q.push(formField.name + "=" + encodeURIComponent(formField.value));
                break;
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
    } else {
        icon.classList.add('glyphicon-remove-circle');
        message_div.classList.add('help-block-error');
        message_div.appendChild(icon);
    }

    message_div.appendChild(document.createTextNode(' ' + message));
    save_message_div.appendChild(message_div);
}

function removeErrors(form) {
    var error_elements, form_elements;

    error_elements = form.querySelectorAll('.help-block-error');
    form_elements = form.querySelectorAll('.has-error');

    while (error_elements.length > 0) {
        error_elements[0].parentNode.removeChild(error_elements[0]);
    }

    while (form_elements.length > 0) {
        form_elements[0].className = form_elements[0].className.replace('has-error', '');
    }
}

function addErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
        try {
            var error, errorNode, textnode;

            error = errors[i];

            errorNode = document.getElementById(error.name);

            if (errorNode.className.indexOf('-container') === -1) {
                errorNode = errorNode.parentNode;

            }

            if (errorNode.className.indexOf('input-group') > -1) {
                errorNode = errorNode.parentNode;
            }

            errorNode.className += ' has-error';

            var pNode = document.createElement("p");
            pNode.className = "help-block help-block-error";
            textnode = document.createTextNode(error.error);
            pNode.appendChild(textnode);
            errorNode.appendChild(pNode);

            if (i === 0) {
                document.getElementById(error.name).scrollIntoView();
                window.scrollBy(0, -100);
            }
        } catch (tryError) {
            // Can't find attribute, probably due to a name change
        }
    }
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
                        console.log(relObjectParentElementId);
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

function replaceTotalBudget(total_budget) {
    var totalBudgetNode;

    totalBudgetNode = document.getElementById('total-budget');
    totalBudgetNode.innerHTML = total_budget;
}

function saveDocuments(form, api_url, step, new_objects) {
    var documentFormData, documents, file_request;

    documentFormData = new FormData();
    documents = form.querySelectorAll('*[id^="document-document-"]');

    for (var i=0; i < documents.length; i++) {
        var document_id, document_files;
        document_id = documents[i].getAttribute("id");
        document_files = document.getElementById(document_id).files;

        if (document_files !== undefined) {
            documentFormData.append(document_id, document_files[0]);
        }
    }

    file_request = new XMLHttpRequest();
    file_request.open("POST", api_url);
    file_request.setRequestHeader("X-CSRFToken", csrftoken);

    file_request.onload = function() {
        var message;

        if (file_request.status >= 200 && file_request.status < 400) {
            var response;

            response = JSON.parse(file_request.responseText);
            addErrors(response.errors);

            if (response.errors.length > 0) {
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Error while saving document</div>';
                finishSave(step, message);
            }

            return false;
        } else {
            // We reached our target server, but it returned an error
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong with your request</div>';

            finishSave(step, message);
            return false;
        }
    };

    file_request.onerror = function() {
        // There was a connection error of some sort
        var message;

        message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

        finishSave(step, message);
        return false;
    };

    file_request.send(documentFormData);
}

function submitStep(saveButton) {
    return function(e) {
        /* Main function for submitting a form */
        e.preventDefault();

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

                // Replace saved values
                for (var i=0; i < response.changes.length; i++) {
                    var formElement;

                    formElement = document.getElementById(response.changes[i][0]);
                    formElement.setAttribute('saved-value', response.changes[i][1]);
                }

                // Replace field IDs, names and unicode
                replaceNames(response.rel_objects);

                var section = findAncestorByClass(form, 'formStep');
                setSectionCompletionPercentage(section);
                setPageCompletionPercentage();

                return false;
            } else if (request.status === 403) {
                // TODO: Not allowed to save, add error message
                finishSave(saveButton, message);
                return false;
            } else {
                // We reached our target server, but it returned an error
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong while saving</div>';

                finishSave(saveButton, message);
                return false;
            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

            finishSave(saveButton, message);
            return false;
        };

        request.send(form_data);
    }
}

function deleteItem(itemId, itemType) {
    /* Delete an item through the API, and remove the associated related object div. */

    var relatedObjDiv = document.getElementById(itemType + '.' + itemId);

    var request = new XMLHttpRequest();
    request.open('DELETE', '/rest/v1/' + itemType + '/' + itemId + '/?format=json', true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            relatedObjDiv.parentNode.removeChild(relatedObjDiv);

            // Update the budget in case of removed budget
            if (itemType === 'budget-item') {
                getTotalBudget();
            }

            return false;
        } else {
            // We reached our target server, but it returned an error
            // TODO: Show error message
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        // TODO: Show error message
        return false;
    };

    request.send();
}

/* Check the size of a file. MaxSize is specified in MB. */
function checkFileSize(file, maxSize) {
    return file.size < maxSize * 1024 * 1024;
}

function setDeletePhoto() {
    try {
        var deletePhotoButton;

        deletePhotoButton = document.getElementById('delete-photo');
        deletePhotoButton.onclick = getDeletePhoto();

    } catch (error) {
        // No delete photo button
        return false;
    }
}

function getDeletePhoto() {
    return function(e) {
        e.preventDefault();
        deletePhoto();
    };
}

function deletePhoto() {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/delete_photo/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var imgNode, aNode, inputNode;

            imgNode = document.getElementById('img-photo');
            imgNode.parentNode.removeChild(imgNode);

            aNode = document.getElementById('delete-photo');
            aNode.parentNode.removeChild(aNode);

            inputNode = document.getElementById('rsr_project.current_image.' + defaultValues.project_id);
            inputNode.setAttribute('default', '');

            setAllSectionsCompletionPercentage();

            return false;
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

function setPhotoUpload() {
    try {
        var photoInput;

        photoInput = document.getElementById('rsr_project.current_image.' + defaultValues.project_id);
        photoInput.onchange = function(e) {
            e.preventDefault();
            uploadPhoto(photoInput);
        };

    } catch (error) {
        // No photo input found
        return false;
    }
}

function uploadPhoto(photoInput) {
    var formData, progressBarContainer, request, uploadFile, url;

    // Remove error indications
    var errorHelpNodes = photoInput.parentNode.querySelectorAll('.help-block-error');
    for (var i=0; i<errorHelpNodes.length; i++) {
        errorHelpNodes[i].parentNode.removeChild(errorHelpNodes[i])
    }
    photoInput.parentNode.classList.remove('has-error');

    // Get photo
    uploadFile = photoInput.files[0];

    // Check file size first
    if (!checkFileSize(uploadFile, 2)) {
        var errorText, uploadFileSize;

        uploadFileSize = uploadFile.size / 1024 / 1024;

        errorText = defaultValues.file_size + ': ' + uploadFileSize.toFixed(2) + ' MB. ';
        errorText += defaultValues.file_size_allowed + ' 2 MB.';

        addErrors([{"name": "rsr_project.current_image." + defaultValues.project_id,
                    "error": errorText}]);
        return false;
    }

    // Check if file is image, supported formats are: jpg, jpeg, png, gif
    if (!uploadFile.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        addErrors([{"name": "rsr_project.current_image." + defaultValues.project_id,
                    "error": defaultValues.image_file_format + ": jpg, jpeg, png, gif"}]);
        return false;
    }

    url = '/rest/v1/project/' + defaultValues.project_id + '/upload_photo/?format=json';

    formData = new FormData();
    formData.append("photo", uploadFile);

    request = new XMLHttpRequest();

    progressBarContainer = document.getElementById('rsr_project.current_image.' + defaultValues.project_id + '.progress');

    if (request.upload) {
        // Show progress bar
        progressBarContainer.classList.remove('hidden');

        // progress bar
		request.upload.addEventListener("progress", function(e) {
            var progressBar = progressBarContainer.querySelector('.progress-bar');
			var percentage = parseInt(100 - (e.loaded / e.total * 100));
            progressBar.setAttribute('aria-valuenow', percentage);
            progressBar.style.width = percentage + '%';
            progressBar.innerHTML = percentage + '%';
		}, false);
    }

    request.open("POST", url);
    request.setRequestHeader("X-CSRFToken", csrftoken);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var response = JSON.parse(request.responseText);
            replacePhoto(response.new_image);
        }

        // Remove progress bar
        progressBarContainer.classList.add('hidden');

        return false;
    };

    request.onerror = function() {
        // Remove progress bar
        progressBarContainer.classList.add('hidden');

        addErrors([{"name": "rsr_project.current_image." + defaultValues.project_id,
                    "error": defaultValues.connection_error}]);

        return false;
    };

    request.send(formData);
}

function deleteDocument(document_id) {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/delete_document/' + document_id + '/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var docNode, aNode;

            docNode = document.querySelector('#document-document-url-' + document_id);
            docNode.parentNode.removeChild(docNode);

            aNode = document.querySelector('#delete-document-document-' + document_id);
            aNode.parentNode.removeChild(aNode);

            return false;
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

function confirmRemove(objId, apiEndpoint, parentDiv) {
    return function(e) {
        e.preventDefault();

//        var itemId, itemType;
//
//        itemId = idArray[idArray.length - 1];
//        idArray.pop();
//        itemType = idArray.join();
//
//        if (itemType === 'keyword') {
//            itemType = 'project/' + defaultValues.project_id + '/remove_keyword';
//        }

        deleteItem(objId, apiEndpoint, parentDiv);
    };
}

function dismissRemove(noNode) {
    return function(e) {
        e.preventDefault();

        var sureNode = noNode.parentNode;
        var parentNode = sureNode.parentNode;
        parentNode.removeChild(sureNode);

        var node = document.createElement('a');
        node.setAttribute('class', 'delete-related-object');
        node.onclick = setRemovePartial(node);

        var trashCan = document.createElement('span');
        trashCan.setAttribute('class', 'glyphicon glyphicon-trash');

        node.appendChild(trashCan);
        parentNode.appendChild(node);
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
    inputClass = selector + " form-control " + childClass;

    selectorClass = document.querySelector('.' + childClass);

    TypeaheadContainer = React.createClass({

        getInitialState: function() {
            return ({focusClass: 'inactive'});
        },
        onKeyUp: function() {

            /* Only activate the "add org" button for typeaheads that are for organisations. */
            if (inputType === 'org') {
                this.setState({focusClass: 'active'});
            }
        },
        onBlur: function() {
            this.setState({focusClass: 'inactive'});
        },
        render: function() {
            return (
                    <div className={this.state.focusClass}>
                        <Typeahead
                            placeholder=''
                            options={typeaheadOptions}
                            onOptionSelected={typeaheadCallback}
                            maxVisible={10}
                            displayOption={displayOption}
                            filterOption={filterOption}
                            childID={selector}
                            onKeyUp={this.onKeyUp}
                            onBlur={this.onBlur}
                            customClasses={{
                              typeahead: "",
                              input: inputClass,
                              results: "",
                              listItem: "",
                              token: "",
                              customAdd: ""
                            }}
                            inputProps={{
                                name: selector,
                                id: selector
                            }} />
                        <div className="addOrg" onMouseDown={addOrgModal}>+ {defaultValues.add_new_organisation}</div>
                    </div>
            );
        }
    });

    React.render(
        <TypeaheadContainer />,
        document.querySelector('.' + childClass)
    );

    typeaheadInput = document.querySelector('.' + childClass + ' .typeahead' + ' input');
    typeaheadInput.setAttribute('autocomplete', 'off');
    typeaheadInput.setAttribute('id', selector);

    if (valueId !== null) {
        for (var i = 0; i < typeaheadOptions.length; i++) {
            if (parseInt(typeaheadOptions[i].id, 10) == parseInt(valueId, 10)) {
                var savedResult;

                savedResult = typeaheadOptions[i];

                typeaheadInput.value = savedResult[displayOption];
                typeaheadInput.setAttribute('value', savedResult.id);
                typeaheadInput.setAttribute('saved-value', savedResult.id);
            }
        }
    } else {
        typeaheadInput.setAttribute('saved-value', '');
    }

    selectorTypeahead = selectorClass.querySelector('.typeahead');
    selectorTypeahead.appendChild(label);
    selectorTypeahead.appendChild(help);
    elAddClass(selectorClass, 'has-typeahead');

    // Set mandatory markers before help icons
    var mandatoryMarkers = selectorClass.querySelectorAll('.mandatory');

    for (var i = 0; i < mandatoryMarkers.length; i++) {
        mandatoryMarkers[i].parentNode.removeChild(mandatoryMarkers[i]);
    }

    var mandatoryLabels = selectorClass.querySelectorAll(MEASURE_CLASS + ' ~ label');
    var markerSpan = document.createElement('span');

    elAddClass(markerSpan, 'mandatory');
    markerSpan.textContent = '*';

    for (var i = 0; i < mandatoryLabels.length; i++) {
        mandatoryLabels[i].appendChild(markerSpan);
    }

    updateHelpIcons('.' + childClass);
    setAllSectionsCompletionPercentage();
    setAllSectionsChangeListerner();
    setPageCompletionPercentage();
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
        var el;

        el = document.querySelector('input.' + childClass);
        el.setAttribute('value', option.id);
    };
    var displayOption = function(option, index) {
        return option[filterOption];
    };

    buildReactComponents(typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption, inputType);
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

    var removeLinks = document.querySelectorAll('.delete-related-object');
    for (var k=0; k < removeLinks.length; k++) {
        removeLinks[k].onclick = setRemovePartial(removeLinks[k]);
    }

    var hidePartials = document.querySelectorAll('.hide-partial-click');
    for (var l=0; l < hidePartials.length; l++) {
        hidePartials[l].onclick = togglePartial(hidePartials[l]);
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
            var oldFieldIdList = partialInputs[j].getAttribute('id').split('.');
            partialInputs[j].setAttribute('id', [oldFieldIdList[0], oldFieldIdList[1], newID].join('.'));
            partialInputs[j].setAttribute('name', [oldFieldIdList[0], oldFieldIdList[1], newID].join('.'));
        }
    }

    // Replace names and IDs of all typeahead fields
    var typeaheadContainers = partial.querySelectorAll('.typeahead-container');
    for (var k = 0; k < typeaheadContainers.length; k++) {
        // Update the data-child-id attribute
        var oldChildIdList = typeaheadContainers[k].getAttribute('data-child-id').split('.');
        var oldTypeaheadId = oldChildIdList[2];
        typeaheadContainers[k].setAttribute('data-child-id', [oldChildIdList[0], oldChildIdList[1], newID].join('.'));


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

            return [-1, false]
        }

        // Indicate the hierarchy of partials
        var partialHierarchy = [
            ['result', 'indicator', 'indicator-period'],
            ['transaction', 'transaction-sector'],
            ['project-location', 'location-administrative']
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
                var childChildContainer = childContainer.querySelector('.parent');
                var childRelatedObjCount = document.querySelectorAll('.' + hierarchyList[1][1] + '-item').length;
                updatePartialIDs(childChildContainer, [childId, 'new-' + childRelatedObjCount.toString()].join('_'));
            }
        } else if (hierarchyList[0] === 2 || hierarchyList[0] === 3) {
            // Second or third level, fetch the ID from the parent item and add the new ID to it
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
                childContainer = partial.querySelector('.parent');
                relatedObjCount = document.querySelectorAll('.' + hierarchyList[1][0] + '-item').length;
                updatePartialIDs(childContainer, [newID, 'new-' + relatedObjCount.toString()].join('_'));
            }
        }

        var parentContainer, parentID;

        // Update the typeaheads and datepickers
        updateTypeaheads();
        setDatepickers();

        // Update help icons and progress bars
        updateHelpIcons('.' + partialName + '-container');
        setSectionChangeListener(findAncestorByClass(partialContainer, 'formStep'));
        setSectionCompletionPercentage(findAncestorByClass(partialContainer, 'formStep'));
        setValidationListeners();

        // Set onClicks for partials again in case this partial contains other partials
        setPartialOnClicks();
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
}

function updateTypeaheads(forceReloadOrg) {
    updateOrganisationTypeaheads(forceReloadOrg);
    updateProjectTypeaheads();
}

function updateHelpIcons(container) {
    // Add an "info" glyphicon to each label
    // Clicking the glyphicon shows the help text
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

        iconClasses.forEach(function(el) {
            elAddClass(output, el);
        });

        label.appendChild(output);

        var infoIcons = label.querySelectorAll('.info-icon');

        for (var i = 0; i < infoIcons.length; i++) {
            var el = infoIcons[i];
            var listener = getInfoIconListener(el, helpBlockIsLabelSibling);
            el.onclick = listener;
        }

        // Mark the label as processed to avoid adding extra help icons to it later
        elAddClass(label, 'has-icon');
    }
}

function getInfoIconListener(el, helpBlockIsLabelSibling) {
    var output = function(e) {
        var helpBlock;

        e.preventDefault();

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

    return output;
}

function updateAllHelpIcons() {
    var pageContainer;

    pageContainer = '.projectEdit';
    updateHelpIcons(pageContainer);
}

function setSectionCompletionPercentage(section) {
    var inputResults = getInputResults(section, MEASURE_CLASS);
    var numInputs = inputResults[0];
    var numInputsCompleted = inputResults[1];

    if (numInputs === 0) {
        if (elHasClass(section, 'stepEight')) {
            // Section 8 without mandatory fields (no sectors) should still display empty
            renderCompletionPercentage(0, 1, section);
            return;
        } else {
            // There are no mandatory fields, show the section as complete
            renderCompletionPercentage(1, 1, section);
            return;
        }
    }

    renderCompletionPercentage(numInputsCompleted, numInputs, section);
}

function setPageCompletionPercentage() {
    var inputResults, numInputs, numInputsCompleted, completionPercentage, publishButton;

    inputResults = getInputResults(document.querySelector('.projectEdit'), MEASURE_CLASS);
    numInputs = inputResults[0];
    numInputsCompleted = inputResults[1];

    completionPercentage = renderCompletionPercentage(numInputsCompleted, numInputs,
                                            document.querySelector('.rsr-progress'));

    // Enable publishing when all is filled in
    if (completionPercentage === 100) {
        try {
            publishButton = document.getElementById('publishProject');
            publishButton.removeAttribute('disabled');
        } catch (error) {
            // Do nothing, no publish button
        }
    } else {
        try {
            publishButton = document.getElementById('publishProject');
            publishButton.setAttribute('disabled', '');
        } catch (error) {
            // Do nothing, no publish button
        }
    }

    inputResults = getInputResults(document.querySelector('.projectEdit'), MEASURE_CLASS_IATI);
    numInputs = inputResults[0];
    numInputsCompleted = inputResults[1];

    renderCompletionPercentage(numInputsCompleted, numInputs, document.querySelector('.iati-progress'));
}

function getInputResults(section, measureClass) {
    var numInputs = 0;
    var numInputsCompleted = 0;

    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var selector, sectionResults;

        selector = INPUT_ELEMENTS[i] + measureClass;
        sectionResults = section.querySelectorAll(selector);

        for (var j = 0; j < sectionResults.length; j++ ) {
            var result = sectionResults[j];

            if (result.getAttribute('name') === 'step') {
                // This is a progress bar input, ignore it
                continue;
            }

            if (result.getAttribute('disabled') !== null) {
                // This is a disabled input, ignore it
                continue;
            }

            numInputs += 1;

            if (result.getAttribute('name') === 'projectStatus' && result.value === 'N') {
                // Ignore project status 'None'
                continue;
            } else if (result.value !== '') {
                numInputsCompleted += 1;
            } else if (result.getAttribute('name') === 'rsr_project.current_image.' + defaultValues.project_id && result.getAttribute('default') !== '' && result.getAttribute('default') !== null) {
                // Custom code for project photo
                numInputsCompleted += 1;
            }
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
        var selector;
        var elements;

        selector = INPUT_ELEMENTS[i] + MEASURE_CLASS;
        elements = section.querySelectorAll(selector);

        for (var y = 0; y < elements.length; y++) {
            var listener;
            var el = elements[y];

            if (elHasClass(el, 'has-listener')) {

                // We have already added a class for this listener
                // do nothing
                continue;
            }

            listener = getChangeListener(section, this);
            el.addEventListener('change', listener);
        }

        selector = INPUT_ELEMENTS[i] + MEASURE_CLASS_IATI;
        elements = section.querySelectorAll(selector);

        for (var z = 0; z < elements.length; z++) {
            var listener_iati;
            var el_iati = elements[z];

            if (elHasClass(el_iati, 'has-listener')) {

                // We have already added a class for this listener
                // do nothing
                continue;
            }

            listener_iati = getChangeListener(section, this);
            el_iati.addEventListener('change', listener_iati);
        }
    }
}

function getChangeListener(section, el) {
    var listener;

    listener = function() {
        var currentSection;
        currentSection = section;

        setSectionCompletionPercentage(currentSection);
        elAddClass(el, 'has-listener');
        setPageCompletionPercentage();
    };
    return listener;
}

function setAllSectionsCompletionPercentage() {
    var formSteps = document.querySelectorAll('.formStep');

    for (var i = 0; i < formSteps.length; i++) {
        setSectionCompletionPercentage(formSteps[i]);
    }
}

function setAllSectionsChangeListerner() {
    var formSteps = document.querySelectorAll('.formStep');

    for (var i = 0; i < formSteps.length; i++) {
        setSectionChangeListener(formSteps[i]);
    }
}

// Validate all inputs with the given class
// Display validation status to the user in real time
function setValidationListeners() {
    var inputs = document.querySelectorAll('input');
    var textareas = document.querySelectorAll('textarea');

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var inputListener;
        var focusOutListener;

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

    for (var i = 0; i < textareas.length; i++) {
        var textarea = textareas[i];
        var inputListener;
        var focusOutListener;

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

    function getLengthListener(el) {
            var output = function() {
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

        return output;
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

    // Mark mandatory fields with an asterisk
    function markMandatoryFields() {
        var existingMarkers = document.querySelectorAll('.mandatory');
        var elementsToMark = document.querySelectorAll(MEASURE_CLASS + ' ~ label');

        // Clear any existing markers
        for (var i = 0; i < existingMarkers.length; i++) {
            var el = existingMarkers[i];

            el.parentNode.removeChild(el);
        }

        for (var i = 0; i < elementsToMark.length; i++) {
            var el = elementsToMark[i];
            var markContainer = document.createElement('span');

            elAddClass(markContainer, 'mandatory');
            markContainer.textContent = '*';

            el.appendChild(markContainer);
        }
    }

    markMandatoryFields();
}

function setCurrencyOnChange() {
    try {
        var currencyDropdown;

        currencyDropdown = document.getElementById('projectCurrency');
        currencyDropdown.onchange = updateCurrency(currencyDropdown);
    } catch (error) {
        // No currency dropdown
        return false;
    }
}

function updateCurrency(currencyDropdown) {
    return function(e) {
        e.preventDefault();

        var currencyDisplays, currency;

        currency = currencyDropdown.options[currencyDropdown.selectedIndex].text;
        currencyDisplays = document.getElementsByClassName('currency-display');

        for (var i=0; i < currencyDisplays.length; i++) {
            currencyDisplays[i].innerHTML = currency;
        }
    };
}

function setToggleSectionOnClick () {
    var toggleSections;

    toggleSections = document.getElementsByClassName('toggleSection');

    for (var i=0; i < toggleSections.length; i++) {
        toggleSections[i].onclick = toggleSection(toggleSections[i]);
    }
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
        } else {
            formBlock.className += ' hidden';
            infoIcon.className += ' hidden';
        }
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

        } else {
            // Show warning first
            var nodeClass, nodeId, noNode, parentNode, sureNode, yesNode;

            nodeClass = node.getAttribute('class');
            nodeId = node.getAttribute('id');

            parentNode = node.parentNode;
            parentNode.removeChild(node);

            sureNode = document.createElement('div');
            sureNode.innerHTML = defaultValues.sure_message;

            yesNode = document.createElement('a');
            yesNode.setAttribute('style', 'color: green; margin-left: 5px;');
            yesNode.onclick = confirmRemove(objId, apiEndpoint, parentDiv);
            yesNode.innerHTML = defaultValues.yes;

            noNode = document.createElement('a');
            noNode.setAttribute('style', 'color: red; margin-left: 5px;');
            noNode.onclick = dismissRemove(noNode);
            noNode.innerHTML = defaultValues.no;

            sureNode.appendChild(yesNode);
            sureNode.appendChild(noNode);
            parentNode.appendChild(sureNode);
        }

        // Update the progress bars to account for the removed inputs
        setSectionCompletionPercentage(findAncestorByClass(parentParent, "formStep"));
    };
}

function setImportResults() {
    try {
        var importButton;

        importButton = document.getElementById('import-results');
        importButton.onclick = getImportResults(importButton);

    } catch (error) {
        // No import results button
        return false;
    }
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
            response = JSON.parse(request.responseText);
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
    }
}

function setPublishOnClick() {
    try {
        var publishButton;

        publishButton = document.getElementById('publishProject');
        publishButton.onclick = getProjectPublish(defaultValues.publishing_status_id, publishButton);

    } catch (error) {
        // No publish button
        return false;
    }
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
                var publishingStatusNode, viewProjectButton;
                publishingStatusNode = document.getElementById('publishingStatus');
                viewProjectButton = document.getElementById('viewProject');

                // Change the project's status indicator
                // Change the view project page button to "View project" or "Preview project"
                // Update the button's status and appearance
                if (status === 'unpublished') {
                    publishingStatusNode.className = "published";
                    publishingStatusNode.innerHTML = "published";
                    viewProjectButton.innerHTML = defaultValues.view_project;
                    publishButton.setAttribute('status', 'published');
                    publishButton.innerHTML = "Unpublish project";
                    publishButton.className = publishButton.className.replace('btn-success', 'btn-danger');
                } else {
                    publishingStatusNode.className = "notPublished";
                    publishingStatusNode.innerHTML = "unpublished";
                    viewProjectButton.innerHTML = defaultValues.preview_project;
                    publishButton.setAttribute('status', 'unpublished');
                    publishButton.innerHTML = "Publish project";
                    publishButton.className = publishButton.className.replace('btn-danger', 'btn-success');
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
    var datepickerContainers;

    datepickerContainers = document.getElementsByClassName('datepicker-container');

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

            DatePickerComponent = React.createClass({
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
                    });
                },

                render: function () {
                    if (disableInput !== 'true') {
                        return <div>
                            <DatePicker
                            locale = 'en'
                            placeholderText = ''
                            dateFormat = 'DD/MM/YYYY'
                            selected = {this.state.initialDate}
                            onChange = {this.handleDateChange}
                            />
                        </div>;
                    } else {
                        return <div>
                            <DatePicker
                            locale = 'en'
                            placeholderText = ''
                            dateFormat = 'DD/MM/YYYY'
                            selected = {this.state.initialDate}
                            />
                        </div>;
                    }
                }
            });


            React.render(<DatePickerComponent key={datepickerId} />, datepickerContainer);

            // Set id, name and saved value of datepicker input
            inputNode = datepickerContainer.getElementsByClassName('datepicker__input')[0];
            inputNode.setAttribute("id", datepickerId);
            inputNode.setAttribute("name", datepickerId);
            inputNode.setAttribute("saved-value", inputValue);
            if (disableInput === 'true') {
                inputNode.setAttribute("disabled", '');
            }

            // Set classes of datepicker input
            inputNode.className += ' form-control ' + datepickerContainer.getAttribute('data-classes');

            // Set addtional attributes of input
            extraAttributes = datepickerContainer.getAttribute('data-attributes');
            if (extraAttributes !== null) {
                var extraAttributesList = extraAttributes.split(' ');
                for (var j = 0; j < extraAttributesList.length; j++) {
                    if (extraAttributesList[j] !== '') {
                        inputNode.setAttribute(extraAttributesList[j], '');
                    }
                }
            }

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
    *  Ignores hidden fields and file fields. */

    if (fieldIsHidden(inputField) || inputField.type === 'file') {
        return false;
    } else if (inputField.parentNode.className === 'typeahead') {
        return (inputField.getAttribute('value') !== inputField.getAttribute('saved-value'))
    } else {
        return (inputField.value !== inputField.getAttribute('saved-value'))
    }
}

function checkUnsavedChangesForm(form) {
    /* Checks if a form has unsaved changes. Returns true if so and false otherwise. */

    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var inputElements = form.querySelectorAll(INPUT_ELEMENTS[i]);
        for (var j = 0; j < inputElements.length; j++) {
            if (fieldChanged(inputElements[j])) {
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
        '10 - Project comments'
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

    /* Remove the modal */
    function cancelModal() {
        var modal = document.querySelector('.modalParent');
        modal.parentNode.removeChild(modal);
    }

    /* Submit the new org */
    function submitModal() {
        if (allInputsFilled() && checkLocationFilled()) {
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
                if (request.status === 201) {
                    var organisation_id;

                    // Get organisation ID
                    response = JSON.parse(request.responseText);
                    organisation_id = response.id;

                    // Add location (fails silently)
                    if (form.querySelector('#latitude').value !== '') {
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

                    // This flag forces the fetching of a fresh API response
                    var forceReloadOrg = true;

                    updateOrganisationTypeaheads(forceReloadOrg);
                    cancelModal();
                } else if (request.status === 400) {
                    var response;
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
        var shortName = document.querySelector('#name');
        var shortNameHelp = document.querySelector('#name + label + .help-block');
        var shortNameContainer = document.querySelector('.inputContainer.newOrgName');
        var longName = document.querySelector('#long_name');
        var longNameHelp = document.querySelector('#long_name + label + .help-block');
        var longNameContainer = document.querySelector('.inputContainer.newOrgLongName');

        if (shortName.value === '') {
            shortNameHelp.textContent = defaultValues.blank_name;
            elAddClass(shortNameHelp, 'help-block-error');
            elAddClass(shortNameContainer, 'has-error');
            allInputsFilledBoolean = false;
        } else {
            shortNameHelp.textContent = '';
            elRemoveClass(shortNameHelp, 'help-block-error');
            elRemoveClass(shortNameContainer, 'has-error');
        }

        if (longName.value === '') {
            longNameHelp.textContent = defaultValues.blank_long_name;
            elAddClass(longNameHelp, 'help-block-error');
            elAddClass(longNameContainer, 'has-error');
            allInputsFilledBoolean = false;
        } else {
            longNameHelp.textContent = '';
            elRemoveClass(longNameHelp, 'help-block-error');
            elRemoveClass(longNameContainer, 'has-error');
        }

        return allInputsFilledBoolean;
    }

    function checkLocationFilled() {
        var latitudeNode, longitudeNode, countryNode, latitudeHelp, longitudeHelp, countryHelp, result;

        latitudeNode = document.querySelector('#latitude');
        latitudeHelp = document.querySelector('#latitude + label + .help-block');
        longitudeNode = document.querySelector('#longitude');
        longitudeHelp = document.querySelector('#longitude + label + .help-block');
        countryNode = document.querySelector('#country');
        countryHelp = document.querySelector('#country + label + .help-block');

        result = true;

        if (latitudeNode.value === '' && longitudeNode.value === '' && countryNode.value === '') {
            return result;
        } else if (latitudeNode.value === '' || longitudeNode.value === '' || countryNode.value === '') {
            if (latitudeNode.value === '') {
                latitudeHelp.textContent = defaultValues.location_check;
                elAddClass(latitudeHelp, 'help-block-error');
                elAddClass(latitudeHelp.parentNode, 'has-error');
            }
            if (longitudeNode.value === '') {
                longitudeHelp.textContent = defaultValues.location_check;
                elAddClass(longitudeHelp, 'help-block-error');
                elAddClass(longitudeHelp.parentNode, 'has-error');
            }
            if (countryNode.value === '') {
                countryHelp.textContent = defaultValues.location_check;
                elAddClass(countryHelp, 'help-block-error');
                elAddClass(countryHelp.parentNode, 'has-error');
            }
            result = false;
        } else {
            if (latitudeNode.value.indexOf(',') > 0) {
                latitudeHelp.textContent = defaultValues.comma_value;
                elAddClass(latitudeHelp, 'help-block-error');
                elAddClass(latitudeHelp.parentNode, 'has-error');
                result = false;
            }
            if (longitudeNode.value.indexOf(',') > 0) {
                longitudeHelp.textContent = defaultValues.comma_value;
                elAddClass(longitudeHelp, 'help-block-error');
                elAddClass(longitudeHelp.parentNode, 'has-error');
                result = false;
            }
        }
        return result;
    }

    Modal = React.createClass({
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
                                            <div className="inputContainer newOrgName col-md-4">
                                                <input name="name" id="name" type="text" className="form-control" maxLength="25"/>
                                                <label htmlFor="newOrgName" className="control-label">{defaultValues.name}<span className="mandatory">*</span></label>
                                                <p className="help-block">{defaultValues.max} 25 {defaultValues.characters}</p>
                                            </div>
                                            <div className="inputContainer newOrgLongName col-md-4">
                                                <input name="long_name" id="long_name" type="text"  className="form-control" maxLength="75"/>
                                                <label htmlFor="newOrgLongName" className="control-label">{defaultValues.long_name}<span className="mandatory">*</span></label>
                                                <p className="help-block">{defaultValues.max} 75 {defaultValues.characters}</p>
                                            </div>
                                            <div className="inputContainer newOrgIatiId col-md-4">
                                                <input name="iati_org_id" id="iati_org_id" type="text"  className="form-control" maxLength="75"/>
                                                <label htmlFor="newOrgIatiId" className="control-label">{defaultValues.iati_org_id}</label>
                                                <p className="help-block">{defaultValues.max} 75 {defaultValues.characters}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="inputContainer col-md-12">
                                                <input type="file" className="form-control" id="org-logo" name="org-logo" accept="image/*"/>
                                                <label className="control-label" for="org-logo">{defaultValues.org_logo}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="IATIOrgTypeContainer inputContainer col-md-6">
                                                <select name="new_organisation_type" id="newOrgIATIType"  className="form-control">
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
                                                <label htmlFor="newOrgIATIType" className="control-label">{defaultValues.org_type}<span className="mandatory">*</span></label>
                                                <p className="help-block"></p>
                                            </div>
                                            <div className="inputContainer col-md-6">
                                                <input name="url" id="url" type="text" className="form-control"/>
                                                <label htmlFor="url" className="control-label">{defaultValues.website}</label>
                                                <p className="help-block">{defaultValues.start_http}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="inputContainer col-md-4">
                                                <input name="latitude" id="latitude" type="text" className="form-control"/>
                                                <label htmlFor="latitude" className="control-label">{defaultValues.latitude}</label>
                                                <p className="help-block"></p>
                                            </div>
                                            <div className="inputContainer col-md-4">
                                                <input name="longitude" id="longitude" type="text"  className="form-control"/>
                                                <label htmlFor="longitude" className="control-label">{defaultValues.longitude}</label>
                                                <p className="help-block"></p>
                                            </div>
                                            <div className="inputContainer col-md-4">
                                                <select name="country" id="country" className="form-control">
                                                    <option value="">{defaultValues.country}:</option>
                                                    {country_option_list}
                                                </select>
                                                <label htmlFor="country" className="control-label">{defaultValues.country}</label>
                                                <p className="help-block"></p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <p className="help-block">{defaultValues.use_link} <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> {defaultValues.coordinates}</p>
                                        </div>
                                        <div className="row">
                                            <div className="inputContainer col-md-6">
                                                <input name="contact_person" id="contact_person" type="text" className="form-control"/>
                                                <label htmlFor="contact_person" className="control-label">{defaultValues.contact_person}</label>
                                                <p className="help-block"></p>
                                            </div>
                                            <div className="inputContainer col-md-6">
                                                <input name="contact_email" id="contact_email" type="text" className="form-control"/>
                                                <label htmlFor="contact_email" className="control-label">{defaultValues.contact_email}</label>
                                                <p className="help-block"></p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="inputContainer col-md-12">
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
                                            <span className="glyphicon glyphicon-plus"></span> {defaultValues.add_new_organisation}
                                        </button>
                                    </div>   
                                </div>
                            </div>                   
                        </div>
                    </div>
            );
        }
    });

    React.render(
        <Modal />,

        // Use the footer to prevent page scroll on injection
        document.querySelector('footer')
    );    
}

/* Set the onclick() for switching to the advanced editor */
function setAdvancedFieldsOnClick () {
    var advancedFieldsButton;

    advancedFieldsButton = document.getElementById('showAdvancedFields');
    advancedFieldsButton.onclick = function(e) {
        e.preventDefault();

        var advancedFields = document.getElementsByClassName("hide-default");
        for (var i=0; i < advancedFields.length; i++){
            if (advancedFields[i].classList.contains("hidden")) {
                advancedFields[i].classList.remove("hidden");
            }
        }

        var hideFields = document.getElementsByClassName("show-default");
        for (var j=0; j < hideFields.length; j++){
            if (!hideFields[j].classList.contains("hidden")) {
                hideFields[j].classList.add("hidden");
            }
        }
    };
}


/* Retrieve all projects for the typeaheads and store in the responses global variable */
function getAllProjects() {
    var url = projectsAPIUrl;
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            if (xmlHttp.status == 200){
                var response = JSON.parse(xmlHttp.responseText);
                responses[url] = response;
                updateLocalStorage(url, response);
                updateProjectTypeaheads();
            } else {
                // TODO: display error message
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
            if (xmlHttp.status == 200){
                var response = JSON.parse(xmlHttp.responseText);
                responses[url] = response;
                updateLocalStorage(url, response);
                updateOrganisationTypeaheads();
            } else {
                // TODO: display error message
            }
        } else {
            return false;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
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

document.addEventListener('DOMContentLoaded', function() {
    getAllOrganisations();
    getAllProjects();

    setAdvancedFieldsOnClick();
    setUnsavedChangesMessage();
    setDatepickers();
    setToggleSectionOnClick();
    setPublishOnClick();
    setSubmitOnClicks();
    setPartialOnClicks();
    setCurrencyOnChange();
    setPhotoUpload();
    setDeletePhoto();
    setImportResults();

    setValidationListeners();
    updateAllHelpIcons();

    try {
        localStorageResponses = JSON.parse(localStorageResponses);
    } catch (error) {
        localStorageResponses = {};
    }

    setAllSectionsCompletionPercentage();
    setAllSectionsChangeListerner();
    setPageCompletionPercentage();
});
