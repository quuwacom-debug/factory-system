// RTO Shield Checkout JavaScript
(function ($) {
    'use strict';

    var riskCheckTimer = null;
    var currentRiskData = null;

    $(document).ready(function () {
        // Listen for phone number input on checkout
        $(document).on('input change', '#billing_phone', function () {
            var phone = $(this).val();

            // Clear previous timer
            clearTimeout(riskCheckTimer);

            // Debounce risk check (wait 1 second after typing stops)
            riskCheckTimer = setTimeout(function () {
                checkCustomerRisk(phone);
            }, 1000);
        });
    });

    function checkCustomerRisk(phone) {
        if (!phone || phone.length < 10) {
            return;
        }

        $.ajax({
            url: rtoShield.ajax_url,
            method: 'POST',
            data: {
                action: 'rto_shield_check_risk',
                phone: phone,
                nonce: rtoShield.nonce
            },
            success: function (response) {
                if (response.success) {
                    currentRiskData = response.data;

                    if (response.data.show_popup) {
                        showConversionPopup(response.data);
                    } else if (response.data.block_cod) {
                        blockCODPayment();
                    }
                }
            },
            error: function () {
                console.error('RTO Shield: Risk check failed');
            }
        });
    }

    function showConversionPopup(data) {
        if (!data.popup_html) return;

        var $container = $('#rto-shield-popup-container');
        $container.html(data.popup_html);

        // Ensure overlay is shown
        $('#rto-shield-popup-overlay').addClass('active').fadeIn();

        // Initialize popup logic (from popup.js)
        if (window.RTOShieldPopup) {
            window.RTOShieldPopup.init(data.popup_config);
        }
    }

    function blockCODPayment() {
        // Block COD payment method in WooCommerce
        var $cod = $('input[name="payment_method"][value="cod"]');
        if ($cod.length) {
            $cod.prop('disabled', true).closest('li').css('opacity', '0.5');

            // If COD was selected, switch to another method
            if ($cod.is(':checked')) {
                $('input[name="payment_method"]:not([value="cod"]):first').click();
            }

            // Show a notice
            if ($('#rto-shield-cod-notice').length === 0) {
                $('.woocommerce-checkout-payment').prepend('<div id="rto-shield-cod-notice" class="woocommerce-NoticeGroup woocommerce-NoticeGroup-checkout"><div class="woocommerce-error">Cash on Delivery is currently unavailable for your profile. Please select a prepaid payment method to continue.</div></div>');
            }
        }
    }

    // Handle conversion start
    $(document).on('rto_shield_convert_started', function () {
        var phone = $('#billing_phone').val();

        $.ajax({
            url: rtoShield.ajax_url,
            method: 'POST',
            data: {
                action: 'rto_shield_record_conversion',
                phone: phone
            },
            success: function (response) {
                if (response.success) {
                    applyPrepaidIncentives();
                }
            }
        });
    });

    function applyPrepaidIncentives() {
        // Switch to a prepaid method automatically
        var $prepaid = $('input[name="payment_method"]:not([value="cod"]):first');
        if ($prepaid.length) {
            $prepaid.prop('checked', true).trigger('click');
        }

        // Refresh checkout totals to apply discount
        $(document.body).trigger('update_checkout');
    }

})(jQuery);
