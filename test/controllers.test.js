var Sitelist = require("../code/js/modules/Sitelist.js"),
    _ = require("lodash");

chrome.storage.sync = require("./helpers/chrome_storage_area.js");

describe("sitelist", function() {
  var sitelist, sitesMapping, siteUrls;

  beforeAll(function() {
    sitelist = new Sitelist();

    sitelist.loadSettings();

    sitesMapping = _.map(
      sitelist.sites,
      function(siteData, siteKey) {
        return {
          key: siteKey,
          urls: [siteData.url],
          controller: siteData.controller ? siteData.controller : (siteKey[0].toUpperCase() + siteKey.slice(1) + "Controller.js")
        }
      }
    );

    // Extend sites that have multiple URLs (or different player URLs) here
    _.result(_.findWhere(sitesMapping, { key: "play.google" }), "urls").push("http://play.google.com/music");
    _.result(_.findWhere(sitesMapping, { key: "spotify" }), "urls").push("http://play.spotify.com", "http://player.spotify.com");
  });

  afterAll(function() {
    chrome.storage.sync.clear();
  });

  it("matches the correct controller for site url", function() {
    _.each(sitesMapping, function(siteMapping) {
      _.each(siteMapping.urls, function(url) {
        expect(sitelist.getController(url)).toBe(siteMapping.controller);
      });
    });
  });
})
