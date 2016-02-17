define("GoogleAnalytics/widget/EventTracker", [
    "dojo/_base/declare", "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.EventTracker", [_WidgetBase], {

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._insertGoogleAnalytics();

        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            // Track it or not?
            if (this.addEvent) {
                this._addEvent();
            }
            callback();
        },

        _addGoogle: function(i, s, o, g, r, a, m) {
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

        _insertGoogleAnalytics: function () {
            logger.debug(this.id + "._insertGoogleAnalytics");
            this._addGoogle(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
            if (typeof window.mxGoogleAnalytics === "undefined") {
                ga("create", this.uaTrackCode, "auto");
            }
        },

        _addEvent: function () {
            logger.debug(this.id + "._addEvent");
            ga("send",
               "event",
               this.category,
               this.action,
               (this._contextObj !== null) ? this._contextObj.get(this.label) : "",
               (this._contextObj !== null) ? this._contextObj.get(this.value) : "");
        }

    });
});

require(["GoogleAnalytics/widget/EventTracker"], function () {
    "use strict";
});
