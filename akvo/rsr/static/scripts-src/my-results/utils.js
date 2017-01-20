/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import fetch from 'isomorphic-fetch';


let months;

export function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    if (!months) {
        months = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    }
    if (dateString) {
        const locale = "en-gb";
        const date = new Date(dateString.split(".")[0].replace("/", /-/g));
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
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
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie('csrftoken')
                }
            });
            break;
    }
    handler()
        //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        .then(function(response) {
            if (response.status != 204)
                return response.json();
            else
                return response;
        }).then(callback);
}


// Object holds callback URL functions as values, most of them called with an id parameter
// Usage: endpoints.result(17) -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
export const endpoints = {
        "result": (id) => `/rest/v1/result/${id}/?format=json`,
        "results": (id) => `/rest/v1/result/?format=json&project=${id}`,
        "indicators": (id) => `/rest/v1/indicator/?format=json&result__project=${id}`,
        "periods": (id) => `/rest/v1/indicator_period/?format=json&indicator__result__project=${id}`,
        "updates": (id) => `/rest/v1/indicator_period_data/?format=json&period__indicator__result__project=${id}`,
        "comments": (id) => `/rest/v1/indicator_period_data_comment/?format=json&data__period__indicator__result__project=${id}`,
        "period": (id) => `/rest/v1/indicator_period/${id}/?format=json`,
        "update_and_comments": (id) => `/rest/v1/indicator_period_data_framework/${id}/?format=json`,
        "updates_and_comments": () => `/rest/v1/indicator_period_data_framework/?format=json`,
        "user": (id) => `/rest/v1/user/${id}/?format=json`,
        "partnerships": (id) => `/rest/v1/partnership/?format=json&project=${id}`,
        "file_upload": (id) => `/rest/v1/indicator_period_data/${id}/upload_file/?format=json`
};

export function displayNumber(numberString) {
    // Add commas to numbers of 1000 or higher.
    if (numberString !== undefined && numberString !== null) {
        var locale = "en-gb";
        var float = parseFloat(numberString);
        if (!isNaN(float)) {
            return float.toLocaleString(locale);
        }
    }
    return '';
}

let strings;

// Translation a la python. Let's hope we never need lodash...
export function _(s) {
    if (!strings) {
        strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
    }
    return strings[s];
}

export const isNewUpdate = (update) => {return update.id.toString().substr(0, 4) === 'new-'};

export function levelToggle(WrappedComponent) {

    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {activeKey: [], isOpen: false};
            this.onChange = this.onChange.bind(this);
            this.toggleLevel = this.toggleLevel.bind(this);
        }

        onChange(activeKey) {
            // Keep track of open panels
            this.setState({activeKey});
        }

        toggleLevel() {
            const isOpen = this.state.isOpen;
            if (isOpen) {
                this.setState({activeKey: [], isOpen: !isOpen});
            } else {
                this.setState({
                    activeKey: this.props.items.map((item) => item.id.toString()),
                    isOpen: !isOpen
                });
            }
        }

        render() {
            return (
                <div>
                    <a onClick={this.toggleLevel}
                        className={'btn btn-sm btn-default'}
                        style={{margin: '0.3em 0.5em'}}>
                        +
                    </a>
                    <WrappedComponent
                        activeKey={this.state.activeKey}
                        onChange={this.onChange}
                        {...this.props}/>
                </div>
            )
        }
    }
}
