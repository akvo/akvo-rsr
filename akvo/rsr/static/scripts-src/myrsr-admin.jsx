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
    'location-administrative', 'project-location'];
var partialsCount = {};

// Measure the percentage of completion for each panel and display the results to the user
// Which elements count as inputs?
var INPUT_ELEMENTS = ['input', 'select', 'textarea'];

// Add a class selector here if you only want inputs with a certain class to count
// towards the completion percentage. If left blank, all inputs will count.
var MEASURE_CLASS = '.priority1';


function savingStep(saving, step, message) {
    var div, div_id, div_button_id, div_button;

    div_id = '#savingstep' + step;
    div = document.querySelector(div_id);

    div_button_id = '#savingstep' + step + '-button';
    div_button = document.querySelector(div_button_id);

    if (saving) {
        div_button.setAttribute('disabled', '');
        div.innerHTML = '<div class="help-block">Saving...</div>';
    } else {
        if (message !== undefined) {
            div.innerHTML = message;
            setTimeout(function () {
                div.innerHTML = '';
                div_button.removeAttribute('disabled');
            }, 5000);
        } else {
            div.innerHTML = '';
            div_button.removeAttribute('disabled');
        }
    }
}

function removeErrors(form) {
    var error_elements, form_elements;

    error_elements = form.getElementsByClassName('help-block-error');
    form_elements = form.getElementsByClassName('has-error');

    while(error_elements.length > 0){
        error_elements[0].parentNode.removeChild(error_elements[0]);
    }

    for (var j = 0; j < form_elements.length; j++) {
        form_elements[j].className =
                form_elements[j].className.replace( /(?:^|\s)has-error(?!\S)/g , '' );
    }
}

function addErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
        try {
            var error, form_group, labels, span, textnode;

            error = errors[i];
            form_group = document.querySelector('#' + error.name).parentNode;
            form_group.className += ' has-error';

            labels = form_group.getElementsByTagName('label');
            span = document.createElement("span");
            textnode = document.createTextNode(error.error);
            span.appendChild(textnode);
            span.className = "help-block-error";
            labels[0].parentNode.insertBefore(span, labels[0].nextSibling);

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
        add_html = '<img src="' + photo + '" class="current-project-photo" id="img-photo"><a onclick="deletePhoto(this);" class="btn btn-link delete-photo-button" id="delete-photo"><span class="glyphicon glyphicon-remove"></span> Delete photo</a>';

        photo_container.innerHTML = add_html + photo_container.innerHTML;
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

            removeErrors(form);
            response = JSON.parse(file_request.responseText);
            addErrors(response.errors);

            if (response.errors.length > 0) {
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Error while saving document</div>';
                savingStep(false, step, message);
            }

            return false;
        } else {
            // We reached our target server, but it returned an error
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong with your request</div>';

            savingStep(false, step, message);
            return false;
        }
    };

    file_request.onerror = function() {
        // There was a connection error of some sort
        var message;

        message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

        savingStep(false, step, message);
        return false;
    };

    file_request.send(documentFormData);
}

function submitStep(step, level) {
    savingStep(true, step);

    var api_url, form, form_data, form_div, request, file_request, message;

    // Collect form data
    form_div = '#admin-step-' + step;
    form = document.querySelector(form_div);
    form_data = serialize(form);

    // Custom code per step
    if (step === '1') {
        form_data += '&eventFromPlanned=' + document.querySelector('#eventFromPlanned').value;
        form_data += '&eventFromActual=' + document.querySelector('#eventFromActual').value;
        form_data += '&eventEndPlanned=' + document.querySelector('#eventEndPlanned').value;
        form_data += '&eventEndActual=' + document.querySelector('#eventEndActual').value;

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
        if (level === 3) {
            var indicatorPeriods;

            indicatorPeriods = document.querySelectorAll('.indicator-period-item');

            for (var n = 0; n < indicatorPeriods.length; n++) {
                var periodId;

                periodId = indicatorPeriods[n].getAttribute('id').replace('indicator_period-', '');

                form_data += '&indicator-period-start-' + periodId + '=' + document.querySelector('#indicator-period-start-' + periodId).value;
                form_data += '&indicator-period-end-' + periodId + '=' + document.querySelector('#indicator-period-end-' + periodId).value;
            }
        }

        form_data += '&level=' + level;
    } else if (step === '6') {
        var budgetItems, transactions, plannedDisbursements, receiverOrgs, providerOrgs;

        budgetItems = document.querySelectorAll('.budget-item');
        transactions = document.querySelectorAll('.transaction-item');
        plannedDisbursements = document.querySelectorAll('.planned-disbursement-item');

        for (var k=0; k < budgetItems.length; k++) {
            var budgetItemNodeId, budgetItemId;

            budgetItemNodeId = budgetItems[k].getAttribute('id');
            budgetItemId = budgetItemNodeId.replace('budget_item-', '');

            form_data += '&budget-item-value-date-' + budgetItemId + '=' + document.querySelector('#budget-item-value-date-' + budgetItemId).value;
            form_data += '&budget-item-period-start-' + budgetItemId + '=' + document.querySelector('#budget-item-period-start-' + budgetItemId).value;
            form_data += '&budget-item-period-end-' + budgetItemId + '=' + document.querySelector('#budget-item-period-end-' + budgetItemId).value;
        }

        for (var l=0; l < transactions.length; l++) {
            var transactionNodeId, transactionId;

            transactionNodeId = transactions[l].getAttribute('id');
            transactionId = transactionNodeId.replace('transaction-', '');

            form_data += '&transaction-date-' + transactionId + '=' + document.querySelector('#transaction-date-' + transactionId).value;
            form_data += '&transaction-value-date-' + transactionId + '=' + document.querySelector('#transaction-value-date-' + transactionId).value;
        }

        for (var m=0; m < plannedDisbursements.length; m++) {
            var plannedDisbursementNodeId, plannedDisbursementId;

            plannedDisbursementNodeId = plannedDisbursements[m].getAttribute('id');
            plannedDisbursementId = plannedDisbursementNodeId.replace('planned_disbursement-', '');

            form_data += '&planned-disbursement-period-start-' + plannedDisbursementId + '=' + document.querySelector('#planned-disbursement-period-start-' + plannedDisbursementId).value;
            form_data += '&planned-disbursement-period-end-' + plannedDisbursementId + '=' + document.querySelector('#planned-disbursement-period-end-' + plannedDisbursementId).value;
            form_data += '&planned-disbursement-value-date-' + plannedDisbursementId + '=' + document.querySelector('#planned-disbursement-value-date-' + plannedDisbursementId).value;
        }

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

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/admin_step_' + step + '/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var response;

            removeErrors(form);
            response = JSON.parse(request.responseText);
            if (step === '5' && level === 1) {
                replaceNames(response.new_objects, 'indicator');
            } else if (step === '5' && level === 2) {
                replaceNames(response.new_objects, 'indicator-period');
            } else if (step === '6' && level === 1) {
                replaceNames(response.new_objects, 'sector');
                replaceTotalBudget(response.total_budget);
            } else if (step === '7' && level === 1) {
                replaceNames(response.new_objects, 'administrative');
            }  else {
                replaceNames(response.new_objects);
            }
            addErrors(response.errors);

            if (step === '5' && level < 3) {
                submitStep('5', level + 1);
                return false;
            }

            if (step === '6' && level < 2) {
                submitStep('6', level + 1);
                return false;
            }

            if (step === '7' && level < 2) {
                submitStep('7', level + 1);
                return false;
            }

            if (step === '9') {
                saveDocuments(form, api_url, step, response.new_objects);
            }

            if (response.errors.length > 0) {
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Error while saving</div>';
            } else {
                message = '<div class="save-success"><span class="glyphicon glyphicon-ok-circle"></span> Saved successfully!</div>';
            }

            savingStep(false, step, message);
            return false;
        } else {
            // We reached our target server, but it returned an error
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong while saving</div>';

            savingStep(false, step, message);
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

        savingStep(false, step);
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
                    savingStep(false, step, message);
                }
                return false;
            } else {
                // We reached our target server, but it returned an error
                message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Something went wrong while saving</div>';

                savingStep(false, step, message);
                return false;
            }
        };

        file_request.onerror = function() {
            // There was a connection error of some sort
            message = '<div class="help-block-error"><span class="glyphicon glyphicon-remove-circle"></span> Connection error, check your internet connection</div>';

            savingStep(false, step);
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

function deletePhoto() {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/admin_delete_photo/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var imgNode, aNode, inputNode;

            imgNode = document.querySelector('#img-photo');
            imgNode.parentNode.removeChild(imgNode);

            aNode = document.querySelector('#delete-photo');
            aNode.parentNode.removeChild(aNode);

            inputNode = document.querySelector('#photo');
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
    api_url = '/rest/v1/project/' + defaultValues.project_id + '/admin_delete_document/' + document_id + '/?format=json';

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

function removePartial(node) {
    var parentDiv, idArray, parentParent;

    parentDiv = node.closest(".parent");
    idArray = parentDiv.getAttributeNode("id").value.split("-");
    parentParent = parentDiv.parentNode;

    if (idArray[idArray.length - 2] === 'add') {
        parentDiv.parentNode.removeChild(parentDiv);
    } else {
        var itemId, itemType;

        itemId = idArray[idArray.length - 1];
        idArray.pop();
        itemType = idArray.join();

        deleteItem(itemId, itemType, parentDiv);
    }

    // Update the progress bars to account for the removed inputs
    setSectionCompletionPercentage($(parentParent.closest('.formStep')));
}

function buildReactComponents(placeholder, typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption) {
    var Typeahead, TypeaheadLabel, TypeaheadContainer, selectorTypeahead, selectorClass, inputClass;

    Typeahead = ReactTypeahead.Typeahead;   

    inputClass = selector + " form-control " + childClass;

    selectorClass = $('.' + selector);

    TypeaheadContainer = React.createClass({
        render: function() {
            return (
                    <div>
                        <Typeahead
                            placeholder={placeholder}
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

    if (valueId !== null) {
        for (var i = 0; i < typeaheadOptions.length; i++) {
            if (parseInt(typeaheadOptions[i].id, 10) == parseInt(valueId, 10)) {
                var savedResult, typeaheadInput;

                savedResult = typeaheadOptions[i];
                typeaheadInput = $('.' + selector + ' .typeahead' + ' input');

                typeaheadInput.attr('value', savedResult.id);
                typeaheadInput.prop('value', savedResult[filterOption]);
            }
        }
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

function processResponse(response, selector, childClass, valueId, label, help, placeholder, filterOption) {
    var typeaheadOptions = response.results;
    var typeaheadCallback = function(option) {
        var el;

        el = $("input." + this.childID);
        el.attr('value', option.id);
    };
    var displayOption = function(option, index) {
        return option[filterOption];
    };

    buildReactComponents(placeholder, typeaheadOptions, typeaheadCallback, displayOption, selector, childClass, valueId, label, help, filterOption);
}

function getCallback(selector, childClass, valueId, label, help, placeholder, filterOption) {
    var output = function(response) {
        processResponse(response, selector, childClass, valueId, label, help, placeholder, filterOption);
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
            callback = getOnClick(pName, $(this));
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

function getOnClick(pName, element) {
    var onclick = function(e) {
        e.preventDefault();

        var markupSelector = '#' + pName + '-input';
        var containerSelector = '.' + pName + '-container';
        var container = element.closest(':has(' + containerSelector + ')').find(containerSelector);

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

        // The typeahead containers need to have the unique identifying appended
        // to the class rather than the id, so handle that separately
        function addCountToClass(el) {
            var oldClass = el.data('count-class');
            var newClass = oldClass + '-add-' + partialsCount[pName];

            el.removeClass(oldClass);
            el.addClass(newClass);

            el.data('child-id', newClass);
        }

        container.append(partial);
        partialsCount[pName] += 1;

        // Add any typeaheads, help icons and change listeners for the new project partial
        updateTypeaheads();
        updateHelpIcons(containerSelector);
        setSectionChangeListener($(containerSelector).closest('.formStep'));
        setSectionCompletionPercentage($(containerSelector).closest('.formStep'));
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
        var placeholder = defaultValues.related_project_label + ':';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(projectsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, placeholder, filterOption));
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
        var placeholder = defaultValues.reporting_org_helptext + ':';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(reportingOrgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, placeholder, filterOption));
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
        var placeholder = defaultValues.partner_label + ':';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(orgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, placeholder, filterOption));
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
        var placeholder = defaultValues.provider_org_label + ':';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(orgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, placeholder, filterOption));
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
        var helpText = '';
        var label = '<label for="' + childSelector + '" class="control-label typeahead-label">' +
                    labelText + '</label>';
        var help = '<p class="help-block hidden">' + helpText + '</p>';
        var placeholder = defaultValues.recipient_org_label + ':';

        if ($(this).data('value') !== "") {
            valueId = $(this).data('value');
        }

        loadAsync(orgsAPIUrl, 0, MAX_RETRIES, getCallback(childSelector, childClass, valueId, label, help, placeholder, filterOption));
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

        $(this).find('.info-icon').on('click', '', function() {
            var helpBlock;

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

        // There are no mandatory fields, show the section as complete
        renderCompletionPercentage(1, 1, section);
        return;
    }

    renderCompletionPercentage(numInputsCompleted, numInputs, section);
}

function setPageCompletionPercentage() {
    var inputResults = getInputResults($('.projectEdit'));
    var numInputs = inputResults[0];
    var numInputsCompleted = inputResults[1];

    renderCompletionPercentage(numInputsCompleted, numInputs, $('.formOverviewInfo'));
}

function getInputResults(section) {
    var numInputs = 0;
    var numInputsCompleted = 0;

    for (var i = 0; i < INPUT_ELEMENTS.length; i++) {
        var selector;

        selector = INPUT_ELEMENTS[i] + MEASURE_CLASS;

        section.find(selector).each( function() {

            if ($(this).attr('name') === 'step') {

                // This is a progress bar input
                // Ignore it
                return true;
            }

            numInputs += 1;

            if ($(this).val() !== '') {
                numInputsCompleted += 1;
            } else if ($(this).attr('name') === 'photo' && $(this).attr('default') !== '') {
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

    if (completionPercentage < 2) {
        completionClass = 'empty';
    } else if (completionPercentage < 100) {
        completionClass = 'incomplete';
    } else if (completionPercentage === 100) {
        completionClass = 'complete';
    }

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

    section.find('div.progress-bar').attr('data-completion', completionClass);
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

function setRemovePartialOnClicks() {

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

        var api_url, request, publishErrorNode;

        publishErrorNode = document.getElementById('publishErrors');
        publishErrorNode.innerHTML = '';

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
                    var response, span;

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


$(document).ready(function() {
    setPublishOnClick();
    setSubmitOnClicks();
    setPartialOnClicks();
    setCurrencyOnChange();

    setValidationListeners();
    updateAllHelpIcons();

    setAllSectionsCompletionPercentage();
    setAllSectionsChangeListerner();
    setPageCompletionPercentage();

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
});