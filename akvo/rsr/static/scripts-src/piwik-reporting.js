// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


window.AKVO_RSR.analytics = {

  render: function(resp, parseFn) {
    //  render the hits on the page.
    var hits = parseFn(resp);

    $("#footer_analytics").append(
      "<span class='projectLocation' style='color:#888;'>" +
        AKVO_RSR.i18n.strings.visits + ": " + hits + "</span><br><br>"
    );

  },

  parse: function(data) {
    // Aggregate Piwik data for multiple langauges

    return _.reduce(data, function(hits, n) {
      return hits + n.nb_visits;
    }, 0);

  },

  success: function(resp, renderFn, parseFn) {
    // Dispatch on success

    if (resp.length > 0) {
      renderFn(resp, parseFn);
    }

  },

  segments: function(host, path) {
    // Return segment for bare, en, es & fr
    var barePath, pattern, urls;

    pattern = /\/en\/|\/es\/|\/fr\//i;
    barePath = path.replace(pattern, "/");

    urls = [encodeURIComponent(window.location.protocol + "//" + host + barePath)];
    _(AKVO_RSR.i18n.languages).forEach(function(langCode) {
      urls.push(
        encodeURIComponent(window.location.protocol + "//" + host + "/" + langCode + barePath)
      );
    });
    return urls;

  },

  backendUrl: function(host, path) {
    // Construct url for the Piwik API
    var resource, segment, siteId, period, token;

    resource = "http://analytics.akvo.org/" + "index.php?module=API&method=Actions.getPageUrls";
    segment = "segment=pageUrl==" + this.segments(host, path).join(",pageUrl==");
    siteId = "idSite=" + AKVO_RSR.piwik.idSite;
    period = "period=range&date=2013-05-30,yesterday";
    token = "token_auth=" + AKVO_RSR.piwik.authToken; //"3ae549f4e3fb9dbaa02e48f0d3aceb23"; // read-only token

    return [
      resource,
      segment,
      siteId,
      period,
      "format=json",
      "filter_limit=5000&flat=1",
      token,
      "callback=?"
    ].join('&');

  },


  getReport: function(callback, renderFn, parseFn) {
    // Inits request to the Piwik API and hands that to the success callback.

    $.getJSON(
      this.backendUrl(
        window.location.hostname,
        window.location.pathname

        // dev values
        // "projects.commonsites.net",
        // "/en/project/2330/"
      ),
      function(data) {
        callback(data, renderFn, parseFn);
      });
  },

  hits: function() {
    // Get some hits on the page.
    // piwikId = (typeof AKVO_RSR.page !== "undefined") ? AKVO_RSR.page.piwikId : 1;
    if (typeof AKVO_RSR.piwik.disabled === "undefined") {
      return this.getReport(
        this.success,
        this.render,
        this.parse
      );
    } else {
      console.log(typeof AKVO_RSR.piwik.disabled);
      console.log("Piwik reporting disabled");
    }

  }

};
