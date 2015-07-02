// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


window.AKVO_RSR.analytics = {

  render: function(resp) {
    // Renders the resp data to the DOM.

    if (resp.length > 0) {
      $('#footer_analytics').append(
        resp[0].nb_visits
      );
    } else {
      console.log('No hits');
    }
  },


  backendUrl: function(url, isPage) {
    // Constructs the backend url
    var segment, resource, token, site, today, period;

    resource = "http://analytics.akvo.org/" + "index.php?module=API&method=Actions.getPageUrls";
    segment = "segment=pageUrl" + encodeURIComponent("==" + url);
    // segment = "segment=pageUrl%3D%40" + encodeURIComponent(url);
    token = "token_auth=" + "3ae549f4e3fb9dbaa02e48f0d3aceb23"; // read only token
    site = isPage? "idSite=30" : "idSite=26"; // match Piwik

    today = new Date();
    period = "period=month&date=" + [
      today.getFullYear(), today.getMonth() + 1, today.getUTCDate()
    ].join('-');

    return [
      resource,
      segment,
      site,
      period,
      "format=json",
      "filter_limit=5000&flat=1",
      token,
      "callback=?"
    ].join('&');

  },

  getAnalytics: function(url, isPage, callback) {
    // Inits a json request and hands that to the render callback.
    $.getJSON(
      this.backendUrl(url, isPage),
      function(data) {
        callback(data);
    });
  },

  hits: function(url, isPage) {
    // Adds number of hits to the document.
    return this.getAnalytics(url, isPage, this.render);
  }

};
