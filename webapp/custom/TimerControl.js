sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";
    
    return Control.extend("com.smod.ux.customcontrol.custom.TimerControl", {
        metadata: {
            properties: {
                timeRemaining: { type: "int", defaultValue: 0 }
            },
            events: {
                timeout: {},
                tick: {}
            }
        },

        init: function() {
            this._interval = null;
            this._isRunning = false;
            this._timeElapsed = 0;
            this._duration = 0;
        },

        updateDisplay: function() {
            this.invalidate();
        },

        start: function(zorluk) {
            
            switch (zorluk) {
                case "kolay":
                    this._duration = 60; 
                    break;
                case "orta":
                    this._duration = 120; 
                    break;
                case "zor":
                    this._duration = 180; 
                    break;
                default:
                    console.warn("Geçersiz zorluk seviyesi. Varsayılan olarak kolay mod (60 saniye) kullanılıyor.");
                    this._duration = 60;
            }

            this.setTimeRemaining(this._duration);
            this._timeElapsed = 0;
            this._isRunning = true;

            clearInterval(this._interval);

            this._interval = setInterval(() => {
                if (this._isRunning) {
                    this._timeElapsed += 1;
                    this.setTimeRemaining(this._duration - this._timeElapsed);
                    this.fireTick();

                    if (this._timeElapsed >= this._duration) {
                        this.stop();
                        this.fireTimeout();
                    }
                }
            }, 1000);
        },

        stop: function() {
            clearInterval(this._interval);
            this._isRunning = false;
        },

        pause: function() {
            this._isRunning = false;
        },

        resume: function() {
            if (!this._isRunning && this._timeElapsed < this._duration) {
                this._isRunning = true;

                this._interval = setInterval(() => {
                    this._timeElapsed += 1;
                    this.setTimeRemaining(this._duration - this._timeElapsed);
                    this.fireTick();

                    if (this._timeElapsed >= this._duration) {
                        this.stop();
                        this.fireTimeout();
                    }
                }, 1000);
            }
        },

        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.addClass("timerControl");
            oRM.writeClasses();
            oRM.write(">");
            oRM.writeEscaped("Kalan Süre: " + oControl.getTimeRemaining() + " sn");
            oRM.write("</div>");
        }
    });
});
