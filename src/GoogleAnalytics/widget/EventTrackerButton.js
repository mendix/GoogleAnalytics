/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery, ga, window */
/*mendix */
/*
    GoogleAnalytics
    ========================

    @file      : GoogleAnalytics.js
    @version   : 2.0.0
    @author    : Gerhard Richard Edens
    @date      : Wed, 20 May 2015 12:17:18 GMT
    @copyright : Mendix b.v.
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define("GoogleAnalytics/widget/EventTrackerButton", [
    "dojo/_base/declare", "mxui/widget/_Button", "dojo/_base/lang"
], function (declare, _Button, lang) {
    
    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.EventTrackerButton", [_Button], {

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
            this._insertGoogleAnalytics();
            this.inherited(arguments);
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + ".update");
            this._contextObj = obj;
            callback();
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

        _addEvent: function () {
            if(this.addEvent){
                ga('send', 
                   'event', 
                   this.category, 
                   this.action, 
                   (this._contextObj !== null) ? this._contextObj.get(this.label) : "", 
                   (this._contextObj !== null) ? this._contextObj.get(this.value) : "");
            }
        },

        onClick: function () {
            console.log(this.id + ".onClick");

            var b = this.onclickmf,
                a = this._contextObj,
                self = this;
            if (a) {
                mx.data.action({
                    actionname: b,
                    guids: [a.getGuid()],
                    callback: function (objs) {
                        self._addEvent();
                    },
                    error: function () {
                        console.error(this.id + ".click: Microflow invocation failed");
                    }
                });
            } else {
                console.error(this.id + ".click: no object in context");
            }
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }

    });
});
require(["GoogleAnalytics/widget/EventTrackerButton"], function () {
    "use strict";
});