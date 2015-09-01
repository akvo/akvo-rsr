/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// DEFAULT VALUES
var defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);

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
var reportingOrgsAPIUrl = '/rest/v1/typeaheads/reporting_organisations?format=json';
var responses = {};
responses[projectsAPIUrl] = null;
responses[orgsAPIUrl] = null;
responses[reportingOrgsAPIUrl] = null;

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
var partialsCount = {};

// Measure the percentage of completion for each panel and display the results to the user
// Which elements count as inputs?
var INPUT_ELEMENTS = ['input', 'select', 'textarea'];

// Add a class selector here if you only want inputs with a certain class to count
// towards the completion percentage. If left blank, all inputs will count.
var MEASURE_CLASS = '.priority1';

function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function startSave(step) {
    var div, div_id, div_button_id, div_button;

    div_id = 'savingstep' + step;
    div = document.getElementById(div_id);

    div_button_id = 'savingstep' + step + '-button';
    div_button = document.getElementById(div_button_id);

    div_button.setAttribute('disabled', '');
    div.innerHTML = '<div class="help-block">Saving...</div>';
}

function finishSave(step, message) {
    var div, div_id, div_button_id, div_button, message_time;

    div_id = 'savingstep' + step;
    div = document.getElementById(div_id);

    div_button_id = 'savingstep' + step + '-button';
    div_button = document.getElementById(div_button_id);

    // Show error message 20 seconds, other messages only 5 seconds
    if (message.indexOf('class="help-block-error"') > -1) {
        message_time = 20000;
    } else {
        message_time = 5000;
    }

    // Only replace the message if no error is shown yet
    if (div.innerHTML.indexOf('class="help-block-error"') === -1) {
        div.innerHTML = message;

        setTimeout(function () {
            div.innerHTML = '';
            div_button.removeAttribute('disabled');
        }, message_time);
    }
}

function removeErrors(form) {
    var error_elements, form_elements;

    error_elements = form.getElementsByClassName('help-block-error');
    form_elements = form.getElementsByClassName('has-error');

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

function replaceNames(newObjects, excludeClass) {
    for (var i = 0; i < newObjects.length; i++) {
        var parentNode, newParentNodeId, otherParents, inputs, selects, textareas, excludedInputs, excludedSelects, excludedTextareas;

        parentNode = document.getElementById(newObjects[i].div_id);
        newParentNodeId = parentNode.getAttributeNode("id").value.replace(newObjects[i].old_id, newObjects[i].new_id);
        parentNode.setAttribute("id", newParentNodeId);

        otherParents = parentNode.querySelectorAll('.parent');

        try {
            var newUnicode, unicodeNode;

            newUnicode = newObjects[i].unicode;
            unicodeNode = parentNode.getElementsByClassName('unicode')[0];

            unicodeNode.innerHTML = newUnicode;
        } catch (error) {
            // No new unicode
        }

        if (excludeClass === undefined) {

            inputs = parentNode.querySelectorAll('input');
            selects = parentNode.querySelectorAll('select');
            textareas = parentNode.querySelectorAll('textarea');

            excludedInputs = [];
            excludedSelects = [];
            excludedTextareas = [];
        } else {
            inputs = parentNode.querySelectorAll('input:not(.' + excludeClass + ')');
            selects = parentNode.querySelectorAll('select:not(.' + excludeClass + ')');
            textareas = parentNode.querySelectorAll('textarea:not(.' + excludeClass + ')');

            excludedInputs = parentNode.querySelectorAll('input.' + excludeClass);
            excludedSelects = parentNode.querySelectorAll('select.' + excludeClass);
            excludedTextareas = parentNode.querySelectorAll('textarea.' + excludeClass);
        }

        for (var j=0; j < inputs.length; j++) {
            var newInputId = inputs[j].getAttributeNode("id").value.replace(newObjects[i].old_id, newObjects[i].new_id);
            inputs[j].setAttribute("id", newInputId);
            inputs[j].setAttribute("name", newInputId);
        }

        for (var k=0; k < selects.length; k++) {
            var newSelectId = selects[k].getAttributeNode("id").value.replace(newObjects[i].old_id, newObjects[i].new_id);
            selects[k].setAttribute("id", newSelectId);
            selects[k].setAttribute("name", newSelectId);
        }

        for (var l=0; l < textareas.length; l++) {
            var newTextareaId = textareas[l].getAttributeNode("id").value.replace(newObjects[i].old_id, newObjects[i].new_id);
            textareas[l].setAttribute("id", newTextareaId);
            textareas[l].setAttribute("name", newTextareaId);
        }

        for (var m=0; m < excludedInputs.length; m++) {
            if (!(excludedInputs[m].hasAttribute(excludeClass))) {
                var newExcludedInputId = excludedInputs[m].getAttributeNode("id").value + '-' + newObjects[i].new_id;
                excludedInputs[m].setAttribute("id", newExcludedInputId);
                excludedInputs[m].setAttribute("name", newExcludedInputId);
                excludedInputs[m].setAttribute(excludeClass, "");
            }
        }

        for (var n=0; n < excludedSelects.length; n++) {
            if (!(excludedSelects[n].hasAttribute(excludeClass))) {
                var newExcludedSelectId = excludedSelects[n].getAttributeNode("id").value + '-' + newObjects[i].new_id;
                excludedSelects[n].setAttribute("id", newExcludedSelectId);
                excludedSelects[n].setAttribute("name", newExcludedSelectId);
                excludedSelects[n].setAttribute(excludeClass, "");
            }
        }

        for (var o=0; o < excludedTextareas.length; o++) {
            if (!(excludedTextareas[o].hasAttribute(excludeClass))) {
                var newExcludedTextareaId = excludedTextareas[o].getAttributeNode("id").value + '-' + newObjects[i].new_id;
                excludedTextareas[o].setAttribute("id", newExcludedTextareaId);
                excludedTextareas[o].setAttribute("name", newExcludedTextareaId);
                excludedTextareas[o].setAttribute(excludeClass, "");
            }
        }

        for (var p=0; p < otherParents.length; p++) {
            if (!(otherParents[p].hasAttribute(excludeClass))) {
                var newOtherParentId = otherParents[p].getAttributeNode("id").value + '-' + newObjects[i].new_id;
                otherParents[p].setAttribute("id", newOtherParentId);
                otherParents[p].setAttribute(excludeClass, "");
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

function submitStep(step, level) {
    var api_url, form, form_data, form_div, request, file_request, message;

    // Collect form data
    form_div = '#admin-step-' + step;
    form = document.querySelector(form_div);
    form_data = serialize(form);

    if (level === undefined || level === 1) {
        // Indicate saving has started
        startSave(step);
        removeErrors(form);
    }

    // Custom code per step
    if (step === '1') {
        var related_projects = form.getElementsByClassName('related-project-input');

        for (var i=0; i < related_projects.length; i++) {
            var input, input_id, input_value;

            input = related_projects[i].getElementsByTagName('input')[0];
            input_id = input.getAttribute("id");
            if (input.value !== '') {
                input_value = input.getAttribute("value");
            } else {
                input_value = '';
            }

            form_data += '&value-' + input_id + '=' + input_value;
        }
    } else if (step === '3') {
        var reporting_org, reporting_org_value, partners;

        reporting_org = form.querySelector('#reportingOrganisation');

        if (reporting_org.value !== '') {
            reporting_org_value = reporting_org.getAttribute("value");
        } else {
            reporting_org_value = '';
        }

        form_data += '&value-reportingOrganisation=' + reporting_org_value;

        partners = form.getElementsByClassName('partner-input');

        for (var j=0; j < partners.length; j++) {
            var partner_input, partner_input_id, partner_input_value;

            partner_input = partners[j].getElementsByTagName('input')[0];
            partner_input_id = partner_input.getAttribute("id");
            if (partner_input.value !== '') {
                partner_input_value = partner_input.getAttribute("value");
            } else {
                partner_input_value = '';
            }

            form_data += '&value-' + partner_input_id + '=' + partner_input_value;
        }
    } else if (step === '5') {
        form_data += '&level=' + level;
    } else if (step === '6') {
        var receiverOrgs, providerOrgs;

        receiverOrgs = form.getElementsByClassName('transaction-receiver-org-input');
        providerOrgs = form.getElementsByClassName('transaction-provider-org-input');

        for (var o=0; o < receiverOrgs.length; o++) {
            var receiver_org_input, receiver_org_input_id, receiver_org_input_value;

            receiver_org_input = receiverOrgs[o].getElementsByTagName('input')[0];
            receiver_org_input_id = receiver_org_input.getAttribute("id");
            if (receiver_org_input.value !== '') {
                receiver_org_input_value = receiver_org_input.getAttribute("value");
            } else {
                receiver_org_input_value = '';
            }

            form_data += '&value-' + receiver_org_input_id + '=' + receiver_org_input_value;
        }

        for (var p=0; p < providerOrgs.length; p++) {
            var provider_org_input, provider_org_input_id, provider_org_input_value;

            provider_org_input = providerOrgs[p].getElementsByTagName('input')[0];
            provider_org_input_id = provider_org_input.getAttribute("id");
            if (provider_org_input.value !== '') {
                provider_org_input_value = provider_org_input.getAttribute("value");
            } else {
                provider_org_input_value = '';
            }

            form_data += '&value-' + provider_org_input_id + '=' + provider_org_input_value;
        }

        form_data += '&level=' + level;
    } else if (step === '7') {
        form_data += '&level=' + level;
    }

    // Boolean custom fields
    var booleanCustomFields = form.getElementsByClassName('boolean-custom-field');
    for (var q=0; q < booleanCustomFields.length; q++) {
        var custom_field, custom_field_id;

        custom_field = booleanCustomFields[q];
        custom_field_id = custom_field.getAttribute('id');

        if (custom_field.checked) {
            form_data = form_data.replace(custom_field_id + '=on', custom_field_id + '=True');
        } else {
            form_data += '&' + custom_field_id + '=False';
        }
    }

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/step_' + step + '/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var response;
            response = JSON.parse(request.responseText);

            // Add errors
            if (response.errors.length > 0) {
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Error while saving</div>';
            } else {
                message = '<div class="save-success"><span class="glyphicon glyphicon-ok-circle"></span> Saved successfully!</div>';
            }
            addErrors(response.errors);

            // Replace saved values
            for (var i=0; i < response.changes.length; i++) {
                var formElement;

                formElement = document.getElementById(response.changes[i][0]);
                formElement.setAttribute('saved-value', response.changes[i][1]);
            }

            if (step === '5' && level === 1) {
                replaceNames(response.rel_objects, 'indicator');
            } else if (step === '5' && level === 2) {
                replaceNames(response.rel_objects, 'indicator-period');
            } else if (step === '6' && level === 1) {
                replaceNames(response.rel_objects, 'sector');
                replaceTotalBudget(response.total_budget);
            } else if (step === '7' && level === 1) {
                replaceNames(response.rel_objects, 'administrative');
            }  else {
                replaceNames(response.rel_objects);
            }

            if (step === '5' && level < 3) {
                submitStep('5', level + 1);
            }

            if (step === '6' && level < 2) {
                submitStep('6', level + 1);
            }

            if (step === '7' && level < 2) {
                submitStep('7', level + 1);
            }

            if (step === '9') {
                saveDocuments(form, api_url, step, response.new_objects);
            }

            var section = findAncestor(form, 'formStep');
            setSectionCompletionPercentage($(section));
            setPageCompletionPercentage();

            finishSave(step, message);

            return false;
        } else {
            // We reached our target server, but it returned an error
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong while saving</div>';

            finishSave(step, message);
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

        finishSave(step, message);
        return false;
    };

    request.send(form_data);

    if (step === '1') {
        var formData = new FormData();
        formData.append("photo", document.getElementById("photo").files[0]);

        file_request = new XMLHttpRequest();
        file_request.open("POST", api_url);
        file_request.setRequestHeader("X-CSRFToken", csrftoken);

        file_request.onload = function() {
            if (file_request.status >= 200 && file_request.status < 400) {
                var response;

                removeErrors(form);
                response = JSON.parse(file_request.responseText);
                replacePhoto(response.new_image);
                addErrors(response.errors);

                if (response.errors.length > 0) {
                    message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Error while saving photo</div>';
                    finishSave(step, message);
                }
                return false;
            } else {
                // We reached our target server, but it returned an error
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong while saving</div>';

                if (file_request.status == 413) {
                    // Image is too big
                    addErrors([{"name": "photo", "error": "Photo is too big, please upload a photo that is smaller than 2 MB."}]);
                }

                finishSave(step, message);
                return false;
            }
        };

        file_request.onerror = function() {
            // There was a connection error of some sort
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

            finishSave(step, message);
            return false;
        };

        file_request.send(formData);
    }
}

function deleteItem(itemId, itemType, parentDiv) {
    var request;

    // Create request
    request = new XMLHttpRequest();
    request.open('DELETE', '/rest/v1/' + itemType + '/' + itemId + '/?format=json', true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            parentDiv.parentNode.removeChild(parentDiv);


            // Update the budget in case of removed budget
            if (itemType === 'budget_item') {
                getTotalBudget();
            }

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

            inputNode = document.getElementById('photo');
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

function confirmRemove(idArray, parentDiv) {
    return function(e) {
        e.preventDefault();

        var itemId, itemType;

        itemId = idArray[idArray.length - 1];
        idArray.pop();
        itemType = idArray.join();

        if (itemType === 'keyword') {
            itemType = 'project/' + defaultValues.project_id + '/remove_keyword';
        }

        deleteItem(itemId, itemType, parentDiv);
    };
}

function dismissRemove(nodeClass, nodeId, parentNode, sureNode) {
    return function(e) {
        e.preventDefault();

        var node, trashCan;

        parentNode.removeChild(sureNode);

        node = document.createElement('a');

        node.setAttribute('class', nodeClass);
        node.setAttribute('id', nodeId);
        node.onclick = setRemovePartial(node);

        trashCan = document.createElement('span');
        trashCan.setAttribute('class', 'glyphicon glyphicon-trash');

        node.appendChild(trashCan);
        parentNode.appendChild(node);
    };
}

function removePartial(node) {
    var parentDiv, idArray, parentParent;

    parentDiv = findAncestor(node, "parent");
    idArray = parentDiv.getAttributeNode("id").value.split("-");
    parentParent = parentDiv.parentNode;

    if (idArray[idArray.length - 2] === 'add') {
        // New object, not saved to the DB, so partial can be directly deleted
        parentDiv.parentNode.removeChild(parentDiv);
    } else {
        // Show warning first
        var nodeClass, nodeId, noNode, parentNode, sureNode, yesNode;

        nodeClass = node.getAttribute('class');
        nodeId = node.getAttribute('id');

        parentNode = node.parentNode;
        parentNode.removeChild(node);

        sureNode = document.createElement('div');
        sureNode.innerHTML = "Are you sure?";

        yesNode = document.createElement('a');
        yesNode.setAttribute('style', 'color: green; margin-left: 5px;');
        yesNode.onclick = confirmRemove(idArray, parentDiv);
        yesNode.innerHTML = 'Yes';

        noNode = document.createElement('a');
        noNode.setAttribute('style', 'color: red; margin-left: 5px;');
        noNode.onclick = dismissRemove(nodeClass, nodeId, parentNode, sureNode);
        noNode.innerHTML = 'No';

        sureNode.appendChild(yesNode);
        sureNode.appendChild(noNode);
        parentNode.appendChild(sureNode);
    }

    // Update the progress bars to account for the removed inputs
    setSectionCompletionPercentage($(findAncestor(parentParent, "formStep")));
}

function buildReactComponents(typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption) {
    var Typeahead, TypeaheadLabel, TypeaheadContainer, selectorTypeahead, selectorClass, inputClass, typeaheadInput;

    Typeahead = ReactTypeahead.Typeahead;   

    inputClass = selector + " form-control " + childClass;

    selectorClass = $('.' + selector);

    TypeaheadContainer = React.createClass({
        render: function() {
            return (
                    <div>
                        <Typeahead
                            placeholder=''
                            options={typeaheadOptions}
                            onOptionSelected={typeaheadCallback}
                            maxVisible={10}
                            displayOption={displayOption}
                            filterOption={filterOption}
                            childID={selector}
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
                    </div>
            );
        }
    });

    React.render(
        <TypeaheadContainer />,
        document.querySelector('.' + selector)
    );

    typeaheadInput = $('.' + selector + ' .typeahead' + ' input');
    if (valueId !== null) {
        for (var i = 0; i < typeaheadOptions.length; i++) {
            if (parseInt(typeaheadOptions[i].id, 10) == parseInt(valueId, 10)) {
                var savedResult;

                savedResult = typeaheadOptions[i];

                typeaheadInput.attr('value', savedResult.id);
                typeaheadInput.prop('value', savedResult[filterOption]);

                typeaheadInput.attr('saved-value', savedResult.id);
            }
        }
    } else {
        typeaheadInput.attr('saved-value', '');
    }

    selectorTypeahead = selectorClass.find('.typeahead');
    selectorTypeahead.append(label);
    selectorTypeahead.append(help);
    selectorClass.addClass('has-typeahead');

    // Set mandatory markers before help icons
    selectorClass.find('.mandatory').remove();

    selectorClass.find('.priority1 ~ label').each(function() {
        var markContainer = '<span class="mandatory">*</span>';

        $(markContainer).appendTo($(this));
    });

    updateHelpIcons('.' + selector);

    setAllSectionsCompletionPercentage();
    setAllSectionsChangeListerner();
    setPageCompletionPercentage();
}



function loadAsync(url, retryCount, retryLimit, callback) {
    var xmlHttp;

    // If we already have the response cached, don't fetch it again
    if (responses[url] !== null) {
        callback(responses[url]);
        return;
    }

    // If the response is in localStorage, don't fetch it again
    if (localStorageResponses !== null && localStorageResponses !== '') {
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

        localStorage.setItem(localStorageName, lsData);
    }
}

function processResponse(response, selector, childClass, valueId, label, help, filterOption) {
    var typeaheadOptions = response.results;
    var typeaheadCallback = function(option) {
        var el;

        el = $("input." + this.childID);
        el.attr('value', option.id);
    };
    var displayOption = function(option, index) {
        return option[filterOption];
    };

    buildReactComponents(typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption);
}

function getCallback(selector, childClass, valueId, label, help, filterOption) {
    var output = function(response) {
        processResponse(response, selector, childClass, valueId, label, help, filterOption);
    };

    return output;
}

function setSubmitOnClicks() {
    var forms;

    forms = document.getElementsByTagName('form');

    for (var i=0; i < forms.length; i++) {
        var stepId;

        stepId = forms[i].getAttribute('id').replace('admin-step-', '');
        forms[i].onsubmit = getFormSubmit(stepId);
    }
}

function getFormSubmit(stepId) {
    return function(e) {
        e.preventDefault();
        if (stepId === '5' || '6' || '7') {
            submitStep(stepId, 1);
        } else {
            submitStep(stepId);
        }
    };
}

function setPartialOnClicks() {
    for (var i=0; i < partials.length; i++) {
        var pName = partials[i];
        var buttonSelector = '.add-' + pName;

        $(buttonSelector).each(function() {
            var callback;

            if ($(this).hasClass('has-onclick')) {
                // already set the onclick, do nothing
                return;
            }

            $(this).addClass('has-onclick');
            callback = getOnClick(pName, $(this).parent().parent().parent()[0]);
            $(this).click(function(e) {
                callback(e);
            });
        });
    }

    var removeLinks;

    removeLinks = document.getElementsByClassName('delete-object-button');

    for (var j=0; j < removeLinks.length; j++) {
        var removeLink;

        removeLink = removeLinks[j];
        removeLink.onclick = setRemovePartial(removeLink);
    }

    var hidePartials;

    hidePartials = document.getElementsByClassName('hide-partial-click');

    for (var k=0; k < hidePartials.length; k++) {
        hidePartials[k].onclick = togglePartial(hidePartials[k]);
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

function getOnClick(pName, parentElement) {
    var onclick = function(e) {
        e.preventDefault();

        var markupSelector = '#' + pName + '-input';
        var containerSelector = pName + '-container';
        var container = parentElement.querySelector('#' + containerSelector);

        var markup = document.querySelector(markupSelector).innerHTML;

        var partial = document.createElement('div');
        partial.innerHTML = markup;

        $(partial).find('div.parent').each( function() {
            var oldID = $(this).attr('id');
            var newID = oldID + '-add-' + partialsCount[pName];

            $(this).attr('id', newID);
        });

        $(partial).find('input').each( function() {
            addCountToName($(this));
        });

        $(partial).find('select').each( function() {
            addCountToName($(this));
        });

        $(partial).find('textarea').each( function() {
            addCountToName($(this));
        });

        $(partial).find('.datepicker-container').each( function() {
            addCountToDate($(this));
        });

        $(partial).find('.typeahead-container').each( function() {
            addCountToClass($(this));
        });

        function addCountToName(el) {
            var oldName = el.attr('name');
            var newName = oldName + '-add-' + partialsCount[pName];

            el.attr('name', newName);

            var oldID = el.attr('id');
            var newID = oldID + '-add-' + partialsCount[pName];

            el.attr('id', newID);
        }

        function addCountToDate(el) {
            var oldID = el.attr('data-id');
            var newID = oldID + '-add-' + partialsCount[pName];

            el.attr('data-id', newID);
        }

        // The typeahead containers need to have the unique identifying appended
        // to the class rather than the id, so handle that separately
        function addCountToClass(el) {
            var oldClass = el.data('count-class');
            var newClass = oldClass + '-add-' + partialsCount[pName];

            el.removeClass(oldClass);
            el.addClass(newClass);

            el.data('child-id', newClass);
        }

        container.appendChild(partial);
        partialsCount[pName] += 1;

        // Add any datepickers and typeaheads, help icons and change listeners for the new project partial
        setDatepickers();
        updateTypeaheads();
        updateHelpIcons('.' + containerSelector);
        setSectionChangeListener($(findAncestor(container, 'formStep')));
        setSectionCompletionPercentage($(findAncestor(container, 'formStep')));
        setValidationListeners();

        // Set onClicks for partials again in case this partial contains other partials
        setPartialOnClicks();
    };

    return onclick;
}

function updateTypeaheads() {
    $('.related-project-input').each( function() {

        // Check if we've already rendered this typeahead
        if ($(this).hasClass('has-typeahead')) {
            return;
        }

        // The name of the property holding the text value we want to display in the typeahead
        var filterOption = 'title';

        // The id we'll give the input once it's been rendered
        var childSelector = $(this).data('child-id');
        var childClass = $(this).data('child-class');
        var valueId = null;
        var labelText = defaultValues.related_project_label;
        var helpText = defaultValues.related_project_helptext;
        var label = '<label for="' + childSelector + '" class="control-label typeahead-label">' +
                    labelText + '</label>';
        var help = '<p class="help-block hidden">' + helpText + '</p>';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(projectsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, filterOption));
    });

    $('.reportingOrganisation-input').each( function() {

        // Check if we've already rendered this typeahead
        if ($(this).hasClass('has-typeahead')) {
            return;
        }

        // The name of the property holding the text value we want to display in the typeahead
        var filterOption = 'name';

        // The id we'll give the input once it's been rendered
        var childSelector = $(this).data('child-id');
        var childClass = $(this).data('child-class');
        var valueId = null;
        var labelText = defaultValues.reporting_org_label;
        var helpText = defaultValues.reporting_org_helptext;
        var label = '<label for="' + childSelector + '" class="control-label typeahead-label">' +
                    labelText + '</label>';
        var help = '<p class="help-block hidden">' + helpText + '</p>';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(reportingOrgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, filterOption));
    });

    $('.partner-input').each( function() {

        // Check if we've already rendered this typeahead
        if ($(this).hasClass('has-typeahead')) {
            return;
        }

        // The name of the property holding the text value we want to display in the typeahead
        var filterOption = 'name';

        // The id we'll give the input once it's been rendered
        var childSelector = $(this).data('child-id');
        var childClass = $(this).data('child-class');
        var valueId = null;
        var labelText = defaultValues.partner_label;
        var helpText = defaultValues.partner_helptext;
        var label = '<label for="' + childSelector + '" class="control-label typeahead-label">' +
                    labelText + '</label>';
        var help = '<p class="help-block hidden">' + helpText + '</p>';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(orgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, filterOption));
    });

    $('.transaction-provider-org-input').each( function() {

        // Check if we've already rendered this typeahead
        if ($(this).hasClass('has-typeahead')) {
            return;
        }

        // The name of the property holding the text value we want to display in the typeahead
        var filterOption = 'name';

        // The id we'll give the input once it's been rendered
        var childSelector = $(this).data('child-id');
        var childClass = $(this).data('child-class');
        var valueId = null;
        var labelText = defaultValues.provider_org_label;
        var helpText = defaultValues.provider_org_helptext;
        var label = '<label for="' + childSelector + '" class="control-label typeahead-label">' +
                    labelText + '</label>';
        var help = '<p class="help-block hidden">' + helpText + '</p>';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(orgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, filterOption));
    });

    $('.transaction-receiver-org-input').each( function() {

        // Check if we've already rendered this typeahead
        if ($(this).hasClass('has-typeahead')) {
            return;
        }

        // The name of the property holding the text value we want to display in the typeahead
        var filterOption = 'name';

        // The id we'll give the input once it's been rendered
        var childSelector = $(this).data('child-id');
        var childClass = $(this).data('child-class');
        var valueId = null;
        var labelText = defaultValues.recipient_org_label;
        var helpText = defaultValues.recipient_org_helptext;
        var label = '<label for="' + childSelector + '" class="control-label typeahead-label">' +
                    labelText + '</label>';
        var help = '<p class="help-block hidden">' + helpText + '</p>';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(orgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, filterOption));
    });
}

function updateHelpIcons(container) {
    // Add an "info" glyphicon to each label
    // Clicking the glyphicon shows the help text
    $(container + ' label.control-label').each( function() {
        var output, helpBlockIsLabelSibling, iconClasses, helpBlockFromLabel;

        if ($(this).hasClass('has-icon')) {

            // We've already processed this label. Do nothing.
            return;
        }

        // Assume that the help block is a sibling of the label element
        helpBlockIsLabelSibling = true;

        if ($(this).parent().find('.help-block').length === 0) {
            if ($(this).parent().parent().find('.help-block').length === 1) {
                helpBlockIsLabelSibling = false;
            } else {

                // There is no help block for this label
                return;
            }
        }

        if (helpBlockIsLabelSibling) {
            helpBlockFromLabel = $(this).parent().find('.help-block');
        } else {
            helpBlockFromLabel = $(this).parent().parent().find('.help-block');
        }

        iconClasses = 'glyphicon glyphicon-info-sign info-icon';

        if (helpBlockFromLabel.is(':visible')) {
            iconClasses += ' activated';
        }

        output = '<span class="' + iconClasses + '"></span>';

        $(this).append(output);

        $(this).find('.info-icon').on('click', '', function(e) {
            var helpBlock;

            e.preventDefault();
            
            if (helpBlockIsLabelSibling) {
                helpBlock = $(this).parent().parent().find('.help-block');
            } else {
                helpBlock = $(this).parent().parent().parent().find('.help-block');
            }

            if ($(this).hasClass('activated')) {
                helpBlock.fadeOut(400, function() {
                    helpBlock.addClass('hidden');
                });
                $(this).removeClass('activated');
            } else {
                helpBlock.hide();
                helpBlock.removeClass('hidden');
                helpBlock.fadeIn();
                $(this).addClass('activated');
            }
        });

        // Mark the label as processed to avoid adding extra help icons to it later

        $(this).addClass('has-icon');
    });
}

function updateAllHelpIcons() {
    var pageContainer;

    pageContainer = '.projectEdit';
    updateHelpIcons(pageContainer);
}

function setSectionCompletionPercentage(section) {
    var inputResults = getInputResults(section);
    var numInputs = inputResults[0];
    var numInputsCompleted = inputResults[1];

    if (numInputs === 0) {
        if (section.hasClass('stepEight')) {
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

    inputResults = getInputResults($('.projectEdit'));
    numInputs = inputResults[0];
    numInputsCompleted = inputResults[1];

    completionPercentage = renderCompletionPercentage(numInputsCompleted, numInputs, $('.formOverviewInfo'));

    // Enable publishing when all is filled in
    if (completionPercentage === 100) {
        try {
            publishButton = document.getElementById('publishProject');
            publishButton.removeAttribute('disabled');
            publishButton.className = publishButton.className.replace('btn-danger', 'btn-success');
        } catch (error) {
            // Do nothing, no publish button
        }
    } else {
        try {
            publishButton = document.getElementById('publishProject');
            publishButton.setAttribute('disabled', '');
            publishButton.className = publishButton.className.replace('btn-success', 'btn-danger');
        } catch (error) {
            // Do nothing, no publish button
        }
    }
}

function getInputResults(section) {
    var numInputs = 0;
    var numInputsCompleted = 0;

    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var selector;

        selector = INPUT_ELEMENTS[i] + MEASURE_CLASS;

        section.find(selector).each( function() {

            if ($(this).attr('name') === 'step') {
                // This is a progress bar input, ignore it
                return true;
            }

            if (this.hasAttribute("disabled")) {
                // This is a disabled input, ignore it
                return true;
            }

            numInputs += 1;

            if ($(this).attr('name') == 'projectStatus' && $(this).val() === 'N') {
                // Ignore project status 'None'
                return true;
            } else if ($(this).val() !== '') {
                numInputsCompleted += 1;
            } else if ($(this).attr('name') === 'photo' && $(this).attr('default') !== '') {
                // Custom code for project photo
                numInputsCompleted += 1;
            }
        });
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
    section.find('.progress-bar').attr('aria-valuenow', completionPercentage);
    section.find('.progress .sr-only').text(completionPercentage + '% Complete');
    section.find('.progress .progress-percentage').text(completionPercentage + '%');
    section.find('div.progress-bar').width(completionPercentage + '%');

    if (completionPercentage < 10) {
        completionClass = 'empty';
    } else if (completionPercentage < 100) {
        completionClass = 'incomplete';
    } else if (completionPercentage === 100) {
        completionClass = 'complete';
    }

    section.find('div.progress-bar').attr('data-completion', completionClass);

    return completionPercentage;
}

function setSectionChangeListener(section) {
    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var selector;

        selector = INPUT_ELEMENTS[i] + MEASURE_CLASS;

        section.find(selector).each( function() {
            var listener;

            if ($(this).hasClass('has-listener')) {
                // We have already added a class for this listener
                // do nothing

                return;
            }

            listener = getChangeListener(section, $(this));

            $(this).on('change', listener);
        });
    }
}

function getChangeListener(section, el) {
    var listener;

    listener = function() {
        var currentSection;
        currentSection = section;

        setSectionCompletionPercentage(currentSection);
        el.addClass('has-listener');
        setPageCompletionPercentage();
    };
    return listener;
}

function setAllSectionsCompletionPercentage() {
    $('.formStep').each( function() {
        setSectionCompletionPercentage($(this));
    });
}

function setAllSectionsChangeListerner() {
    $('.formStep').each( function() {
        setSectionChangeListener($(this));
    });
}

// Validate all inputs with the given class
// Display validation status to the user in real time
function setValidationListeners() {
    $('input').each( function() {
        var listener;

        if ($(this).hasClass('validation-listener')) {

            // We've already set the listener for this element, do nothing
            return;
        }

        // Max character counts for text inputs
        if ($(this).attr('type') === 'text' && $(this).attr('maxlength')) {
            listener = getLengthListener($(this));
            $(this).on('input', function() {
                listener();
            });
            $(this).on('focusout', function() {
                $(this).parent().find('.charsLeft').hide();
            });
        }
    });

    $('textarea').each( function() {
        var listener;

        if ($(this).hasClass('validation-listener')) {

            // We've already set the listener for this element, do nothing
            return;
        }

        // Max character counts for text inputs
        if ($(this).attr('maxlength')) {
            listener = getLengthListener($(this));
            $(this).on('input', function() {
                listener();
            });
            $(this).on('focusout', function() {
                $(this).parent().find('.charsLeft').hide();
            });
        }
    });

    function getLengthListener(el) {
        var output = function() {
            var maxLength, currentLength, charsLeft, charMessage;

            maxLength = parseInt(el.attr('maxlength'), 10);
            currentLength = el.val().length;
            charsLeft = maxLength - currentLength;
            charMessage = '';

            if (el.parent().find('.charsLeft').length === 0) {
                el.parent().append('<span class="charsLeft"></span>');
            }

            if (charsLeft === 1) {
                charMessage = ' character remaining';
            } else {
                charMessage = ' characters remaining';
            }

            el.parent().find('.charsLeft').show().text(charsLeft + charMessage);
        };

        return output;
    }

    // Mark mandatory fields with an asterisk
    function markMandatoryFields() {

        // Clear any existing markers
        $('.mandatory').remove();

        $('.priority1 ~ label').each(function() {
            var markContainer = '<span class="mandatory">*</span>';

            $(markContainer).appendTo($(this));
        });
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

        removePartial(node);
    };
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

        var api_url, request, publishErrorNode, span, unsavedMessage, unsavedSections;

        // Remove any previous errors
        publishErrorNode = document.getElementById('publishErrors');
        publishErrorNode.innerHTML = '';

        // Check for unsaved changes first
        unsavedSections = checkUnsavedChanges();
        if (unsavedSections.length > 0) {
            unsavedMessage = "You can't publish, because there are unsaved changes in the following section(s):<ul>";

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

        // Create request
        api_url = '/rest/v1/publishing_status/' + publishingStatusId + '/?format=json';

        request = new XMLHttpRequest();
        request.open('PATCH', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Succesfully published project!
                var publishingStatusNode, viewProjectButton;

                publishButton.parentNode.removeChild(publishButton);

                publishingStatusNode = document.getElementById('publishingStatus');
                publishingStatusNode.className = "published";
                publishingStatusNode.innerHTML = "published";

                viewProjectButton = document.getElementById('viewProject');
                viewProjectButton.innerHTML = defaultValues.view_project;

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
                        publishErrorNode.innerHTML = 'Could not publish project';
                    }
                }

                return false;
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            publishButton.removeAttribute('disabled');
            return false;
        };

        request.send('{"status": "published"}');

    };
}

function setDatepickers() {
    var datepickerContainers;

    datepickerContainers = document.getElementsByClassName('datepicker-container');

    for (var i=0; i < datepickerContainers.length; i++) {
        var datepickerId, DatePickerComponent, datepickerContainer, extraAttributes, helptext, initialDate, inputNode, inputValue, label;

        datepickerContainer = datepickerContainers[i];

        // Check if datepicker already has been set
        if (datepickerContainer.className.indexOf('has-datepicker') == -1) {
            datepickerId = datepickerContainer.getAttribute('data-id');

            // Set initial value of datepicker
            inputValue = datepickerContainer.getAttribute('data-child');
            if (inputValue !== "") {
                initialDate = moment(inputValue, "DD-MM-YYYY");
            } else {
                initialDate = null;
            }

            DatePickerComponent = React.createClass({
                displayName: datepickerId,

                getInitialState: function () {
                    return {
                        initialDate: initialDate
                    };
                },

                handleDateChange: function (date) {
                    this.setState({
                        initialDate: date
                    });
                },

                render: function () {
                    return <div>
                        <DatePicker
                        locale = 'en'
                        placeholderText = ''
                        dateFormat = 'DD/MM/YYYY'
                        selected = {this.state.initialDate}
                        onChange = {this.handleDateChange}
                        />
                    </div>;
                }
            });

            React.render(<DatePickerComponent key={datepickerId} />, datepickerContainer);

            // Set id, name and saved value of datepicker input
            inputNode = datepickerContainer.getElementsByClassName('datepicker__input')[0];
            inputNode.setAttribute("id", datepickerId);
            inputNode.setAttribute("name", datepickerId);
            inputNode.setAttribute("saved-value", inputValue);

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

function checkUnsavedChangesForm(form) {
    var inputs, selects, textareas;

    inputs = form.getElementsByTagName('input');
    selects = form.getElementsByTagName('select');
    textareas = form.getElementsByTagName('textarea');

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == 'file') {
            // Ignore file inputs for now.
        } else if (inputs[i].type == 'checkbox') {
            if (inputs[i].checked && (inputs[i].getAttribute('saved-value') == 'False')) {
                return true;
            } else if (!inputs[i].checked && (inputs[i].getAttribute('saved-value') == 'True')) {
                return true;
            }
        } else if (inputs[i].parentNode.className.indexOf('typeahead') > -1) {
            if (inputs[i].getAttribute('value') != inputs[i].getAttribute('saved-value')) {
                return true;
            }
        } else if (inputs[i].value != inputs[i].getAttribute('saved-value')) {
            return true;
        }
    }

    for (var j=0; j < selects.length; j++) {
        if (selects[j].value != selects[j].getAttribute('saved-value')) {
            return true;
        }
    }

    for (var k = 0; k < textareas.length; k++) {
        if (textareas[k].value != textareas[k].getAttribute('saved-value')) {
            return true;
        }
    }

    return false;
}

function checkUnsavedChanges() {
    var forms, unsavedForms;

    unsavedForms = [];
    forms = [
        ['1', '01 - General information'],
        ['2', '02 - Contact information'],
        ['3', '03 - Project partners'],
        ['4', '04 - Project descriptions'],
        ['5', '05 - Results and indicators'],
        ['6', '06 - Finance'],
        ['7', '07 - Project locations'],
        ['8', '08 - Project focus'],
        ['9', '09 - Links and documents'],
        ['10', '10 - Project comments']
    ];

    for (var i=0; i < forms.length; i++) {
        if (checkUnsavedChangesForm(document.getElementById('admin-step-' + forms[i][0]))) {
            unsavedForms.push(forms[i][1]);
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


$(document).ready(function() {
    setUnsavedChangesMessage();
    setDatepickers();
    setToggleSectionOnClick();
    setPublishOnClick();
    setSubmitOnClicks();
    setPartialOnClicks();
    setCurrencyOnChange();
    setDeletePhoto();

    setValidationListeners();
    updateAllHelpIcons();

    updateTypeaheads();

    try {
        localStorageResponses = JSON.parse(localStorageResponses);
    } catch (error) {
        localStorageResponses = {};
    }

    // Keep count of how many of each partial we've injected
    for (var i=0; i < partials.length; i++) {
        var partialName = partials[i];

        partialsCount[partialName] = 1;
    }

    setAllSectionsCompletionPercentage();
    setAllSectionsChangeListerner();
    setPageCompletionPercentage();
});