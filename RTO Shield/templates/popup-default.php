<?php
/**
 * Default Popup Template
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$discount_percent = $config['discount_percent'] ?? 10;
$free_delivery    = $config['free_delivery'] ?? true;
$timer_seconds    = $config['timer_seconds'] ?? 300;
?>

<div id="rto-shield-popup-overlay">
	<div class="rto-shield-popup">
		<div class="offer-icon">🎁</div>
		<h2>Exclusive Prepaid Offer!</h2>
		<p>We noticed you selected Cash-On-Delivery. Pay now and unlock these benefits instantly:</p>
		
		<div class="benefits">
			<?php if ( $free_delivery ) : ?>
				<div class="benefit-item"><strong>FREE Delivery</strong> (Save up to ৳100)</div>
			<?php endif; ?>
			
			<?php if ( $discount_percent > 0 ) : ?>
				<div class="benefit-item"><strong><?php echo esc_html( $discount_percent ); ?>% Instant Discount</strong> on your total</div>
			<?php endif; ?>
		</div>

		<div class="timer-label">Offer expires in:</div>
		<div class="timer" id="rto-shield-timer">05:00</div>

		<button type="button" class="cta-button" id="rto-shield-pay-now">
			PAY NOW & SAVE!
		</button>

		<p><a class="decline-link" id="rto-shield-decline">No thanks, I'll pay more with COD</a></p>
	</div>
</div>
