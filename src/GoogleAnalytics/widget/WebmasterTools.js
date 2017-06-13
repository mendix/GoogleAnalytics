define("GoogleAnalytics/widget/WebmasterTools", [
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.WebmasterTools", [_WidgetBase], {

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            // Track it or not?
            if (this.insertVerification) {
                this._insertVerificationMetaTag();
            }
        },

        _addGoogleVerification: function(s, o, g, a, m) {
            logger.debug(this.id + "._addGoogle");
            a = s.createElement(o);
            m = s.getElementsByTagName(o)[0];
            a.content = g;
            a.name = "google-site-verification";
            m.parentNode.insertBefore(a, m);
        },

        _insertVerificationMetaTag: function () {
            logger.debug(this.id + "._insertVerificationMetaTag");
            this._addGoogleVerification(document, "meta", this.verifyCode);
        }

    });
});

require(["GoogleAnalytics/widget/WebmasterTools"]);
