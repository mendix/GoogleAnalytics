define("GoogleAnalytics/widget/AdvancedPageTracker", [
    "dojo/_base/declare", "mxui/widget/_WidgetBase", "dojo/_base/lang"
], function (declare, _WidgetBase, lang) {
    "use strict";

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.AdvancedPageTracker", [_WidgetBase], {

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._insertGoogleAnalytics();
            this.connect(this.mxform, "onNavigation", lang.hitch(this, function () {
                // Track it or not?
                if (this.trackIt) {
                    this._addPage();
                }
            }));
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            callback();
        },

        _addGoogle: function (i, s, o, g, r, a, m) {
            logger.debug(this.id + "._addGoogle");
            if (typeof ga === "undefined") {
                i.GoogleAnalyticsObject = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments);
                };
                i[r].l = 1 * new Date();
                a = s.createElement(o);
                m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            }
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
            this._addGoogle(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");

            if (typeof window.mxGoogleAnalytics === "undefined") {
                ga("create", this.uaTrackCode, "auto");
            }
        },

        _addPage: function () {
            logger.debug(this.id + "._addPage");
            this._replaceTags(this.trackUrl, lang.hitch(this, function (newTrackUrl) {
                    this._replaceTags(this.pageTitle, function (newPageTitle) {
                        ga("send", {
                            "hitType": "pageview",
                            "page": newTrackUrl,
                            "title": newPageTitle
                        });
                    });
                })
            );
        }

    });
});

require(["GoogleAnalytics/widget/AdvancedPageTracker"], function () {
    "use strict";
});
