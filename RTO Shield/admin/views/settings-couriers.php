<?php
/**
 * Admin Courier Settings View
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Handle courier settings update
if ( isset( $_POST['rto_shield_save_courier_settings'] ) ) {
	check_admin_referer( 'rto_shield_courier_settings', 'rto_shield_nonce' );

	$couriers = array( 'steadfast', 'pathao', 'redx', 'paperfly' );
	foreach ( $couriers as $courier ) {
		$enabled = isset( $_POST["{$courier}_enabled"] ) ? 1 : 0;
		$api_key = sanitize_text_field( $_POST["{$courier}_api_key"] );
		$api_secret = sanitize_text_field( $_POST["{$courier}_api_secret"] ?? '' );

		RTO_Shield_Settings::update_courier( $courier, array(
			'is_enabled' => $enabled,
			'api_key'    => $api_key,
			'api_secret' => $api_secret,
		) );
	}
	echo '<div class="updated"><p>Courier configurations updated!</p></div>';
}

$steadfast = RTO_Shield_Settings::get_courier( 'steadfast' );
$pathao    = RTO_Shield_Settings::get_courier( 'pathao' );
$redx      = RTO_Shield_Settings::get_courier( 'redx' );
$paperfly  = RTO_Shield_Settings::get_courier( 'paperfly' );
?>

<div class="wrap rto-shield-admin-wrap">
	<h1>Courier Integrations</h1>
	<p>Enable and configure the couriers you use to fetch customer delivery history.</p>

	<form method="post">
		<?php wp_nonce_field( 'rto_shield_courier_settings', 'rto_shield_nonce' ); ?>

		<!-- Steadfast -->
		<div class="rto-shield-card courier-config-item <?php echo $steadfast['is_enabled'] ? 'enabled' : ''; ?>">
			<h2>Steadfast</h2>
			<div class="courier-toggle">
				<label class="switch">
					<input type="checkbox" name="steadfast_enabled" <?php checked( $steadfast['is_enabled'], 1 ); ?>>
					Enable Steadfast History API
				</label>
			</div>
			<table class="form-table">
				<tr>
					<th scope="row">API Key</th>
					<td><input type="text" name="steadfast_api_key" value="<?php echo esc_attr( $steadfast['api_key'] ); ?>" class="regular-text"></td>
				</tr>
				<tr>
					<th scope="row">Secret Key</th>
					<td><input type="password" name="steadfast_api_secret" value="<?php echo esc_attr( $steadfast['api_secret'] ); ?>" class="regular-text"></td>
				</tr>
			</table>
			<button type="button" class="button test-courier-connection" data-courier="steadfast">Test Connection</button>
		</div>

		<!-- Pathao -->
		<div class="rto-shield-card courier-config-item <?php echo $pathao['is_enabled'] ? 'enabled' : ''; ?>">
			<h2>Pathao Courier</h2>
			<div class="courier-toggle">
				<label class="switch">
					<input type="checkbox" name="pathao_enabled" <?php checked( $pathao['is_enabled'], 1 ); ?>>
					Enable Pathao History API
				</label>
			</div>
			<table class="form-table">
				<tr>
					<th scope="row">Access Token</th>
					<td><input type="password" name="pathao_api_key" value="<?php echo esc_attr( $pathao['api_key'] ); ?>" class="regular-text"></td>
				</tr>
			</table>
			<button type="button" class="button test-courier-connection" data-courier="pathao">Test Connection</button>
		</div>

		<!-- RedX -->
		<div class="rto-shield-card courier-config-item <?php echo $redx['is_enabled'] ? 'enabled' : ''; ?>">
			<h2>RedX</h2>
			<div class="courier-toggle">
				<label class="switch">
					<input type="checkbox" name="redx_enabled" <?php checked( $redx['is_enabled'], 1 ); ?>>
					Enable RedX History API
				</label>
			</div>
			<table class="form-table">
				<tr>
					<th scope="row">API Access Token</th>
					<td><input type="password" name="redx_api_key" value="<?php echo esc_attr( $redx['api_key'] ); ?>" class="regular-text"></td>
				</tr>
			</table>
			<button type="button" class="button test-courier-connection" data-courier="redx">Test Connection</button>
		</div>

		<!-- Paperfly -->
		<div class="rto-shield-card courier-config-item <?php echo $paperfly['is_enabled'] ? 'enabled' : ''; ?>">
			<h2>Paperfly</h2>
			<div class="courier-toggle">
				<label class="switch">
					<input type="checkbox" name="paperfly_enabled" <?php checked( $paperfly['is_enabled'], 1 ); ?>>
					Enable Paperfly History API
				</label>
			</div>
			<table class="form-table">
				<tr>
					<th scope="row">API Authorization Key</th>
					<td><input type="password" name="paperfly_api_key" value="<?php echo esc_attr( $paperfly['api_key'] ); ?>" class="regular-text"></td>
				</tr>
			</table>
			<button type="button" class="button test-courier-connection" data-courier="paperfly">Test Connection</button>
		</div>

		<p class="submit">
			<input type="submit" name="rto_shield_save_courier_settings" class="button button-primary" value="Save Courier Configurations">
		</p>
	</form>
</div>

<style>
/* Basic switch styling */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
  vertical-align: middle;
}
.switch input { opacity: 0; width: 0; height: 0; }
.switch:before {
    content: "";
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
}
.switch input:checked +:before { background-color: #2271b1; }
</style>
