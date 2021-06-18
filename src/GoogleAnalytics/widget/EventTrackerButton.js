define("GoogleAnalytics/widget/EventTrackerButton", [
    "dojo/_base/declare",
    "GoogleAnalytics/widget/TrackerCore",
    "mxui/widget/_Button",
    "dojo/_base/lang"
], function (declare, _TrackerCore, _Button, lang) {

    // Declare widget"s prototype.
    return declare("GoogleAnalytics.widget.EventTrackerButton", [_TrackerCore, _Button], {

        _iconSet: false,

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._iconSet = (this.icon === "");
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

        _addEvent: function () {
            logger.debug(this.id + "._addEvent");
            if (this.addEvent && this._gaScriptAvailable()) {
                ga("send",
                   "event",
                   this.category,
                   this.evt,
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
                    origin: this.mxform,
                    callback: lang.hitch(this, function () {
                        this._addEvent();
                    }),
                    error: function () {
                        mx.ui.error("An error occurred, please contact your system administrator.");
                        console.error(".click: Microflow invocation failed");
                    }
                });
            } else {
                console.error(this.id + ".click: no object in context");
            }
        }

    });
});

require(["GoogleAnalytics/widget/EventTrackerButton"]);
