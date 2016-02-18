define("GoogleAnalytics/widget/EventTrackerButton", [
    "dojo/_base/declare", "mxui/widget/_Button", "dojo/_base/lang"
], function (declare, _Button, lang) {

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.EventTrackerButton", [_Button], {

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,
        _iconSet: false,

        postCreate: function () {
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".postCreate");
            this._iconSet = (this.icon === "");
            this._insertGoogleAnalytics();
            this.inherited(arguments);
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            if (!this._iconSet) {
                this._setIcon(this.icon, false);
                this._iconSet = true;
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
            if (this.addEvent) {
                ga("send",
                   "event",
                   this.category,
                   this.action,
                   (this._contextObj !== null) ? this._contextObj.get(this.label) : "",
                   (this._contextObj !== null) ? this._contextObj.get(this.value) : "");
            }
        },

        onClick: function () {
            logger.debug(this.id + ".onClick");

            if (this._contextObj) {
                mx.data.action({
                    params       : {
                        actionname  : this.onclickmf,
                        applyto     : "selection",
                        guids       : [this._contextObj.getGuid()]
                    },
                    store: {
                        caller: this.mxform
                    },
                    callback: lang.hitch(this, function (objs) {
                        this._addEvent();
                    }),
                    error: function () {
                        console.error(this.id + ".click: Microflow invocation failed");
                    }
                });
            } else {
                console.error(this.id + ".click: no object in context");
            }
        }

    });
});

require(["GoogleAnalytics/widget/EventTrackerButton"], function () {
    "use strict";
});
