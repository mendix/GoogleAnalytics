define("GoogleAnalytics/widget/MasterPageTracker", [
    "dojo/_base/declare",
    "GoogleAnalytics/widget/TrackerCore",
    "dojo/_base/lang"
], function (declare, _TrackerCore, lang) {
    "use strict";

    return declare("GoogleAnalytics.widget.MasterPageTracker", [_TrackerCore], {

        _contextObj: null,
        _initialized: false,

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            if (!this._initialized) {
                if (typeof window.mxGoogleAnalytics === "undefined") {
                    this._insertGoogleAnalytics();
                }
                this._setupGlobalTrackerId();

                this.connect(this.mxform, "onNavigation", function() {
                    // Track it or not?
                    if (this.trackIt) {
                        this._addPage();
                    }
                });
                this._initialized = true;
            }
            callback();
        },

        _setupGlobalTrackerId: function () {
            logger.debug(this.id + "._setupGlobalTrackerId");
            window.mxGoogleAnalytics = {trackerId: this.uaTrackCode};
        },

        _replaceTagsRecursive: function (s, attrs, callback) {
            logger.debug(this.id + "._replaceTagsRecursive");
            var attr = attrs.pop();
            if (attr === undefined) {
                lang.hitch(this, callback(s));
            } else {
                var toBeReplacedValue = "${" + attr.variableName + "}";
                this._contextObj.fetch(attr.attr, lang.hitch(this, function (value) {
                        var str = s.replace(toBeReplacedValue, value);
                        lang.hitch(this, this._replaceTagsRecursive(str, attrs, callback));
                    })
                );
            }
        },

        _replaceTags: function (s, callback) {
            logger.debug(this.id + "._replaceTags");
            this._replaceTagsRecursive(s, this.attributeList.slice(), function (str) {
                callback(str);
            });
        },

        _insertGoogleAnalytics: function () {
            logger.debug(this.id + "._insertGoogleAnalytics");
            this._addGoogle(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

            if (typeof window.mxGoogleAnalytics === "undefined") {
                this._replaceTags(this.uaTrackCode, lang.hitch(this, function (text) {
                    var opts = { "cookieDomain": "auto" };

                    if (this.useridAttr !== "") {
                        var uid = this._contextObj.get(this.useridAttr);
                        opts.userId = uid;
                        ga("create", text, opts);
                        ga("set", "&uid", uid);

                        if (this.userIdDimension > 0)
                            ga("set", "dimension"+this.userIdDimension, uid);

                    } else {
                        ga("create", text, opts);
                    }

                }));
            }
        },
        _buildFullPath: function(prefix, includePageName, oriMendixPath) {
          if (includePageName) {
            var pageExtension = ".page.xml";
            var path = oriMendixPath.substr(0, oriMendixPath.length - pageExtension.length);
            return prefix + "/" + path;
          } else {
            return prefix;
          }
        },
        _addPage: function () {
            logger.debug(this.id + "._addPage");
            this._replaceTags(this.prefix, lang.hitch(this, function(text) {
                var path = this._buildFullPath(text, this.includePageName, this.mxform.path);
                ga("send", {
                    "hitType": "pageview",
                    "page": path,
                    "title": this.mxform.title
                  });
            }));
        }
    });
});

require(["GoogleAnalytics/widget/MasterPageTracker"]);
