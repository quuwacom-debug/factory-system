// RTO Shield Admin JavaScript
(function($) {
    'use strict';

    $(document).ready(function() {
        // Courier toggle handler
        $('.courier-toggle input[type="checkbox"]').on('change', function() {
            var $item = $(this).closest('.courier-config-item');
            if ($(this).is(':checked')) {
                $item.addClass('enabled');
            } else {
                $item.removeClass('enabled');
            }
        });

        // Test courier connection
        $('.test-courier-connection').on('click', function(e) {
            e.preventDefault();
            var $button = $(this);
            var courier = $button.data('courier');
            
            $button.prop('disabled', true).text('Testing...');

            // AJAX call to test connection
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                data: {
                    action: 'rto_shield_test_courier',
                    courier: courier,
                    nonce: rtoShieldAdmin.nonce
                },
                success: function(response) {
                    if (response.success) {
                        alert('Connection successful!');
                    } else {
                        alert('Connection failed: ' + response.data.message);
                    }
                },
                complete: function() {
                    $button.prop('disabled', false).text('Test Connection');
                }
            });
        });
    });

})(jQuery);
