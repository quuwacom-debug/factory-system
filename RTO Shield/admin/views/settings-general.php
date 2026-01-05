<?php
/**
 * Admin General Settings View
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Handle form submission
if ( isset( $_POST['rto_shield_save_general_settings'] ) ) {
	check_admin_referer( 'rto_shield_general_settings', 'rto_shield_nonce' );

	$settings = array(
		'risk_threshold_low'    => intval( $_POST['risk_threshold_low'] ),
		'risk_threshold_medium' => intval( $_POST['risk_threshold_medium'] ),
		'risk_threshold_high'   => intval( $_POST['risk_threshold_high'] ),
		'cod_block_threshold'   => intval( $_POST['cod_block_threshold'] ),
		'cache_duration_hours'  => intval( $_POST['cache_duration_hours'] ),
	);

	foreach ( $settings as $key => $value ) {
		RTO_Shield_Settings::set( $key, $value );
	}

	echo '<div class="updated"><p>Settings saved successfully!</p></div>';
}

$settings = RTO_Shield_Settings::get_all();
?>

<div class="wrap rto-shield-admin-wrap">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

	<div class="rto-shield-card">
		<form method="post">
			<?php wp_nonce_field( 'rto_shield_general_settings', 'rto_shield_nonce' ); ?>
			
			<table class="form-table">
				<tr>
					<th scope="row"><label for="risk_threshold_low">Low Risk Threshold</label></th>
					<td>
						<input name="risk_threshold_low" type="number" id="risk_threshold_low" value="<?php echo esc_attr( $settings['risk_threshold_low'] ?? 30 ); ?>" class="small-text">
						<p class="description">Scores below this are considered safe.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="risk_threshold_medium">Medium Risk Threshold</label></th>
					<td>
						<input name="risk_threshold_medium" type="number" id="risk_threshold_medium" value="<?php echo esc_attr( $settings['risk_threshold_medium'] ?? 50 ); ?>" class="small-text">
						<p class="description">Transition point between safe and risky behavior.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="risk_threshold_high">High Risk Threshold (Popup Trigger)</label></th>
					<td>
						<input name="risk_threshold_high" type="number" id="risk_threshold_high" value="<?php echo esc_attr( $settings['risk_threshold_high'] ?? 70 ); ?>" class="small-text">
						<p class="description">Scores above this will trigger the conversion popup.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="cod_block_threshold">Critical Risk Threshold (COD Block)</label></th>
					<td>
						<input name="cod_block_threshold" type="number" id="cod_block_threshold" value="<?php echo esc_attr( $settings['cod_block_threshold'] ?? 80 ); ?>" class="small-text">
						<p class="description">Scores above this will block COD payment entirely.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="cache_duration_hours">Cache Duration (Hours)</label></th>
					<td>
						<input name="cache_duration_hours" type="number" id="cache_duration_hours" value="<?php echo esc_attr( $settings['cache_duration_hours'] ?? 24 ); ?>" class="small-text">
						<p class="description">How long to cache customer risk scores locally.</p>
					</td>
				</tr>
			</table>

			<p class="submit">
				<input type="submit" name="rto_shield_save_general_settings" id="submit" class="button button-primary" value="Save Settings">
			</p>
		</form>
	</div>
</div>
