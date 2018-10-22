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
            if (this.addEvent) {
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
                var sequenceHandlers = [];

                if (this.mxform.commit) {
                    sequenceHandlers.push(lang.hitch(this, function (callback) {
                        this.mxform.commit(callback, function (err) {
                            if (!(err instanceof mendix.lib.ValidationError)) {
                                window.mx.onError(err);
                            }
                        });
                    }));
                }

                if (this.mxform.save) { // this will be removed in Mendix 8
                    // We're saving the form (ticket 53351) before we handle the microflow
                    sequenceHandlers.push(lang.hitch(this, function (callback) {
                        this.mxform.save(callback, function (err) {
                            if (!(err instanceof mendix.lib.ValidationError)) {
                                window.mx.onError(err);
                            }
                        });
                    }));
                }

                sequenceHandlers.push(lang.hitch(this, function() {
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
                }));

                this.sequence(sequenceHandlers);
            } else {
                console.error(this.id + ".click: no object in context");
            }
        }

    });
});

require(["GoogleAnalytics/widget/EventTrackerButton"]);
