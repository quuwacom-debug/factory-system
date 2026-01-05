/**
 * RTO Shield Popup Logic
 */
(function ($) {
    'use strict';

    window.RTOShieldPopup = {
        timer: null,
        secondsRemaining: 0,

        init: function (config) {
            this.secondsRemaining = config.timer_seconds;
            this.updateTimerDisplay();
            this.startTimer();
            this.bindEvents();
        },

        startTimer: function () {
            var self = this;
            this.timer = setInterval(function () {
                self.secondsRemaining--;
                self.updateTimerDisplay();

                if (self.secondsRemaining <= 0) {
                    self.close();
                }
            }, 1000);
        },

        updateTimerDisplay: function () {
            var minutes = Math.floor(this.secondsRemaining / 60);
            var seconds = this.secondsRemaining % 60;
            var display = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            $('#rto-shield-timer').text(display);
        },

        bindEvents: function () {
            var self = this;

            // Pay Now Button
            $('#rto-shield-pay-now').on('click', function () {
                self.convertOrder();
            });

            // Decline Link
            $('#rto-shield-decline').on('click', function () {
                self.close();
            });

            // Close on overlay click (optional)
            /*
            $('#rto-shield-popup-overlay').on('click', function(e) {
                if (e.target === this) {
                    self.close();
                }
            });
            */
        },

        convertOrder: function () {
            // This is handled in Phase 5: Payment Conversion
            // For now, let's signal to the main checkout script
            $(document).trigger('rto_shield_convert_started');
            this.close();
        },

        close: function () {
            clearInterval(this.timer);
            $('#rto-shield-popup-overlay').removeClass('active').fadeOut();
            $(document).trigger('rto_shield_popup_closed');
        }
    };

})(jQuery);
