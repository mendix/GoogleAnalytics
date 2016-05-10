define("GoogleAnalytics/widget/AdvancedPageTracker", [
    "dojo/_base/declare",
    "GoogleAnalytics/widget/TrackerCore",
    "dojo/_base/lang"
], function (declare, _TrackerCore, lang) {
    "use strict";

    return declare("GoogleAnalytics.widget.AdvancedPageTracker", [_TrackerCore], {

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

        _setDimensions: function (callback) {
            logger.debug(this.id + "._getDimensions");
            for (var i = 0; i < this.metricDimensionList.length; i++) {
                var dimension = this.metricDimensionList[i];
                if (dimension.name.indexOf("dimension") === 0) {
                    ga("set", dimension.name, this._contextObj.get(dimension.attr));
                }
            }
            callback();
        },

        _addPage: function () {
            logger.debug(this.id + "._addPage");
            this._replaceTags(this.trackUrl, lang.hitch(this, function (newTrackUrl) {
                    this._replaceTags(this.pageTitle, lang.hitch(this, function (newPageTitle) {
                        this._setDimensions(function () {
                            ga("send", {
                                hitType: "pageview",
                                page: newTrackUrl,
                                title: newPageTitle
                            });
                        });
                    }));
                })
            );
        }

    });
});

require(["GoogleAnalytics/widget/AdvancedPageTracker"], function () {
    "use strict";
});
