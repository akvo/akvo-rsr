// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


window.AKVO_RSR.analytics = {

  render: function(resp) {
    // Renders the resp data to the DOM.

    if (resp.length > 0) {
      $('#footer_analytics').append(
        resp[0].nb_hits
      );
    } else {
      console.log('No hits');
    }
  },

  backendUrl: function(url) {
    // Constructs the backend url
    var segment, resource;

    resource = "http://analytics.akvo.org/" + "index.php?module=API&method=Actions.getPageUrls";
    segment = "segment=pageUrl==" + encodeURIComponent(url);
    token = "token_auth=" + "XXX";
    return [
      resource,
      "idSite=26",
      "period=month&date=2015-05-01",
      "format=json",
      "filter_limit=5000&flat=1",
      token,
      segment,
      "callback=?"
    ].join('&');
  },

  getAnalytics: function(url, callback) {
    // Inits a json request and hands that to the render callback.
    $.getJSON(
      this.backendUrl(url),
      function(data) {
        callback(data);
    });
  },

  hits: function(url) {
    // Adds number of hits to the document.
    return this.getAnalytics(url, this.render);
  }

};
