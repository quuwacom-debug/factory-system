<?php
/**
 * Urgent Popup Template
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div id="rto-shield-popup-overlay">
	<div class="rto-shield-popup urgent" style="border: 3px solid #dc2626;">
		<div class="offer-icon">⚠️</div>
		<h2 style="color: #dc2626;">Hold On! Your Order Qualifies for a Discount.</h2>
		<p>Due to your selection, we can offer you <strong>FREE Shipping</strong> if you complete your payment now.</p>
		
		<div class="savings" style="background: #fee2e2; border-color: #ef4444; color: #b91c1c;">
			Limited Time Checkout Offer
		</div>

		<div class="timer" id="rto-shield-timer">05:00</div>

		<button type="button" class="cta-button" id="rto-shield-pay-now" style="background: #dc2626;">
			CLAIM FREE SHIPPING NOW
		</button>

		<p><a class="decline-link" id="rto-shield-decline">I prefer to pay for shipping later</a></p>
	</div>
</div>
