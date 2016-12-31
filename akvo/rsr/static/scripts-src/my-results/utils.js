/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import fetch from 'isomorphic-fetch';


export function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (dateString) {
        const locale = "en-gb";
        const date = new Date(dateString.split(".")[0].replace("/", /-/g));
        const day = date.getUTCDate();
        const month = i18nMonths[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return "Unknown date";
}


export function getCookie(name) {
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

export function APICall(method, url, data, callback, retries) {
    function modify(method, url, data){
        return fetch(url, {
            credentials: 'same-origin',
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        })
    }

    let handler;
    switch (method) {
        case "GET":
            handler = () => fetch(url, {
                credentials: 'same-origin',
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            break;

        case "POST":
            handler = () => modify('POST', url, data);
            break;

        case "PUT":
            handler = () => modify('PUT', url, data);
            break;

        case "PATCH":
            handler = () => modify('PATCH', url, data);
            break;

        case "DELETE":
            handler = () => fetch(url, {
                credentials: 'same-origin',
                method: 'DELETE'
            });
            break;
    }
    handler()
        //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        .then((response) => response.json())
        .then(callback);
}


// Object holds callback URL functions as values, most of them called with an id parameter
// Usage: endpointURL(17).result -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
export const endpoints = {
        "result": (id) => `/rest/v1/result/${id}/?format=json`,
        "results": (id) => `/rest/v1/result/?format=json&project=${id}`,
        "indicators": (id) => `/rest/v1/indicator/?format=json&result__project=${id}`,
        "periods": (id) => `/rest/v1/indicator_period/?format=json&indicator__result__project=${id}`,
        "updates": (id) => `/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=${id}`,
        "comments": (id) => `/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=${id}`,
        "period_framework": (id) => `/rest/v1/indicator_period_framework/${id}/?format=json`,
        "update_and_comments": (id) => `/rest/v1/indicator_period_data_framework/${id}/?format=json`,
        "updates_and_comments": () => `/rest/v1/indicator_period_data_framework/?format=json`,
        "user": (id) => `/rest/v1/user/${id}/?format=json`,
        "partnerships": (id) => `/rest/v1/partnership/?format=json&project=${id}`,
        "file_upload": (id) => `/rest/v1/indicator_period_data/${id}/upload_file/?format=json`
};

