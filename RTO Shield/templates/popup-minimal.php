<?php
/**
 * Minimal Popup Template
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$discount_percent = $config['discount_percent'] ?? 10;
?>

<div id="rto-shield-popup-overlay">
	<div class="rto-shield-popup minimal">
		<h2>Instant Prepaid Benefit</h2>
		<p>Switch to prepaid now and get <strong><?php echo esc_html( $discount_percent ); ?>% OFF</strong> your order instantly.</p>
		
		<div class="timer" id="rto-shield-timer" style="font-size: 24px; margin: 10px 0;">05:00</div>

		<button type="button" class="cta-button" id="rto-shield-pay-now">
			PAY SECURELY NOW
		</button>

		<p><a class="decline-link" id="rto-shield-decline">Continue with COD (Higher Price)</a></p>
	</div>
</div>
