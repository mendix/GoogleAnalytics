/*jslint white:true, nomen: true, plusplus: true */
/*global mx, dojo, mxui, define, require, browser, devel, console, document, jQuery, ga, window */
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
    return declare("GoogleAnalytics.widget.PageTracker", [_WidgetBase], {

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
        _replaceTags: function (s) {
            var i;
            var str = s;
            for (i = 0; i < this.attributeList.length; i++) {
                var toBeReplacedValue = "${" + this.attributeList[i].variableName + "}";
                var replacementValue = this._getObjectAttr(this._contextObj, this.attributeList[i].attr, false);
                str = str.replace(toBeReplacedValue, replacementValue);
            }
            return str;
        },
        _getObjectAttr: function (object, attr, renderValue) {
            if (!object || !attr) {
                return "";
            }

            if (attr.indexOf("/") === -1) {
                if (renderValue) {
                    return mx.parser && mx.parser.formatAttribute ? mx.parser.formatAttribute(object, attr) : mxui.html.renderValue(object, attr); //mxui.html.rendervalue moved in 5.~7.
                }
                return object.getAttribute(attr);
            }
            var parts = attr.split("/");
            if (parts.length === 3) {
                var child = object.get(parts[0]);

                if (!child) {
                    return "";
                }

                //Fine, we have an object
                if (dojo.isObject(child)) {
                    child = object.getChild(parts[0]); //Get child only works if child was not a guid but object
                    return this._getObjectAttr(child, parts[2], renderValue);
                }

                //Try to retrieve guid in syc
                else {
                    //..but, there is a guid...
                    var tmp = null;
                    mx.processor.get({
                        guid: child, noCache: false, callback: function (obj) { //async = false option would be nice!
                            tmp = obj;
                        }
                    });
                    if (tmp !== null) {//callback was invoked in sync :)
                        return this._getObjectAttr(tmp, parts[2], renderValue);
                    }

                    //console && console.warn && console.warn("Commons.getObjectAttr failed to retrieve " + attr );
                    //This happens if no retrieve schema was used :-(.
                    return "";
                }
            }

            //objects can be returned in X different ways, sometime just a guid, sometimes its an object...
            if (parts.length === 2) {
                var result = object.getAttribute(parts[0]); //incase of of a get object, return the GUIDs (but sometimes getAttribute gives the object...)
                if (!result) {
                    return "";
                }
                if (result.guid) {
                    return result.guid;
                }
                if (/\d+/.test(result)) {
                    return result;
                }
            }
            throw "GridCommons.getObjectAttr: Failed to retrieve attribute '" + attr + "'";

        },
        _insertGoogleAnalytics: function () {
            this._addGoogle(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            if (typeof window.mxGoogleAnalytics === "undefined") {
                ga('create', this.uaTrackCode, 'auto');
            }
        },

        _addPage: function () {
            ga('send', {
                'hitType': 'pageview',
                'page': this._replaceTags(this.trackUrl),
                'title': this._replaceTags(this.pageTitle)
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