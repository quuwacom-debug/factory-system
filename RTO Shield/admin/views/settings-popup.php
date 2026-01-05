<?php
/**
 * Admin Popup Settings View
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Handle form submission
if ( isset( $_POST['rto_shield_save_popup_settings'] ) ) {
	check_admin_referer( 'rto_shield_popup_settings', 'rto_shield_nonce' );

	$settings = array(
		'popup_enabled'         => isset( $_POST['popup_enabled'] ) ? true : false,
		'popup_template'        => sanitize_text_field( $_POST['popup_template'] ),
		'popup_timer_seconds'   => intval( $_POST['popup_timer_seconds'] ),
		'discount_enabled'      => isset( $_POST['discount_enabled'] ) ? true : false,
		'discount_percentage'   => intval( $_POST['discount_percentage'] ),
		'free_delivery_enabled' => isset( $_POST['free_delivery_enabled'] ) ? true : false,
	);

	foreach ( $settings as $key => $value ) {
		RTO_Shield_Settings::set( $key, $value );
	}

	echo '<div class="updated"><p>Popup settings saved successfully!</p></div>';
}

$settings = RTO_Shield_Settings::get_all();
?>

<div class="wrap rto-shield-admin-wrap">
	<h1>Popup & Conversion Settings</h1>
	<p>Customize how RTO Shield intercepts and converts risky COD orders.</p>

	<div class="rto-shield-card">
		<form method="post">
			<?php wp_nonce_field( 'rto_shield_popup_settings', 'rto_shield_nonce' ); ?>
			
			<table class="form-table">
				<tr>
					<th scope="row">Enable Conversion Popup</th>
					<td>
						<label><input type="checkbox" name="popup_enabled" <?php checked( $settings['popup_enabled'] ?? true, true ); ?>> Enable automated popup at checkout</label>
					</td>
				</tr>
				<tr>
					<th scope="row">Popup Design Template</th>
					<td>
						<select name="popup_template">
							<option value="default" <?php selected( $settings['popup_template'] ?? 'default', 'default' ); ?>>Default (Modern & Vibrant)</option>
							<option value="minimal" <?php selected( $settings['popup_template'] ?? 'default', 'minimal' ); ?>>Minimalist (Clean & Simple)</option>
							<option value="urgent" <?php selected( $settings['popup_template'] ?? 'default', 'urgent' ); ?>>High Urgency (Direct Action)</option>
						</select>
					</td>
				</tr>
				<tr>
					<th scope="row">Countdown Timer (Seconds)</th>
					<td>
						<input type="number" name="popup_timer_seconds" value="<?php echo esc_attr( $settings['popup_timer_seconds'] ?? 300 ); ?>" class="small-text">
					</td>
				</tr>
				<tr>
					<th scope="row">Prepaid Incentives</th>
					<td>
						<label><input type="checkbox" name="discount_enabled" <?php checked( $settings['discount_enabled'] ?? true, true ); ?>> Offer Instant Discount</label><br><br>
						Discount Percentage: <input type="number" name="discount_percentage" value="<?php echo esc_attr( $settings['discount_percentage'] ?? 10 ); ?>" class="small-text">% <br><br>
						<label><input type="checkbox" name="free_delivery_enabled" <?php checked( $settings['free_delivery_enabled'] ?? true, true ); ?>> Offer Free Delivery</label>
					</td>
				</tr>
			</table>

			<p class="submit">
				<input type="submit" name="rto_shield_save_popup_settings" class="button button-primary" value="Save Popup Settings">
			</p>
		</form>
	</div>

	<div class="rto-shield-card">
		<h2>Popup Preview</h2>
		<p>Check how your popup looks to customers. (Coming Soon: Live Interactive Preview)</p>
		<button type="button" class="button" disabled>Preview Popup</button>
	</div>
</div>
