/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery, ga, window */
/*mendix */
/*
    GoogleAnalytics
    ========================

    @file      : MasterPageTracker.js
    @version   : 2.0.0
    @author    : Ismail Habib Muhammad
    @date      : 29 May 2015
    @copyright : Mendix b.v.
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare", "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.MasterPageTracker", [_WidgetBase], {

        // Parameters configured in the Modeler.
        mfToExecute: "",
        messageString: "",
        backgroundColor: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + ".postCreate");
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
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + ".update");
            callback();
        },
        _setupGlobalTrackerId: function () {
            window.mxGoogleAnalytics = {trackerId: this.uaTrackCode};
        },
        _addGoogle: function(i, s, o, g, r, a, m) {
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
            this._addGoogle(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            if (typeof window.mxGoogleAnalytics === "undefined") {
                ga('create', this.uaTrackCode, 'auto');
            }
        },

        _addPage: function () {
            var pageExtension = '.page.xml';
            var oriPath = this.mxform.path;
            var path = oriPath.substr(0, oriPath.length - pageExtension.length);
            ga('send', {
                'hitType': 'pageview',
                'page': path,
                'title': this.mxform.title
            });
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }

    });
});
require(["GoogleAnalytics/widget/PageTracker"], function () {
    "use strict";
});