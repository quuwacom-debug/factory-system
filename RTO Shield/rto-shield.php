<?php
/**
 * Plugin Name: RTO Shield
 * Plugin URI: https://rtoshield.com
 * Description: Smart Checkout Intelligence for E-commerce in Bangladesh. Prevents RTO by converting risky COD orders to secured prepaid payments.
 * Version: 1.0.0
 * Author: RTO Shield
 * Author URI: https://rtoshield.com
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: rto-shield
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.5
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Current plugin version.
 */
define( 'RTO_SHIELD_VERSION', '1.0.0' );
define( 'RTO_SHIELD_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'RTO_SHIELD_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'RTO_SHIELD_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 */
function activate_rto_shield() {
	require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-activator.php';
	RTO_Shield_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_rto_shield() {
	require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-deactivator.php';
	RTO_Shield_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_rto_shield' );
register_deactivation_hook( __FILE__, 'deactivate_rto_shield' );

/**
 * Check if WooCommerce is active
 */
function rto_shield_check_woocommerce() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', 'rto_shield_woocommerce_missing_notice' );
		deactivate_plugins( RTO_SHIELD_PLUGIN_BASENAME );
		return false;
	}
	return true;
}

/**
 * WooCommerce missing notice
 */
function rto_shield_woocommerce_missing_notice() {
	?>
	<div class="error">
		<p><?php esc_html_e( 'RTO Shield requires WooCommerce to be installed and active.', 'rto-shield' ); ?></p>
	</div>
	<?php
}

/**
 * Begin execution of the plugin.
 */
function run_rto_shield() {
	// Check WooCommerce dependency
	if ( ! rto_shield_check_woocommerce() ) {
		return;
	}

	require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-rto-shield.php';
	$plugin = new RTO_Shield();
	$plugin->run();
}

add_action( 'plugins_loaded', 'run_rto_shield' );
