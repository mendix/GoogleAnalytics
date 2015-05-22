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
define([
    "dojo/_base/declare", "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.WebmasterTools", [_WidgetBase], {

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
            // Track it or not?
            if (this.insertVerification) {
                this._insertVerificationMetaTag();
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + ".update");
            callback();
        },

        _addGoogle: function(s, o, g, a, m) {
            a = s.createElement(o);
            m = s.getElementsByTagName(o)[0];
            a.content = g;
            a.name = "google-site-verification";
            m.parentNode.insertBefore(a, m);
        },
       
        _insertVerificationMetaTag: function () {
            this._addGoogle(document, "meta", this.verifyCode);
        },
        
        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }

    });
});
require(["GoogleAnalytics/widget/WebmasterTools"], function () {
    "use strict";
});